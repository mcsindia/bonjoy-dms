import React, { useState } from 'react';
import { Table, InputGroup, Form, Pagination, Dropdown, DropdownButton } from 'react-bootstrap';
import { FaEye, FaFileExport, FaFileExcel, FaFilePdf, } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';

export const ComplaintsResolutionList = () => {
  const navigate = useNavigate();

  const initialComplaints = [
    { id: 1, trip_id: 'S7001', complainant_id: 'R1001', complainant_type: 'Rider', against_id: 'D001', against_type: 'Driver', complaint_category: 'Rude Behavior', complaint_description: 'Driver was rude', filed_at: '2025-03-10', support_agent_id: 'A001', resolution_status: 'Resolved', resolved_at: '2025-03-12' },
    { id: 2, trip_id: 'S7002', complainant_id: 'D002', complainant_type: 'Driver', against_id: 'R1002', against_type: 'Rider', complaint_category: 'Non-Payment', complaint_description: 'Rider did not pay', filed_at: '2025-03-11', support_agent_id: 'A002', resolution_status: 'Pending', resolved_at: '' },
  ];

  const [complaints, setComplaints] = useState(initialComplaints);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleSearch = (e) => setSearch(e.target.value);

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch = complaint.trip_id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus ? complaint.resolution_status === filterStatus : true;
    return matchesSearch && matchesStatus;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentComplaints = filteredComplaints.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <AdminLayout>
      <div className="complaints-list-container p-3">
        <div className="dms-pages-header sticky-header">
          <h3>Complaints & Resolutions</h3>
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
          <DropdownButton variant="primary" title="Filter Status" className="me-2">
            <Dropdown.Item onClick={() => setFilterStatus('')}>All</Dropdown.Item>
            <Dropdown.Item onClick={() => setFilterStatus('Resolved')}>Resolved</Dropdown.Item>
            <Dropdown.Item onClick={() => setFilterStatus('Pending')}>Pending</Dropdown.Item>
          </DropdownButton>
          <InputGroup className="dms-custom-width">
            <Form.Control placeholder="Search complaints..." value={search} onChange={handleSearch} />
          </InputGroup>
        </div>

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Trip ID</th>
              <th>Complainant ID</th>
              <th>Complainant Type</th>
              <th>Against ID</th>
              <th>Against Type</th>
              <th>Category</th>
              <th>Description</th>
              <th>Filed At</th>
              <th>Support Agent ID</th>
              <th>Resolution Status</th>
              <th>Resolved At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentComplaints.length > 0 ? (
              currentComplaints.map((complaint) => (
                <tr key={complaint.id}>
                  <td>
                    <a href='' role="button" className='trip-id-link' onClick={() => navigate('/dms/trip/details', { state: { trip: complaint } })}>
                      {complaint.trip_id}
                    </a>
                  </td>
                  <td>{complaint.complainant_id}</td>
                  <td>{complaint.complainant_type}</td>
                  <td>{complaint.against_id}</td>
                  <td>{complaint.against_type}</td>
                  <td>{complaint.complaint_category}</td>
                  <td className='table-description'>{complaint.complaint_description}</td>
                  <td>{complaint.filed_at}</td>
                  <td>{complaint.support_agent_id}</td>
                  <td>{complaint.resolution_status}</td>
                  <td>{complaint.resolved_at || 'N/A'}</td>
                  <td>
                    <FaEye title="View" className="icon-blue me-2" onClick={() => navigate("/dms/complaint-resolution-report/view", { state: { complaint } })} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" className="text-center">No complaints found.</td>
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
