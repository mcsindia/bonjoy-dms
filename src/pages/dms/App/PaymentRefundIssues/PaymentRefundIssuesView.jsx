import React from "react";
import { Card, Row, Col, Badge, Button } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { AdminLayout } from "../../../../layouts/dms/AdminLayout/AdminLayout";

const refundData = {
    tripId: "S7001",
    riderId: "R1001",
    driverId: "D001",
    issueType: "Overcharge",
    reportedAt: "2025-03-10 12:30",
    refundAmount: "₹10.50",
    paymentMethod: "Credit Card",
    issueDescription: "Charged extra for the ride.",
    supportStatus: "Pending",
    resolvedAt: "N/A",
};

export const PaymentRefundIssuesView = () => {
    const { id } = useParams(); // use for dynamic routing later
    const navigate = useNavigate();

    return (
        <AdminLayout>
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Refund Issue Details</h4>
                <Button className="back-button" onClick={() => navigate(-1)}>
                    <FaArrowLeft /> Back
                </Button>
            </div>
            <Card>
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <p><strong>Trip ID:</strong> {refundData.tripId}</p>
                            <p><strong>Rider ID:</strong> {refundData.riderId}</p>
                            <p><strong>Driver ID:</strong> {refundData.driverId}</p>
                            <p><strong>Issue Type:</strong> {refundData.issueType}</p>
                            <p><strong>Reported At:</strong> {refundData.reportedAt}</p>
                        </Col>
                        <Col md={6}>
                            <p><strong>Refund Amount:</strong> {refundData.refundAmount}</p>
                            <p><strong>Payment Method:</strong> {refundData.paymentMethod}</p>
                            <p><strong>Issue Description:</strong> {refundData.issueDescription}</p>
                            <p>
                                <strong>Support Status:</strong>{" "}
                                <Badge bg={refundData.supportStatus === "Resolved" ? "success" : "warning"}>
                                    {refundData.supportStatus}
                                </Badge>
                            </p>
                            <p><strong>Resolved At:</strong> {refundData.resolvedAt}</p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </div>
        </AdminLayout>
    );
};

