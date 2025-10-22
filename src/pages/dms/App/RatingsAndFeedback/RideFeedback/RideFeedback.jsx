import React, { useState, useEffect } from "react";
import {
    Table,
    Form,
    InputGroup,
    Pagination,
    Spinner
} from "react-bootstrap";
import { FaStar, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";
import axios from "axios";
import { getModuleId, getToken } from "../../../../../utils/authhelper";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = () => ({
    Authorization: `Bearer ${getToken()}`,
});

export const RideFeedback = () => {
    const navigate = useNavigate();
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [date, setDate] = useState("");

    // 🔹 Fetch API Feedbacks
    const fetchFeedbacks = async (page = 1) => {
        setLoading(true);
        try {
            const params = {
                page,
                limit: itemsPerPage,
                module_id: getModuleId("ridefeedback"),
            };

            if (date) params.date = date;
            if (search) params.role = search;  // <-- send search as role filter

            const response = await axios.get(`${API_BASE_URL}/getAllFeedback`, {
                headers: getAuthHeaders(),
                params,
            });

            const apiData = response.data?.data?.models || [];
            const totalPageCount = response.data?.data?.totalPages || 1;

            const formatted = apiData.map((item) => ({
                feedback_id: item.id,
                ride_id: item.rideid,
                reviewer_id: item.feedbackByUser?.id,
                reviewer_name: item.feedbackByUser?.fullName || "-",
                reviewed_id: item.feedbackToUser?.id,
                reviewed_name: item.feedbackToUser?.fullName || "-",
                role: item.role || "-",
                rating: item.rating,
                driving_quality: item.driving_quality,
                behavior: item.behavior,
                punctuality: item.punctuality,
                feedback_text: item.feedback_text,
                created_at: item.createdAt,
                ride: { ...item.ride },
            }));

            setFeedbacks(formatted);
            setTotalPages(totalPageCount);
            setCurrentPage(response.data?.data?.currentPage || 1);
        } catch (err) {
            console.error("Error fetching feedbacks:", err);
            setFeedbacks([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedbacks(currentPage);
    }, [currentPage, itemsPerPage, date]);

    // Filtered & Paginated Feedbacks
    const filteredFeedbacks = feedbacks.filter(
        (fb) =>
            fb.role.toLowerCase().includes(search.toLowerCase()) ||
            fb.feedback_text?.toLowerCase().includes(search.toLowerCase())
    );

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

            {/* Filters */}
            <div className="filter-search-container">
                <div className="filter-container">
                    <p className="btn btn-primary mb-0">Filter by Date -</p>
                    <Form.Group className="me-3">
                        <Form.Control
                            type="date"
                            value={date}
                            onChange={(e) => {
                                setDate(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </Form.Group>
                </div>
                <InputGroup className="dms-custom-width">
                    <Form.Control
                        placeholder="Search by role..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                            fetchFeedbacks(1);
                        }}
                    />
                </InputGroup>
            </div>

            {/* Table */}
            <div className="dms-table-container">
                {loading ? (
                    <div className="text-center py-5 fs-4">
                        <Spinner animation="border" size="sm" /> Loading...
                    </div>
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
                                                {fb.rating && (
                                                    <div className="d-flex align-items-center">
                                                        <FaStar className="icon star-icon me-1" />
                                                        {fb.rating.toFixed(1)}
                                                    </div>
                                                )}
                                            </td>
                                            <td>
                                                {fb.driving_quality ? (
                                                    <div className="d-flex align-items-center">
                                                        <FaStar className="icon star-icon me-1" />
                                                        {fb.driving_quality.toFixed(1)}
                                                    </div>
                                                ) : "-"}
                                            </td>
                                            <td>
                                                {fb.behavior ? (
                                                    <div className="d-flex align-items-center">
                                                        <FaStar className="icon star-icon me-1" />
                                                        {fb.behavior.toFixed(1)}
                                                    </div>
                                                ) : "-"}
                                            </td>
                                            <td>
                                                {fb.punctuality ? (
                                                    <div className="d-flex align-items-center">
                                                        <FaStar className="icon star-icon me-1" />
                                                        {fb.punctuality.toFixed(1)}
                                                    </div>
                                                ) : "-"}
                                            </td>
                                            <td>{fb.feedback_text || "-"}</td>
                                            <td>{new Date(fb.created_at).toLocaleDateString()}</td>
                                            <td>
                                                <FaEye
                                                    title="View"
                                                    className="icon icon-blue"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() =>
                                                        navigate(`/dms/ridefeedback/view/${fb.feedback_id}`, {
                                                            state: { feedback: fb },
                                                        })
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="10" className="text-center">
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
