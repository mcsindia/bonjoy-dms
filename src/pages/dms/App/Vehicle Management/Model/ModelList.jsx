import React, { useState, useEffect } from 'react';
import { Button, Table, InputGroup, Form, Pagination, Dropdown, DropdownButton, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';
import { getModuleId, getToken, getModulePermissions } from '../../../../../utils/authhelper';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ModelList = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modelToDelete, setModelToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // 🔹 Use helpers (like BrandList)
  const permissions = getModulePermissions("model");
  const moduleId = getModuleId("model");
  const token = getToken();

  const brandIdToName = {};
  brands.forEach((brand) => {
    brandIdToName[brand.id] = brand.brandName;
  });

  // Fetch brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/getAllBrands`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { module_id: moduleId },
        });
        setBrands(response.data?.data?.data || []);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };
    fetchBrands();
  }, []);

  // Fetch models
  useEffect(() => {
    const fetchModels = async () => {
      setLoading(true);
      try {
        let url = `${API_BASE_URL}/getAllModels`;
        const params = {
          page: currentPage,
          limit: itemsPerPage,
          module_id: moduleId,
        };

        if (search) {
          url = `${API_BASE_URL}/searchModels`;
          params.modelName = search;
        } else if (filter) {
          url = `${API_BASE_URL}/filterModels`;
          params.status = filter;
        }

        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
          params,
        });

        if (filter) {
          setModels(response.data?.data?.brands || []);
        } else {
          setModels(response.data?.data?.models || []);
        }

        setTotalPages(response.data?.data?.totalPages || 1);
      } catch (error) {
        console.error("Error fetching model data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, [currentPage, search, filter, itemsPerPage]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (status) => {
    setFilter(status);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Delete model
  const handleDelete = async () => {
    if (modelToDelete) {
      try {
        await axios.delete(`${API_BASE_URL}/deleteModel/${modelToDelete}`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { module_id: moduleId },
        });
        setModels(models.filter((model) => model.id !== modelToDelete));
        setShowModal(false);
        setModelToDelete(null);
      } catch (error) {
        console.error("Error deleting model:", error);
      }
    }
  };

  const openDeleteModal = (modelId) => {
    setModelToDelete(modelId);
    setShowModal(true);
  };

  const closeDeleteModal = () => {
    setShowModal(false);
    setModelToDelete(null);
  };

  return (
    <AdminLayout>
      <div className="dms-pages-header sticky-header">
        <h3>Model List</h3>
        {permissions.includes("add") && (
          <Button variant="primary" onClick={() => navigate('/dms/model/add')}>
            <FaPlus /> Add Model
          </Button>
        )}
      </div>

      {/* Search and Filter */}
      <div className="filter-search-container">
        <DropdownButton variant="primary" title={`Filter: ${filter || 'All'}`} id="filter-dropdown">
          <Dropdown.Item onClick={() => handleFilterChange('')}>All</Dropdown.Item>
          <Dropdown.Item onClick={() => handleFilterChange('Active')}>Active</Dropdown.Item>
          <Dropdown.Item onClick={() => handleFilterChange('Inactive')}>Inactive</Dropdown.Item>
        </DropdownButton>
        <InputGroup className="dms-custom-width">
          <Form.Control
            placeholder="Search by model name..."
            value={search}
            onChange={handleSearch}
          />
        </InputGroup>
      </div>

      <div className="dms-table-container">
        {loading ? (
          <div className="text-center mt-5"><h4>Loading model list...</h4></div>
        ) : (
          <>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Model Name</th>
                  <th>Brand Name</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {models.length > 0 ? (
                  models.map((model, index) => (
                    <tr key={model.id}>
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>{model.modelName}</td>
                      <td>{brandIdToName[model.brandId] || 'Unknown'}</td>
                      <td>{model.status}</td>
                      <td>{new Date(model.createdAt).toLocaleString()}</td>
                      <td>
                        {permissions.includes("edit") && (
                          <FaEdit
                            title="Edit"
                            className="icon-green me-2"
                            onClick={() => navigate('/dms/model/edit', { state: model })}
                          />
                        )}
                        {permissions.includes("delete") && (
                          <FaTrash
                            title="Delete"
                            className="icon-red"
                            onClick={() => openDeleteModal(model.id)}
                          />
                        )}
                        {!permissions.includes("edit") && !permissions.includes("delete") && <span>-</span>}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="6" className="text-center">No models found.</td></tr>
                )}
              </tbody>
            </Table>

            {/* Pagination */}
            <div className="pagination-container">
              <Pagination className="mb-0">
                <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                {[...Array(totalPages)].map((_, index) => (
                  <Pagination.Item
                    key={index + 1}
                    active={index + 1 === currentPage}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
              </Pagination>

              <Form.Select
                value={itemsPerPage}
                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="pagination-option w-auto"
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
      <Modal show={showModal} onHide={closeDeleteModal}>
        <Modal.Header closeButton><Modal.Title>Confirm Deletion</Modal.Title></Modal.Header>
        <Modal.Body>Are you sure you want to delete this model?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeDeleteModal}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};
