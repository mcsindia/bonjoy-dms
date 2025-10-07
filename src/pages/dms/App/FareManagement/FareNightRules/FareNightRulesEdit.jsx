import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Container, Form, Alert, Row, Col } from "react-bootstrap";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";
import axios from "axios";
import { getModuleId, getToken } from "../../../../../utils/authhelper";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const FareNightRulesEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { rule } = location.state || {}; 

  const [regions, setRegions] = useState([]);
  const [formData, setFormData] = useState({
    night_rule_id: "",
    regionId: "",
    night_start_time: "",
    night_end_time: "",
    effective_from: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // ✅ Fetch region list from API
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const token = getToken();
        const moduleId = getModuleId("farenightrules");
        const response = await axios.get(
          `${API_BASE_URL}/getAllFareRegionSetting?module_id=${moduleId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data?.success) {
          setRegions(response.data.data.models || []);
        } else {
          setError("Failed to fetch regions.");
        }
      } catch (err) {
        console.error("Error fetching regions:", err);
        setError("Failed to fetch regions. Please try again later.");
      }
    };

    fetchRegions();
  }, []);

  // ✅ Prefill form on edit
  useEffect(() => {
    if (rule && !hasInitialized) {
      setFormData({
        night_rule_id: rule.night_rule_id || rule.id || "",
        regionId: rule.regionId || rule.region_id || "",
        night_start_time: rule.night_start_time
          ? rule.night_start_time.replace(" ", "T").slice(0, 16)
          : "",
        night_end_time: rule.night_end_time
          ? rule.night_end_time.replace(" ", "T").slice(0, 16)
          : "",
        effective_from: rule.effective_from
          ? rule.effective_from.split("T")[0]
          : "",
      });
      setHasInitialized(true);
    }
  }, [rule, hasInitialized]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle update API call
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.regionId || !formData.night_start_time || !formData.night_end_time) {
      setError("Region, Night Start Time, and Night End Time are required!");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      const token = getToken();
      const moduleId = getModuleId("farenightrules");

      // Convert datetime-local → "YYYY-MM-DD HH:mm:ss"
      const payload = {
        regionId: Number(formData.regionId),
        night_start_time: formData.night_start_time.replace("T", " ") + ":00",
        night_end_time: formData.night_end_time.replace("T", " ") + ":00",
        effective_from: formData.effective_from,
        module_id: moduleId,
      };

      const response = await axios.put(
        `${API_BASE_URL}/updateFareNightRule/${formData.night_rule_id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.success) {
        setSuccess(response.data.message || "Fare night rule updated successfully!");
        setTimeout(() => navigate("/dms/farenightrules"), 1500);
      } else {
        setError(response.data?.message || "Failed to update fare night rule.");
      }
    } catch (err) {
      console.error("Error updating fare night rule:", err);
      const backendMsg = err.response?.data?.message;
      setError(backendMsg || "Failed to update fare night rule. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Container className="dms-container">
        <h4>Edit Fare Night Rule</h4>
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
                  <Form.Label>Region</Form.Label>
                  <Form.Select
                    name="regionId"
                    value={formData.regionId}
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

            <Row>
              <Col md={6}>
                <Form.Group className="dms-form-group">
                  <Form.Label>Night Start Time</Form.Label>
                  <Form.Control
                    type="datetime-local"
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
                    type="datetime-local"
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
                {isLoading ? "Saving..." : "Save Changes"}
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
