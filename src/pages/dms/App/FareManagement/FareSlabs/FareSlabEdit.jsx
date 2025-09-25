import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Container, Form, Alert, Row, Col } from "react-bootstrap";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";
import axios from "axios";
import { getModuleId, getToken } from "../../../../../utils/authhelper";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const FareSlabEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { slab } = location.state || {}; // 👈 slab passed from list

  const [formData, setFormData] = useState({
    slab_id: "",
    fare_id: "",
    start_km: "",
    end_km: "",
    rate_per_km: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  const token = getToken();
  const moduleId = getModuleId("fareslab");

  // ✅ Prefill when editing
  useEffect(() => {
    if (slab && !hasInitialized) {
      setFormData({
        slab_id: slab.slab_id || "",
        fare_id: slab.fare_id || "",
        start_km: slab.start_km || "",
        end_km: slab.end_km ?? "", // null → ""
        rate_per_km: slab.rate_per_km || "",
      });
      setHasInitialized(true);
    }
  }, [slab, hasInitialized]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.start_km || !formData.rate_per_km) {
      setError("Start KM and Rate per KM are required!");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      const payload = {
        fare_id: formData.fare_id,
        start_km: formData.start_km,
        end_km: formData.end_km === "" ? null : formData.end_km,
        rate_per_km: formData.rate_per_km,
        module_id: moduleId,
      };

      const response = await axios.put(
        `${API_BASE_URL}/updateFareSlab/${formData.slab_id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data?.success) {
        setSuccess("Fare slab updated successfully!");
        setTimeout(() => navigate("/dms/fareslab"), 1500);
      } else {
        setError(response.data?.message || "Failed to update fare slab.");
      }
    } catch (err) {
      console.error("Error updating fare slab:", err);
      setError("Failed to update fare slab. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Container className="dms-container">
        <h4>Edit Fare Slab</h4>
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
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="save-and-cancel-btn mt-4">
              <Button type="submit" className="me-2" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate("/dms/fareslab")}
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
