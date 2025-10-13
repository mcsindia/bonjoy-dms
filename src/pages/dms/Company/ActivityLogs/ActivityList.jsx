import React, { useEffect, useState } from 'react';
import {
  Table, InputGroup, Form, Pagination, Dropdown, DropdownButton
} from 'react-bootstrap';
import { FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ActivityList = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const userData = JSON.parse(localStorage.getItem("userData"));
  let permissions = [];

  // 🔹 Extract activity module permissions
  if (Array.isArray(userData?.employeeRole)) {
    for (const role of userData.employeeRole) {
      for (const child of role.childMenus || []) {
        for (const mod of child.modules || []) {
          if (mod.moduleUrl?.toLowerCase() === "activity") {
            permissions = mod.permission
              ?.toLowerCase()
              .split(',')
              .map(p => p.trim()) || [];
          }
        }
      }
    }
  }

  const fetchActivities = async () => {
    setLoading(true);
    const token = userData?.token;
    const headers = { Authorization: `Bearer ${token}` };
    let url = '';
    let params = { page: currentPage, limit: itemsPerPage };

    if (filter || (fromDate && toDate)) {
      url = `${API_BASE_URL}/filterActivities`;
      if (filter) params.status = filter;
      if (fromDate) params.startDate = fromDate;
      if (toDate) params.endDate = toDate;
    } else {
      url = `${API_BASE_URL}/getAllActivities`;
    }

    try {
      const response = await axios.get(url, { headers, params });
      setActivities(response.data.data.activities || []);
      setTotalPages(response.data.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const searchActivityById = async (id) => {
    setLoading(true);
    const token = userData?.token;
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const response = await axios.get(`${API_BASE_URL}/searchActivityById/${id}`, { headers });
      const result = response.data.data;
      setActivities(result ? [result] : []);
      setTotalPages(1);
    } catch (error) {
      console.error('Error searching activity:', error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (search) {
      searchActivityById(search);
    } else {
      fetchActivities();
    }
  }, [search, filter, fromDate, toDate, currentPage, itemsPerPage]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <AdminLayout>
      <div className="dms-pages-header sticky-header">
        <h3>Activity List</h3>
      </div>

      {/* Filters */}
      <div className="filter-search-container">
        <div className='filter-container'>
          <DropdownButton variant="primary" title="Filter by status" id="filter-dropdown">
            <Dropdown.Item onClick={() => setFilter('')}>All</Dropdown.Item>
            <Dropdown.Item onClick={() => setFilter('Success')}>Success</Dropdown.Item>
            <Dropdown.Item onClick={() => setFilter('Failed')}>Failed</Dropdown.Item>
            <Dropdown.Item onClick={() => setFilter('Pending')}>Pending</Dropdown.Item>
          </DropdownButton>

          <p className='btn btn-primary'>Filter by Date -</p>
          <Form.Group controlId="fromDate">
            <Form.Control type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="toDate">
            <Form.Control type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </Form.Group>
        </div>

        <InputGroup className="dms-custom-width">
          <Form.Control
            placeholder="Search by Activity ID..."
            value={search}
            onChange={handleSearch}
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
                  <th>Activity ID</th>
                  <th>Employee ID</th>
                  <th>Action</th>
                  <th>Timestamp</th>
                  <th>IP Address</th>
                  <th>Details</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {activities.length > 0 ? (
                  activities.map((activity, index) => {
                    let details = {};
                    try {
                      details = typeof activity.details === 'string'
                        ? JSON.parse(activity.details)
                        : activity.details;
                    } catch {
                      details = {};
                    }

                    return (
                      <tr key={activity.id || index}>
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>{activity.id || 'NA'}</td>
                        <td>{activity.employee_id || 'NA'}</td>
                        <td>{activity.action || 'NA'}</td>
                        <td>{new Date(activity.createdAt || 'NA').toLocaleString()}</td>
                        <td>{activity.ip_address || 'NA'}</td>
                        <td>
                          {details ? (
                            Object.entries(details).map(([key, value]) => (
                              <div key={key}>
                                <strong>{key}:</strong> {value}
                              </div>
                            ))
                          ) : (
                            'N/A'
                          )}
                        </td>
                        <td>
                          {permissions.includes("view") ? (
                            <FaEye
                              title="View"
                              className="icon-blue me-2"
                              onClick={() => navigate(`/dms/activity/view/${activity.id}`, { state: { activity } })}
                            />
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">No activities found.</td>
                  </tr>
                )}
              </tbody>
            </Table>

            {/* Pagination */}
            {!search && (
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
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};
