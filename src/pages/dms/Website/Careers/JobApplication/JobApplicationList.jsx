import React, { useState } from 'react';
import { Table,  InputGroup, Form, Pagination, Dropdown, DropdownButton } from 'react-bootstrap';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';
import { FaEye, FaTrash, FaFileExcel, FaFilePdf, FaFileExport } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export const JobApplicationList = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([
    {
      id: 1,
      fullName: 'Amit Shah',
      email: 'amit@example.com',
      phone: '9876543210',
      gender: 'Male',
      expectedSalary: '₹60,000/month',
      availableDate: '2025-06-01',
      preferredLocation: 'Mumbai',
      qualification: 'MBA in HR',
      passingYear: '2020',
      percentage: '85%',
      experience: '3 years',
      skills: 'Recruitment, Communication, MS Office',
      status: 'Pending',
      createdAt: '2025-05-30',
    },
    {
      id: 2,
      fullName: 'Riya Mehta',
      email: 'riya@example.com',
      phone: '9123456789',
      gender: 'Female',
      expectedSalary: '₹45,000/month',
      availableDate: '2025-06-10',
      preferredLocation: 'Delhi',
      qualification: 'B.Tech in Computer Science',
      passingYear: '2022',
      percentage: '8.7 CGPA',
      experience: '1 year',
      skills: 'JavaScript, React, HTML/CSS',
      status: 'Reviewed',
      createdAt: '2025-05-29',
    },
  ]);

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleDelete = (id) => {
    const updated = applications.filter(app => app.id !== id);
    setApplications(updated);
  };

  const filteredApps = applications.filter(app =>
    app.fullName.toLowerCase().includes(search.toLowerCase()) ||
    app.email.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentApps = filteredApps.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredApps.length / itemsPerPage);

  return (
    <AdminLayout>
      <div className="job-application-container p-3">
        <div className="dms-pages-header sticky-header ">
          <h3>Job Applications</h3>
          <div className="export-import-container">
            <DropdownButton title={<><FaFileExport /> Export</>} variant="primary">
              <Dropdown.Item><FaFileExcel className="icon-green" /> Excel</Dropdown.Item>
              <Dropdown.Item><FaFilePdf className="icon-red" /> PDF</Dropdown.Item>
            </DropdownButton>
          </div>
        </div>

        <div className="filter-search-container">
          <InputGroup className="dms-custom-width">
            <Form.Control
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </div>

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Experience</th>
              <th>Expected Salary</th>
              <th>Created At</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentApps.length > 0 ? currentApps.map(app => (
              <tr key={app.id}>
                <td>{app.id}</td>
                <td>{app.fullName}</td>
                <td>{app.email}</td>
                <td>{app.phone}</td>
                <td>{app.experience}</td>
                <td>{app.expectedSalary}</td>
                <td>{app.createdAt}</td>
                <td>{app.status}</td>
                <td>
                  <FaEye
                    title="View"
                    className="me-2 icon-blue"
                    onClick={() => navigate('/dms/job-application/view', { state: { application: app } })}
                  />
                  <FaTrash title="Delete" className="icon-red" onClick={() => handleDelete(app.id)} />
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="9" className="text-center">No applications found.</td>
              </tr>
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
      </div>
    </AdminLayout>
  );
};
