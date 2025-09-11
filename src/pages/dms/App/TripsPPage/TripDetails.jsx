import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, Row, Col } from "react-bootstrap";
import { FaMotorcycle, FaMapMarkerAlt, FaEdit } from "react-icons/fa";
import { AdminLayout } from "../../../../layouts/dms/AdminLayout/AdminLayout";

export const TripDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const trip = location.state?.trip;
  const [loading] = useState(false);

  const userData = JSON.parse(localStorage.getItem("userData"));
  let permissions = [];

  if (Array.isArray(userData?.employeeRole)) {
    for (const role of userData.employeeRole) {
      for (const child of role.childMenus || []) {
        for (const mod of child.modules || []) {
          if (mod.moduleUrl?.toLowerCase() === "trip") {
            permissions =
              mod.permission?.toLowerCase().split(",").map((p) => p.trim()) ||
              [];
          }
        }
      }
    }
  }

  const handlePermissionCheck = (
    permissionType,
    action,
    fallbackMessage = null
  ) => {
    if (permissions.includes(permissionType)) {
      action();
    } else {
      alert(
        fallbackMessage || `You don't have permission to ${permissionType} this trip.`
      );
    }
  };

  if (!trip) {
    return (
      <AdminLayout>
        <div className="text-center">
          <h3>Invalid Trip</h3>
          <Button onClick={() => navigate("/dms/trip")} variant="primary">
            Go Back
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const {
    ride_id,
    riderName,
    driverName,
    rideType,
    status,
    fare,
    pickup_add,
    drop_add,
    createdAt,
  } = trip;

  const source = encodeURIComponent(pickup_add);
  const destination = encodeURIComponent(drop_add);

  return (
    <AdminLayout>
      <div className="trip-details-page container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Trip Details</h4>
          <Button
            className="edit-button"
            onClick={() =>
              handlePermissionCheck("edit", () =>
                navigate("/dms/trip/edit", { state: { trip } })
              )
            }
          >
            <FaEdit /> Edit
          </Button>
        </div>

        <Card className="p-4 mb-4 shadow-sm">
          <h4>Trip Information</h4>
          <hr />

          <div className="d-flex align-items-center justify-content-around text-center mb-3">
            <div className="d-flex flex-column align-items-center">
              <FaMapMarkerAlt className="text-success mb-2" size={24} />
              <span className="fw-bold">Pickup</span>
              <span className="text-muted">{pickup_add}</span>
            </div>

            <div className="position-relative d-flex flex-column align-items-center">
              <FaMotorcycle className="text-primary" size={30} />
            </div>

            <div className="d-flex flex-column align-items-center">
              <FaMapMarkerAlt className="text-danger mb-2" size={24} />
              <span className="fw-bold">Drop-off</span>
              <span className="text-muted">{drop_add}</span>
            </div>
          </div>

          <hr />

          {/* Trip Info Grid */}
          <Row className="mb-2">
            <Col md={6}><p><strong>Trip ID:</strong> {ride_id}</p></Col>
            <Col md={6}><p><strong>Status:</strong> {status}</p></Col>
          </Row>
          <Row className="mb-2">
            <Col md={6}><p><strong>Fare:</strong> ₹{fare}</p></Col>
            <Col md={6}><p><strong>Distance:</strong> {trip.distance || "N/A"} km</p></Col>
          </Row>
          <Row className="mb-2">
            <Col md={6}><p><strong>Ride Type:</strong> {rideType}</p></Col>
            <Col md={6}><p><strong>Emergency:</strong> {trip.emergency ? "Yes" : "No"}</p></Col>
          </Row>
          <Row className="mb-2">
            <Col md={6}><p><strong>Payment Status:</strong> {trip.payment_status || "N/A"}</p></Col>
            <Col md={6}><p><strong>Scheduled Time:</strong> {trip.scheduled_time ? new Date(trip.scheduled_time).toLocaleString() : "N/A"}</p></Col>
          </Row>
          <Row className="mb-2">
            <Col md={6}><p><strong>Pickup Time:</strong> {trip.pickup_time ? new Date(trip.pickup_time).toLocaleString() : "N/A"}</p></Col>
            <Col md={6}><p><strong>Drop Time:</strong> {trip.drop_time ? new Date(trip.drop_time).toLocaleString() : "N/A"}</p></Col>
          </Row>
          <Row className="mb-2">
            <Col md={6}><p><strong>Completed At:</strong> {trip.completed_at ? new Date(trip.completed_at).toLocaleString() : "N/A"}</p></Col>
            <Col md={6}><p><strong>Cancelled At:</strong> {trip.cancelled_at ? new Date(trip.cancelled_at).toLocaleString() : "N/A"}</p></Col>
          </Row>
          <Row className="mb-2">
            <Col md={6}><p><strong>Emergency Triggered At:</strong> {trip.emergency_triggered_at ? new Date(trip.emergency_triggered_at).toLocaleString() : "N/A"}</p></Col>
            <Col md={6}><p><strong>Created At:</strong> {new Date(trip.createdAt).toLocaleString()}</p></Col>
          </Row>
        </Card>

        <Row>
          <Col md={6}>
            <Card className="p-4 mb-4 shadow-sm">
              <h4>Rider Information</h4>
              <hr />
              <p><strong>Name:</strong> {riderName}</p>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="p-4 mb-4 shadow-sm">
              <h4>Driver Information</h4>
              <hr />
              <p><strong>Name:</strong> {driverName}</p>
            </Card>
          </Col>
        </Row>

        <Card className="p-4 mb-4 shadow-sm border-dark">
          <h4>Trip Map</h4>
          <div className="trip-map-container">
            <iframe
              title="trip map"
              className="trip-iframe"
              src={`https://www.google.com/maps/embed/v1/directions?key=YOUR_GOOGLE_MAPS_API_KEY&origin=${source}&destination=${destination}`}
              frameBorder="0"
              allowFullScreen
            />
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};
