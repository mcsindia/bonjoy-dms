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
        <Button onClick={() => navigate("/dms/trips")}>Go Back</Button>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues((prevState) => ({
      ...prevState,
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

      // Build payload with all editable fields
      const payload = {
        riderId: Number(formValues.riderId),
        driverId: Number(formValues.driverId),
        rideTypeId: Number(formValues.rideTypeId),
        startLocation: formValues.startLocation,
        endLocation: formValues.endLocation,
        startPoint: formValues.startPoint,
        endPoint: formValues.endPoint,
        fare: parseFloat(formValues.fare),
        distance: parseFloat(formValues.distance),
        emergencyRide: formValues.emergencyRide === true || formValues.emergencyRide === "true",
        scheduledTime: formValues.scheduledTime,
        pickupTime: formValues.pickupTime,
        dropTime: formValues.dropTime,
        completedAt: formValues.completedAt,
        paymentStatus: formValues.paymentStatus,
        cancelledAt: formValues.cancelledAt,
        emergencyTriggeredAt: formValues.emergencyTriggeredAt,
      };

      const response = await axios.put(url, payload);

      if (response.data.success) {
        setSuccessMessage("Trip updated successfully!");
        console.log("Update successful:", response.data.message);
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
            <Form.Group className="mb-3">
              <Form.Label>Trip ID</Form.Label>
              <Form.Control type="text" value={formValues.id} readOnly />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Rider ID</Form.Label>
              <Form.Control
                type="number"
                name="riderId"
                value={formValues.riderId || ""}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Driver ID</Form.Label>
              <Form.Control
                type="number"
                name="driverId"
                value={formValues.driverId || ""}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ride Type ID</Form.Label>
              <Form.Control
                type="number"
                name="rideTypeId"
                value={formValues.rideTypeId || ""}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Start Location</Form.Label>
              <Form.Control
                type="text"
                name="startLocation"
                value={formValues.startLocation || ""}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>End Location</Form.Label>
              <Form.Control
                type="text"
                name="endLocation"
                value={formValues.endLocation || ""}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Start Point</Form.Label>
              <Form.Control
                type="text"
                name="startPoint"
                value={formValues.startPoint || ""}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>End Point</Form.Label>
              <Form.Control
                type="text"
                name="endPoint"
                value={formValues.endPoint || ""}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Fare</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name="fare"
                value={formValues.fare || ""}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Distance (km)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name="distance"
                value={formValues.distance || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Emergency Ride"
                name="emergencyRide"
                checked={formValues.emergencyRide || false}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Scheduled Time</Form.Label>
              <Form.Control
                type="time"
                name="scheduledTime"
                value={formValues.scheduledTime || ""}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Pickup Time</Form.Label>
              <Form.Control
                type="time"
                name="pickupTime"
                value={formValues.pickupTime || ""}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Drop Time</Form.Label>
              <Form.Control
                type="time"
                name="dropTime"
                value={formValues.dropTime || ""}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Completed At</Form.Label>
              <Form.Control
                type="time"
                name="completedAt"
                value={formValues.completedAt || ""}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Payment Status</Form.Label>
              <Form.Control
                as="select"
                name="paymentStatus"
                value={formValues.paymentStatus || ""}
                onChange={handleInputChange}
              >
                <option value="">Select Payment Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Cancelled At</Form.Label>
              <Form.Control
                type="time"
                name="cancelledAt"
                value={formValues.cancelledAt || ""}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Emergency Triggered At</Form.Label>
              <Form.Control
                type="time"
                name="emergencyTriggeredAt"
                value={formValues.emergencyTriggeredAt || ""}
                onChange={handleInputChange}
              />
            </Form.Group>

            {error && <p className="text-danger mt-2">{error}</p>}
            {successMessage && <p className="text-success mt-2">{successMessage}</p>}

            <div className="save-and-cancel-btn">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save changes"}
              </Button>
              <Button
                type="cancel"
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
