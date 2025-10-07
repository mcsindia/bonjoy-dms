import React, { useState, useEffect } from "react";
import { Button, Container, Form, Alert, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";
import axios from "axios";
import { getModuleId, getToken } from "../../../../../utils/authhelper";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const FareSlabAdd = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    start_km: "",
    end_km: "",
    rate_type: "per_km", 
    rate: "",
    fare_id: "",
    isActive: "1",
  });

  const [fareSettings, setFareSettings] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const token = getToken();
  const moduleId = getModuleId("fareslab");

  // Fetch fare settings from backend
  const fetchFareSettings = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getAllFareSetting`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { module_id: getModuleId("faresettings") }, // module_id for fare settings
      });
      if (response.data?.success) {
        setFareSettings(response.data.data.models || []);
      } else {
        console.error("Failed to fetch fare settings", response.data);
      }
    } catch (err) {
      console.error("Error fetching fare settings:", err);
    }
  };

  useEffect(() => {
    fetchFareSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.start_km || !formData.rate || !formData.fare_id) {
    setError("Start KM, Rate, and Fare Setting are required.");
    return;
  }

  try {
    setIsLoading(true);
    setError("");
    setSuccess("");

    const payload = {
      start_km: formData.start_km,
      end_km: formData.end_km || null,
      rate_type: formData.rate_type,
      rate: formData.rate,
      fareId: formData.fare_id,  // <-- fixed
      module_id: moduleId,
      isActive: formData.isActive,
    };

    const response = await axios.post(`${API_BASE_URL}/createFareSlab`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.data?.success) {
      setSuccess(response.data.message || "Fare slab added successfully!");
      setFormData({
        start_km: "",
        end_km: "",
        rate_type: "per_km",
        rate: "",
        fare_id: "",
        isActive: "1",
      });
      setTimeout(() => navigate("/dms/fareslab"), 1500);
    } else {
      setError(response.data?.message || "Failed to add fare slab.");
    }
  } catch (err) {
    console.error("Error adding fare slab:", err);
    setError(err.response?.data?.message || "Failed to add fare slab.");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <AdminLayout>
      <Container className="dms-container">
        <h4>Add New Fare Slab</h4>
        <div className="dms-form-container">
          {error && <Alert variant="danger" onClose={() => setError("")} dismissible>{error}</Alert>}
          {success && <Alert variant="success" onClose={() => setSuccess("")} dismissible>{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="dms-form-group">
                  <Form.Label>Start KM</Form.Label>
                  <Form.Control
                    type="number"
                    name="start_km"
                    value={formData.start_km}
                    onChange={handleChange}
                    placeholder="Enter start km"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="dms-form-group">
                  <Form.Label>End KM</Form.Label>
                  <Form.Control
                    type="number"
                    name="end_km"
                    value={formData.end_km}
                    onChange={handleChange}
                    placeholder="Enter end km (optional)"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="dms-form-group">
                  <Form.Label>Rate Type</Form.Label>
                  <Form.Select name="rate_type" value={formData.rate_type} onChange={handleChange}>
                    <option value="per_km">Per KM</option>
                    <option value="flat">Flat</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="dms-form-group">
                  <Form.Label>Rate</Form.Label>
                  <Form.Control
                    type="number"
                    name="rate"
                    value={formData.rate}
                    onChange={handleChange}
                    placeholder="Enter rate"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="dms-form-group mt-3">
              <Form.Label>Fare Setting</Form.Label>
              <Form.Select name="fare_id" value={formData.fare_id} onChange={handleChange} required>
                <option value="">-- Select Fare Setting --</option>
                {fareSettings.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.base_fare} | {f.effective_from}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="save-and-cancel-btn mt-4">
              <Button type="submit" className="me-2" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
              <Button variant="secondary" onClick={() => navigate("/dms/fareslab")}>
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      </Container>
    </AdminLayout>
  );
};
