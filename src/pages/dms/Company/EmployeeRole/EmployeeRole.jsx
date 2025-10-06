import React, { useState, useEffect } from 'react';
import { Button, Table, InputGroup, Form, Pagination, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';
import axios from 'axios';
import { getModuleId, getToken } from '../../../../utils/authhelper';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const EmployeeRole = () => {
  const navigate = useNavigate();
  const [totalPages, setTotalPages] = useState(1);
  const [roles, setRoles] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const userData = JSON.parse(localStorage.getItem("userData"));
  let permissions = [];

  if (Array.isArray(userData?.employeeRole)) {
    for (const role of userData.employeeRole) {
      for (const child of role.childMenus || []) {
        for (const mod of child.modules || []) {
          if (mod.moduleUrl?.toLowerCase() === "role") {
            permissions = mod.permission
              ?.toLowerCase()
              .split(',')
              .map(p => p.trim()) || [];
          }
        }
      }
    }
  }

  useEffect(() => {
    fetchRoles();
  }, [currentPage, itemsPerPage, search, filter]);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/getAllRoles`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        params: {
          page: currentPage,
          limit: itemsPerPage,
          name: search || undefined,
          status: filter || undefined,
          module_id: getModuleId("role"),
        }
      });

      if (response.data.success) {
        const fetchedRoles = response.data.data.rows.map(role => ({
          id: role.id,
          role: role.roleName,
          responsibility: role.responsibility,
          isActive: role.is_active,
          createdAt: role.createdAt,
          updatedAt: role.updatedAt,
          moduleIds: Array.isArray(role.moduleId)
            ? role.moduleId
            : role.moduleId
              ? [role.moduleId]
              : [],
        }));

        setRoles(fetchedRoles);
        const total = response.data.data.count;
        const pages = Math.max(1, Math.ceil(total / itemsPerPage));
        setTotalPages(pages);

        if (pages < currentPage && currentPage > 1) {
          setCurrentPage(pages);
        } else {
          setTotalPages(pages);
        }
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = (id) => {
    setRoleToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/deleteRole/${roleToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
          params: { module_id: getModuleId("role") },
        }
      );

      if (response.data.success) {
        const updatedRoles = roles.filter((role) => role.id !== roleToDelete);
        setRoles(updatedRoles);

        if (updatedRoles.length === 0 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchRoles(); // Refresh list
        }
      } else {
        alert(response.data.message || "Failed to delete role.");
      }
    } catch (error) {
      const backendMsg = error.response?.data?.message?.toLowerCase?.() || '';

      if (
        backendMsg.includes("link with employee") ||
        backendMsg.includes("foreign key") ||
        backendMsg.includes("constraint")
      ) {
        alert("Cannot delete this role because it is assigned to one or more employees. Please unlink or remove those employees first.");
      } else if (error.response?.status === 500) {
        alert("Server error occurred while deleting the role. Please try again later.");
      } else if (!error.response) {
        alert("No response from server. Please check your internet connection.");
      } else {
        alert(backendMsg || "Unexpected error occurred. Please try again.");
      }
      console.error("Error deleting role:", error);
    } finally {
      setShowDeleteModal(false);
      setRoleToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setRoleToDelete(null);
  };

  const stripHtmlTags = (html) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  return (
    <AdminLayout>
      <div className="user-roles-container p-3">
        <div className="dms-pages-header sticky-header">
          <h3>Role</h3>
          <div className="export-import-container">
            {permissions.includes("add") && (
              <Button variant="primary" onClick={() => navigate('/dms/role/add')}>
                <FaPlus /> Add Role
              </Button>
            )}
          </div>
        </div>

        <div className="filter-search-container">
          <InputGroup className="dms-custom-width">
            <Form.Control
              placeholder="Search user roles..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
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
                    <th>Role</th>
                    <th>Description</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.length > 0 ? (
                    roles.map((role, index) => (
                      <tr key={role.id}>
                        <td>{index + 1}</td>
                        <td>{role.role}</td>
                        <td className='table-description'>{stripHtmlTags(role.responsibility)}</td>
                        <td>{new Date(role.createdAt).toLocaleString()}</td>
                        <td>{new Date(role.updatedAt).toLocaleString()}</td>
                        <td>
                          {permissions.includes("view") ||
                            permissions.includes("edit") ||
                            permissions.includes("delete") ? (
                            <>
                              {permissions.includes("view") && (
                                <FaEye
                                  title="View"
                                  className="icon-blue me-2"
                                  onClick={() =>
                                    navigate(`/dms/role/view/${role.id}`, { state: { role } })
                                  }
                                />
                              )}
                              {permissions.includes("edit") && (
                                <FaEdit
                                  title="Edit"
                                  className="icon-green me-2"
                                  onClick={() =>
                                    navigate("/dms/role/edit", { state: { role } })
                                  }
                                />
                              )}
                              {permissions.includes("delete") && (
                                <FaTrash
                                  title="Delete"
                                  className="icon-red"
                                  onClick={() => handleDelete(role.id)}
                                />
                              )}
                            </>
                          ) : (
                            <span>-</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">No roles found.</td>
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

        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={cancelDelete}>
          <Modal.Body>Are you sure you want to delete this user role?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button variant="primary" onClick={confirmDelete}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </AdminLayout>
  );
};
