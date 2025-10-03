import React, { useState } from "react";
import { Button, Container, Form, Alert, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";

export const FareDynamicRuleAdd = () => {
  const navigate = useNavigate();

  // Dummy regions
  const dummyRegions = [
    { region_id: "Reg001", city: "Mumbai", state: "Maharashtra" },
    { region_id: "Reg002", city: "Delhi", state: "Delhi" },
    { region_id: "Reg003", city: "Bengaluru", state: "Karnataka" },
  ];

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.region_id || !formData.multiplier || !formData.start_time || !formData.end_time) {
      setError("Region, Multiplier, Start Time, and End Time are required.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage("Dynamic rule added successfully!");
      console.log("Submitted Rule:", formData);

      // Reset form
      setFormData({
        region_id: "",
        rule_type: "peak",
        multiplier: "",
        start_time: "",
        end_time: "",
      });

      // Navigate back after short delay
      setTimeout(() => navigate("/dms/faredynamicrules"), 1500);
    }, 1000);
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
                  <Form.Label>Region</Form.Label>
                  <Form.Select
                    name="region_id"
                    value={formData.region_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Region</option>
                    {dummyRegions.map((r) => (
                      <option key={r.region_id} value={r.region_id}>
                        {r.city} ({r.state})
                      </option>
                    ))}
                  </Form.Select>
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
