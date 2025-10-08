import React, { useState, useEffect } from "react";
import {
    Table,
    Form,
    InputGroup,
    Pagination,
} from "react-bootstrap";
import { FaStar, FaEye } from "react-icons/fa";
import {useNavigate} from 'react-router-dom'
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";

// Dummy data (matches your feedback table)
const dummyFeedbacks = [
  {
    feedback_id: "FB001",
    ride_id: "R001",
    reviewer_id: "U101",
    reviewer_name: "Rohit Sharma",
    reviewed_id: "U201",
    reviewed_name: "Amit Patel",
    role: "rider_to_driver",
    rating: 4.7,
    driving_quality: 4.8,
    behavior: 4.6,
    punctuality: 4.9,
    feedback_text: "Smooth ride and polite driver!",
    created_at: "2025-10-08T10:00:00Z",
  },
  {
    feedback_id: "FB002",
    ride_id: "R002",
    reviewer_id: "U102",
    reviewer_name: "Priya Verma",
    reviewed_id: "U202",
    reviewed_name: "Rajesh Singh",
    role: "driver_to_rider",
    rating: 4.3,
    driving_quality: null,
    behavior: 4.2,
    punctuality: 4.0,
    feedback_text: "Good passenger, on time.",
    created_at: "2025-10-07T09:30:00Z",
  },
  {
    feedback_id: "FB003",
    ride_id: "R003",
    reviewer_id: "U103",
    reviewer_name: "Sana Khan",
    reviewed_id: "U203",
    reviewed_name: "Karan Mehta",
    role: "rider_to_driver",
    rating: 3.8,
    driving_quality: 3.9,
    behavior: 3.7,
    punctuality: 3.5,
    feedback_text: "Driver was late but friendly.",
    created_at: "2025-10-06T12:15:00Z",
  },
];

export const RideFeedback = () => {
    const navigate = useNavigate();
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setFeedbacks(dummyFeedbacks);
            setLoading(false);
        }, 500);
    }, []);

    // Filter feedbacks based on role or comment text
    const filteredFeedbacks = feedbacks.filter(
        (fb) =>
            fb.role.toLowerCase().includes(search.toLowerCase()) ||
            fb.feedback_text?.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage);

    const displayedFeedbacks = filteredFeedbacks.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) setCurrentPage(pageNumber);
    };

    return (
        <AdminLayout>
            <div className="dms-pages-header sticky-header">
                <h3>Ride Feedback</h3>
            </div>

            {/* Search Filter */}
            <div className="filter-search-container mb-3">
                <InputGroup className="dms-custom-width">
                    <Form.Control
                        placeholder="Search by feedback text or role..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </InputGroup>
            </div>

            {/* Table */}
            <div className="dms-table-container">
                {loading ? (
                    <div className="text-center py-5 fs-4">Loading...</div>
                ) : (
                    <>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Ride ID</th>
                                    <th>Role</th>
                                    <th>Rating</th>
                                    <th>Driving Quality</th>
                                    <th>Behavior</th>
                                    <th>Punctuality</th>
                                    <th>Feedback</th>
                                    <th>Created At</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedFeedbacks.length > 0 ? (
                                    displayedFeedbacks.map((fb, idx) => (
                                        <tr key={fb.feedback_id}>
                                            <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                                            <td>{fb.ride_id}</td>
                                            <td>{fb.role.replace("_", " ")}</td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <FaStar className="icon star-icon me-1" />
                                                    {fb.rating?.toFixed(1)}
                                                </div>
                                            </td>
                                            <td>
                                                {fb.driving_quality ? (
                                                    <div className="d-flex align-items-center">
                                                        <FaStar className="icon star-icon me-1" />
                                                        {fb.driving_quality.toFixed(1)}
                                                    </div>
                                                ) : (
                                                    "-"
                                                )}
                                            </td>
                                            <td>
                                                {fb.behavior ? (
                                                    <div className="d-flex align-items-center">
                                                        <FaStar className="icon star-icon me-1" />
                                                        {fb.behavior.toFixed(1)}
                                                    </div>
                                                ) : (
                                                    "-"
                                                )}
                                            </td>
                                            <td>
                                                {fb.punctuality ? (
                                                    <div className="d-flex align-items-center">
                                                        <FaStar className="icon star-icon me-1" />
                                                        {fb.punctuality.toFixed(1)}
                                                    </div>
                                                ) : (
                                                    "-"
                                                )}
                                            </td>
                                            <td>{fb.feedback_text || "-"}</td>
                                            <td>{new Date(fb.created_at).toLocaleDateString()}</td>
                                            <td>
                                                <FaEye
                                                    title="View"
                                                    className="icon icon-blue"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => navigate(`/dms/ridefeedback/view/${fb.feedback_id}`, { state: { feedback: fb } })}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="text-center">
                                            No feedback found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>

                        {/* Pagination */}
                        <div className="pagination-container">
                            <Pagination className="mb-0">
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

                            <Form.Select
                                value={itemsPerPage}
                                onChange={(e) => {
                                    setItemsPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className="pagination-option w-auto"
                            >
                                <option value="5">Show 5</option>
                                <option value="10">Show 10</option>
                                <option value="20">Show 20</option>
                                <option value="30">Show 30</option>
                                <option value="50">Show 50</option>
                            </Form.Select>
                        </div>
                    </>
                )}
            </div>
        </AdminLayout>
    );
};