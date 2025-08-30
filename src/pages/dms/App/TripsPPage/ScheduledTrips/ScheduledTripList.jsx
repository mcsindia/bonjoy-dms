import React, { useState } from 'react';
import { Button, Table, InputGroup, Form, Pagination, Dropdown, DropdownButton } from 'react-bootstrap';
import { FaEye, FaFileExport, FaPlus, FaFileExcel, FaFilePdf, FaTrash, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';

export const ScheduledTripList = () => {
    const navigate = useNavigate();

    const initialTrips = [
        { id: 1, trip_id: 'S7001', rider_id: 'R1001', driver_id: 'D001', vehicle_id: 'V1001', pickup_location: 'NYC', dropoff_location: 'Brooklyn', scheduled_pickup_time: '2025-03-15 10:00', ride_type: 'Standard', estimated_fare: 25.50, payment_status: 'Paid' },
        { id: 2, trip_id: 'S7002', rider_id: 'R1002', driver_id: 'D002', vehicle_id: 'V1002', pickup_location: 'LA', dropoff_location: 'Santa Monica', scheduled_pickup_time: '2025-03-16 14:30', ride_type: 'Luxury', estimated_fare: 50.00, payment_status: 'Pending' },
    ];

    const [trips, setTrips] = useState(initialTrips);
    const [search, setSearch] = useState('');
    const [filterRideType, setFilterRideType] = useState('');
    const [filterPaymentStatus, setFilterPaymentStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const scheduledCount = trips.length;
    const handleSearch = (e) => setSearch(e.target.value);

    const filteredTrips = trips.filter((trip) => {
        const matchesSearch = trip.trip_id.toLowerCase().includes(search.toLowerCase());
        const matchesRideType = filterRideType ? trip.ride_type === filterRideType : true;
        const matchesPaymentStatus = filterPaymentStatus ? trip.payment_status === filterPaymentStatus : true;
        return matchesSearch && matchesRideType && matchesPaymentStatus;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTrips = filteredTrips.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredTrips.length / itemsPerPage);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <AdminLayout>
            <div className="trip-list-container p-3">
                <div className="dms-pages-header sticky-header">
                    <div className="live-count">
                        <h3>Scheduled Trips</h3>
                        <div className='live-count-container'>
                            <Button className='green-button'>
                                🏍️ Scheduled: {scheduledCount}
                            </Button>
                        </div>
                    </div>
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
                        <Button variant="primary" onClick={() => navigate('/dms/scheduled-trips/add')}>
                            <FaPlus /> Add Trip
                        </Button>
                    </div>
                </div>

                <div className="filter-search-container">
                    <DropdownButton variant="primary" title="Filter" id="filter-ride-dropdown" className="me-2">
                        <Dropdown.Item onClick={() => setFilterRideType('')}>All</Dropdown.Item>
                        <Dropdown.Item onClick={() => setFilterRideType('Standard')}>Standard</Dropdown.Item>
                        <Dropdown.Item onClick={() => setFilterRideType('Luxury')}>Luxury</Dropdown.Item>
                    </DropdownButton>
                    <InputGroup className="dms-custom-width">
                        <Form.Control placeholder="Search trips..." value={search} onChange={handleSearch} />
                    </InputGroup>
                </div>

                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>SNo</th>
                            <th>Trip ID</th>
                            <th>Rider ID</th>
                            <th>Driver ID</th>
                            <th>Vehicle ID</th>
                            <th>Pickup Location</th>
                            <th>Dropoff Location</th>
                            <th>Scheduled Pickup Time</th>
                            <th>Ride Type</th>
                            <th>Estimated Fare</th>
                            <th>Payment Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentTrips.length > 0 ? (
                            currentTrips.map((trip, index) => (
                                <tr key={trip.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <a href='' role="button" className='trip-id-link' onClick={() => navigate('/dms/trip/details', { state: { trip: trip } })}>
                                            {trip.trip_id}
                                        </a>
                                    </td>
                                    <td>
                                        <a href='#' role="button" className='driver-id-link' onClick={() => navigate('/dms/rider/profile', { state: { rider: trip } })}>
                                            {trip.rider_id}
                                        </a>
                                    </td>
                                    <td>
                                        <a href='#' role="button" className='driver-id-link' onClick={() => navigate('/dms/drivers/details/view', { state: { driver: trip } })}>
                                            {trip.driver_id}
                                        </a>
                                    </td>
                                    <td>{trip.vehicle_id || 'N/A'}</td>
                                    <td>{trip.pickup_location}</td>
                                    <td>{trip.dropoff_location}</td>
                                    <td>{trip.scheduled_pickup_time}</td>
                                    <td>{trip.ride_type}</td>
                                    <td>₹{trip.estimated_fare.toFixed(2)}</td>
                                    <td>{trip.payment_status}</td>
                                    <td>
                                        <FaEye title="View" className="icon-blue me-2" onClick={() => navigate("/dms/scheduled-trips/view", { state: { trip } })} />
                                        <FaEdit title="Edit" className="icon-green me-2" onClick={() => navigate("/dms/scheduled-trips/edit", { state: { trip } })} />
                                        <FaTrash title="Delete" className="icon-red" />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="12" className="text-center">No scheduled trips found.</td>
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
