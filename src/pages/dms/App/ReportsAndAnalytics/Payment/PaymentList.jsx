import React, { useState } from 'react';
import { Table, InputGroup, Form, Pagination, Dropdown, DropdownButton, } from 'react-bootstrap';
import { FaEye,  FaFileExport, FaFileExcel, FaFilePdf, } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';

export const PaymentList = () => {
  const navigate = useNavigate();

  const initialPayments = [
    { id: 1, trip_id: 'P7001', rider_id: 'R1001', driver_id: 'D001', payment_amount: 30.50, base_fare: 15.00, distance_fare: 10.00, time_fare: 5.50, discount_applied: 0, final_payout: 30.50, payment_method: 'Credit Card', payment_status: 'Paid', refund_status: 'None', created_at: '2025-03-15' },
    { id: 2, trip_id: 'P7002', rider_id: 'R1002', driver_id: 'D002', payment_amount: 45.00, base_fare: 20.00, distance_fare: 15.00, time_fare: 10.00, discount_applied: 5, final_payout: 40.00, payment_method: 'PayPal', payment_status: 'Pending', refund_status: 'None', created_at: '2025-03-16' },
  ];

  const [payments, setPayments] = useState(initialPayments);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterMethod, setFilterMethod] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleSearch = (e) => setSearch(e.target.value);

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = payment.trip_id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus ? payment.payment_status === filterStatus : true;
    const matchesMethod = filterMethod ? payment.payment_method === filterMethod : true;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPayments = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <AdminLayout>
      <div className="payment-report-container p-3">
        <div className="dms-pages-header sticky-header">
          <h3>Payment Report</h3>
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
          <DropdownButton variant="primary" title="Filter" id="filter-dropdown" className="me-2">
            <Dropdown.Item onClick={() => setFilterStatus('')}>All Statuses</Dropdown.Item>
            <Dropdown.Item onClick={() => setFilterStatus('Paid')}>Paid</Dropdown.Item>
            <Dropdown.Item onClick={() => setFilterStatus('Pending')}>Pending</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => setFilterMethod('')}>All Methods</Dropdown.Item>
            <Dropdown.Item onClick={() => setFilterMethod('Credit Card')}>Credit Card</Dropdown.Item>
            <Dropdown.Item onClick={() => setFilterMethod('PayPal')}>PayPal</Dropdown.Item>
          </DropdownButton>
          <InputGroup className="dms-custom-width">
            <Form.Control placeholder="Search payments..." value={search} onChange={handleSearch} />
          </InputGroup>
        </div>

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Trip ID</th>
              <th>Rider ID</th>
              <th>Driver ID</th>
              <th>Payment Amount</th>
              <th>Base Fare</th>
              <th>Distance Fare</th>
              <th>Discount Applied</th>
              <th>Final Payout</th>
              <th>Payment Method</th>
              <th>Payment Status</th>
              <th>Refund Status</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentPayments.length > 0 ? (
              currentPayments.map((payment) => (
                <tr key={payment.id}>
                  <td>
                    <a href='' role="button" className='trip-id-link' onClick={() => navigate('/dms/trip/details', { state: { trip: payment } })}>
                      {payment.trip_id}
                    </a>
                  </td>
                  <td>
                    <a href='#' role="button" className='driver-id-link' onClick={() => navigate('/dms/rider/profile', { state: { rider: payment } })}>
                      {payment.rider_id}
                    </a>
                  </td>
                  <td>
                    <a href='#' role="button" className='driver-id-link' onClick={() => navigate('/dms/drivers/details/view', { state: { driver: payment } })}>
                      {payment.driver_id}
                    </a>
                  </td>
                  <td>₹{payment.payment_amount.toFixed(2)}</td>
                  <td>₹{payment.base_fare.toFixed(2)}</td>
                  <td>₹{payment.distance_fare.toFixed(2)}</td>
                  <td>₹{payment.discount_applied.toFixed(2)}</td>
                  <td>₹{payment.final_payout.toFixed(2)}</td>
                  <td>{payment.payment_method}</td>
                  <td>{payment.payment_status}</td>
                  <td>{payment.refund_status}</td>
                  <td>{payment.created_at}</td>
                  <td>
                    <FaEye title="View Details" className="icon-blue me-2" onClick={() => navigate('/dms/payment-report/view', { state: { payment } })} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="14" className="text-center">No payments found.</td>
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
