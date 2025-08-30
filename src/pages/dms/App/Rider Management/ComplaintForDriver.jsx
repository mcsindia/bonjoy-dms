import React, { useState } from 'react';
import { Table, Pagination, Form, InputGroup, Modal, Button, Row, Col } from 'react-bootstrap';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';
import { FaEye, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const complaintData = [
    {
        tripId: 'TRIP001',
        driverId: 'DRV001',
        riderId: 'RID001',
        date: '2023-12-18',
        time: '5:00 PM',
        complaintType: 'Rude Behavior',
        status: 'Pending',
        remark: 'Driver was impolite.'
    },
    {
        tripId: 'TRIP002',
        driverId: 'DRV002',
        riderId: 'RID002',
        date: '2023-12-17',
        time: '9:50 PM',
        complaintType: 'Late Arrival',
        status: 'Resolved',
        remark: 'Driver arrived 30 minutes late.'
    },
    {
        tripId: 'TRIP003',
        driverId: 'DRV003',
        riderId: 'RID003',
        date: '2023-12-16',
        time: '7:00 AM',
        complaintType: 'Vehicle Condition',
        status: 'Pending',
        remark: 'Vehicle was not clean.'
    },
    // Add more complaints as needed
];

export const ComplaintForDriver = () => {
    const navigate = useNavigate();
    const [complaintPage, setComplaintPage] = useState(1);
    const [filteredComplaints, setFilteredComplaints] = useState(complaintData);
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [comment, setComment] = useState('');
    const itemsPerPage = 15;

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        filterData(e.target.value, dateFrom, dateTo);
    };

    const handleDateChange = (e, setDate) => {
        setDate(e.target.value);
        filterData(searchQuery, e.target.name === 'dateFrom' ? e.target.value : dateFrom, e.target.name === 'dateTo' ? e.target.value : dateTo);
    };

    const filterData = (query, from, to) => {
        let filtered = complaintData;

        if (query) {
            filtered = filtered.filter(complaint =>
                complaint.tripId.toLowerCase().includes(query.toLowerCase()) ||
                complaint.driverId.toLowerCase().includes(query.toLowerCase()) ||
                complaint.riderId.toLowerCase().includes(query.toLowerCase())
            );
        }

        if (from) {
            filtered = filtered.filter(complaint => new Date(complaint.date) >= new Date(from));
        }

        if (to) {
            filtered = filtered.filter(complaint => new Date(complaint.date) <= new Date(to));
        }

        setFilteredComplaints(filtered);
        setComplaintPage(1); // Reset to first page after filtering
    };

    const paginate = (data, currentPage) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return data.slice(startIndex, endIndex);
    };

    const handlePageChange = (pageNumber) => {
        setComplaintPage(pageNumber);
    };

    const handleViewComplaint = (complaint) => {
        setSelectedComplaint(complaint);
        setComment(complaint.remark); // Populate comment box with the existing remark
        setShowModal(true);
    };

    const handleStatusToggle = () => {
        if (selectedComplaint) {
            const updatedComplaint = {
                ...selectedComplaint,
                status: selectedComplaint.status === 'Pending' ? 'Resolved' : 'Pending',
            };
            const updatedData = filteredComplaints.map(complaint =>
                complaint.tripId === selectedComplaint.tripId ? updatedComplaint : complaint
            );
            setFilteredComplaints(updatedData);
            setSelectedComplaint(updatedComplaint);
        }
    };

    const handleCommentUpdate = () => {
        if (selectedComplaint) {
            const updatedComplaint = { ...selectedComplaint, remark: comment };
            const updatedData = filteredComplaints.map(complaint =>
                complaint.tripId === selectedComplaint.tripId ? updatedComplaint : complaint
            );
            setFilteredComplaints(updatedData);
            setSelectedComplaint(updatedComplaint);
        }
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
                <div className="live-count">
                <h3>Complaints for Drivers</h3>
                    <div className="live-count-container">
                        <Button className="green-button">
                            Total Complaints: {filteredComplaints.length}
                        </Button>
                    </div>
                </div>
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

            {/* Complaints Table */}
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Trip ID</th>
                        <th>Driver ID</th>
                        <th>Rider ID</th>
                        <th>Date & Time</th>
                        <th>Complaint Type</th>
                        <th>Status</th>
                        <th>Remark</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {paginate(filteredComplaints, complaintPage).map((complaint, index) => (
                        <tr key={index}>
                            <td>
                                <a href="#" role="button" className='trip-id-link' onClick={() => navigate('/dms/trip/details', { state: { trip: complaint } })}>
                                    {complaint.tripId}
                                </a>
                            </td>
                            <td>
                                <a
                                    href="#"
                                    className="driver-id-link"
                                    onClick={() => handleDriverClick(complaint.driverId)} // Add the click handler
                                >
                                    {complaint.driverId}
                                </a>
                            </td>
                            <td><a
                                href="#"
                                className="rider-id-link"
                                onClick={() => handleRiderClick(complaint.riderId)} // Handle rider click
                            >
                                {complaint.riderId}
                            </a></td>
                            <td>{complaint.date} <br /> {complaint.time}</td>
                            <td>{complaint.complaintType}</td>
                            <td>{complaint.status}</td>
                            <td>{complaint.remark}</td>
                            <td>
                                <FaEye
                                    className="icon icon-blue"
                                    title="View"
                                    onClick={() => handleViewComplaint(complaint)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Pagination */}
            <Pagination className="justify-content-center">
                <Pagination.Prev
                    onClick={() => handlePageChange(complaintPage - 1)}
                    disabled={complaintPage === 1}
                />
                {[...Array(Math.ceil(filteredComplaints.length / itemsPerPage))].map((_, idx) => (
                    <Pagination.Item
                        key={idx + 1}
                        active={idx + 1 === complaintPage}
                        onClick={() => handlePageChange(idx + 1)}
                    >
                        {idx + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next
                    onClick={() => handlePageChange(complaintPage + 1)}
                    disabled={complaintPage === Math.ceil(filteredComplaints.length / itemsPerPage)}
                />
            </Pagination>

            {/* Modal for Viewing Complaint Details */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Trip ID: {selectedComplaint?.tripId}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedComplaint && (
                        <div>
                            <Row>
                                <Col><strong>Driver ID:</strong></Col>
                                <Col>{selectedComplaint.driverId}</Col>
                            </Row>
                            <Row>
                                <Col><strong>Rider ID:</strong></Col>
                                <Col>{selectedComplaint.riderId}</Col>
                            </Row>
                            <Row>
                                <Col><strong>Date:</strong></Col>
                                <Col>{selectedComplaint.date}</Col>
                            </Row>
                            <Row>
                                <Col><strong>Complaint Type:</strong></Col>
                                <Col>{selectedComplaint.complaintType}</Col>
                            </Row>
                            <Row className="align-items-center">
                                <Col><strong>Status:</strong></Col>
                                <Col className="d-flex align-items-center">
                                    {selectedComplaint.status}
                                    {selectedComplaint.status === 'Pending' ? (
                                        <FaToggleOff
                                            className="ms-3 icon-red"
                                            title="Resolve Complaint"
                                            onClick={handleStatusToggle}
                                            size={24}
                                        />
                                    ) : (
                                        <FaToggleOn
                                            className="ms-3 icon-green"
                                            title="Revert to Pending"
                                            onClick={handleStatusToggle}
                                            size={24}
                                        />
                                    )}
                                </Col>
                            </Row>
                            <Row>
                                <Col><strong>Remark:</strong></Col>
                                <Col>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    />
                                </Col>
                            </Row>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="primary"
                        onClick={handleCommentUpdate}
                    >
                        Save Comment
                    </Button>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </AdminLayout>
    );
};
