import React, { useState, useEffect } from 'react';
import { Button, Table, Form, InputGroup, Pagination, DropdownButton, Dropdown, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getModuleId, getToken } from '../../../../../utils/authhelper';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
});

export const RideFareSetting = () => {
  const navigate = useNavigate();
  const [fareSettings, setFareSettings] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFare, setSelectedFare] = useState(null);

  const userData = JSON.parse(localStorage.getItem('userData'));
  let permissions = [];
  if (Array.isArray(userData?.employeeRole)) {
    for (const role of userData.employeeRole) {
      for (const child of role.childMenus || []) {
        for (const mod of child.modules || []) {
          if (mod.moduleUrl?.toLowerCase() === 'faresettings') {
            permissions = mod.permission?.toLowerCase().split(',').map(p => p.trim()) || [];
          }
        }
      }
    }
  }

  const fetchFareSettings = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: itemsPerPage,
        module_id: getModuleId('faresettings'),
      };
      if (search) params.search = search;
      if (filterStatus) params.status = filterStatus;
      if (filterDate) params.date = filterDate;

      const response = await axios.get(`${API_BASE_URL}/getAllFareSetting`, {
        headers: getAuthHeaders(),
        params,
      });

      const data = response.data?.data?.models || [];
      const pageCount = response.data?.data?.totalPages || 1;

      setFareSettings(data);
      setTotalPages(pageCount);
      setCurrentPage(response.data?.data?.currentPage || 1);
    } catch (error) {
      console.error('Error fetching fare settings:', error);
      setFareSettings([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  useEffect(() => {
    fetchFareSettings(currentPage);
  }, [currentPage, itemsPerPage, search, filterStatus, filterDate]);

  const handleDelete = (fare) => {
    setSelectedFare(fare);
    setShowDeleteModal(true);
  };

  // Delete fare setting
  const confirmDelete = async () => {
    if (!selectedFare) return;

    try {
      setLoading(true); 
      const token = getToken();
      const moduleId = getModuleId('faresettings');

      const response = await axios.delete(`${API_BASE_URL}/deleteFareSetting/${selectedFare.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params: { module_id: moduleId } 
      });

      if (response.data?.success) {
        alert(response.data.message || 'Fare setting deleted successfully.');
        fetchFareSettings(currentPage); // refresh table
      } else {
        alert(response.data?.message || 'Failed to delete fare setting.');
      }
    } catch (err) {
      console.error('Error deleting fare setting:', err);
      const backendMsg = err.response?.data?.message;
      alert(backendMsg || 'Failed to delete fare setting. Please try again.');
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setSelectedFare(null);
    }
  };

  return (
    <AdminLayout>
      <div className="dms-pages-header sticky-header">
        <h3>Ride Fare Setting</h3>
        {permissions.includes('add') && (
          <Button variant="primary" onClick={() => navigate('/dms/faresettings/add')}>
            <FaPlus /> Add Fare Setting
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className='filter-container'>
        <DropdownButton
          title={`Filter by Status: ${filterStatus === '' ? 'All' : filterStatus === '1' ? 'Active' : 'Inactive'}`}
        >
          <Dropdown.Item onClick={() => setFilterStatus('')}>All</Dropdown.Item>
          <Dropdown.Item onClick={() => setFilterStatus('1')}>Active</Dropdown.Item>
          <Dropdown.Item onClick={() => setFilterStatus('0')}>Inactive</Dropdown.Item>
        </DropdownButton>
        <p className="btn btn-primary">Filter by createdAt Date -</p>
        <Form.Group>
          <Form.Control
            type="date"
            value={filterDate}
            onChange={(e) => { setFilterDate(e.target.value); setCurrentPage(1); }}
          />
        </Form.Group>
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
                  <th>Base Fare</th>
                  <th>Per Km Fare</th>
                  <th>Waiting Charge</th>
                  <th>Grace Period</th>
                  <th>Cancel Fee (Normal)</th>
                  <th>Cancel Fee (Emergency Cap)</th>
                  <th>Emergency Bonus</th>
                  <th>First Ride Bonus</th>
                  <th>Effective From</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {fareSettings.length > 0 ? fareSettings.map((fare, idx) => (
                  <tr key={fare.id}>
                    <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                    <td>{fare.base_fare}</td>
                    <td>{fare.per_km_fare || '-'}</td>
                    <td>{fare.waiting_charge_per_min}</td>
                    <td>{fare.waiting_grace_period}</td>
                    <td>{fare.cancellation_normal}</td>
                    <td>{fare.cancellation_emergency_cap}</td>
                    <td>{fare.emergency_bonus}</td>
                    <td>{fare.first_ride_bonus}</td>
                    <td>{new Date(fare.effective_from).toLocaleDateString()}</td>
                    <td>{fare.isActive ? 'Active' : 'Inactive'}</td>
                    <td>{fare.createdAt.slice(0, 10)}</td>
                    <td>{fare.updatedAt.slice(0, 10)}</td>
                    <td>
                      {permissions.includes('edit') && (
                        <FaEdit className="icon icon-green me-2" onClick={() => navigate('/dms/faresettings/edit', { state: { fare } })} />
                      )}
                      {permissions.includes('delete') && (
                        <FaTrash className="icon icon-red" onClick={() => handleDelete(fare)} />
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="14" className="text-center">No fare settings found.</td>
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

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this fare setting?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};
