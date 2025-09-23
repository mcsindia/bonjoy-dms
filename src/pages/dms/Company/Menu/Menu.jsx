import React, { useState, useEffect } from 'react';
import { Button, Table, InputGroup, Form, Pagination, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';
import { getModuleId, getToken, getModulePermissions } from '../../../../utils/authhelper';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const Menu = () => {
  const navigate = useNavigate();
  const [menus, setMenus] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState(null);
  const userData = JSON.parse(localStorage.getItem('userData')) || {};

  const permissions = getModulePermissions("menu");
  const moduleId = getModuleId("menu");
  const token = getToken();

  useEffect(() => {
    fetchMenus();
  }, [currentPage, itemsPerPage, search]);

  const fetchMenus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getAllMenu`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: {
          page: currentPage,
          limit: itemsPerPage,
          name: search,
          module_id: moduleId,
        },
      });

      const result = response.data?.data;

      if (Array.isArray(result.data)) {
        setMenus(result.data);
        setTotalPages(result.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching menus:", error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = (id) => {
    setMenuToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/deleteMenu/${menuToDelete}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { module_id: moduleId },
        }
      );

      if (response?.data?.success === false) {
        alert(response.data.message || "Failed to delete menu.");
      } else {
        setShowDeleteModal(false);
        setMenuToDelete(null);
        fetchMenus();
      }
    } catch (error) {
      const errMsg = error?.response?.data?.message;
      if (
        errMsg === "Menu has child items linked to it. Please delete child items first."
      ) {
        alert(errMsg);
      } else {
        alert("Something went wrong while deleting. Please try again.");
      }
      console.error("Error deleting menu:", error);
    }
  };

  return (
    <AdminLayout>
      <div className="company-menus-container p-3">
        <div className="dms-pages-header sticky-header">
          <h3>Menus</h3>
          {permissions.includes("add") && (
            <Button
              variant="primary"
              onClick={() => navigate('/dms/menu/add')}
            >
              <FaPlus /> Add Menu
            </Button>
          )}
        </div>

        <div className="filter-search-container mt-3">
          <InputGroup className="dms-custom-width">
            <Form.Control
              placeholder="Search menu by name..."
              value={search}
              onChange={(e) => {
                setCurrentPage(1);
                setSearch(e.target.value);
              }}
            />
          </InputGroup>
        </div>

        <Table striped bordered hover responsive className="mt-3">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Menu Name</th>
              <th>Parent Menu</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {menus.length > 0 ? (
              menus.map((menu, index) => (
                <tr key={menu.id}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{menu.name}</td>
                  <td>{menu.parentLabel || '—'}</td>
                  <td>{new Date(menu.createdAt).toLocaleDateString()}</td>
                  <td>{menu.updatedAt ? new Date(menu.updatedAt).toLocaleDateString() : '—'}</td>
                  <td>
                    {permissions.includes("edit") || permissions.includes("delete") ? (
                      <>
                        {permissions.includes("edit") && (
                          <FaEdit
                            className="icon-green me-2"
                            onClick={() => navigate('/dms/menu/edit', { state: { menu } })}
                          />
                        )}
                        {permissions.includes("delete") && (
                          <FaTrash
                            className="icon-red"
                            onClick={() => handleDelete(menu.id)}
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
                <td colSpan="6" className="text-center">
                  No menus found.
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
            className="pagination-option w-auto"
          >
            <option value="5">Show 5</option>
            <option value="10">Show 10</option>
            <option value="20">Show 20</option>
            <option value="30">Show 30</option>
          </Form.Select>
        </div>

        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Body>Are you sure you want to delete this menu?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </AdminLayout>
  );
};
