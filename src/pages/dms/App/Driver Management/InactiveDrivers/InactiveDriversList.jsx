import React, { useState } from 'react';
import { Button, Table, InputGroup, Form, Pagination, Dropdown, DropdownButton } from 'react-bootstrap';
import { FaEye, FaTrash, FaFileExport, FaPlus, FaFileExcel, FaFilePdf, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';

export const InactiveDriversList = () => {
  const navigate = useNavigate();

  const initialDrivers = [
    { id: 1, driver_id: 'D001', full_name: 'John Doe', vehicle_id: 'V1001', suspension_reason: 'Policy Violation', suspension_type: 'Temporary', suspended_at: '2025-03-12 09:00 AM' },
    { id: 2, driver_id: 'D002', full_name: 'Jane Smith', vehicle_id: 'V1002', suspension_reason: 'Reckless Driving', suspension_type: 'Permanent', suspended_at: '2025-03-10 02:45 PM' },
  ];

  const [drivers, setDrivers] = useState(initialDrivers);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleSearch = (e) => setSearch(e.target.value);

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.driver_id.toLowerCase().includes(search.toLowerCase()) ||
      driver.full_name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter ? driver.suspension_type === filter : true;
    return matchesSearch && matchesFilter;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDrivers = filteredDrivers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDrivers.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <AdminLayout>
      <div className="driver-list-container p-3">
        <div className="dms-pages-header sticky-header">
          <h3>Inactive Drivers</h3>
          <div className="export-import-container">
            <DropdownButton variant="primary" title={<><FaFileExport /> Export</>} className="me-2">
              <Dropdown.Item> <FaFileExcel className="icon-green" /> Export to Excel</Dropdown.Item>
              <Dropdown.Item> <FaFilePdf className="icon-red" /> Export to PDF</Dropdown.Item>
            </DropdownButton>
            <DropdownButton variant="primary" title={<><FaFileExport /> Import</>} className="me-2">
              <Dropdown.Item> <FaFileExcel className="icon-green" /> Import from Excel</Dropdown.Item>
              <Dropdown.Item> <FaFilePdf className="icon-red" /> Import from PDF</Dropdown.Item>
            </DropdownButton>
            <Button variant="primary" onClick={() => navigate('/dms/inactive-drivers/add')}>
              <FaPlus /> Add Inactive Driver
            </Button>
          </div>
        </div>

        <div className="filter-search-container">
          <DropdownButton variant="primary" title="Filter" id="filter-dropdown">
            <Dropdown.Item onClick={() => setFilter('')}>All</Dropdown.Item>
            <Dropdown.Item onClick={() => setFilter('Temporary')}>Temporary</Dropdown.Item>
            <Dropdown.Item onClick={() => setFilter('Permanent')}>Permanent</Dropdown.Item>
          </DropdownButton>
          <InputGroup className="dms-custom-width">
            <Form.Control placeholder="Search drivers..." value={search} onChange={handleSearch} />
          </InputGroup>
        </div>

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>SNo</th>
              <th>Driver ID</th>
              <th>Full Name</th>
              <th>Vehicle ID</th>
              <th>Inactive Reason</th>
              <th>Inactive Type</th>
              <th>Inactive At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentDrivers.length > 0 ? (
              currentDrivers.map((driver, index) => (
                <tr key={driver.id}>
                  <td>{index + 1}</td>
                  <td>{driver.driver_id}</td>
                  <td>{driver.full_name}</td>
                  <td>{driver.vehicle_id}</td>
                  <td>{driver.suspension_reason}</td>
                  <td>{driver.suspension_type}</td>
                  <td>{driver.suspended_at}</td>
                  <td>
                    <FaEye title="View" className="icon-blue me-2" onClick={() => navigate("/dms/drivers/details/view", { state: { driver } })} />
                    <FaEdit title="Edit" className="icon-green me-2" onClick={() => navigate("/dms/inactive-drivers/edit", { state: { driver } })} />
                    <FaTrash title="Delete" className="icon-red" />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">No inactive drivers found.</td>
              </tr>
            )}
          </tbody>
        </Table>

        <Pagination className="justify-content-center">
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
      </div>
    </AdminLayout>
  );
};