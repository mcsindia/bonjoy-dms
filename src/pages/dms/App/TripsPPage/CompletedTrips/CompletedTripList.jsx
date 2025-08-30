import React, { useState } from 'react';
import { Button, Table, InputGroup, Form, Pagination, Dropdown, DropdownButton } from 'react-bootstrap';
import { FaEye, FaFileExport, FaPlus, FaFileExcel, FaFilePdf, FaTrash, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';

export const CompletedTripList = () => {
    const navigate = useNavigate();

    const initialTrips = [
        { id: 1, trip_id: 'T5001', driver_id: 'D001', rider_id: 'R1001', vehicle_id: 'V1001', pickup_location: 'NYC', dropoff_location: 'Brooklyn', fare_amount: 45.50, payment_status: 'Completed', trip_distance: '10 km', trip_rating: 4.8, driver_rating: 4.9 },
        { id: 2, trip_id: 'T5002', driver_id: 'D002', rider_id: 'R1002', vehicle_id: 'V1002', pickup_location: 'LA', dropoff_location: 'Santa Monica', fare_amount: 32.00, payment_status: 'Completed', trip_distance: '8 km', trip_rating: 4.5, driver_rating: 4.6 },
    ];

    const [trips, setTrips] = useState(initialTrips);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const handleSearch = (e) => setSearch(e.target.value);
    const completedCount = trips.length;

    const filteredTrips = trips.filter((trip) => {
        const matchesSearch = trip.trip_id.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter ? trip.payment_status === filter : true;
        return matchesSearch && matchesFilter;
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
                    <h3>Completed Trips</h3>
                        <div className='live-count-container'>
                            <Button className='green-button'>
                                🏍️ Completed: {completedCount}
                            </Button>
                        </div>
                    </div>
                    <div className="export-import-container">
                        <DropdownButton variant="primary" title={<><FaFileExport /> Export</>} className="me-2">
                            <Dropdown.Item> <FaFileExcel className="icon-green" /> Export to Excel</Dropdown.Item>
                            <Dropdown.Item> <FaFilePdf className="icon-red" /> Export to PDF</Dropdown.Item>
                        </DropdownButton>
                       {/*  <DropdownButton variant="primary" title={<><FaFileExport /> Import</>} className="me-2">
                            <Dropdown.Item> <FaFileExcel className="icon-green" /> Import from Excel</Dropdown.Item>
                            <Dropdown.Item> <FaFilePdf className="icon-red" /> Import from PDF</Dropdown.Item>
                        </DropdownButton>
                        <Button variant="primary" onClick={() => navigate('/completed-trips/add')}>
                            <FaPlus /> Add Trip
                        </Button> */}
                    </div>
                </div>

                <div className="filter-search-container">
                    <DropdownButton variant="primary" title="Filter by payment status" id="filter-dropdown">
                        <Dropdown.Item onClick={() => setFilter('')}>All</Dropdown.Item>
                        <Dropdown.Item onClick={() => setFilter('Completed')}>Completed</Dropdown.Item>
                        <Dropdown.Item onClick={() => setFilter('Pending')}>Pending</Dropdown.Item>
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
                            <th>Driver ID</th>
                            <th>Rider ID</th>
                            <th>Vehicle ID</th>
                            <th>Pickup Location</th>
                            <th>Dropoff Location</th>
                            <th>Fare Amount</th>
                            <th>Payment Status</th>
                            <th>Trip Distance</th>
                            <th>Trip Rating</th>
                            <th>Driver Rating</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentTrips.length > 0 ? (
                            currentTrips.map((trip, index) => (
                                <tr key={trip.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <a href='' role="button" className='trip-id-link' onClick={() => navigate('/trip/details', { state: { trip: trip } })}>
                                            {trip.trip_id}
                                        </a>
                                    </td>
                                    <td>
                                        <a href='#' role="button" className='driver-id-link' onClick={() => navigate('/drivers/details/view', { state: { driver: trip } })}>
                                            {trip.driver_id}
                                        </a>
                                    </td>
                                    <td>
                                        <a href='#' role="button" className='driver-id-link' onClick={() => navigate('/rider/profile', { state: { rider: trip } })}>
                                            {trip.rider_id}
                                        </a>
                                    </td>
                                    <td>{trip.vehicle_id}</td>
                                    <td>{trip.pickup_location}</td>
                                    <td>{trip.dropoff_location}</td>
                                    <td>₹{trip.fare_amount.toFixed(2)}</td>
                                    <td>{trip.payment_status}</td>
                                    <td>{trip.trip_distance}</td>
                                    <td>{trip.trip_rating}</td>
                                    <td>{trip.driver_rating}</td>
                                    <td>
                                        <FaEye title="View" className="icon-blue me-2" onClick={() => navigate("/dms/completed-trips/view", { state: { trip } })} />
                                        <FaEdit title="Edit" className="icon-green me-2" onClick={() => navigate("/dms/completed-trips/edit", { state: { trip } })} />
                                 {/*        <FaTrash title="Delete" className="icon-red" />
                                 */}    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="13" className="text-center">No completed trips found.</td>
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
