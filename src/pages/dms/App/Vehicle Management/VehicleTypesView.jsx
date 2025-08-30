import React from 'react';
import { Card, Row, Col, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { AdminLayout } from "../../../../layouts/dms/AdminLayout/AdminLayout";
import { FaArrowLeft } from "react-icons/fa";

const vehicleTypeData = {
    id: "1",
    image: "/images/bike.png",
    type: "Bike",
    costPerKm: "₹5",
    status: "Active",
    description: "A two-wheeler ride option suitable for quick and budget-friendly travel."
};

export const VehicleTypesView = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // optional if you load dynamic data

    return (
        <AdminLayout>
            <div className="container mt-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0">Vehicle Type Details</h4>
                    <Button className="back-button" onClick={() => navigate(-1)}>
                       <FaArrowLeft/> Back</Button>
                </div>
                <Card>
                    <Card.Body>
                        <Row className="mb-3">
                            <Col md={4}>
                                <img
                                    src={vehicleTypeData.image}
                                    alt={vehicleTypeData.type}
                                    className="img-fluid rounded"
                                    style={{ maxWidth: "150px" }}
                                />
                            </Col>
                            <Col md={8}>
                                <h5>{vehicleTypeData.type}</h5>
                                <p><strong>Cost per Km:</strong> {vehicleTypeData.costPerKm}</p>
                                <p><strong>Status:</strong>
                                    <span className={`ms-2 badge bg-${vehicleTypeData.status === "Active" ? "success" : "secondary"}`}>
                                        {vehicleTypeData.status}
                                    </span>
                                </p>
                                <p><strong>Description:</strong> {vehicleTypeData.description}</p>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </div>
        </AdminLayout>
    );
};

