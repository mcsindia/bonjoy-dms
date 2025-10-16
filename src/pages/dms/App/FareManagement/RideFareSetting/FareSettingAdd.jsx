import React, { useState } from "react";
import { Button, Container, Form, Alert, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";
import axios from "axios";
import { getModuleId, getToken } from "../../../../../utils/authhelper";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const FareSettingAdd = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    base_fare: "",
    per_km_fare_night: "",
    night_start_time: "",
    night_end_time: "",
    waiting_charge_per_min: "",
    waiting_grace_period: "",
    cancellation_normal: "",
    cancellation_emergency_cap: "",
    emergency_bonus: "",
    first_ride_bonus: "",
    effective_from: "",
    isActive: "1",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.base_fare || !formData.per_km_fare) {
      setError("Base fare and per km fare are required.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const token = getToken(); //  get token
      const moduleId = getModuleId("faresettings"); //  dynamic module id

      const payload = {
        ...formData,
        module_id: moduleId, // include module_id in body
      };

      const response = await axios.post(
        `${API_BASE_URL}/createFareSetting`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.success) {
        setSuccessMessage(response.data.message || "Fare setting saved successfully!");
        setFormData({
          base_fare: "",
          per_km_fare_night: "",
          night_start_time: "",
          night_end_time: "",
          waiting_charge_per_min: "",
          waiting_grace_period: "",
          cancellation_normal: "",
          cancellation_emergency_cap: "",
          emergency_bonus: "",
          first_ride_bonus: "",
          effective_from: "",
          isActive: "1",
        });

        setTimeout(() => navigate("/dms/faresettings"), 2000);
      } else {
        setError(response.data?.message || "Failed to add fare setting.");
      }
    } catch (err) {
      console.error("Error adding fare setting:", err);
      setError("Failed to add fare setting. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Container className="dms-container">
        <h4>Add New Fare Setting</h4>
        <div className="dms-form-container">
          {error && <Alert variant="danger" onClose={() => setError("")} dismissible>{error}</Alert>}
          {successMessage && <Alert variant="success" onClose={() => setSuccessMessage("")} dismissible>{successMessage}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
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
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="dms-form-group">
                  <Form.Label>Waiting Charge Per Min</Form.Label>
                  <Form.Control
                    type="number"
                    name="waiting_charge_per_min"
                    value={formData.waiting_charge_per_min}
                    onChange={handleChange}
                    placeholder="Enter waiting charge per min"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="dms-form-group">
                  <Form.Label>Waiting Grace Period (min)</Form.Label>
                  <Form.Control
                    type="number"
                    name="waiting_grace_period"
                    value={formData.waiting_grace_period}
                    onChange={handleChange}
                    placeholder="Enter grace period"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="dms-form-group">
                  <Form.Label>Cancellation Fee (Normal)</Form.Label>
                  <Form.Control
                    type="number"
                    name="cancellation_normal"
                    value={formData.cancellation_normal}
                    onChange={handleChange}
                    placeholder="Enter normal cancellation fee"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="dms-form-group">
                  <Form.Label>Cancellation Fee (Emergency Cap)</Form.Label>
                  <Form.Control
                    type="number"
                    name="cancellation_emergency_cap"
                    value={formData.cancellation_emergency_cap}
                    onChange={handleChange}
                    placeholder="Enter emergency cancellation cap"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="dms-form-group">
                  <Form.Label>Emergency Bonus</Form.Label>
                  <Form.Control
                    type="number"
                    name="emergency_bonus"
                    value={formData.emergency_bonus}
                    onChange={handleChange}
                    placeholder="Enter emergency bonus"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="dms-form-group">
                  <Form.Label>First Ride Bonus</Form.Label>
                  <Form.Control
                    type="number"
                    name="first_ride_bonus"
                    value={formData.first_ride_bonus}
                    onChange={handleChange}
                    placeholder="Enter first ride bonus"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
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

            <div className="save-and-cancel-btn">
              <Button type="submit" className="me-2" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save changes"}
              </Button>
              <Button variant="secondary" onClick={() => navigate("/dms/faresettings")}>
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      </Container>
    </AdminLayout>
  );
};
