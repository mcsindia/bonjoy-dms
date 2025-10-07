import React, { useState, useEffect } from "react";
import { Button, Container, Form, Alert, Row, Col, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";
import axios from "axios";
import { getModuleId, getToken } from "../../../../../utils/authhelper";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const FareNightRulesAdd = () => {
  const navigate = useNavigate();

  const [regions, setRegions] = useState([]);
  const [formData, setFormData] = useState({
    regionId: "",
    night_start_time: "",
    night_end_time: "",
    effective_from: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingRegions, setIsFetchingRegions] = useState(false);

  // ✅ Fetch regions dynamically from API
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        setIsFetchingRegions(true);
        const token = getToken();
        const moduleId = getModuleId("fareregion"); // or the correct key used in that module
        const response = await axios.get(
          `${API_BASE_URL}/getAllFareRegionSetting?module_id=${moduleId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data?.success) {
          setRegions(response.data.data.models || []);
        } else {
          setError("Failed to load regions. Please try again.");
        }
      } catch (err) {
        console.error("Error fetching regions:", err);
        setError("Error fetching regions. Please try again later.");
      } finally {
        setIsFetchingRegions(false);
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

    if (!formData.regionId || !formData.night_start_time || !formData.night_end_time) {
      setError("Region, Night Start Time, and Night End Time are required.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      const token = getToken();
      const moduleId = getModuleId("farenightrules");

      const payload = {
        ...formData,
        module_id: moduleId,
      };

      const response = await axios.post(
        `${API_BASE_URL}/createfareNightRule`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.success) {
        setSuccessMessage(response.data.message || "Fare night rule added successfully!");
        setFormData({
          regionId: "",
          night_start_time: "",
          night_end_time: "",
          effective_from: "",
        });

        setTimeout(() => navigate("/dms/farenightrules"), 2000);
      } else {
        setError(response.data?.message || "Failed to add fare night rule.");
      }
    } catch (err) {
      console.error("Error adding fare night rule:", err);
      setError("Failed to add fare night rule. Please try again later.");
    } finally {
      setIsLoading(false);
    }
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
                    name="regionId"
                    value={formData.regionId}
                    onChange={handleChange}
                    required
                    disabled={isFetchingRegions}
                  >
                    <option value="">
                      {isFetchingRegions ? "Loading regions..." : "Select Region"}
                    </option>
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
                {isLoading ? (
                  <>
                    <Spinner animation="border" size="sm" /> Saving...
                  </>
                ) : (
                  "Save Rule"
                )}
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate("/dms/farenightrules")}
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
