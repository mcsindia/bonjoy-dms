import React, { useState } from 'react';
import { Button, Table, InputGroup, Form, Pagination, Dropdown, DropdownButton } from 'react-bootstrap';
import { FaEdit, FaTrash, FaEye, FaFileExport, FaPlus, FaFileExcel, FaFilePdf } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';

export const InactiveRidersList = () => {
  const navigate = useNavigate();

  const initialBlockedRiders = [
    { id: 1, rider_id: 'R1001', blocked_by: 'Admin', reason: 'Fraudulent Activity', reported_by: 'U001', ride_id: 'R2001', block_type: 'Permanent', start_date: '2025-03-10' },
    { id: 2, rider_id: 'R1002', blocked_by: 'Moderator', reason: 'Abusive Behavior', reported_by: 'U002', ride_id: 'R2002', block_type: 'Temporary', start_date: '2025-03-11' },
    { id: 3, rider_id: 'R1003', blocked_by: 'Admin', reason: 'Multiple Complaints', reported_by: 'U003', ride_id: 'R2003', block_type: 'Permanent', start_date: '2025-03-12' },
  ];

  const [blockedRiders, setBlockedRiders] = useState(initialBlockedRiders);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [riderToDelete, setRiderToDelete] = useState(null);

  const itemsPerPage = 3;

  const handleSearch = (e) => setSearch(e.target.value);
  const handleFilter = (type) => setFilter(type);

  const filteredRiders = blockedRiders.filter((rider) => {
    const matchesSearch = rider.reason.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter ? rider.block_type === filter : true;
    return matchesSearch && matchesFilter;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRiders = filteredRiders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRiders.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handleDelete = (id) => {
    setRiderToDelete(id);
    setShowDeleteModal(true);
  };
  const confirmDelete = () => {
    setBlockedRiders(blockedRiders.filter((rider) => rider.id !== riderToDelete));
    setShowDeleteModal(false);
    setRiderToDelete(null);
  };

  return (
    <AdminLayout>
      <div className="inactive-riders-container p-3">
        <div className="dms-pages-header sticky-header ">
          <div className='live-count'>
            <h3>Inactive Riders List</h3>
            <div className="live-count-container">
              <Button className='green-button'>
              🧍 Inactive Riders: {blockedRiders.length}
              </Button>
            </div>
          </div>

          <div className="export-import-container mt-3 mt-md-0 d-flex flex-wrap gap-2">
            <DropdownButton variant="primary" title={<><FaFileExport /> Export</>} className="me-2">
              <Dropdown.Item><FaFileExcel className="icon-green" /> Export to Excel</Dropdown.Item>
              <Dropdown.Item><FaFilePdf className="icon-red" /> Export to PDF</Dropdown.Item>
            </DropdownButton>

            <DropdownButton variant="primary" title={<><FaFileExport /> Import</>} className="me-2">
              <Dropdown.Item><FaFileExcel className="icon-green" /> Import from Excel</Dropdown.Item>
              <Dropdown.Item><FaFilePdf className="icon-red" /> Import from PDF</Dropdown.Item>
            </DropdownButton>

            <Button variant="primary" onClick={() => navigate('/dms/inactive-riders/add')}>
              <FaPlus /> Add Inactive Rider
            </Button>
          </div>
        </div>

        <div className="filter-search-container">
          <DropdownButton variant="primary" title="Filter" id="filter-dropdown">
            <Dropdown.Item onClick={() => handleFilter('')}>All</Dropdown.Item>
            <Dropdown.Item onClick={() => handleFilter('Permanent')}>Permanent</Dropdown.Item>
            <Dropdown.Item onClick={() => handleFilter('Temporary')}>Temporary</Dropdown.Item>
          </DropdownButton>
          <InputGroup className="dms-custom-width">
            <Form.Control placeholder="Search blocked riders..." value={search} onChange={handleSearch} />
          </InputGroup>
        </div>

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>S.no</th>
              <th>Rider ID</th>
              <th>Inactive By</th>
              <th>Reason</th>
              <th>Reported By</th>
              <th>Trip ID</th>
              <th>Inactive Type</th>
              <th>Start Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRiders.length > 0 ? (
              currentRiders.map((rider) => (
                <tr key={rider.id}>
                  <td>{rider.id}</td>
                  <td>
                    <a href="#" role="button" className='rider-id-link' onClick={() => navigate('/dms/rider/profile', { state: { rider: rider } })}>
                      {rider.ride_id}
                    </a>
                  </td>
                  <td>{rider.blocked_by}</td>
                  <td>{rider.reason}</td>
                  <td>{rider.reported_by}</td>
                  <td>
                    <a href="#" role="button" className='trip-id-link' onClick={() => navigate('/dms/trip/details', { state: { trip: rider } })}>
                      {rider.ride_id}
                    </a>
                  </td>
                  <td>{rider.block_type}</td>
                  <td>{rider.start_date}</td>
                  <td>
                    <FaEye title="View" className="icon-blue me-2" onClick={() => navigate("/dms/rider/profile", { state: { rider } })} />
                    <FaEdit title="Edit" className="icon-green me-2" onClick={() => navigate("/dms/inactive-riders/edit", { state: { rider } })} />
                    <FaTrash title="Delete" className="icon-red" onClick={() => handleDelete(rider.id)} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">No blocked riders found.</td>
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
