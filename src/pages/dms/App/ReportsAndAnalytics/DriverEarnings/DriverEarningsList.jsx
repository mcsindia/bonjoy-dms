import React, { useState } from 'react';
import { Table, InputGroup, Form, Pagination, Dropdown, DropdownButton } from 'react-bootstrap';
import { FaEye, FaFileExport,  FaFileExcel, FaFilePdf } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';

export const DriverEarningsList = () => {
  const navigate = useNavigate();

  const initialEarnings = [
    { earning_id: 1, driver_id: 'D001', trip_id: 'T1001', base_fare: 50.00, distance_fare: 30.00, time_fare: 20.00, surge_earning: 10.00, bonus_amount: 5.00, commission_deduction: 15.00, net_earning: 100.00, payment_status: 'Paid', paid_at: '2025-03-10' },
    { earning_id: 2, driver_id: 'D002', trip_id: 'T1002', base_fare: 40.00, distance_fare: 25.00, time_fare: 15.00, surge_earning: 5.00, bonus_amount: 10.00, commission_deduction: 10.00, net_earning: 85.00, payment_status: 'Pending', paid_at: null },
  ];

  const [earnings, setEarnings] = useState(initialEarnings);
  const [search, setSearch] = useState('');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleSearch = (e) => setSearch(e.target.value);

  const filteredEarnings = earnings.filter((earning) => {
    const matchesSearch = earning.driver_id.toLowerCase().includes(search.toLowerCase());
    const matchesPaymentStatus = filterPaymentStatus ? earning.payment_status === filterPaymentStatus : true;
    return matchesSearch && matchesPaymentStatus;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEarnings = filteredEarnings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEarnings.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <AdminLayout>
      <div className="earnings-list-container p-3">
        <div className="dms-pages-header sticky-header">
          <h3>Driver Earnings</h3>
          <div className="export-import-container">
            <DropdownButton variant="primary" title={<><FaFileExport /> Export</>} className="me-2">
              <Dropdown.Item> <FaFileExcel className="icon-green" /> Export to Excel</Dropdown.Item>
              <Dropdown.Item> <FaFilePdf className="icon-red" /> Export to PDF</Dropdown.Item>
            </DropdownButton>
            <DropdownButton variant="primary" title={<><FaFileExport /> Import</>} className="me-2">
              <Dropdown.Item>
                <FaFileExcel className='icon-green' /> Import from Excel
              </Dropdown.Item>
              <Dropdown.Item>
                <FaFilePdf className='icon-red' /> Import from PDF
              </Dropdown.Item>
            </DropdownButton>
          </div>
        </div>

        <div className="filter-search-container">
          <DropdownButton variant="primary" title="Filter" id="filter-payment-dropdown" className="me-2">
            <Dropdown.Item onClick={() => setFilterPaymentStatus('')}>All</Dropdown.Item>
            <Dropdown.Item onClick={() => setFilterPaymentStatus('Paid')}>Paid</Dropdown.Item>
            <Dropdown.Item onClick={() => setFilterPaymentStatus('Pending')}>Pending</Dropdown.Item>
          </DropdownButton>
          <InputGroup className="dms-custom-width">
            <Form.Control placeholder="Search by Driver ID..." value={search} onChange={handleSearch} />
          </InputGroup>
        </div>

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>SNo</th>
              <th>Driver ID</th>
              <th>Trip ID</th>
              <th>Base Fare</th>
              <th>Distance Fare</th>
              <th>Time Fare</th>
              <th>Surge Earning</th>
              <th>Bonus Amount</th>
              <th>Commission Deduction</th>
              <th>Net Earning</th>
              <th>Payment Status</th>
              <th>Paid At</th>
            </tr>
          </thead>
          <tbody>
            {currentEarnings.length > 0 ? (
              currentEarnings.map((earning, index) => (
                <tr key={earning.earning_id}>
                  <td>{index + 1}</td>
                  <td>
                    <a href='#' role="button" className='driver-id-link' onClick={() => navigate('/dms/drivers/details/view', { state: { driver: earning } })}>
                      {earning.driver_id}
                    </a>
                  </td>
                  <td>
                    <a href='' role="button" className='trip-id-link' onClick={() => navigate('/dms/trip/details', { state: { trip: earning } })}>
                      {earning.trip_id}
                    </a>
                  </td>
                  <td>₹{earning.base_fare.toFixed(2)}</td>
                  <td>₹{earning.distance_fare.toFixed(2)}</td>
                  <td>₹{earning.time_fare.toFixed(2)}</td>
                  <td>₹{earning.surge_earning?.toFixed(2) || 'N/A'}</td>
                  <td>₹{earning.bonus_amount?.toFixed(2) || 'N/A'}</td>
                  <td>₹{earning.commission_deduction.toFixed(2)}</td>
                  <td>₹{earning.net_earning.toFixed(2)}</td>
                  <td>{earning.payment_status}</td>
                  <td>{earning.paid_at || 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="13" className="text-center">No earnings found.</td>
              </tr>
            )}
          </tbody>
        </Table>

        <Pagination className="justify-content-center">
          <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => handlePageChange(index + 1)}>
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
        </Pagination>
      </div>
    </AdminLayout>
  );
};
