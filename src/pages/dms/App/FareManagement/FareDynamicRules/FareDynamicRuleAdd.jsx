import React, { useState, useEffect } from "react";
import { Button, Container, Form, Alert, Row, Col, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";
import axios from "axios";
import { getModuleId, getToken } from "../../../../../utils/authhelper";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const FareDynamicRuleAdd = () => {
  const navigate = useNavigate();

  const [regions, setRegions] = useState([]);
  const [loadingRegions, setLoadingRegions] = useState(true);

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

  // Fetch regions from API
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const token = getToken();
        const moduleId = getModuleId("faredynamicrules"); // module_id = 84 for example

        const response = await axios.get(`${API_BASE_URL}/getAllFareRegionSetting`, {
          params: { module_id: moduleId },
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data?.success) {
          // Map API response to dropdown format
          const regionOptions = response.data.data.models.map((r) => ({
            region_id: r.id,
            city: r.city,
            state: r.state,
          }));
          setRegions(regionOptions);
        } else {
          setError("Failed to fetch regions.");
        }
      } catch (err) {
        console.error("Error fetching regions:", err);
        setError("Failed to fetch regions. Please try again later.");
      } finally {
        setLoadingRegions(false);
      }
    };

    fetchRegions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.region_id || !formData.multiplier || !formData.start_time || !formData.end_time) {
      setError("Region, Multiplier, Start Time, and End Time are required.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const token = getToken();
      const moduleId = getModuleId("faredynamicrules");

      const payload = {
        regionId: formData.region_id,
        rule_type: formData.rule_type,
        multiplier: parseFloat(formData.multiplier),
        start_time: formData.start_time,
        end_time: formData.end_time,
        module_id: moduleId,
      };

      const response = await axios.post(
        `${API_BASE_URL}/createfareDynamicRule`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.success) {
        setSuccessMessage(response.data.message || "Dynamic rule added successfully!");
        setFormData({
          region_id: "",
          rule_type: "peak",
          multiplier: "",
          start_time: "",
          end_time: "",
        });

        setTimeout(() => navigate("/dms/faredynamicrules"), 2000);
      } else {
        setError(response.data?.message || "Failed to add dynamic rule.");
      }
    } catch (err) {
      console.error("Error adding dynamic rule:", err);
      setError("Failed to add dynamic rule. Please try again later.");
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
                  <Form.Label>Region</Form.Label>
                  {loadingRegions ? (
                    <div><Spinner animation="border" size="sm" /> Loading regions...</div>
                  ) : (
                    <Form.Select
                      name="region_id"
                      value={formData.region_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Region</option>
                      {regions.map((r) => (
                        <option key={r.region_id} value={r.region_id}>
                          {r.city} ({r.state})
                        </option>
                      ))}
                    </Form.Select>
                  )}
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
