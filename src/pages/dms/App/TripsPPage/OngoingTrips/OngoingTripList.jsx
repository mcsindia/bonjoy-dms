import React, { useState } from 'react';
import { Button, Table, InputGroup, Form, Pagination, Dropdown, DropdownButton } from 'react-bootstrap';
import { FaEye, FaTrash, FaFileExport, FaFileExcel, FaFilePdf } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';

export const OngoingTripList = () => {
    const navigate = useNavigate();

    const initialTrips = [
        { id: 1, trip_id: 'T001', driver_id: 'D001', rider_id: 'R1001', vehicle_id: 'V1001', pickup_location: 'Downtown', dropoff_location: 'Airport', current_location: 'Highway', estimated_fare: 25.50, payment_status: 'Pending' },
        { id: 2, trip_id: 'T002', driver_id: 'D002', rider_id: 'R1002', vehicle_id: 'V1002', pickup_location: 'City Center', dropoff_location: 'Mall', current_location: 'Main St.', estimated_fare: 15.75, payment_status: 'Paid' },
    ];

    const [trips, setTrips] = useState(initialTrips);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const ongoingCount = trips.length;

    const handleSearch = (e) => setSearch(e.target.value);

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
                        <h3>Ongoing Trips</h3>
                        <div className='live-count-container'>
                        <Button className='green-button'>
                        🏍️ Ongoing: {ongoingCount}
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
                        </DropdownButton> */}
                    </div>
                </div>

                <div className="filter-search-container">
                    <DropdownButton variant="primary" title="Filter by Payment Status" id="filter-dropdown">
                        <Dropdown.Item onClick={() => setFilter('')}>All</Dropdown.Item>
                        <Dropdown.Item onClick={() => setFilter('Paid')}>Paid</Dropdown.Item>
                        <Dropdown.Item onClick={() => setFilter('Pending')}>Pending</Dropdown.Item>
                        <Dropdown.Item onClick={() => setFilter('Failed')}>Failed</Dropdown.Item>
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
                            <th>Current Location</th>
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
                                        <a href='#' role="button" className='driver-id-link' onClick={() => navigate('/dms/drivers/details/view', { state: { driver: trip } })}>
                                            {trip.driver_id}
                                        </a>
                                    </td>
                                    <td>
                                        <a href='#' role="button" className='driver-id-link' onClick={() => navigate('/dms/rider/profile', { state: { rider: trip } })}>
                                            {trip.rider_id}
                                        </a>
                                    </td>
                                    <td>{trip.vehicle_id}</td>
                                    <td>{trip.pickup_location}</td>
                                    <td>{trip.dropoff_location}</td>
                                    <td>{trip.current_location}</td>
                                    <td>₹{trip.estimated_fare.toFixed(2)}</td>
                                    <td>{trip.payment_status}</td>
                                    <td>
                                        <FaEye title="View" className="icon-blue me-2" onClick={() => navigate("/dms/ongoing-trips/view", { state: { trip } })} />
                                  {/*       <FaTrash title="Delete" className="icon-red" />
                                   */}  </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="12" className="text-center">No ongoing trips found.</td>
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
