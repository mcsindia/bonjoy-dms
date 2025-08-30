import React, { useState } from 'react';
import {  Table, InputGroup, Form, Pagination, Dropdown, DropdownButton } from 'react-bootstrap';
import { FaEye, FaFileExport,  FaFileExcel, FaFilePdf } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';

export const TripPerformanceList = () => {
    const navigate = useNavigate();

    const initialRides = [
        { id: 1, trip_id: 'RP1001', driver_id: 'D001', tripr_id: 'R1001', pickup_location: 'NYC', dropoff_location: 'Brooklyn', trip_duration: '00:30:00', trip_distance: 15.2, trip_rating: 4.8, driver_rating: 4.9, cancellation_rate: 5.0, on_time_rate: 98.0, completed_at: '2025-03-15 10:30', status: 'Completed' },
        { id: 2, trip_id: 'RP1002', driver_id: 'D002', tripr_id: 'R1002', pickup_location: 'LA', dropoff_location: 'Santa Monica', trip_duration: '00:45:00', trip_distance: 20.5, trip_rating: 4.6, driver_rating: 4.7, cancellation_rate: 3.5, on_time_rate: 95.0, completed_at: '2025-03-16 15:00', status: 'Cancelled' },
    ];

    const [trips, setRides] = useState(initialRides);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const handleSearch = (e) => setSearch(e.target.value);

    const filteredRides = trips.filter((trip) => {
        const matchesSearch = trip.trip_id.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = filterStatus ? trip.status === filterStatus : true;
        return matchesSearch && matchesStatus;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentRides = filteredRides.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredRides.length / itemsPerPage);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <AdminLayout>
            <div className="trip-list-container p-3">
                <div className="dms-pages-header sticky-header">
                    <h3>Trip Performance</h3>
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
                    <DropdownButton variant="primary" title="Filter by Status" id="filter-status-dropdown" className="me-2">
                        <Dropdown.Item onClick={() => setFilterStatus('')}>All</Dropdown.Item>
                        <Dropdown.Item onClick={() => setFilterStatus('Completed')}>Completed</Dropdown.Item>
                        <Dropdown.Item onClick={() => setFilterStatus('Cancelled')}>Cancelled</Dropdown.Item>
                        <Dropdown.Item onClick={() => setFilterStatus('Pending')}>Pending</Dropdown.Item>
                    </DropdownButton>
                    <InputGroup className="dms-custom-width">
                        <Form.Control placeholder="Search trips..." value={search} onChange={handleSearch} />
                    </InputGroup>
                </div>

                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Trip ID</th>
                            <th>Driver ID</th>
                            <th>Rider ID</th>
                            <th>Pickup Location</th>
                            <th>Dropoff Location</th>
                            <th>Trip Duration</th>
                            <th>Trip Rating</th>
                            <th>Driver Rating</th>
                            <th>Cancellation Rate</th>
                            <th>On-time Rate</th>
                            <th>Completed At</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRides.length > 0 ? (
                            currentRides.map((trip, index) => (
                                <tr key={trip.id}>
                                    <td>{trip.trip_id}</td>
                                    <td>{trip.driver_id}</td>
                                    <td>{trip.tripr_id}</td>
                                    <td>{trip.pickup_location}</td>
                                    <td>{trip.dropoff_location}</td>
                                    <td>{trip.trip_duration}</td>
                                    <td>{trip.trip_rating || 'N/A'}</td>
                                    <td>{trip.driver_rating || 'N/A'}</td>
                                    <td>{trip.cancellation_rate}%</td>
                                    <td>{trip.on_time_rate}%</td>
                                    <td>{trip.completed_at}</td>
                                    <td>{trip.status}</td>
                                    <td>
                                        <FaEye title="View" className="icon-blue me-2" onClick={() => navigate("/dms/trip-performance-report/view", { state: { trip } })} />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="14" className="text-center">No trip performance records found.</td>
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
