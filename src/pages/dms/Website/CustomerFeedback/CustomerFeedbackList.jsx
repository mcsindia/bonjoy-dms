import React, { useState } from 'react';
import {
  Table,
  InputGroup,
  Form,
  Pagination,
} from 'react-bootstrap';
import { FaEye, FaStar } from 'react-icons/fa';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';
import { useNavigate } from 'react-router-dom';

export const CustomerFeedbackList = () => {
  const navigate = useNavigate();

  const initialFeedback = [
    {
      id: 1,
      customerName: 'Ravi Kumar',
      mobile: '9876543210',
      feedbackDate: '2025-05-15',
      rating: 4,
      comment: 'Great experience! The driver was very professional.',
    },
    {
      id: 2,
      customerName: 'Anjali Sharma',
      mobile: '9123456789',
      feedbackDate: '2025-05-14',
      rating: 2,
      comment: 'Car was not clean, and driver was late.',
    },
    {
      id: 3,
      customerName: 'Suresh Mehta',
      mobile: '9988776655',
      feedbackDate: '2025-05-12',
      rating: 5,
      comment: 'Very smooth ride. Highly recommended!',
    },
  ];

  const [feedbacks] = useState(initialFeedback);
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  //  Permission extraction
  const userData = JSON.parse(localStorage.getItem('userData'));
  let permissions = [];

  if (Array.isArray(userData?.employeeRole)) {
    for (const role of userData.employeeRole) {
      for (const child of role.childMenus || []) {
        for (const mod of child.modules || []) {
          if (mod.moduleUrl?.toLowerCase() === 'customer-feedback') {
            permissions =
              mod.permission?.toLowerCase().split(',').map((p) => p.trim()) || [];
          }
        }
      }
    }
  }

  const handleSearch = (e) => setSearch(e.target.value);

  const filteredFeedbacks = feedbacks.filter((item) =>
    item.customerName.toLowerCase().includes(search.toLowerCase()) ||
    item.comment.toLowerCase().includes(search.toLowerCase()) ||
    item.mobile.includes(search)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFeedbacks = filteredFeedbacks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <AdminLayout>
      <div className="feedback-list-container p-3">
        {/* Header */}
        <div className="dms-pages-header sticky-header d-flex justify-content-between align-items-center mb-3">
          <h3>Customer Feedback</h3>
        </div>

        <div className="filter-search-container">
          <div className='filter-container'>
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
              placeholder="Search by name, mobile"
              value={search}
              onChange={handleSearch}
            />
          </InputGroup>
        </div>

        {/* Table */}
        <div className="dms-table-container">
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Mobile</th>
                <th>Message</th>
                <th>Rating</th>
                <th>Feedback Date</th>
                {permissions.includes('view') && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {currentFeedbacks.length > 0 ? (
                currentFeedbacks.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.customerName}</td>
                    <td>{item.mobile}</td>
                    <td>{item.comment}</td>
                    <td><FaStar className='icon star-icon' /> {item.rating}</td>
                    <td>{item.feedbackDate}</td>
                    {permissions.includes('view') && (
                      <td>
                        <FaEye
                          title="View"
                          className="icon-blue me-2"
                          onClick={() =>
                            navigate('/dms/customer-feedback/view', { state: { feedback: item } })
                          }
                        />
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">No feedback found.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

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
      </div>
    </AdminLayout>
  );
};
