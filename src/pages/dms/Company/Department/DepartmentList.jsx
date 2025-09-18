import React, { useState, useEffect } from 'react';
import { Button, Table, Form, InputGroup, Pagination, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = () => {
  const token = JSON.parse(localStorage.getItem("userData"))?.token;
  return { Authorization: `Bearer ${token}` };
};

function stripHtmlTags(html) {
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

export const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userData"));
  let permissions = [];

  if (Array.isArray(userData?.employeeRole)) {
    for (const role of userData.employeeRole) {
      for (const child of role.childMenus || []) {
        for (const mod of child.modules || []) {
          if (mod.moduleUrl?.toLowerCase() === "department") {
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

  const fetchDepartments = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: itemsPerPage,
        module_id: "department",
      };

      if (search) params.name = search;

      const response = await axios.get(`${API_BASE_URL}/getAllDepartments`, {
        headers: getAuthHeaders(),
        params,
      });

      const data = response.data?.data?.data || [];
      const pageCount = response.data?.data?.totalPages || 1;

      const updatedDepartments = data.map((dept) => ({
        ...dept,
        hasDesignations: dept.designationCount > 0,
      }));

      setDepartments(updatedDepartments);
      setTotalPages(pageCount);
      setCurrentPage(response.data?.data?.currentPage || 1);
    } catch (error) {
      console.error('Error fetching departments:', error);
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments(currentPage);
  }, [currentPage, search, itemsPerPage]);

  const handleEdit = (department) => {
    navigate('/dms/department/edit', { state: { department } });
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleDelete = (department) => {
    setSelectedDepartment(department);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/deleteDepartment/${selectedDepartment.id}`,
        {
          headers: getAuthHeaders(),
          data: { module_id: "department" },
        }
      );

      if (response.data.success) {
        const updatedList = departments.filter((d) => d.id !== selectedDepartment.id);
        setDepartments(updatedList);

        if (updatedList.length === 0 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchDepartments(currentPage);
        }
      } else {
        alert(response.data.message || "Failed to delete department.");
      }
    } catch (error) {
      const backendMsg = error.response?.data?.message;
      if (backendMsg) {
        alert(backendMsg);
      } else {
        alert("Error deleting department. Please try again.");
      }
      console.error("Error deleting department:", error);
    } finally {
      setShowDeleteModal(false);
      setSelectedDepartment(null);
    }
  };

  return (
    <AdminLayout>
      <div className="dms-pages-header sticky-header">
        <h3>Department List</h3>

        {permissions.includes("add") && (
          <Button variant="primary" onClick={() => navigate('/dms/department/add')}>
            <FaPlus /> Add Department
          </Button>
        )}
      </div>

      <div className="filter-search-container">
        <InputGroup className="dms-custom-width">
          <Form.Control
            placeholder="Search department name..."
            value={search}
            onChange={handleSearch}
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
                  <th>Department Name</th>
                  <th>Description</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {departments.length > 0 ? (
                  departments.map((department, index) => (
                    <tr key={department.id}>
                      <td>{index + 1}</td>
                      <td>
                        {department.departmentName}
                        {department.hasDesignations && (
                          <span className="badge badge-warning">Has Related Designations</span>
                        )}
                      </td>
                      <td>{stripHtmlTags(department.description)}</td>
                      <td>{new Date(department.createdAt).toLocaleString()}</td>
                      <td>{new Date(department.updatedAt).toLocaleString()}</td>
                      <td className="actions">
                        {permissions.includes("edit") || permissions.includes("delete") ? (
                          <>
                            {permissions.includes("edit") && (
                              <FaEdit
                                className="icon icon-green"
                                title="Edit"
                                onClick={() => handleEdit(department)}
                              />
                            )}{' '}
                            {permissions.includes("delete") && (
                              <FaTrash
                                className={`icon ${department.hasDesignations ? 'icon-disabled' : 'icon-red'}`}
                                title={department.hasDesignations ? 'Cannot delete. Linked to designations.' : 'Delete'}
                                onClick={() => !department.hasDesignations && handleDelete(department)}
                              />
                            )}
                          </>
                        ) : (
                          '—'
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No departments found.
                    </td>
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

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this department?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};
