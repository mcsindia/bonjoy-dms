import React, { useState } from 'react';
import { Button, Table, InputGroup, Form, Pagination, Dropdown, DropdownButton } from 'react-bootstrap';
import { FaEye, FaFileExport, FaPlus, FaFileExcel, FaFilePdf, FaTrash, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';

export const CanceledTripList = () => {
    const navigate = useNavigate();

    const initialTrips = [
        { id: 1, trip_id: 'C6001', driver_id: 'D001', rider_id: 'R1001', vehicle_id: 'V1001', pickup_location: 'NYC', dropoff_location: 'Brooklyn', cancellation_reason: 'Driver No-show', canceled_by: 'Driver', canceled_at: '2025-03-10 14:30', refund_status: 'Pending', cancellation_fee: 5.00 },
        { id: 2, trip_id: 'C6002', driver_id: 'D002', rider_id: 'R1002', vehicle_id: 'V1002', pickup_location: 'LA', dropoff_location: 'Santa Monica', cancellation_reason: 'Rider No-show', canceled_by: 'Rider', canceled_at: '2025-03-11 09:15', refund_status: 'Not Applicable', cancellation_fee: 0.00 },
    ];

    const [trips, setTrips] = useState(initialTrips);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const canceledCount = trips.length;
    const handleSearch = (e) => setSearch(e.target.value);

    const filteredTrips = trips.filter((trip) => {
        const matchesSearch = trip.trip_id.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter ? trip.refund_status === filter : true;
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
                    <h3>Canceled Trips</h3>
                        <div className='live-count-container'>
                            <Button className='green-button'>
                                🏍️ Canceled: {canceledCount}
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
                        <Button variant="primary" onClick={() => navigate('/canceled-trips/add')}>
                            <FaPlus /> Add Trip
                        </Button> */}
                    </div>
                </div>

                <div className="filter-search-container">
                    <DropdownButton variant="primary" title="Filter" id="filter-dropdown">
                        <Dropdown.Item onClick={() => setFilter('')}>All</Dropdown.Item>
                        <Dropdown.Item onClick={() => setFilter('Pending')}>Pending</Dropdown.Item>
                        <Dropdown.Item onClick={() => setFilter('Not Applicable')}>Not Applicable</Dropdown.Item>
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
                            <th>Cancellation Reason</th>
                            <th>Canceled By</th>
                            <th>Canceled At</th>
                            <th>Refund Status</th>
                            <th>Cancellation Fee</th>
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
                                    <td>{trip.vehicle_id || 'N/A'}</td>
                                    <td>{trip.pickup_location}</td>
                                    <td>{trip.dropoff_location}</td>
                                    <td>{trip.cancellation_reason}</td>
                                    <td>{trip.canceled_by}</td>
                                    <td>{trip.canceled_at}</td>
                                    <td>{trip.refund_status}</td>
                                    <td>₹{trip.cancellation_fee.toFixed(2)}</td>
                                    <td>
                                        <FaEye title="View" className="icon-blue me-2" onClick={() => navigate("/dms/canceled-trips/view", { state: { trip } })} />
                                        <FaEdit title="Edit" className="icon-green me-2" onClick={() => navigate("/dms/canceled-trips/edit", { state: { trip } })} />
                                   {/*      <FaTrash title="Delete" className="icon-red" />
                                    */} </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="13" className="text-center">No canceled trips found.</td>
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
