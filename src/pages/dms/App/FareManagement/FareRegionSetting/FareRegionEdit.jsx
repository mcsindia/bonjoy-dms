import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Container, Form, Alert, Row, Col } from "react-bootstrap";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";
import axios from "axios";
import { getModuleId, getToken } from "../../../../../utils/authhelper";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const FareRegionEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { region } = location.state || {};

  const [formData, setFormData] = useState({
    region_id: "",
    city: "",
    state: "",
    tier: 1,
    base_fare: "",
    per_km_fare: "",
    per_km_fare_night: "",
    waiting_charge_per_min: "",
    fuel_type: "",
    peak_multiplier: 1,
    effective_from: "",
    isActive: 1,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  const token = getToken();
  const moduleId = getModuleId("fareregion"); 

  useEffect(() => {
    if (region && !hasInitialized) {
      setFormData({
        region_id: region.region_id || region.id || "", 
        city: region.city || "",
        state: region.state || "",
        tier: region.tier ? parseInt(region.tier) : 1,
        base_fare: region.base_fare || "",
        per_km_fare: region.per_km_fare || "",
        per_km_fare_night: region.per_km_fare_night || "",
        waiting_charge_per_min: region.waiting_charge_per_min || "",
        fuel_type: region.fuel_type || "",
        peak_multiplier: region.peak_multiplier
          ? parseFloat(region.peak_multiplier)
          : 1,
        effective_from: region.effective_from
          ? region.effective_from.split("T")[0]
          : "",
      });
      setHasInitialized(true);
    }
  }, [region, hasInitialized]);

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
      setSuccess("");

      const payload = {
        city: formData.city,
        state: formData.state,
        tier: parseInt(formData.tier),
        base_fare: parseFloat(formData.base_fare),
        per_km_fare: parseFloat(formData.per_km_fare) || 0,
        per_km_fare_night: parseFloat(formData.per_km_fare_night) || 0,
        waiting_charge_per_min: parseFloat(formData.waiting_charge_per_min) || 0,
        fuel_type: formData.fuel_type || null,
        peak_multiplier: parseFloat(formData.peak_multiplier),
        effective_from: formData.effective_from,
        isActive: parseInt(formData.isActive),
        module_id: moduleId,
      };

      const response = await axios.put(
        `${API_BASE_URL}/updateFareRegionSetting/${formData.region_id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.success) {
        setSuccess(response.data.message || "Fare region updated successfully!");
        setTimeout(() => navigate("/dms/fareregion"), 1500);
      } else {
        setError(response.data?.message || "Failed to update fare region.");
      }
    } catch (err) {
      console.error("Error updating fare region:", err);
      const backendMsg = err.response?.data?.message;
      setError(backendMsg || "Failed to update fare region. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Container className="dms-container">
        <h4>Edit Fare Region</h4>
        <div className="dms-form-container">
          {error && <Alert variant="danger" onClose={() => setError("")} dismissible>{error}</Alert>}
          {success && <Alert variant="success" onClose={() => setSuccess("")} dismissible>{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="dms-form-group">
                  <Form.Label>City</Form.Label>
                  <Form.Control type="text" name="city" value={formData.city} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="dms-form-group">
                  <Form.Label>State</Form.Label>
                  <Form.Control type="text" name="state" value={formData.state} onChange={handleChange} required />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="dms-form-group">
                  <Form.Label>Tier</Form.Label>
                  <Form.Control
                    type="number"
                    name="tier"
                    value={formData.tier}
                    onChange={handleChange}
                    min={1}
                    step={1}
                    required
                    placeholder="Enter tier (e.g., 1,2,3)"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="dms-form-group">
                  <Form.Label>Fuel Type</Form.Label>
                  <Form.Select name="fuel_type" value={formData.fuel_type || ""} onChange={handleChange}>
                    <option value="">-- Select --</option>
                    <option value="petrol">Petrol</option>
                    <option value="cng">CNG</option>
                    <option value="ev">EV</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="dms-form-group">
                  <Form.Label>Base Fare</Form.Label>
                  <Form.Control type="number" name="base_fare" value={formData.base_fare} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="dms-form-group">
                  <Form.Label>Per KM Fare (Day)</Form.Label>
                  <Form.Control type="number" name="per_km_fare" value={formData.per_km_fare} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="dms-form-group">
                  <Form.Label>Per KM Fare (Night)</Form.Label>
                  <Form.Control type="number" name="per_km_fare_night" value={formData.per_km_fare_night} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="dms-form-group">
                  <Form.Label>Waiting Charge / Min</Form.Label>
                  <Form.Control type="number" name="waiting_charge_per_min" value={formData.waiting_charge_per_min} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="dms-form-group">
                  <Form.Label>Peak Multiplier</Form.Label>
                  <Form.Control type="number" step="0.1" name="peak_multiplier" value={formData.peak_multiplier} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="dms-form-group">
                  <Form.Label>Effective From</Form.Label>
                  <Form.Control type="date" name="effective_from" value={formData.effective_from} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>

            <div className="save-and-cancel-btn mt-3">
              <Button type="submit" className="me-2" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
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
