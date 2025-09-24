import React, { useEffect, useState } from 'react';
import {
  Button, Table, InputGroup, Form, Dropdown, DropdownButton, Pagination, Modal
} from 'react-bootstrap';
import { FaEdit, FaTrash, FaFileExport, FaFileExcel, FaFilePdf, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';
import axios from "axios";
import { getModuleId, getToken } from '../../../../../utils/authhelper';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const UserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [userTypeFilter, setUserTypeFilter] = useState('Both');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [totalRiders, setTotalRiders] = useState(0);
  const [totalDrivers, setTotalDrivers] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const userData = JSON.parse(localStorage.getItem("userData"));
  let permissions = [];

  if (Array.isArray(userData?.employeeRole)) {
    for (const role of userData.employeeRole) {
      for (const child of role.childMenus || []) {
        for (const mod of child.modules || []) {
          if (mod.moduleUrl?.toLowerCase() === "user") {
            permissions = mod.permission
              ?.toLowerCase()
              .split(',')
              .map(p => p.trim()) || [];
          }
        }
      }
    }
  }

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let baseUrl = `${API_BASE_URL}/`;
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        module_id: getModuleId("user") 
      });

      const isSearching = !!search;
      const isFilteringByDate = !!startDate || !!endDate;
      const isFilteringByType = userTypeFilter !== 'Both';
      const isFilteringByStatus = statusFilter !== 'All';

      if (isSearching) {
        baseUrl += "getAllUsers";
        queryParams.set("name", search);
      } else if (isFilteringByDate || isFilteringByType || isFilteringByStatus) {
        baseUrl += "filterUsers";
        if (startDate) queryParams.set("fromDate", startDate);
        if (endDate) queryParams.set("toDate", endDate);
        if (userTypeFilter !== 'Both') queryParams.set("userType", userTypeFilter);
        if (statusFilter !== 'All') queryParams.set("status", statusFilter);
      } else {
        baseUrl += "getAllUsers";
      }

      const finalUrl = `${baseUrl}?${queryParams.toString()}`;
      const token = getToken();

      const res = await axios.get(finalUrl, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const fetchedUsers = Array.isArray(res.data?.data?.results) ? res.data.data.results : [];
      fetchedUsers.sort((a, b) => Number(a.id) - Number(b.id));
      const filteredUsers = fetchedUsers.filter(user => user.userType === "Driver" || user.userType === "Rider");

      setUsers(filteredUsers);
      setTotalRiders(res.data?.data?.totalRiders || 0);
      setTotalDrivers(res.data?.data?.totalDrivers || 0);
      const total = res.data?.data?.totalUsers || fetchedUsers.length;
      setTotalPages(Math.ceil(total / itemsPerPage));

    } catch (err) {
      console.error("Error fetching user: ", err);
      setUsers([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, startDate, endDate, currentPage, itemsPerPage, userTypeFilter, statusFilter]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) setCurrentPage(pageNumber);
  };

  const handleEdit = (user) => navigate('/dms/user/edit', { state: { user } });

  const handleView = (user) => navigate(`/dms/user/view/${user.id}`, { state: { user } });

  // Export
  const handleExport = (format) => {
    const url = `${API_BASE_URL}/exportUsers?format=${format}&module_id=${getModuleId("user")}`;
    window.open(url, '_blank');
  };

  // Import
  const handleImport = async () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv, .xlsx';
    fileInput.click();

    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return alert("No file selected.");

      const formData = new FormData();
      formData.append('file', file);
      formData.append('module_id', getModuleId("user")); 

      try {
        const token = getToken();
        const res = await axios.post(`${API_BASE_URL}/importUsers`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });

        if (res.status === 200) {
          alert("Users imported successfully!");
          fetchUsers();
        }
      } catch (err) {
        console.error("Error importing users:", err);
        alert("There was an error importing the users.");
      }
    };
  };
  
  return (
    <AdminLayout>
      <div className="dms-pages-header sticky-header">
        <div className="live-count">
          <h3 className="mb-0">All Users</h3>
          <div className="live-count-container">
            <Button className='yellow-button'>🚗 Drivers: {totalDrivers}</Button>
            <Button className='green-button'>🧍 Riders: {totalRiders}</Button>
          </div>
        </div>
        <div className="export-import-container">
          <DropdownButton title={<><FaFileExport /> Export</>} className="me-2">
            <Dropdown.Item onClick={() => handleExport('excel')}><FaFileExcel className="icon-green" /> Export to Excel</Dropdown.Item>
            <Dropdown.Item onClick={() => handleExport('pdf')}><FaFilePdf className="icon-red" /> Export to PDF</Dropdown.Item>
          </DropdownButton>
          <DropdownButton title={<><FaFileExcel /> Import</>} className="me-2">
            <Dropdown.Item onClick={() => handleImport('excel')}><FaFileExcel className="icon-green" /> Import from Excel</Dropdown.Item>
            <Dropdown.Item ><FaFilePdf className="icon-red" />  Import from PDF</Dropdown.Item>
          </DropdownButton>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-search-container">
        <div className='filter-container'>
          <DropdownButton title={`User Type: ${userTypeFilter}`} onSelect={(val) => { setUserTypeFilter(val); setCurrentPage(1); }}>
            <Dropdown.Item eventKey="Both">Both</Dropdown.Item>
            <Dropdown.Item eventKey="Driver">Driver</Dropdown.Item>
            <Dropdown.Item eventKey="Rider">Rider</Dropdown.Item>
          </DropdownButton>

          <DropdownButton
            title={`Status: ${statusFilter}`}
            onSelect={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}
          >
            <Dropdown.Item eventKey="All">All</Dropdown.Item>
            <Dropdown.Item eventKey="Active">Active</Dropdown.Item>
            <Dropdown.Item eventKey="Inactive">Inactive</Dropdown.Item>
            <Dropdown.Item eventKey="Pending">Pending</Dropdown.Item>
          </DropdownButton>

          <p className='btn btn-primary'>Filter by Date -</p>
          <Form.Group>
            <Form.Control type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }} />
          </Form.Group>
          <Form.Group>
            <Form.Control type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }} />
          </Form.Group>
        </div>

        <InputGroup className="dms-custom-width">
          <Form.Control
            placeholder="Search by User name"
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
                  <th>Full Name</th>
                  <th>Phone</th>
                  <th>User Type</th>
                  <th>Created At</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? users.map((user, index) => (
                  <tr key={user.id}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{user.fullName || `N/A`}</td>
                    <td>{user.mobile || 'N/A'}</td>
                    <td>{user.userType || 'N/A'}</td>
                    <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
                    <td>{user.status || 'N/A'}</td>
                    <td>
                      {permissions.includes("view") ||
                        permissions.includes("edit") ||
                        permissions.includes("delete") ? (
                        <>
                          {permissions.includes("view") && (
                            <FaEye
                              className="icon-blue me-2"
                              title="View"
                              onClick={() => handleView(user)}
                            />
                          )}
                          {permissions.includes("edit") && (
                            <FaEdit
                              className="icon-green me-2"
                              title="Edit"
                              onClick={() => handleEdit(user)}
                            />
                          )}
                        </>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="7" className="text-center">No users found.</td></tr>
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
    </AdminLayout>
  );
};
