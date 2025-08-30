import React, { useState } from 'react';
import { Button, Table, InputGroup, Form, Pagination, Dropdown, DropdownButton } from 'react-bootstrap';
import { FaEdit, FaTrash, FaEye, FaFileExport, FaPlus, FaFileExcel, FaFilePdf } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';

export const ActiveDriverList = () => {
    const navigate = useNavigate();

    const initialDrivers = [
        { id: 1, driver_id: 'D001', vehicle_id: 'V1001', status: 'Active', current_lat: '40.7128', current_lng: '-74.0060', last_seen: '2025-03-13 10:30 AM', trip_id: 'T5001', rating: 4.8, earnings_today: 120.50 },
        { id: 2, driver_id: 'D002', vehicle_id: 'V1002', status: 'Inactive', current_lat: '34.0522', current_lng: '-118.2437', last_seen: '2025-03-13 11:00 AM', trip_id: 'T5002', rating: 4.5, earnings_today: 95.30 },
    ];

    const [drivers, setDrivers] = useState(initialDrivers);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const handleSearch = (e) => setSearch(e.target.value);

    const filteredDrivers = drivers.filter((driver) => {
        const matchesSearch = driver.driver_id.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter ? driver.status === filter : true;
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
                    <h3>Active Drivers</h3>
                    <div className="export-import-container">
                        <DropdownButton variant="primary" title={<><FaFileExport /> Export</>} className="me-2">
                            <Dropdown.Item> <FaFileExcel className="icon-green" /> Export to Excel</Dropdown.Item>
                            <Dropdown.Item> <FaFilePdf className="icon-red" /> Export to PDF</Dropdown.Item>
                        </DropdownButton>
                        <DropdownButton variant="primary" title={<><FaFileExport /> Import</>} className="me-2">
                            <Dropdown.Item> <FaFileExcel className="icon-green" /> Import from Excel</Dropdown.Item>
                            <Dropdown.Item> <FaFilePdf className="icon-red" /> Import from PDF</Dropdown.Item>
                        </DropdownButton>
                        <Button variant="primary" onClick={() => navigate('/dms/active-drivers/add')}>
                            <FaPlus /> Add Driver
                        </Button>
                    </div>
                </div>

                <div className="filter-search-container">
                    <DropdownButton variant="primary" title="Filter" id="filter-dropdown">
                        <Dropdown.Item onClick={() => setFilter('')}>All</Dropdown.Item>
                        <Dropdown.Item onClick={() => setFilter('Active')}>Active</Dropdown.Item>
                        <Dropdown.Item onClick={() => setFilter('Inactive')}>Inactive</Dropdown.Item>
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
                            <th>Vehicle ID</th>
                            <th>Status</th>
                            <th>Current Location</th>
                            <th>Last Seen</th>
                            <th>Trip ID</th>
                            <th>Rating</th>
                            <th>Earnings Today</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentDrivers.length > 0 ? (
                            currentDrivers.map((driver, index) => (
                                <tr key={driver.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <a href='#' role="button" className='driver-id-link' onClick={() => navigate('/dms/drivers/details/view', { state: { driver: driver } })}>
                                            {driver.driver_id}
                                        </a>
                                    </td>
                                    <td>{driver.vehicle_id}</td>
                                    <td>{driver.status}</td>
                                    <td>{`${driver.current_lat}, ${driver.current_lng}`}</td>
                                    <td>{driver.last_seen}</td>
                                    <td>
                                        <a href='#' role="button" className='trip-id-link' onClick={() => navigate('/dms/trip/details', { state: { trip: driver } })}>
                                            {driver.trip_id}
                                        </a>
                                    </td>
                                    <td>{driver.rating}</td>
                                    <td>₹{driver.earnings_today.toFixed(2)}</td>
                                    <td>
                                        <FaEye title="View" className="icon-blue me-2" onClick={() => navigate("/dms/drivers/details/view", { state: { driver } })} />
                                        <FaEdit title="Edit" className="icon-green me-2" onClick={() => navigate("/dms/active-drivers/edit", { state: { driver } })} />
                                        <FaTrash title="Delete" className="icon-red" />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10" className="text-center">No active drivers found.</td>
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
