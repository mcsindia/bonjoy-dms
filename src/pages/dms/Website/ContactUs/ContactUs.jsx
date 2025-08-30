import React, { useState } from 'react';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';
import { Table, InputGroup, Form, Pagination } from 'react-bootstrap';
import { FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export const ContactUs = () => {

  const initialContacts = [
    {
      id: 1,
      name: 'Ravi Mehta',
      email: 'ravi.mehta@example.com',
      phone: '9876543210',
      subject: 'Ride Cancellation Refund',
      message: 'My ride was cancelled but I haven’t received the refund yet.',
      date: '2025-05-20'
    },
    {
      id: 2,
      name: 'Priya Kapoor',
      email: 'priya.kapoor@example.com',
      phone: '8765432109',
      subject: 'Driver Misconduct',
      message: 'The driver was rude and overcharged me. Please take action.',
      date: '2025-05-21'
    },
    {
      id: 3,
      name: 'Amit Thakur',
      email: 'amit.thakur@example.com',
      phone: '9123456780',
      subject: 'App Not Working',
      message: 'The app crashes every time I try to book a ride.',
      date: '2025-05-22'
    },
    {
      id: 4,
      name: 'Neha Joshi',
      email: 'neha.joshi@example.com',
      phone: '9988776655',
      subject: 'Lost Item in Ride',
      message: 'I left my phone in the cab. How do I retrieve it?',
      date: '2025-05-23'
    }
  ];

  const [contacts, setContacts] = useState(initialContacts);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const navigate = useNavigate();

  const handleSearch = (e) => setSearch(e.target.value);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(search.toLowerCase()) ||
    contact.email.toLowerCase().includes(search.toLowerCase()) ||
    contact.subject.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentContacts = filteredContacts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleView = (id) => {
    const selected = contacts.find((c) => c.id === id);
    navigate('/dms/contact-us/view', { state: { contact: selected } });
  };

  return (
    <AdminLayout>
      <div className="contactus-container p-3">
        {/* Header */}
        <div className="dms-pages-header sticky-header">
          <h3>Contact Us</h3>
        </div>
        <div className="filter-search-container">
          <div className='filter-container'>
            <p className='btn btn-primary'>Filter by Date -</p>
            <Form.Group controlId="fromDate">
              <Form.Control type="date" onChange={(e) => setFromDate(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="toDate">
              <Form.Control type="date" onChange={(e) => setToDate(e.target.value)} />
            </Form.Group>
          </div>

          {/* Search */}
          <InputGroup className="dms-custom-width">
            <Form.Control
              placeholder="Search by name"
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
                <th>S.no</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Message</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentContacts.length > 0 ? (
                currentContacts.map((contact, index) => (
                  <tr key={contact.id}>
                    <td>{indexOfFirstItem + index + 1}</td>
                    <td>{contact.name}</td>
                    <td>{contact.email}</td>
                    <td>{contact.phone}</td>
                    <td>{contact.message}</td>
                    <td>{contact.date}</td>
                    <td>
                      <FaEye
                        title="View"
                        className="icon-blue"
                        onClick={() => handleView(contact.id)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">No records found.</td>
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
