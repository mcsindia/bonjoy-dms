import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Container, Form, Alert, Row, Col } from "react-bootstrap";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";
import axios from "axios";
import { getModuleId, getToken } from "../../../../../utils/authhelper";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const FareDynamicRuleEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { rule } = location.state || {};

  const [regions, setRegions] = useState([]);
  const [formData, setFormData] = useState({
    rule_id: "",
    region_id: "",
    rule_type: "peak",
    multiplier: "",
    start_time: "",
    end_time: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Fetch all regions
  const fetchRegions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getAllFareRegionSetting`, {
        headers: { Authorization: `Bearer ${getToken()}` },
        params: { module_id: getModuleId("faredynamicrules") },
      });
      const data = response.data?.data?.models || [];
      setRegions(data);
    } catch (err) {
      console.error("Error fetching regions:", err);
      setRegions([]);
    }
  };

  useEffect(() => {
    fetchRegions();
  }, []);

  // Prefill form on edit
  useEffect(() => {
    if (rule && !hasInitialized) {
      setFormData({
        rule_id: rule.id || "",
        region_id: rule.FareRegionSetting?.id || "",
        rule_type: rule.rule_type || "peak",
        multiplier: rule.multiplier || "",
        start_time: rule.start_time ? rule.start_time.slice(0, 16) : "",
        end_time: rule.end_time ? rule.end_time.slice(0, 16) : "",
      });
      setHasInitialized(true);
    }
  }, [rule, hasInitialized]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.region_id || !formData.multiplier || !formData.start_time || !formData.end_time) {
      setError("Region, Multiplier, Start Time, and End Time are required!");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      const token = getToken();
      const moduleId = getModuleId("faredynamicrules");

      // Payload exactly like Postman
      const payload = {
        regionId: formData.region_id,
        rule_type: formData.rule_type,
        multiplier: parseFloat(formData.multiplier),
        start_time: formData.start_time,
        end_time: formData.end_time,
        module_id: moduleId, // module id sent
      };

      const response = await axios.put(
        `${API_BASE_URL}/updateFareDynamicRule/${formData.rule_id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.success) {
        setSuccess(response.data.message || "Dynamic rule updated successfully!");
        setTimeout(() => navigate("/dms/faredynamicrules"), 1500);
      } else {
        setError(response.data?.message || "Failed to update dynamic rule.");
      }
    } catch (err) {
      console.error("Error updating dynamic rule:", err);
      const backendMsg = err.response?.data?.message;
      setError(backendMsg || "Failed to update dynamic rule. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Container className="dms-container">
        <h4>Edit Dynamic Rule</h4>
        <div className="dms-form-container">
          {error && <Alert variant="danger" onClose={() => setError("")} dismissible>{error}</Alert>}
          {success && <Alert variant="success" onClose={() => setSuccess("")} dismissible>{success}</Alert>}

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
                    {regions.map((r) => (
                      <option key={r.id} value={r.id}>
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
                    step="0.01"
                    placeholder="Enter multiplier"
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
