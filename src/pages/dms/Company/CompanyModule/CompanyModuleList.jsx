import React, { useEffect, useState } from 'react';
import { Button, Table, InputGroup, Form, Pagination, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';
import { getModuleId, getToken } from '../../../../utils/authhelper';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function stripHtmlTags(html) {
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

export const CompanyModuleList = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [modules, setModules] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState(null);
  const [filter, setFilter] = useState('');
  const moduleId = getModuleId("module");
  const token = getToken();

  const userData = JSON.parse(localStorage.getItem("userData"));
  let permissions = [];

  if (Array.isArray(userData?.employeeRole)) {
    for (const role of userData.employeeRole) {
      for (const child of role.childMenus || []) {
        for (const mod of child.modules || []) {
          if (mod.moduleUrl?.toLowerCase() === "module") {
            permissions = mod.permission
              ?.toLowerCase()
              .split(',')
              .map(p => p.trim()) || [];
          }
        }
      }
    }
  }

  const fetchModules = async () => {
    try {
      setIsLoading(true);

      const response = await axios.get(`${API_BASE_URL}/getAllModules`, {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          name: search.trim() || undefined,
          module_id: moduleId,
        },
        headers: {
          Authorization: `Bearer ${token}`,   // ✅ attach token
        },
      });

      const rawData = response.data?.data;

      if (Array.isArray(rawData?.result)) {
        setModules(rawData.result);
        setTotalPages(rawData.totalPages || 1);
      } else {
        setModules([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching modules:", error.response || error);
      setModules([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, [currentPage, itemsPerPage, search, filter]);

  const handleDelete = (id) => {
    setModuleToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/deleteModule/${moduleToDelete}`,
        {
          params: { module_id: moduleId },
          headers: {
            Authorization: `Bearer ${token}`,   // ✅ attach token
          },
        }
      );

      if (response.data.success) {
        fetchModules();
      } else {
        alert(response.data.message || "Failed to delete the module.");
      }
    } catch (error) {
      console.error('Full Axios Error:', error);

      const backendMsg = error?.response?.data?.message?.toLowerCase?.() || '';

      if (
        backendMsg.includes('link with role') ||
        backendMsg.includes('linked with role')
      ) {
        alert("Cannot delete this module because it is linked with one or more roles. Please delete the roles first.");
      } else if (
        backendMsg.includes('link with permission') ||
        backendMsg.includes('linked with permission')
      ) {
        alert("Cannot delete this module because it is linked with one or more permissions. Please delete the permissions first.");
      } else if (
        backendMsg.includes('foreign key') ||
        backendMsg.includes('constraint')
      ) {
        alert("This module is linked with roles or permissions. Please remove them before deleting.");
      } else if (error.response?.status === 500) {
        alert('Server error occurred while deleting the module. Please try again later.');
      } else if (!error.response) {
        alert('No response from server. Please check your internet connection.');
      } else {
        alert(error.response?.data?.message || 'Unexpected error occurred. Please try again.');
      }
    } finally {
      setShowDeleteModal(false);
      setModuleToDelete(null);
    }
  };

  return (
    <AdminLayout>
      <div className="company-modules-container p-3">
        <div className="dms-pages-header sticky-header">
          <h3>Modules</h3>
          <div className="export-import-container">
            {permissions.includes("add") && (
              <Button variant="primary" onClick={() => navigate('/dms/module/add')}>
                <FaPlus /> Add Module
              </Button>
            )}
          </div>
        </div>

        <div className="filter-search-container">
          <InputGroup className="dms-custom-width">
            <Form.Control
              placeholder="Search module by name..."
              value={search}
              onChange={(e) => {
                setCurrentPage(1);
                setSearch(e.target.value);
              }}
            />
          </InputGroup>
        </div>

        <div className="dms-table-container">
          {isLoading ? (
            <div className="text-center py-5 fs-4">Loading...</div>
          ) : (
            <>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Module Name</th>
                    <th>Parent Menu</th>
                    <th>Secondary Menu</th>
                    <th>Description</th>
                    <th>Module URL</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {modules.length > 0 ? (
                    modules.map((module, index) => (
                      <tr key={module.id}>
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>{module.moduleName}</td>
                        <td>{module.parentMenuName || '—'}</td>
                        <td>{module.childMenuName || '—'}</td>
                        <td>{stripHtmlTags(module.description) || 'NA'}</td>
                        <td>{module.moduleUrl || '—'}</td>
                        <td>
                          {permissions.includes("edit") || permissions.includes("delete") ? (
                            <>
                              {permissions.includes("edit") && (
                                <FaEdit
                                  title="Edit"
                                  className="icon-green me-2"
                                  onClick={() => navigate("/dms/module/edit", { state: { module } })}
                                />
                              )}
                              {permissions.includes("delete") && (
                                <FaTrash
                                  title="Delete"
                                  className="icon-red"
                                  onClick={() => handleDelete(module.id)}
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
                      <td colSpan="7" className="text-center">No modules found.</td>
                    </tr>
                  )}
                </tbody>
              </Table>

              <div className="pagination-container">
                <Pagination className="mb-0">
                  <Pagination.Prev
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  />
                  {[...Array(totalPages)].map((_, index) => (
                    <Pagination.Item
                      key={index + 1}
                      active={index + 1 === currentPage}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next
                    onClick={() => setCurrentPage(currentPage + 1)}
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

        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Body>Are you sure you want to delete this module?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete}>Confirm</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </AdminLayout>
  );
};
