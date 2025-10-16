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

    // 🔹 Navigate to Rider Profile
    const handleNavigateToRider = () => {
        const riderId = feedback.role.includes("rider")
            ? feedback.reviewer_id
            : feedback.reviewed_id;

        navigate(`/dms/rider/view/${riderId}`, {
            state: {
                rider: {
                    userId: riderId,
                    fullName: feedback.role.includes("rider")
                        ? feedback.reviewer_name
                        : feedback.reviewed_name,
                },
            },
        });
    };

    // 🔹 Navigate to Driver Profile
    const handleNavigateToDriver = () => {
        const driverId = feedback.role.includes("driver")
            ? feedback.reviewed_id
            : feedback.reviewer_id;

        navigate(`/dms/driver/view/${driverId}`, {
            state: {
                driver: {
                    userId: driverId,
                    fullName: feedback.role.includes("driver")
                        ? feedback.reviewed_name
                        : feedback.reviewer_name,
                },
            },
        });
    };

    // 🔹 Navigate to Trip Details
    const handleNavigateToTrip = () => {
        if (feedback.ride_id) {
            navigate(`/dms/trip/view/${feedback.ride_id}`, {
                state: { trip: { id: feedback.ride_id } },
            });
        }
    };

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

                {/* Reviewer & Reviewed Info */}
                <Row className="mb-4">
                    <Col md={12}>
                        <Card className="p-3">
                            <h5><strong>Reviewer & Reviewed Information</strong></h5>
                            <hr />
                            <Row>
                                <Col md={6}>
                                    <p><strong>Reviewer Name:</strong> {feedback.reviewer_name}</p>
                                    <p>
                                        <strong>Reviewer ID:</strong>{" "}
                                        <span
                                            className="rider-id-link"
                                            onClick={() => {
                                                if (feedback.role.includes("rider")) handleNavigateToRider();
                                                else handleNavigateToDriver();
                                            }}
                                        >
                                            {feedback.reviewer_id}
                                        </span>
                                    </p>
                                    <p><strong>Role:</strong> {feedback.role.replace("_", " ")}</p>
                                    <p>
                                        <strong>Ride ID:</strong>{" "}
                                        <span
                                            className="driver-id-link"
                                             onClick={handleNavigateToTrip}
                                        >
                                            {feedback.ride_id}
                                        </span>
                                    </p>
                                </Col>
                                <Col md={6}>
                                    <p><strong>Reviewed Name:</strong> {feedback.reviewed_name}</p>
                                    <p>
                                        <strong>Reviewed ID:</strong>{" "}
                                        <span
                                            className="text-primary"
                                            style={{ cursor: "pointer", textDecoration: "underline" }}
                                            onClick={() => {
                                                if (feedback.role.includes("driver")) handleNavigateToDriver();
                                                else handleNavigateToRider();
                                            }}
                                        >
                                            {feedback.reviewed_id}
                                        </span>
                                    </p>
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

                {/* Ride Details */}
                <Row className="mb-4">
                    <Col md={12}>
                        <Card className="p-3">
                            <h5><strong>Ride / Trip Details</strong></h5>
                            <hr />
                            {feedback.ride ? (
                                <Row>
                                    <Col md={6}>
                                        <p>
                                            <strong>Ride ID:</strong>{" "}
                                            <span
                                                className="trip-id-link"
                                                 onClick={handleNavigateToTrip}
                                            >
                                                {feedback.ride.id}
                                            </span>
                                        </p>
                                        <p><strong>Status:</strong> {feedback.ride.status}</p>
                                        <p><strong>Distance:</strong> {feedback.ride.distance} km</p>
                                        <p><strong>Fare:</strong> ₹{feedback.ride.fare}</p>
                                    </Col>
                                    <Col md={6}>
                                        <p><strong>Pickup Location:</strong> {feedback.ride.pickup_address}</p>
                                        <p><strong>Drop Location:</strong> {feedback.ride.drop_address}</p>
                                        <p><strong>Pickup Time:</strong> {feedback.ride.pickup_time || "-"}</p>
                                        <p><strong>Drop Time:</strong> {feedback.ride.drop_time || "-"}</p>
                                    </Col>
                                </Row>
                            ) : (
                                <p>No ride data available.</p>
                            )}
                        </Card>
                    </Col>
                </Row>

                {/* Rider / Driver Info */}
                <Row className="mb-4">
                    <Col md={6}>
                        <Card className="p-3">
                            <h5><strong>Rider Details</strong></h5>
                            <hr />
                            <p>
                                <strong>Name:</strong>{" "}
                                <span
                                    className="rider-id-link"
                                    onClick={handleNavigateToRider}
                                >
                                    {feedback.role.includes("rider")
                                        ? feedback.reviewer_name
                                        : feedback.reviewed_name}
                                </span>
                            </p>
                            <p><strong>User ID:</strong> {feedback.role.includes("rider") ? feedback.reviewer_id : feedback.reviewed_id}</p>
                        </Card>
                    </Col>

                    <Col md={6}>
                        <Card className="p-3">
                            <h5><strong>Driver Details</strong></h5>
                            <hr />
                            <p>
                                <strong>Name:</strong>{" "}
                                <span
                                    className="driver-id-link"
                                    onClick={handleNavigateToDriver}
                                >
                                    {feedback.role.includes("driver")
                                        ? feedback.reviewed_name
                                        : feedback.reviewer_name}
                                </span>
                            </p>
                            <p><strong>User ID:</strong> {feedback.role.includes("driver") ? feedback.reviewed_id : feedback.reviewer_id}</p>
                        </Card>
                    </Col>
                </Row>

                {/* Payment Info */}
                <Row className="mb-4">
                    <Col md={12}>
                        <Card className="p-3">
                            <h5><strong>Payment Information</strong></h5>
                            <hr />
                            {feedback.ride ? (
                                <Row>
                                    <Col md={6}>
                                        <p><strong>Payment Status:</strong> {feedback.ride.payment_status}</p>
                                    </Col>
                                    <Col md={6}>
                                        <p><strong>Fare Amount:</strong> ₹{feedback.ride.fare}</p>
                                        <p><strong>Completed At:</strong> {feedback.ride.completed_at || "-"}</p>
                                    </Col>
                                </Row>
                            ) : (
                                <p>No payment data available.</p>
                            )}
                        </Card>
                    </Col>
                </Row>
            </div>
        </AdminLayout>
    );
};
