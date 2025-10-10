import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Table, Card, Row, Col, Button } from "react-bootstrap";
import { FaStar, FaArrowLeft } from "react-icons/fa";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";

export const UserRatingSummaryView = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Get the user data passed via state
    const { user } = location.state || {};

    if (!user) {
        return (
            <AdminLayout>
                <div className="text-center py-5">
                    <h4>User data not found.</h4>
                    <Button onClick={() => navigate(-1)}>Go Back</Button>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="dms-pages-header sticky-header d-flex justify-content-between align-items-center">
                <h3>User Rating Summary</h3>
                <Button className="back-button" onClick={() => navigate(-1)}>
                    <FaArrowLeft className="me-1" /> Back
                </Button>
            </div>

            <Row className="my-4">
                <Col md={6}>
                    <Card className="p-3">
                        <h5><strong>User Info</strong></h5>
                        <hr />
                        <p><strong>Username:</strong> {user.username}</p>
                        <p><strong>Total Rides:</strong> {user.total_rides}</p>
                        <p><strong>Total Ratings Received:</strong> {user.total_ratings_received}</p>
                        <p>
                            <strong>Average Rating:</strong>{" "}
                            <FaStar className="icon star-icon me-1" /> {user.average_rating.toFixed(1)}
                        </p>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card className="p-3">
                        <h5><strong>Performance Averages</strong></h5>
                        <hr />
                        <p>
                            <strong>Driving Quality:</strong> {user.driving_quality_avg?.toFixed(1) || "-"}
                        </p>
                        <p>
                            <strong>Behavior:</strong> {user.behavior_avg?.toFixed(1) || "-"}
                        </p>
                        <p>
                            <strong>Punctuality:</strong> {user.punctuality_avg?.toFixed(1) || "-"}
                        </p>
                        <p>
                            <strong>Last Updated:</strong> {new Date(user.last_updated).toLocaleString()}
                        </p>
                    </Card>
                </Col>
            </Row>

            <Card className="p-3">
                <h5><strong>Trip Details</strong></h5>
                <hr />
                <Card.Body>
                    {user.trip_details ? (
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Pickup</th>
                                    <th>Drop</th>
                                    <th>Fare</th>
                                    <th>Distance (km)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{user.trip_details.last_trip_date}</td>
                                    <td>{user.trip_details.last_trip_pickup}</td>
                                    <td>{user.trip_details.last_trip_drop}</td>
                                    <td>₹{user.trip_details.last_trip_fare}</td>
                                    <td>{user.trip_details.last_trip_distance}</td>
                                </tr>
                            </tbody>
                        </Table>
                    ) : (
                        <p>No trip details available.</p>
                    )}
                </Card.Body>
            </Card>
        </AdminLayout>
    );
};
