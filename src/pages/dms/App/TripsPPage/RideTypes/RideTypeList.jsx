import React, { useState, useEffect } from 'react';
import { Button, Table, Form, InputGroup, Dropdown, DropdownButton, Pagination, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getModuleId, getToken } from '../../../../../utils/authhelper';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
});

function stripHtmlTags(html) {
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

export const RideTypeList = () => {
  const navigate = useNavigate();
  const [rideTypes, setRideTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Delete Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRideType, setSelectedRideType] = useState(null);

  // Permissions
  const userData = JSON.parse(localStorage.getItem("userData"));
  let permissions = [];
  if (Array.isArray(userData?.employeeRole)) {
    for (const role of userData.employeeRole) {
      for (const child of role.childMenus || []) {
        for (const mod of child.modules || []) {
          if (mod.moduleUrl?.toLowerCase() === "ridetypes") {
            permissions = mod.permission?.toLowerCase().split(',').map(p => p.trim()) || [];
          }
        }
      }
    }
  }

  const fetchRideTypes = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        module_id: getModuleId("ridetypes"),
      };

      if (search) params.name = search;
      if (statusFilter !== 'All') params.status = statusFilter;
      if (dateFilter) params.date = dateFilter;

      const response = await axios.get(`${API_BASE_URL}/getAllRideType`, {
        headers: getAuthHeaders(),
        params,
      });

      const data = response.data?.data?.models || [];
      const totalPages = response.data?.data?.totalPages || 1;

      setRideTypes(data);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching ride types:", error);
      setRideTypes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRideTypes();
  }, [search, statusFilter, dateFilter, currentPage, itemsPerPage]);

  const handleDelete = (ride) => {
    setSelectedRideType(ride);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/deleteRideType/${selectedRideType.id}`, {
        headers: getAuthHeaders(),
        params: { module_id: getModuleId("ridetypes") },
      });
      fetchRideTypes();
      alert("Ride type deleted successfully!");
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to delete ride type.";
      alert(msg);
      console.error("Delete error:", error);
    } finally {
      setShowDeleteModal(false);
      setSelectedRideType(null);
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) setCurrentPage(pageNumber);
  };

  return (
    <AdminLayout>
      <div className="dms-pages-header sticky-header">
        <h3>Ride Type List</h3>
        {permissions.includes("add") && (
          <Button variant="primary" onClick={() => navigate('/dms/ridetypes/add')}>
            <FaPlus /> Add Ride Type
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="filter-search-container">
        <div className="filter-container">
          <DropdownButton
            title={`Filter by Status`}
            onSelect={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}
          >
            <Dropdown.Item eventKey="All">All</Dropdown.Item>
            <Dropdown.Item eventKey="Active">Active</Dropdown.Item>
            <Dropdown.Item eventKey="Inactive">Inactive</Dropdown.Item>
          </DropdownButton>

          <p className="btn btn-primary">Filter by Date -</p>
          <Form.Group>
            <Form.Control
              type="date"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setCurrentPage(1);
              }}
            />
          </Form.Group>
        </div>

        <InputGroup className="dms-custom-width">
          <Form.Control
            placeholder="Search ride type..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </InputGroup>
      </div>

      {/* Table */}
      <div className="dms-table-container">
        {loading ? (
          <div className="text-center py-5 fs-4">Loading...</div>
        ) : (
          <>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Name</th>
                  <th>Fare Multiplier</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {rideTypes.length > 0 ? (
                  rideTypes.map((ride, index) => (
                    <tr key={ride.id}>
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>{ride.name}</td>
                      <td>{ride.multiplier}</td>
                      <td>{stripHtmlTags(ride.description)}</td>
                      <td>{ride.status}</td>
                      <td>{ride.createdAt ? new Date(ride.createdAt).toLocaleDateString() : "N/A"}</td>
                      <td>{ride.updatedAt ? new Date(ride.updatedAt).toLocaleDateString() : "N/A"}</td>
                      <td className="actions">
                        {permissions.includes("edit") && (
                          <FaEdit
                            className="icon icon-green me-2"
                            title="Edit"
                            onClick={() => navigate('/dms/ridetypes/edit', { state: { rideType: ride } })}
                          />
                        )}
                        {permissions.includes("delete") && (
                          <FaTrash
                            className="icon icon-red"
                            title="Delete"
                            onClick={() => handleDelete(ride)}
                          />
                        )}
                        {!permissions.includes("edit") && !permissions.includes("delete") && '—'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">No ride types found.</td>
                  </tr>
                )}
              </tbody>
            </Table>

            {/* Pagination */}
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
                <option value="50">Show 50</option>
              </Form.Select>
            </div>
          </>
        )}
      </div>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{selectedRideType?.name}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};
