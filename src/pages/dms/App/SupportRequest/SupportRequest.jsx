import React, { useState } from 'react';
import { Button, Table, InputGroup, Form, Pagination, Dropdown, DropdownButton } from 'react-bootstrap';
import { FaEdit, FaTrash, FaEye, FaFileExport, FaPlus, FaFileExcel, FaFilePdf } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';

export const SupportRequest = () => {
    const navigate = useNavigate();

    // Initial Support Requests Data
    const initialRequests = [
        { id: 1, userId: 'U123', tripId: 'T456', requestType: 'Technical', userType: 'Rider', title: 'Login Issue', status: 'Active' },
        { id: 2, userId: 'U789', tripId: 'T101', requestType: 'Billing', userType: 'Driver', title: 'Invoice Dispute', status: 'Active' },
        { id: 3, userId: 'U456', tripId: 'T202', requestType: 'General', userType: 'Rider', title: 'Feature Request', status: 'Inactive' },
    ];

    const [requests, setRequests] = useState(initialRequests);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const requestCount = requests.length;
    const itemsPerPage = 5;

    // Search Functionality
    const handleSearch = (e) => setSearch(e.target.value);

    // Filtered Requests
    const filteredRequests = requests.filter((request) => {
        const searchTerm = search.toLowerCase();
        const matchesSearch =
            (request.userId && request.userId.toLowerCase().includes(searchTerm)) ||
            (request.tripId && request.tripId.toLowerCase().includes(searchTerm)) ||
            (request.title && request.title.toLowerCase().includes(searchTerm));

        const matchesFilter = filter ? request.userType === filter : true;
        return matchesSearch && matchesFilter;
    });


    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentRequests = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    // Edit Action
    const handleEdit = (request) => {
        navigate('/dms/support-request/edit', { state: { request } });
    };

    // Delete Action
    const handleDelete = (id) => {
        const updatedRequests = requests.filter((request) => request.id !== id);
        setRequests(updatedRequests);
    };

    const handleToggleStatus = (id) => {
        setRequests(prevRequests =>
            prevRequests.map(request =>
                request.id === id ? { ...request, status: request.status === 'Active' ? 'Inactive' : 'Active' } : request
            )
        );
    };

    return (
        <AdminLayout>
            <div className="dms-pages-header sticky-header">
                <div className="live-count">
                <h3>Support Requests</h3>
                    <div className="live-count-container">
                        <Button className='green-button'>
                        💬 Requests: {requestCount}
                        </Button>
                    </div>
                </div>
            <div className="export-import-container">
                <DropdownButton variant="primary" title={<><FaFileExport /> Export</>} className="me-2">
                    <Dropdown.Item> <FaFileExcel className="icon-green" /> Export to Excel</Dropdown.Item>
                    <Dropdown.Item> <FaFilePdf className="icon-red" /> Export to PDF</Dropdown.Item>
                </DropdownButton>
                <DropdownButton variant="primary" title={<><FaFileExport /> Import</>} className="me-2">
                    <Dropdown.Item> <FaFileExcel className="icon-green" /> Import from Excel</Dropdown.Item>
                    <Dropdown.Item> <FaFilePdf className="icon-red" /> Import from PDF</Dropdown.Item>
                </DropdownButton>
                <Button variant="primary" onClick={() => navigate('/dms/support-request/add')}>
                    <FaPlus /> Add Support Request
                </Button>
            </div>
        </div>

            {/* Search and Filter */ }
    <div className="filter-search-container">
        <DropdownButton variant="primary" title="Filter" id="filter-dropdown">
            <Dropdown.Item onClick={() => setFilter('')}>All</Dropdown.Item>
            <Dropdown.Item onClick={() => setFilter('Rider')}>Rider</Dropdown.Item>
            <Dropdown.Item onClick={() => setFilter('Driver')}>Driver</Dropdown.Item>
            <Dropdown.Item className="text-custom-danger" onClick={() => setFilter("")}>Cancel</Dropdown.Item>
        </DropdownButton>
        <InputGroup className="dms-custom-width">
            <Form.Control
                placeholder="Search by customer name..."
                value={search}
                onChange={handleSearch}
            />
        </InputGroup>
    </div>

    {/* Table */ }
    <div className="dms-table-container">
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>S.No</th>
                    <th>Trip Id</th>
                    <th>User Id</th>
                    <th>User Type</th>
                    <th>Request Type</th>
                    <th>Request Title</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {currentRequests.length > 0 ? (
                    currentRequests.map((request, index) => (
                        <tr key={request.id}>
                            <td>{indexOfFirstItem + index + 1}</td>
                            <td>
                                <a href="#" role="button" className='trip-id-link' onClick={() => navigate('/dms/trip/details', { state: { trip: request } })}>
                                    {request.tripId}
                                </a>
                            </td>
                            <td>
                                <a href="#" role="button" className='user-id-link' onClick={() => navigate('/dms/user/profile', { state: { user: request } })}>
                                    {request.userId}
                                </a>
                            </td>
                            <td>{request.userType}</td>
                            <td>{request.requestType}</td>
                            <td>{request.title}</td>
                            <td> <Form.Check
                                type="switch"
                                id={`status-switch-${request.id}`}
                                checked={request.status === 'Active'}
                                onChange={() => handleToggleStatus(request.id)}
                            /></td>
                            <td>
                                <FaEye
                                    title="View"
                                    className="icon-blue me-2"
                                    onClick={() => navigate('/dms/support-request/details', { state: { request } })}
                                />
                                <FaEdit
                                    title="Edit"
                                    className="icon-green me-2"
                                    onClick={() => handleEdit(request)}
                                />
                                <FaTrash
                                    title="Delete"
                                    className="icon-red"
                                    onClick={() => handleDelete(request.id)}
                                />
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="7" className="text-center">No support requests found.</td>
                    </tr>
                )}
            </tbody>
        </Table>
    </div>

    {/* Pagination */ }
    <Pagination className="justify-content-center">
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
        </AdminLayout >
    );
};
