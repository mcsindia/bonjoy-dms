import React, { useState } from 'react';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';
import { Table, InputGroup, Form, Pagination, Dropdown, DropdownButton, Button } from 'react-bootstrap';
import { FaFileExport, FaFileExcel, FaFilePdf, FaEye, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export const DriverPayoutList = () => {
  const navigate = useNavigate();

  const initialPayouts = [
    {
      payout_id: 1,
      driver_id: 'D001',
      total_amount: 5500.00,
      payout_method: 'Bank Transfer',
      transaction_id: 'TXN123456789',
      payout_status: 'Completed',
      processed_by: 1001,
      processed_at: '2025-03-22 04:30 PM',
      created_at: '2025-03-22 02:00 PM'
    },
    {
      payout_id: 2,
      driver_id: 'D002',
      total_amount: 4200.00,
      payout_method: 'UPI',
      transaction_id: 'TXN987654321',
      payout_status: 'Processing',
      processed_by: null,
      processed_at: null,
      created_at: '2025-03-23 10:15 AM'
    }
  ];

  const [payouts, setPayouts] = useState(initialPayouts);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleSearch = (e) => setSearch(e.target.value);

  const filteredPayouts = payouts.filter((payout) => {
    const matchesSearch = payout.driver_id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter ? payout.payout_status === filter : true;
    return matchesSearch && matchesFilter;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPayouts = filteredPayouts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPayouts.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <AdminLayout>
      <div className="p-3">
        <div className="dms-pages-header sticky-header">
          <h3>Driver Payouts</h3>
          <div className="export-import-container">
            <DropdownButton variant="primary" title={<><FaFileExport /> Export</>} className="me-2">
              <Dropdown.Item><FaFileExcel className="icon-green" /> Export to Excel</Dropdown.Item>
              <Dropdown.Item><FaFilePdf className="icon-red" /> Export to PDF</Dropdown.Item>
            </DropdownButton>
            <DropdownButton variant="primary" title={<><FaFileExport /> Import</>} className="me-2">
              <Dropdown.Item> <FaFileExcel className="icon-green" /> Import from Excel</Dropdown.Item>
              <Dropdown.Item> <FaFilePdf className="icon-red" /> Import from PDF</Dropdown.Item>
            </DropdownButton>
            <Button variant="primary" onClick={() => navigate('/dms/drivers-payout/add')}>
              <FaPlus /> Add Payout
            </Button>
          </div>
        </div>

        <div className="filter-search-container">
          <DropdownButton variant="primary" title="Filter" id="filter-dropdown">
            <Dropdown.Item onClick={() => setFilter('')}>All</Dropdown.Item>
            <Dropdown.Item onClick={() => setFilter('Processing')}>Processing</Dropdown.Item>
            <Dropdown.Item onClick={() => setFilter('Completed')}>Completed</Dropdown.Item>
            <Dropdown.Item onClick={() => setFilter('Failed')}>Failed</Dropdown.Item>
          </DropdownButton>
          <InputGroup className="dms-custom-width">
            <Form.Control
              placeholder="Search by Driver ID..."
              value={search}
              onChange={handleSearch}
            />
          </InputGroup>
        </div>

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>SNo</th>
              <th>Driver ID</th>
              <th>Total Amount</th>
              <th>Method</th>
              <th>Transaction ID</th>
              <th>Status</th>
              <th>Processed By</th>
              <th>Processed At</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentPayouts.length > 0 ? currentPayouts.map((payout, index) => (
              <tr key={payout.payout_id}>
                <td>{index + 1}</td>
                <td>
                  <a href='#' role="button" className='driver-id-link' onClick={() => navigate('/dms/drivers/details/view', { state: { driver: payout } })}>
                    {payout.driver_id}
                  </a>
                </td>
                <td>₹{payout.total_amount.toFixed(2)}</td>
                <td>{payout.payout_method}</td>
                <td>{payout.transaction_id}</td>
                <td>{payout.payout_status}</td>
                <td>{payout.processed_by || '-'}</td>
                <td>{payout.processed_at || '-'}</td>
                <td>{payout.created_at}</td>
                <td>
                  <FaEye
                    className="icon-blue"
                    title="View Details"
                    onClick={() => navigate('/dms/drivers-payout/view', { state: { payout } })}
                    role="button"
                  />
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="10" className="text-center">No payout data found.</td>
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
