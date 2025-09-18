import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Container, Form, Row, Col, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import Select from "react-select";
import { AdminLayout } from "../../../../layouts/dms/AdminLayout/AdminLayout";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const TripEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const trip = location.state?.trip;
  const [formValues, setFormValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [rideTypes, setRideTypes] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [riders, setRiders] = useState([]);
  const [initialized, setInitialized] = useState(false);

  // Fetch riders, drivers, ride types
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("userData"))?.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [rideTypesRes, driversRes, ridersRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/getAllRideType`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { module_id: "ride_type" } // 🔹 add module_id
          }),
          axios.get(`${API_BASE_URL}/getAllDriverProfiles`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { module_id: "driver" } // 🔹 add module_id
          }),
          axios.get(`${API_BASE_URL}/getAllRiderProfiles`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { module_id: "rider" } // 🔹 add module_id
          })
        ]);

        // Map ride types
        setRideTypes(
          rideTypesRes.data?.data?.models?.map(rt => ({
            value: rt.id,
            label: rt.name
          })) || []
        );

        // Map drivers with fallback to mobile if name is null
        setDrivers(
          driversRes.data?.data?.data?.map(d => ({
            value: d.userId,
            label: d.fullName || d.mobile
          })) || []
        );

        // Map riders with fallback to mobile if name is null
        setRiders(
          ridersRes.data?.data?.data?.map(r => ({
            value: r.id,
            label: r.fullName || r.mobile
          })) || []
        );

      } catch (err) {
        console.error("Error fetching dropdown data:", err);
        setError("Failed to load riders, drivers, or ride types.");
      }
    };

    fetchData();
  }, []);

  const formatDateTimeLocal = (timeString) => {
    if (!timeString) return "";
    const today = new Date().toISOString().split("T")[0];
    if (timeString.length === 8) return `${today}T${timeString.slice(0, 5)}`;
    return timeString.replace(" ", "T").slice(0, 16);
  };

  const formatForAPI = (value, field) => {
    if (!value || value === "") return "00:00:00";
    if (value.includes("T")) {
      const timePart = value.split("T")[1];
      return timePart.length === 5 ? timePart + ":00" : timePart;
    }
    return value;
  };

  // Initialize form values from trip
  useEffect(() => {
    if (trip && !initialized) {
      setFormValues({
        riderId: trip.rider_user_id,
        driverId: trip.driver_user_id,
        rideTypeId: trip.ride_type_id,
        pickup_add: trip.pickup_address,
        pickup_lat: trip.pickup_lat,
        pickup_lng: trip.pickup_lng,
        drop_add: trip.drop_address,
        drop_lat: trip.drop_lat,
        drop_lng: trip.drop_lng,
        fare: trip.fare,
        distance: trip.distance,
        emergency: trip.emergency_ride || false,
        status: trip.status.toLowerCase(),
        scheduled_time: formatDateTimeLocal(trip.scheduled_time),
        pickup_time: formatDateTimeLocal(trip.pickup_time),
        drop_time: formatDateTimeLocal(trip.drop_time),
        completed_at: formatDateTimeLocal(trip.completed_at),
        cancelled_at: formatDateTimeLocal(trip.cancelled_at),
        emergency_triggered_at: formatDateTimeLocal(trip.emergency_triggeredAt),
        payment_status: trip.payment_status.toLowerCase()
      });
      setInitialized(true);
    }
  }, [trip, initialized]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSelectChange = (selectedOption, field) => {
    setFormValues(prev => ({
      ...prev,
      [field]: selectedOption?.value || null
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const payload = {
        rider_id: formValues.riderId,
        driver_id: formValues.driverId,
        ride_type_id: formValues.rideTypeId,
        pickup_address: formValues.pickup_add,
        pickup_lat: parseFloat(formValues.pickup_lat),
        pickup_lng: parseFloat(formValues.pickup_lng),
        drop_address: formValues.drop_add,
        drop_lat: parseFloat(formValues.drop_lat),
        drop_lng: parseFloat(formValues.drop_lng),
        fare: parseFloat(formValues.fare),
        distance: parseFloat(formValues.distance),
        emergency_ride: formValues.emergency || false,
        status: formValues.status?.toLowerCase(),
        scheduled_time: formatForAPI(formValues.scheduled_time),
        pickup_time: formatForAPI(formValues.pickup_time),
        drop_time: formatForAPI(formValues.drop_time),
        completed_at: formatForAPI(formValues.completed_at),
        cancelled_at: formatForAPI(formValues.cancelled_at),
        emergency_triggeredAt: formatForAPI(formValues.emergency_triggered_at),
        payment_status: formValues.payment_status?.toLowerCase()
      };

      console.log("Payload to update trip:", payload);

      const response = await axios.put(
        `${API_BASE_URL}/updateRide/${trip.id}`,
        {
          ...payload,
          module_id: "trip" // 🔹 add module_id here
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setSuccessMessage("Trip updated successfully!");
        setTimeout(() => navigate("/dms/trip"), 1000);
      } else {
        setError(response.data.message || "Failed to update trip");
      }
    } catch (err) {
      console.error("Error updating trip:", err);
      setError("Failed to update trip");
    } finally {
      setLoading(false);
    }
  };

  if (!trip) {
    return (
      <div className="text-center">
        <h3>Trip not found</h3>
        <Button onClick={() => navigate("/dms/trip")}>Go Back</Button>
      </div>
    );
  }

  return (
    <AdminLayout>
      <Container className="dms-container">
        <h4>Edit Trip</h4>
        <div className="dms-form-container">
          {error && <Alert variant="danger">{error}</Alert>}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}

          <Form onSubmit={handleSubmit}>
            {/* Rider & Driver */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group className="mt-3">
                  <Form.Label>Rider</Form.Label>
                  <Select
                    options={riders}
                    value={riders.find(r => r.value === formValues.riderId)}
                    onChange={(opt) => handleSelectChange(opt, "riderId")}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mt-3">
                  <Form.Label>Driver</Form.Label>
                  <Select
                    options={drivers}
                    value={drivers.find(d => d.value === formValues.driverId)}
                    onChange={(opt) => handleSelectChange(opt, "driverId")}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Ride Type & Emergency/Status */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group className="mt-3">
                  <Form.Label>Ride Type</Form.Label>
                  <Select
                    options={rideTypes}
                    value={rideTypes.find(rt => rt.value === formValues.rideTypeId)}
                    onChange={(opt) => handleSelectChange(opt, "rideTypeId")}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mt-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
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
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {/* Pickup */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group className="mt-3">
                  <Form.Label>Pickup Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="pickup_add"
                    value={formValues.pickup_add || ""}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mt-3">
                  <Form.Label>Pickup Lat</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.00000001"
                    name="pickup_lat"
                    value={formValues.pickup_lat || ""}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mt-3">
                  <Form.Label>Pickup Lng</Form.Label>
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

            {/* Drop */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group className="mt-3">
                  <Form.Label>Drop Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="drop_add"
                    value={formValues.drop_add || ""}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mt-3">
                  <Form.Label>Drop Lat</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.00000001"
                    name="drop_lat"
                    value={formValues.drop_lat || ""}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mt-3">
                  <Form.Label>Drop Lng</Form.Label>
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

            {/* Fare & Distance */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group className="mt-3">
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
              <Col md={6}>
                <Form.Group className="mt-3">
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
            </Row>

            {/* Times */}
            <Row className="mb-3">
              <Col md={3}>
                <Form.Group className="mt-3">
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
                <Form.Group className="mt-3">
                  <Form.Label>Pickup Time</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="pickup_time"
                    value={formValues.pickup_time || ""}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mt-3">
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
                <Form.Group className="mt-3">
                  <Form.Label>Completed At</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="completed_at"
                    value={formValues.completed_at || ""}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Cancelled & Emergency Triggered */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group className="mt-3">
                  <Form.Label>Cancelled At</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="cancelled_at"
                    value={formValues.cancelled_at || ""}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mt-3">
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

            {/* Payment Status */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group className="mt-3">
                  <Form.Label>Payment Status</Form.Label>
                  <Form.Select
                    name="payment_status"
                    value={formValues.payment_status || ""}
                    onChange={handleInputChange}
                  >
                    <option value="">Select</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mt-5">
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

            <div className="d-flex mt-3">
              <Button type="submit" disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" /> : "Save Changes"}
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
      </Container>
    </AdminLayout>
  );
};
