import React, { useState } from 'react';
import { Table, Pagination, Form, InputGroup, Modal, Button } from 'react-bootstrap';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';
import { FaStar, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Example Data
const feedbackByDriverData = [
    { tripId: 'TRIP001', driverId: 'DRV001', riderId: 'RID001', date: '2023-12-18', time: '9:30 AM', rating: 5, remark: 'Rider was punctual and polite.', punctuality: 4, politeness: 3, cleanliness: 5, communication: 4, respectForVehicle: 4, riderBehaviour: 4, timeliness: 5, },
    { tripId: 'TRIP002', driverId: 'DRV002', riderId: 'RID002', date: '2023-12-17', time: '5:00 PM', rating: 4, remark: 'Good experience with the rider.', punctuality: 4, politeness: 3, cleanliness: 5, communication: 4, respectForVehicle: 4, riderBehaviour: 4, timeliness: 5, },
    { tripId: 'TRIP003', driverId: 'DRV003', riderId: 'RID003', date: '2023-12-16', time: '5:00 PM', rating: 3, remark: 'Rider caused some delays.', punctuality: 2, politeness: 3, cleanliness: 5, communication: 4, respectForVehicle: 4, riderBehaviour: 4, timeliness: 5, },
    { tripId: 'TRIP004', driverId: 'DRV004', riderId: 'RID004', date: '2023-12-14', time: '9:30 AM', rating: 2, remark: 'Rider was not communicative.', punctuality: 4, politeness: 3, cleanliness: 5, communication: 3, respectForVehicle: 4, riderBehaviour: 4, timeliness: 5, },
    { tripId: 'TRIP005', driverId: 'DRV005', riderId: 'RID005', date: '2023-12-12', time: '5:00 PM', rating: 1, remark: 'Very poor experience.', punctuality: 1, politeness: 2, cleanliness: 3, communication: 1, respectForVehicle: 3, riderBehaviour: 2, timeliness: 3, },
    { tripId: 'TRIP001', driverId: 'DRV001', riderId: 'RID001', date: '2023-12-18', time: '5:00 PM', rating: 5, remark: 'Rider was punctual and polite.', punctuality: 4, politeness: 3, cleanliness: 5, communication: 4, respectForVehicle: 4, riderBehaviour: 4, timeliness: 5, },
    { tripId: 'TRIP002', driverId: 'DRV002', riderId: 'RID002', date: '2023-12-17', time: '9:30 AM', rating: 4, remark: 'Good experience with the rider.', punctuality: 4, politeness: 3, cleanliness: 5, communication: 4, respectForVehicle: 4, riderBehaviour: 4, timeliness: 5, },
    { tripId: 'TRIP003', driverId: 'DRV003', riderId: 'RID003', date: '2023-12-16', time: '5:00 PM', rating: 3, remark: 'Rider caused some delays.', punctuality: 2, politeness: 3, cleanliness: 5, communication: 4, respectForVehicle: 4, riderBehaviour: 4, timeliness: 5, },
    { tripId: 'TRIP004', driverId: 'DRV004', riderId: 'RID004', date: '2023-12-14', time: '5:00 PM', rating: 2, remark: 'Rider was not communicative.', punctuality: 4, politeness: 3, cleanliness: 5, communication: 3, respectForVehicle: 4, riderBehaviour: 4, timeliness: 5, },
    { tripId: 'TRIP005', driverId: 'DRV005', riderId: 'RID005', date: '2023-12-12', time: '9:30 AM', rating: 1, remark: 'Very poor experience.', punctuality: 1, politeness: 2, cleanliness: 3, communication: 1, respectForVehicle: 3, riderBehaviour: 2, timeliness: 3, },
    { tripId: 'TRIP001', driverId: 'DRV001', riderId: 'RID001', date: '2023-12-18', time: '5:00 PM', rating: 5, remark: 'Rider was punctual and polite.', punctuality: 4, politeness: 3, cleanliness: 5, communication: 4, respectForVehicle: 4, riderBehaviour: 4, timeliness: 5, },
    { tripId: 'TRIP002', driverId: 'DRV002', riderId: 'RID002', date: '2023-12-17', time: '5:00 PM', rating: 4, remark: 'Good experience with the rider.', punctuality: 4, politeness: 3, cleanliness: 5, communication: 4, respectForVehicle: 4, riderBehaviour: 4, timeliness: 5, },
    { tripId: 'TRIP003', driverId: 'DRV003', riderId: 'RID003', date: '2023-12-16', time: '9:30 AM', rating: 3, remark: 'Rider caused some delays.', punctuality: 2, politeness: 3, cleanliness: 5, communication: 4, respectForVehicle: 4, riderBehaviour: 4, timeliness: 5, },
    { tripId: 'TRIP004', driverId: 'DRV004', riderId: 'RID004', date: '2023-12-14', time: '5:00 PM', rating: 2, remark: 'Rider was not communicative.', punctuality: 4, politeness: 3, cleanliness: 5, communication: 3, respectForVehicle: 4, riderBehaviour: 4, timeliness: 5, },
    { tripId: 'TRIP005', driverId: 'DRV005', riderId: 'RID005', date: '2023-12-12', time: '9:30 AM', rating: 1, remark: 'Very poor experience.', punctuality: 1, politeness: 2, cleanliness: 3, communication: 1, respectForVehicle: 3, riderBehaviour: 2, timeliness: 3, },

    // Add more feedback data as required
];

// Render stars for rating
const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(
            i <= rating ? (
                <FaStar key={i} style={{ color: "gold" }} />
            ) : (
                <FaStar key={i} style={{ color: "silver" }} />
            )
        );
    }
    return stars;
};

export const FeedbackByDriver = () => {
    const navigate = useNavigate();
    const [feedbackPage, setFeedbackPage] = useState(1);
    const [filteredFeedback, setFilteredFeedback] = useState(feedbackByDriverData);
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const itemsPerPage = 15;
    const userData = JSON.parse(localStorage.getItem("userData"));
    let permissions = [];

    if (Array.isArray(userData?.employeeRole)) {
        for (const role of userData.employeeRole) {
            for (const child of role.childMenus || []) {
                for (const mod of child.modules || []) {
                    if (mod.moduleUrl?.toLowerCase() === "feedbackbydriver") {
                        permissions = mod.permission
                            ?.toLowerCase()
                            .split(',')
                            .map(p => p.trim()) || [];
                    }
                }
            }
        }
    }

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        filterData(e.target.value, dateFrom, dateTo);
    };

    const handleDateChange = (e, setDate) => {
        setDate(e.target.value);
        filterData(searchQuery, e.target.name === 'dateFrom' ? e.target.value : dateFrom, e.target.name === 'dateTo' ? e.target.value : dateTo);
    };

    const filterData = (query, from, to) => {
        let filtered = feedbackByDriverData;

        if (query) {
            filtered = filtered.filter(feedback =>
                feedback.tripId.toLowerCase().includes(query.toLowerCase()) ||
                feedback.driverId.toLowerCase().includes(query.toLowerCase())
            );
        }

        if (from) {
            filtered = filtered.filter(feedback => new Date(feedback.date) >= new Date(from));
        }

        if (to) {
            filtered = filtered.filter(feedback => new Date(feedback.date) <= new Date(to));
        }

        setFilteredFeedback(filtered);
        setFeedbackPage(1); // Reset to first page after filtering
    };

    const paginate = (data, currentPage) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return data.slice(startIndex, endIndex);
    };

    const handlePageChange = (pageNumber) => {
        setFeedbackPage(pageNumber);
    };

    const handleViewFeedback = (feedback) => {
        setSelectedFeedback(feedback);
        setShowModal(true);
    };

    const handleDriverClick = (driverId) => {
        navigate(`/dms/drivers/details/view`); // Navigating to driver's details page
    };

    const handleRiderClick = (riderId) => {
        navigate(`/dms/rider/profile`); // Navigating to riders details page
    };

    return (
        <AdminLayout>
            <div className="dms-pages-header sticky-header">
                <h3>Feedback By Drivers</h3>
                <div className="filter-search-container">
                    <Form.Control
                        type="date"
                        name="dateFrom"
                        className="me-2"
                        value={dateFrom}
                        onChange={(e) => handleDateChange(e, setDateFrom)}
                    />
                    <Form.Control
                        type="date"
                        name="dateTo"
                        value={dateTo}
                        onChange={(e) => handleDateChange(e, setDateTo)}
                    />
                    <InputGroup className="me-2">
                        <Form.Control
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </InputGroup>
                </div>
            </div>

            {/* Feedback Table */}
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Trip ID</th>
                        <th>Driver ID</th>
                        <th>Rider ID</th>
                        <th>Date & Time</th>
                        <th>Rating</th>
                        <th>Remark</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>

                    {paginate(filteredFeedback, feedbackPage).map((feedback, index) => (
                        <tr key={index}>
                            <td>
                                <a href="#" role="button" className='trip-id-link' onClick={() => navigate('/dms/trip/details', { state: { trip: feedback } })}>
                                    {feedback.tripId}
                                </a>
                            </td>
                            <td>
                                <a
                                    href="#"
                                    className="driver-id-link"
                                    onClick={() => handleDriverClick(feedback.driverId)} // Add the click handler
                                >
                                    {feedback.driverId}
                                </a>
                            </td>
                            <td><a
                                href="#"
                                className="rider-id-link"
                                onClick={() => handleRiderClick(feedback.riderId)} // Handle rider click
                            >
                                {feedback.riderId}
                            </a></td>
                            <td>{feedback.date} <br /> {feedback.time}</td>
                            <td>{renderStars(feedback.rating)}</td>
                            <td>{feedback.remark}</td>
                            <td>
                                {permissions.includes("view") ? (
                                    <FaEye
                                        className="icon icon-blue"
                                        title="View"
                                        onClick={() => handleViewFeedback(feedback)}
                                    />
                                ) : (
                                    '-'
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Pagination */}
            <Pagination className="justify-content-center">
                <Pagination.Prev
                    onClick={() => handlePageChange(feedbackPage - 1)}
                    disabled={feedbackPage === 1}
                />
                {[...Array(Math.ceil(filteredFeedback.length / itemsPerPage))].map((_, idx) => (
                    <Pagination.Item
                        key={idx + 1}
                        active={idx + 1 === feedbackPage}
                        onClick={() => handlePageChange(idx + 1)}
                    >
                        {idx + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next
                    onClick={() => handlePageChange(feedbackPage + 1)}
                    disabled={feedbackPage === Math.ceil(filteredFeedback.length / itemsPerPage)}
                />
            </Pagination>
            {/* Modal for Viewing Feedback */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Feedback Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedFeedback && (
                        <div>
                            <div className="d-flex justify-content-between">
                                <h6>Punctuality</h6>
                                <div>{renderStars(selectedFeedback.punctuality)}</div>
                            </div>
                            <div className="d-flex justify-content-between">
                                <h6>Politeness</h6>
                                <div>{renderStars(selectedFeedback.politeness)}</div>
                            </div>
                            <div className="d-flex justify-content-between">
                                <h6>Cleanliness</h6>
                                <div>{renderStars(selectedFeedback.cleanliness)}</div>
                            </div>
                            <div className="d-flex justify-content-between">
                                <h6>Communication</h6>
                                <div>{renderStars(selectedFeedback.communication)}</div>
                            </div>
                            <div className="d-flex justify-content-between">
                                <h6>Respect for Vehicle</h6>
                                <div>{renderStars(selectedFeedback.respectForVehicle)}</div>
                            </div>
                            <div className="d-flex justify-content-between">
                                <h6>Rider Behavior</h6>
                                <div>{renderStars(selectedFeedback.riderBehaviour)}</div>
                            </div>
                            <div className="d-flex justify-content-between">
                                <h6>Timeliness</h6>
                                <div>{renderStars(selectedFeedback.timeliness)}</div>
                            </div>
                            <div className="d-flex justify-content-between">
                                <h6>Overall Experience</h6>
                                <div>{renderStars(selectedFeedback.rating)}</div>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button type='cancel' onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </AdminLayout>
    );
};
