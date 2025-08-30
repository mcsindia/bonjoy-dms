import React, { useState, useEffect, useCallback } from 'react';
import { Button, Table, Form, InputGroup, Pagination, Dropdown, DropdownButton, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const DesignationList = () => {
  const [designations, setDesignations] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [filterOptions, setFilterOptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [designationToDelete, setDesignationToDelete] = useState(null);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userData"));

  let permissions = [];

  if (Array.isArray(userData?.employeeRole)) {
    for (const role of userData.employeeRole) {
      for (const child of role.childMenus || []) {
        for (const mod of child.modules || []) {
          if (mod.moduleUrl?.toLowerCase() === "designation") {
            permissions = mod.permission
              ?.toLowerCase()
              .split(',')
              .map(p => p.trim()) || [];
          }
        }
      }
    }
  }

  const handlePermissionCheck = (permissionType, action, fallbackMessage = null) => {
    if (permissions.includes(permissionType)) {
      action(); // allowed, run the actual function
    } else {
      alert(fallbackMessage || `You don't have permission to ${permissionType} this employee.`);
    }
  };

  const getAuthHeaders = () => {
    const token = JSON.parse(localStorage.getItem('userData'))?.token;
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const getFetchUrlAndParams = () => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
    };

    if (search) {
      params.name = search;
    }

    if (selectedDepartmentId) {
      params.departmentId = selectedDepartmentId;
    }

    return {
      url: `${API_BASE_URL}/getAllDesignations`,
      params,
    };
  };

  const fetchFilterOptions = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/getAllDesignations`, { headers: getAuthHeaders() });
      const allDesignations = data?.data?.data || [];
      setFilterOptions([...new Set(allDesignations.map(d => d.designation))]);
    } catch (err) {
      console.error('Error fetching filter options:', err);
    }
  }, []);

  const fetchDesignations = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { url, params } = getFetchUrlAndParams();
      const response = await axios.get(url, { headers: getAuthHeaders(), params });
      const data = response.data?.data?.data || [];
      const total = response.data?.data?.totalPages || 1;

      setDesignations(data);
      setTotalPages(total);

      if (filterOptions.length === 0) {
        await fetchFilterOptions();
      }
    } catch (err) {
      console.error('Error fetching designations:', err);
      setError('Failed to load designations. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [search, selectedFilter, selectedDepartmentId, currentPage, itemsPerPage, filterOptions.length, fetchFilterOptions]);

  useEffect(() => {
    fetchDesignations();
  }, [fetchDesignations]);

  // Handlers
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleDepartmentFilterSelect = (deptId) => {
    setSelectedDepartmentId(Number(deptId));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleEdit = (designation) => navigate('/dms/designation/edit', { state: designation });

  const fetchDepartments = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/getAllDepartments`, { headers: getAuthHeaders() });
      const allDepartments = data?.data?.data || [];
      setDepartmentOptions(allDepartments);
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const confirmDelete = (id) => {
    setDesignationToDelete(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!designationToDelete) return;
    setLoading(true);
    setError('');

    try {
      const response = await axios.delete(
        `${API_BASE_URL}/deleteDesiganation/${designationToDelete}`,
        {
          headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setShowModal(false);
        setDesignationToDelete(null);

        if (designations.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchDesignations();
        }
      } else {
        setShowModal(false);
        setDesignationToDelete(null);
        alert(response.data.message || 'Failed to delete designation.');
      }

    } catch (error) {
      const backendMsg = error.response?.data?.message?.toLowerCase?.() || '';

      if (
        backendMsg.includes("link with employee") ||
        backendMsg.includes("foreign key") ||
        backendMsg.includes("constraint")
      ) {
        alert("Cannot delete this designation because it is assigned to one or more employees. Please unlink or remove those employees first.");
      } else if (error.response?.status === 500) {
        alert("Server error occurred while deleting the designation. Please try again later.");
      } else if (!error.response) {
        alert("No response from server. Please check your internet connection.");
      } else {
        alert(backendMsg || "Unexpected error occurred. Please try again.");
      }

      console.error('Error deleting designation:', error);
    } finally {
      setLoading(false);
      setShowModal(false);
      setDesignationToDelete(null);
    }
  };

  // Helper to strip HTML tags from descriptions
  const stripHtmlTags = (html) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  return (
    <AdminLayout>
      <div className="dms-pages-header sticky-header">
        <h3>Designation List</h3>
        <Button variant="primary" onClick={() => handlePermissionCheck("add", () => navigate('/dms/designation/add'))}>
          <FaPlus /> Add Designation
        </Button>
      </div>

      <div className="filter-search-container">
        <div className='filter-container'>
          <DropdownButton
            title={`Filter By Department`}
            id="department-filter-dropdown"
            className="me-2"
          >
            <Dropdown.Item onClick={() => handleDepartmentFilterSelect('')}>All</Dropdown.Item>
            {departmentOptions.map((dept) => (
              <Dropdown.Item key={dept.id} onClick={() => handleDepartmentFilterSelect(dept.id)}>
                {dept.departmentName}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </div>
        <InputGroup className="dms-custom-width">
          <Form.Control
            placeholder="Search designation..."
            value={search}
            onChange={handleSearchChange}
          />
        </InputGroup>
      </div>

      <div className="dms-table-container">
        {loading ? (
          <div className="text-center py-5 fs-4">Loading...</div>
        ) : (
          <>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Designation Name</th>
                  <th>Department Name</th>
                  <th>Description</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {designations.length > 0 ? (
                  designations.map((designation, idx) => (
                    <tr key={designation.id}>
                      <td>{idx + 1}</td>
                      <td>{designation.designation}</td>
                      <td>{designation.departmentId?.departmentName || '-'}</td>
                      <td>{stripHtmlTags(designation.description)}</td>
                      <td>{new Date(designation.createdAt).toLocaleString()}</td>
                      <td>{new Date(designation.updatedAt).toLocaleString()}</td>
                      <td className="actions">
                        <FaEdit
                          className="icon icon-green"
                          title="Edit"
                          onClick={() => handlePermissionCheck("edit", () => handleEdit(designation))}
                        />
                        <FaTrash
                          className="icon icon-red"
                          title="Delete"
                          onClick={() => handlePermissionCheck("delete", () => confirmDelete(designation.id))}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">No designations found.</td>
                  </tr>
                )}
              </tbody>
            </Table>
            <div className="pagination-container">
              <Pagination className="mb-0">
                <Pagination.Prev
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                />
                {[...Array(totalPages)].map((_, index) => (
                  <Pagination.Item
                    key={index + 1}
                    active={index + 1 === currentPage}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
              </Pagination>

              <Form.Select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className='pagination-option w-auto'
              >
                <option value="5">Show 5</option>
                <option value="10">Show 10</option>
                <option value="20">Show 20</option>
                <option value="30">Show 30</option>
                <option value="50">Show 50</option>
              </Form.Select>
            </div>
          </>
        )}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this designation? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};
