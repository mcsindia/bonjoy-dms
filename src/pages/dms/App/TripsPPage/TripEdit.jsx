import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Form, Row, Col } from "react-bootstrap";
import axios from "axios";
import { AdminLayout } from "../../../../layouts/dms/AdminLayout/AdminLayout";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const TripEdit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const trip = location.state?.trip;

  const [formValues, setFormValues] = useState(trip || {});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  if (!trip) {
    return (
      <div className="text-center">
        <h3>Trip not found</h3>
        <Button onClick={() => navigate("/dms/trip")}>Go Back</Button>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const url = `${API_BASE_URL}/updateRide/${trip.id}`;

      const payload = {
        riderId: formValues.riderId,
        driverId: formValues.driverId,
        rideTypeId: formValues.rideTypeId,
        pickup_add: formValues.pickup_add,
        pickup_lat: formValues.pickup_lat,
        pickup_lng: formValues.pickup_lng,
        drop_add: formValues.drop_add,
        drop_lat: formValues.drop_lat,
        drop_lng: formValues.drop_lng,
        fare: parseFloat(formValues.fare),
        distance: parseFloat(formValues.distance),
        emergency: formValues.emergency || false,
        status: formValues.status,
        scheduled_time: formValues.scheduled_time,
        pickup_time: formValues.pickup_time,
        drop_time: formValues.drop_time,
        completed_at: formValues.completed_at,
        cancelled_at: formValues.cancelled_at,
        emergency_triggered_at: formValues.emergency_triggered_at,
        payment_status: formValues.payment_status,
      };

      const response = await axios.put(url, payload);

      if (response.data.success) {
        setSuccessMessage("Trip updated successfully!");
        navigate("/dms/trip");
      } else {
        setError("Update failed");
      }
    } catch (err) {
      console.error("Error updating trip:", err);
      setError("Failed to update trip");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="dms-container">
        <h4>Edit Trip Details</h4>
              <div className="dms-form-container">
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
               <Form.Group className="dms-form-group mt-3">
                <Form.Label>Rider Name</Form.Label>
                <Form.Control
                  type="text"
                  name="riderId"
                  value={formValues.riderId || ""}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
               <Form.Group className="dms-form-group mt-3">
                <Form.Label>Driver Name</Form.Label>
                <Form.Control
                  type="text"
                  name="driverId"
                  value={formValues.driverId || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
               <Form.Group className="dms-form-group mt-3">
                <Form.Label>Ride Type ID</Form.Label>
                <Form.Control
                  type="text"
                  name="rideTypeId"
                  value={formValues.rideTypeId || ""}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
               <Form.Group className="dms-form-group mt-3">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  as="select"
                  name="status"
                  value={formValues.status || ""}
                  onChange={handleInputChange}
                >
                  <option value="booked">Booked</option>
                  <option value="accepted">Accepted</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="emergency">Emergency</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mt-4">
                <Form.Check
                  type="checkbox"
                  label="Emergency"
                  name="emergency"
                  checked={formValues.emergency || false}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
               <Form.Group className="dms-form-group mt-3">
                <Form.Label>Pickup Address</Form.Label>
                <Form.Control
                  type="text"
                  name="pickup_add"
                  value={formValues.pickup_add || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
               <Form.Group className="dms-form-group mt-3">
                <Form.Label>Pickup Latitude</Form.Label>
                <Form.Control
                  type="number"
                  step="0.00000001"
                  name="pickup_lat"
                  value={formValues.pickup_lat || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
               <Form.Group className="dms-form-group mt-3">
                <Form.Label>Pickup Longitude</Form.Label>
                <Form.Control
                  type="number"
                  step="0.00000001"
                  name="pickup_lng"
                  value={formValues.pickup_lng || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
               <Form.Group className="dms-form-group mt-3">
                <Form.Label>Drop Address</Form.Label>
                <Form.Control
                  type="text"
                  name="drop_add"
                  value={formValues.drop_add || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
               <Form.Group className="dms-form-group mt-3">
                <Form.Label>Drop Latitude</Form.Label>
                <Form.Control
                  type="number"
                  step="0.00000001"
                  name="drop_lat"
                  value={formValues.drop_lat || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
               <Form.Group className="dms-form-group mt-3">
                <Form.Label>Drop Longitude</Form.Label>
                <Form.Control
                  type="number"
                  step="0.00000001"
                  name="drop_lng"
                  value={formValues.drop_lng || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={3}>
               <Form.Group className="dms-form-group mt-3">
                <Form.Label>Fare</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="fare"
                  value={formValues.fare || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
               <Form.Group className="dms-form-group mt-3">
                <Form.Label>Distance (km)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="distance"
                  value={formValues.distance || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
               <Form.Group className="dms-form-group mt-3">
                <Form.Label>Scheduled Time</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="scheduled_time"
                  value={formValues.scheduled_time || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
               <Form.Group className="dms-form-group mt-3">
                <Form.Label>Pickup Time</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="pickup_time"
                  value={formValues.pickup_time || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={3}>
               <Form.Group className="dms-form-group mt-3">
                <Form.Label>Drop Time</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="drop_time"
                  value={formValues.drop_time || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
               <Form.Group className="dms-form-group mt-3">
                <Form.Label>Completed At</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="completed_at"
                  value={formValues.completed_at || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
               <Form.Group className="dms-form-group mt-3">
                <Form.Label>Cancelled At</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="cancelled_at"
                  value={formValues.cancelled_at || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
               <Form.Group className="dms-form-group mt-3">
                <Form.Label>Emergency Triggered At</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="emergency_triggered_at"
                  value={formValues.emergency_triggered_at || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
               <Form.Group className="dms-form-group mt-3">
                <Form.Label>Payment Status</Form.Label>
                <Form.Control
                  as="select"
                  name="payment_status"
                  value={formValues.payment_status || ""}
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={4}>
               <Form.Group className="dms-form-group mt-3">
                <Form.Label>Created At</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="createdAt"
                  value={formValues.createdAt || ""}
                  readOnly
                />
              </Form.Group>
            </Col>
          </Row>

          {error && <p className="text-danger mt-2">{error}</p>}
          {successMessage && <p className="text-success mt-2">{successMessage}</p>}

          <div className="d-flex mt-3">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save changes"}
            </Button>
            <Button
              type="button"
              className="ms-2"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </Form>
        </div>
      </div>
    </AdminLayout>
  );
};
