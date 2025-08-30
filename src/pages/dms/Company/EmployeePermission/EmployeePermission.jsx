import React, { useEffect, useState } from 'react';
import { Button, Table, InputGroup, Form, Pagination, Modal, Alert, Dropdown, DropdownButton } from 'react-bootstrap';
import { FaEdit, FaTrash, FaEye, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const EmployeePermission = () => {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState('');
  const [permissions, setPermissions] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [permissionToDelete, setPermissionToDelete] = useState(null);
  const userData = JSON.parse(localStorage.getItem("userData"));
 
  let allowedPermissions = [];

if (Array.isArray(userData?.employeeRole)) {
  for (const role of userData.employeeRole) {
    for (const child of role.childMenus || []) {
      for (const mod of child.modules || []) {
        if (mod.moduleUrl?.toLowerCase() === "permission") {
          allowedPermissions = mod.permission
            ?.toLowerCase()
            .split(',')
            .map(p => p.trim()) || [];
        }
      }
    }
  }
}

  const handlePermissionCheck = (permissionType, action, fallbackMessage = null) => {
   if (allowedPermissions.includes(permissionType)) {
      action(); // allowed, run the actual function
    } else {
      alert(fallbackMessage || `You don't have permission to ${permissionType} this employee.`);
    }
  };

  const fetchPermissions = async (page, limit, searchTerm, status) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_BASE_URL}/getAllPermissions`, {
        params: {
          page,
          limit,
          name: searchTerm || undefined,
          status: status || undefined
        },
      });

      if (response.data && response.data.success) {
        const data = response.data.data || {};
        setPermissions(data.data || []);
        const totalCount = data.total || 0;
        setTotalPages(Math.ceil(totalCount / limit));
      } else {
        setError(response.data.message || 'Failed to fetch permissions');
      }
    } catch (err) {
      setError('Error fetching permissions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  fetchPermissions(currentPage, itemsPerPage, search, filterStatus);
}, [currentPage, itemsPerPage, search, filterStatus]);

  const handleDelete = (id) => {
    setPermissionToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/deletePermission/${permissionToDelete}`);
    setShowDeleteModal(false);
    setPermissionToDelete(null);
    fetchPermissions(currentPage, itemsPerPage, search);
  } catch (err) {
    console.error('Delete error:', err.response?.data || err.message); 
    setError('Failed to delete permission.');
    setShowDeleteModal(false);
    setPermissionToDelete(null);
  }
};

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setPermissionToDelete(null);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const stripHtmlTags = (html) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  return (
    <AdminLayout>
      <div className="employee-permissions-container p-3">
        <div className="dms-pages-header sticky-header">
          <h3> Permissions</h3>
          <div className="export-import-container">
            <Button variant="primary" onClick={() => handlePermissionCheck("add", () => navigate('/dms/permission/add'))}>
              <FaPlus /> Add Permission
            </Button>
          </div>
        </div>

        <div className="filter-search-container">
          <InputGroup className="dms-custom-width">
            <Form.Control
              placeholder="Search permission by name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </InputGroup>
        </div>

        {error && (
          <Alert variant="danger" onClose={() => setError('')} dismissible>
            {error}
          </Alert>
        )}

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Module Name</th>
              <th>Permission Name</th>
              <th>Description</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && permissions.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center">No permissions found.</td>
              </tr>
            )}
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center">Loading...</td>
              </tr>
            ) : (
              permissions.map((permission, index) => (
                <tr key={permission.permission_id || index}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{permission.module?.moduleName || 'N/A'}</td>
                  <td>{permission.permission_name}</td>
                  <td>{stripHtmlTags(permission.description)}</td>
                  <td>{new Date(permission.createdAt).toLocaleString()}</td>
                  <td>{new Date(permission.updatedAt).toLocaleString()}</td>
                  <td>
                    <FaEye
                      title="View"
                      className="icon-blue me-2"
                      onClick={() => handlePermissionCheck("view", () => navigate(`/dms/permission/view/${permission.id}`, { state: { permission } }))}
                    />
                    <FaEdit
                      title="Edit"
                      className="icon-green me-2"
                      onClick={() => handlePermissionCheck("edit", () => navigate("/dms/permission/edit", { state: { permission } }))}
                    />
                    <FaTrash
                      title="Delete"
                      className="icon-red"
                      onClick={() => handlePermissionCheck("delete", () => handleDelete(permission.id))}
                    />
                  </td>
                </tr>
              ))
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

        <Modal show={showDeleteModal} onHide={cancelDelete}>
          <Modal.Body>Are you sure you want to delete this permission?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={cancelDelete}>Cancel</Button>
            <Button variant="primary" onClick={confirmDelete}>Confirm</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </AdminLayout>
  );
};
