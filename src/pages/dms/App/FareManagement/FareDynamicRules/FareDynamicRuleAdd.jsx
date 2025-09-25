import React, { useState } from "react";
import { Button, Container, Form, Alert, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";
import axios from "axios";
import { getModuleId, getToken } from "../../../../../utils/authhelper";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const FareDynamicRuleAdd = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    region_id: "",
    rule_type: "peak",
    multiplier: "",
    start_time: "",
    end_time: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const token = getToken();
  const moduleId = getModuleId("faredynamicrules");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.region_id || !formData.multiplier || !formData.start_time || !formData.end_time) {
      setError("Region, Multiplier, Start Time and End Time are required.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setSuccessMessage("");

      const payload = {
        ...formData,
        module_id: moduleId,
      };

      // Replace with your actual API endpoint
      const response = await axios.post(`${API_BASE_URL}/createFareDynamicRule`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data?.success) {
        setSuccessMessage("Dynamic rule added successfully!");
        setFormData({
          region_id: "",
          rule_type: "peak",
          multiplier: "",
          start_time: "",
          end_time: "",
        });
        setTimeout(() => navigate("/dms/faredynamicrules"), 1500);
      } else {
        setError(response.data?.message || "Failed to add dynamic rule.");
      }
    } catch (err) {
      console.error("Error adding dynamic rule:", err);
      setError("Failed to add dynamic rule. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Container className="dms-container">
        <h4>Add New Dynamic Rule</h4>
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
                  <Form.Label>Region ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="region_id"
                    value={formData.region_id}
                    onChange={handleChange}
                    placeholder="Enter region ID"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="dms-form-group">
                  <Form.Label>Rule Type</Form.Label>
                  <Form.Select
                    name="rule_type"
                    value={formData.rule_type}
                    onChange={handleChange}
                  >
                    <option value="peak">Peak</option>
                    <option value="weather">Weather</option>
                    <option value="special_event">Special Event</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="dms-form-group">
                  <Form.Label>Multiplier</Form.Label>
                  <Form.Control
                    type="number"
                    name="multiplier"
                    value={formData.multiplier}
                    onChange={handleChange}
                    placeholder="Enter multiplier (e.g. 1.2)"
                    step="0.01"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="dms-form-group">
                  <Form.Label>Start Time</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="dms-form-group">
                  <Form.Label>End Time</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="save-and-cancel-btn mt-3">
              <Button type="submit" className="me-2" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
              <Button variant="secondary" onClick={() => navigate("/dms/faredynamicrules")}>
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      </Container>
    </AdminLayout>
  );
};
