import React, { useState } from "react";
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
    rate_per_km: "",
    fare_id: "",
    isActive: "1",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const token = getToken();
  const moduleId = getModuleId("fareslab");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.start_km || !formData.rate_per_km || !formData.fare_id) {
      setError("Start KM, Rate per KM and Fare ID are required.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const payload = {
        ...formData,
        module_id: moduleId,
      };

      // ✅ Replace with real API
      const response = await axios.post(`${API_BASE_URL}/createFareSlab`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data?.success) {
        setSuccessMessage("Fare slab added successfully!");
        setFormData({
          start_km: "",
          end_km: "",
          rate_per_km: "",
          fare_id: "",
          isActive: "1",
        });

        setTimeout(() => navigate("/dms/fareslab"), 1500);
      } else {
        setError(response.data?.message || "Failed to add fare slab.");
      }
    } catch (err) {
      console.error("Error adding fare slab:", err);
      setError("Failed to add fare slab. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Container className="dms-container">
        <h4>Add New Fare Slab</h4>
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
                    placeholder="Enter end km (leave blank for ∞)"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="dms-form-group">
                  <Form.Label>Rate per KM</Form.Label>
                  <Form.Control
                    type="number"
                    name="rate_per_km"
                    value={formData.rate_per_km}
                    onChange={handleChange}
                    placeholder="Enter rate per km"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="dms-form-group">
                  <Form.Label>Fare ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="fare_id"
                    value={formData.fare_id}
                    onChange={handleChange}
                    placeholder="Enter fare ID"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="dms-form-group">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="isActive"
                value={formData.isActive}
                onChange={handleChange}
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </Form.Select>
            </Form.Group>

            <div className="save-and-cancel-btn">
              <Button type="submit" className="me-2" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save changes"}
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
