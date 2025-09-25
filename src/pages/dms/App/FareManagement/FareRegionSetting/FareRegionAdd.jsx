import React, { useState } from "react";
import { Button, Container, Form, Alert, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";
import axios from "axios";
import { getModuleId, getToken } from "../../../../../utils/authhelper";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const FareRegionAdd = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        city: "",
        state: "",
        tier: "tier1",
        base_fare: "",
        per_km_fare: "",
        per_km_fare_night: "",
        waiting_charge_per_min: "",
        fuel_type: "petrol",
        peak_multiplier: "",
        effective_from: "",
        isActive: "1",
    });

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const token = getToken();
    const moduleId = getModuleId("fareregion");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.city || !formData.state || !formData.base_fare) {
            setError("City, State, and Base Fare are required.");
            return;
        }

        try {
            setIsLoading(true);
            setError("");

            const payload = {
                ...formData,
                module_id: moduleId,
            };

            // ✅ Replace with real API endpoint
            const response = await axios.post(`${API_BASE_URL}/createFareRegion`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data?.success) {
                setSuccessMessage("Fare region added successfully!");
                setFormData({
                    city: "",
                    state: "",
                    tier: "tier1",
                    base_fare: "",
                    per_km_fare: "",
                    per_km_fare_night: "",
                    waiting_charge_per_min: "",
                    fuel_type: "petrol",
                    peak_multiplier: "",
                    effective_from: "",
                    isActive: "1",
                });

                setTimeout(() => navigate("/dms/fareregion"), 1500);
            } else {
                setError(response.data?.message || "Failed to add fare region.");
            }
        } catch (err) {
            console.error("Error adding fare region:", err);
            setError("Failed to add fare region. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AdminLayout>
            <Container className="dms-container">
                <h4>Add New Fare Region</h4>
                <div className="dms-form-container">
                    {error && (
                        <Alert variant="danger" onClose={() => setError("")} dismissible>
                            {error}
                        </Alert>
                    )}

                    {successMessage && (
                        <Alert variant="success" onClose={() => setSuccessMessage("")} dismissible>
                            {successMessage}
                        </Alert>
                    )}

                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="dms-form-group">
                                    <Form.Label>City</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="Enter city"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="dms-form-group">
                                    <Form.Label>State</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        placeholder="Enter state"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="dms-form-group">
                                    <Form.Label>Tier</Form.Label>
                                    <Form.Select name="tier" value={formData.tier} onChange={handleChange}>
                                        <option value="tier1">Tier 1</option>
                                        <option value="tier2">Tier 2</option>
                                        <option value="tier3">Tier 3</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="dms-form-group">
                                    <Form.Label>Fuel Type</Form.Label>
                                    <Form.Select name="fuel_type" value={formData.fuel_type} onChange={handleChange}>
                                        <option value="petrol">Petrol</option>
                                        <option value="cng">CNG</option>
                                        <option value="diesel">Diesel</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={4}>
                                <Form.Group className="dms-form-group">
                                    <Form.Label>Base Fare</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="base_fare"
                                        value={formData.base_fare}
                                        onChange={handleChange}
                                        placeholder="Enter base fare"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="dms-form-group">
                                    <Form.Label>Per KM Fare (Day)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="per_km_fare"
                                        value={formData.per_km_fare}
                                        onChange={handleChange}
                                        placeholder="Enter per km fare"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="dms-form-group">
                                    <Form.Label>Per KM Fare (Night)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="per_km_fare_night"
                                        value={formData.per_km_fare_night}
                                        onChange={handleChange}
                                        placeholder="Enter night per km fare"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={4}>
                                <Form.Group className="dms-form-group">
                                    <Form.Label>Waiting Charge / Min</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="waiting_charge_per_min"
                                        value={formData.waiting_charge_per_min}
                                        onChange={handleChange}
                                        placeholder="Enter waiting charge"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="dms-form-group">
                                    <Form.Label>Peak Multiplier</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.1"
                                        name="peak_multiplier"
                                        value={formData.peak_multiplier}
                                        onChange={handleChange}
                                        placeholder="Enter peak multiplier"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="dms-form-group">
                                    <Form.Label>Effective From</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="effective_from"
                                        value={formData.effective_from}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="dms-form-group mt-3">
                            <Form.Label>Status</Form.Label>
                            <Form.Select name="isActive" value={formData.isActive} onChange={handleChange}>
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </Form.Select>
                        </Form.Group>

                        <div className="save-and-cancel-btn mt-3">
                            <Button type="submit" className="me-2" disabled={isLoading}>
                                {isLoading ? "Saving..." : "Save changes"}
                            </Button>
                            <Button variant="secondary" onClick={() => navigate("/dms/fareregion")}>
                                Cancel
                            </Button>
                        </div>
                    </Form>
                </div>
            </Container>
        </AdminLayout>
    );
};
