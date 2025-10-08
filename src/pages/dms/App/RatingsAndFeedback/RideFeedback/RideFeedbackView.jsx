import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Row, Col, Card, Button, Alert } from "react-bootstrap";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";
import { FaStar, FaArrowLeft } from "react-icons/fa";

export const RideFeedbackView = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const feedback = location.state?.feedback;

    if (!feedback) {
        return (
            <AdminLayout>
                <div className="text-center mt-5">
                    <Alert variant="warning">No feedback data available.</Alert>
                    <Button variant="secondary" onClick={() => navigate(-1)}>
                        Go Back
                    </Button>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="dms-container">
                {/* Header */}
                <div className="dms-pages-header sticky-header d-flex justify-content-between align-items-center mb-4">
                    <h3>Ride Feedback Details</h3>
                    <Button className="back-button" onClick={() => navigate(-1)}>
                        <FaArrowLeft /> Back to List
                    </Button>
                </div>

                {/* Reviewer and Reviewed Info */}
                <Row className="mb-4">
                    <Col md={12}>
                        <Card className="p-3">
                            <h5><strong>Reviewer & Reviewed Information</strong></h5>
                            <hr />
                            <Row>
                                <Col md={6}>
                                    <p><strong>Reviewer Name:</strong> {feedback.reviewer_name}</p>
                                    <p><strong>Reviewer ID:</strong> {feedback.reviewer_id}</p>
                                    <p><strong>Role:</strong> {feedback.role.replace("_", " ")}</p>
                                    <p><strong>Ride ID:</strong> {feedback.ride_id}</p>
                                </Col>
                                <Col md={6}>
                                    <p><strong>Reviewed Name:</strong> {feedback.reviewed_name}</p>
                                    <p><strong>Reviewed ID:</strong> {feedback.reviewed_id}</p>
                                    <p><strong>Created At:</strong> {new Date(feedback.created_at).toLocaleString()}</p>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>

                {/* Ratings Section */}
                <Row className="mb-4">
                    <Col md={12}>
                        <Card className="p-3">
                            <h5><strong>Ratings Summary</strong></h5>
                            <hr />
                            <Row>
                                <Col md={3}>
                                    <p>
                                        <strong>Overall Rating:</strong>{" "}
                                        <FaStar className="icon star-icon me-1" />
                                        {feedback.rating?.toFixed(1)}
                                    </p>
                                </Col>
                                <Col md={3}>
                                    <p>
                                        <strong>Driving Quality:</strong>{" "}
                                        {feedback.driving_quality ? (
                                            <>
                                                <FaStar className="icon star-icon me-1" />
                                                {feedback.driving_quality.toFixed(1)}
                                            </>
                                        ) : (
                                            "-"
                                        )}
                                    </p>
                                </Col>
                                <Col md={3}>
                                    <p>
                                        <strong>Behavior:</strong>{" "}
                                        {feedback.behavior ? (
                                            <>
                                                <FaStar className="icon star-icon me-1" />
                                                {feedback.behavior.toFixed(1)}
                                            </>
                                        ) : (
                                            "-"
                                        )}
                                    </p>
                                </Col>
                                <Col md={3}>
                                    <p>
                                        <strong>Punctuality:</strong>{" "}
                                        {feedback.punctuality ? (
                                            <>
                                                <FaStar className="icon star-icon me-1" />
                                                {feedback.punctuality.toFixed(1)}
                                            </>
                                        ) : (
                                            "-"
                                        )}
                                    </p>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>

                {/* Feedback Text */}
                <Row className="mb-4">
                    <Col md={12}>
                        <Card className="p-3">
                            <h5><strong>Feedback Comment</strong></h5>
                            <hr />
                            <p>{feedback.feedback_text || "No comment provided."}</p>
                        </Card>
                    </Col>
                </Row>
            </div>
        </AdminLayout>
    );
};
