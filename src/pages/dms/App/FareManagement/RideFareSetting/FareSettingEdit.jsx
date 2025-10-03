import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Container, Form, Alert, Row, Col } from "react-bootstrap";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";
import axios from "axios";
import { getModuleId, getToken } from "../../../../../utils/authhelper";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const FareSettingEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fare } = location.state || {};

  const [formData, setFormData] = useState({
    fare_id: "",
    base_fare: "",
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
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  const token = getToken();
  const moduleId = getModuleId("faresettings");

  // Prefill when editing
  useEffect(() => {
    if (fare && !hasInitialized) {
      setFormData({
        fare_id: fare.id || fare.fare_id || "",
        base_fare: fare.base_fare || "",
        waiting_charge_per_min: fare.waiting_charge_per_min || "",
        waiting_grace_period: fare.waiting_grace_period || 3,
        cancellation_normal: fare.cancellation_normal || 25,
        cancellation_emergency_cap: fare.cancellation_emergency_cap || 100,
        emergency_bonus: fare.emergency_bonus || 20,
        first_ride_bonus: fare.first_ride_bonus || 50,
        effective_from: fare.effective_from ? fare.effective_from.split("T")[0] : "",
        isActive: fare.isActive ? "1" : "0",
      });
      setHasInitialized(true);
    }
  }, [fare, hasInitialized]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.base_fare) {
      setError("Base fare is required!");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      const payload = {
        ...formData,
        module_id: moduleId,
      };

      const response = await axios.put(
        `${API_BASE_URL}/updateFareSetting/${formData.fare_id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success) {
        setSuccess("Fare setting updated successfully!");
        setTimeout(() => navigate("/dms/faresettings"), 1500);
      } else {
        setError(response.data?.message || "Failed to update fare setting.");
      }
    } catch (err) {
      console.error("Error updating fare setting:", err);
      setError("Failed to update fare setting. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Container className="dms-container">
        <h4>Edit Fare Setting</h4>
        <div className="dms-form-container">
          {error && (
            <Alert variant="danger" onClose={() => setError("")} dismissible>
              {error}
            </Alert>
          )}
          {success && (
            <Alert variant="success" onClose={() => setSuccess("")} dismissible>
              {success}
            </Alert>
          )}

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
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="dms-form-group">
                  <Form.Label>Waiting Grace Period (Minutes)</Form.Label>
                  <Form.Control
                    type="number"
                    name="waiting_grace_period"
                    value={formData.waiting_grace_period}
                    onChange={handleChange}
                    placeholder="Enter free waiting minutes"
                  />
                </Form.Group>
              </Col>
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
            </Row>

            <Row>
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
            </Row>

            <Row>
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

            <div className="save-and-cancel-btn mt-4">
              <Button type="submit" className="me-2" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate("/dms/faresettings")}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      </Container>
    </AdminLayout>
  );
};
