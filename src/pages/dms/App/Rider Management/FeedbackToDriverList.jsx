import React, { useState } from 'react';
import { Table, Pagination, Form, InputGroup, Modal, Button } from 'react-bootstrap';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';
import { FaStar, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Example data
const feedbackData = [
    {
        tripId: 'TRIP001',
        driverId: 'DRV001',
        driverName: 'John Doe',
        riderId: 'RID001',
        riderName: 'Amit Sharma',
        date: '2023-12-18',
        time: '5:00 PM',
        rating: 5,
        remark: 'Excellent service!',
        cleanliness: 4,
        politeness: 3,
        drivingSkills: 4,
        navigationEfficiency: 5,
        vehicleCondition: 4,
    },
    {
        tripId: 'TRIP002',
        driverId: 'DRV002',
        driverName: 'Rahul Verma',
        riderId: 'RID002',
        riderName: 'Sneha Kapoor',
        date: '2023-12-17',
        time: '7:30 PM',
        rating: 4,
        remark: 'Very good experience.',
        cleanliness: 4,
        politeness: 3,
        drivingSkills: 4,
        navigationEfficiency: 5,
        vehicleCondition: 4,
    },
];

export const FeedbackToDriverList = () => {
    const navigate = useNavigate();
    const [feedbackPage, setFeedbackPage] = useState(1);
    const [filteredFeedback, setFilteredFeedback] = useState(feedbackData);
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
                    if (mod.moduleUrl?.toLowerCase() === "feedbacktodriver") {
                        permissions = mod.permission
                            ?.toLowerCase()
                            .split(',')
                            .map(p => p.trim()) || [];
                    }
                }
            }
        }
    }

    const handlePermissionCheck = (permissionType, action, fallbackMessage = null) => {
        if (permissions.includes(permissionType)) {
            action(); // allowed, run the actual function
        } else {
            alert(fallbackMessage || `You don't have permission to ${permissionType} this employee.`);
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        filterData(e.target.value, dateFrom, dateTo);
    };

    const handleDateChange = (e, setDate) => {
        setDate(e.target.value);
        filterData(searchQuery, e.target.name === 'dateFrom' ? e.target.value : dateFrom, e.target.name === 'dateTo' ? e.target.value : dateTo);
    };

    const filterData = (query, from, to) => {
        let filtered = feedbackData;

        if (query) {
            filtered = filtered.filter(feedback =>
                feedback.tripId.toLowerCase().includes(query.toLowerCase()) ||
                feedback.driverId.toLowerCase().includes(query.toLowerCase()) ||
                feedback.riderId.toLowerCase().includes(query.toLowerCase())
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

    const handleDriverClick = (driverId) => {
        navigate(`/dms/drivers/details/view`); // Navigating to driver's details page
    };

    const handleRiderClick = (riderId) => {
        navigate(`/dms/rider/profile`); // Navigating to riders details page
    };

    return (
        <AdminLayout>
            <div className="dms-pages-header sticky-header">
                <h3>Feedback To Drivers</h3>
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
                        <th>Driver Name</th>
                        <th>Rider Name</th>
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
                                <a
                                    href="#"
                                    role="button"
                                    className="trip-id-link"
                                    onClick={() => navigate('/dms/trip/details', { state: { trip: feedback } })}
                                >
                                    {feedback.tripId}
                                </a>
                            </td>
                            <td>
                                <a
                                    href="#"
                                    className="driver-id-link"
                                    onClick={() => handleDriverClick(feedback.driverId)}
                                >
                                    {feedback.driverName}
                                </a>
                            </td>
                            <td>
                                <a
                                    href="#"
                                    className="rider-id-link"
                                    onClick={() => handleRiderClick(feedback.riderId)}
                                >
                                    {feedback.riderName}
                                </a>
                            </td>
                            <td>{feedback.date} <br /> {feedback.time}</td>
                            <td>{renderStars(feedback.rating)}</td>
                            <td>{feedback.remark}</td>
                            <td>
                                <FaEye
                                    className="icon icon-blue"
                                    title="View"
                                    onClick={() =>
                                        handlePermissionCheck("view", () => handleViewFeedback(feedback))
                                    }
                                />
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
                                <h6>Cleanliness</h6>
                                <div>{renderStars(selectedFeedback.cleanliness)}</div>
                            </div>
                            <div className="d-flex justify-content-between">
                                <h6>Politeness</h6>
                                <div>{renderStars(selectedFeedback.politeness)}</div>
                            </div>
                            <div className="d-flex justify-content-between">
                                <h6>Driving Skills</h6>
                                <div>{renderStars(selectedFeedback.drivingSkills)}</div>
                            </div>
                            <div className="d-flex justify-content-between">
                                <h6>Navigation Efficiency</h6>
                                <div>{renderStars(selectedFeedback.navigationEfficiency)}</div>
                            </div>
                            <div className="d-flex justify-content-between">
                                <h6>Vehicle Condition</h6>
                                <div>{renderStars(selectedFeedback.vehicleCondition)}</div>
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
