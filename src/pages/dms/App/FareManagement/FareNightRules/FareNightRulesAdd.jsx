import React, { useState } from "react";
import { Button, Container, Form, Alert, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";

export const FareNightRulesAdd = () => {
  const navigate = useNavigate();

  // Dummy regions
  const dummyRegions = [
    { region_id: "Reg001", city: "Mumbai", state: "Maharashtra" },
    { region_id: "Reg002", city: "Delhi", state: "Delhi" },
    { region_id: "Reg003", city: "Bengaluru", state: "Karnataka" },
  ];

  const [formData, setFormData] = useState({
    region_id: "",
    night_start_time: "",
    night_end_time: "",
    effective_from: "",
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

    if (!formData.region_id || !formData.night_start_time || !formData.night_end_time) {
      setError("Region, Night Start Time, and Night End Time are required.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage("Night rule added successfully!");
      console.log("Submitted Night Rule:", formData);

      // Reset form
      setFormData({
        region_id: "",
        night_start_time: "",
        night_end_time: "",
        effective_from: "",
      });

      // Navigate back after short delay
      setTimeout(() => navigate("/dms/farenightrules"), 1500);
    }, 1000);
  };

  return (
    <AdminLayout>
      <Container className="dms-container">
        <h4>Add New Fare Night Rule</h4>
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
                  <Form.Label>Effective From</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="effective_from"
                    value={formData.effective_from}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="dms-form-group">
                  <Form.Label>Night Start Time</Form.Label>
                  <Form.Control
                    type="time"
                    name="night_start_time"
                    value={formData.night_start_time}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="dms-form-group">
                  <Form.Label>Night End Time</Form.Label>
                  <Form.Control
                    type="time"
                    name="night_end_time"
                    value={formData.night_end_time}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="save-and-cancel-btn mt-3">
              <Button type="submit" className="me-2" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Rule"}
              </Button>
              <Button variant="secondary" onClick={() => navigate("/dms/farenightrules")}>
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      </Container>
    </AdminLayout>
  );
};
