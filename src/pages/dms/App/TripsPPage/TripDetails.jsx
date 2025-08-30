import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, Row, Col, Spinner } from "react-bootstrap";
import { FaArrowLeft, FaMotorcycle, FaMapMarkerAlt, FaEdit } from "react-icons/fa";
import { AdminLayout } from "../../../../layouts/dms/AdminLayout/AdminLayout";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const TripDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const tripId = location.state?.tripId;
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const userData = JSON.parse(localStorage.getItem("userData"));
  let permissions = [];

  if (Array.isArray(userData?.employeeRole)) {
    for (const role of userData.employeeRole) {
      for (const child of role.childMenus || []) {
        for (const mod of child.modules || []) {
          if (mod.moduleUrl?.toLowerCase() === "trip") {
            permissions = mod.permission
              ?.toLowerCase()
              .split(',')
              .map(p => p.trim()) || [];
          }
        }
      }
    }
  }

  const handlePermissionCheck = (permissionType, action, fallbackMessage = null) => {
    if (permissions.includes(permissionType)) {
      action(); // allowed, run the actual function
    } else {
      alert(fallbackMessage || `You don't have permission to ${permissionType} this employee.`);
    }
  };

  useEffect(() => {
    if (!tripId) return;

    fetch(`${API_BASE_URL}/getRideById/${tripId}`)
      .then(res => res.json())
      .then(data => {
        setTrip(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching trip:", err);
        setLoading(false);
      });
  }, [tripId]);

  if (!tripId) {
    return (
      <AdminLayout>
        <div className="text-center">
          <h3>Invalid Trip ID</h3>
          <Button onClick={() => navigate("/dms/trip")} variant="primary">Go Back</Button>
        </div>
      </AdminLayout>
    );
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center mt-5">
          <Spinner animation="border" variant="primary" />
          <p>Loading trip details...</p>
        </div>
      </AdminLayout>
    );
  }

 const {
  id,
  riderId,
  driverId,
  rideTypeId,
  status,
  distance,
  scheduledTime,
  completedAt,
  cancelledAt,
  emergencyTriggeredAt,
  deletedAt,
  startLocation,
  endLocation,
  fare,
  paymentStatus,
  pickupTime,
  dropTime,
  createdAt,
  emergencyRide,
  Rider,
  Driver,
  RideType,
} = trip;

const source = encodeURIComponent(startLocation);
const destination = encodeURIComponent(endLocation);

return (
  <AdminLayout>
    <div className="trip-details-page container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Trip Details</h4>
        <Button className="edit-button" onClick={() => handlePermissionCheck("edit", () => navigate('/dms/trip/edit', {
          state: { trip }
        }))}>
          <FaEdit /> Edit
        </Button>
      </div>

      <Card className="p-4 mb-4 shadow-sm">
        <h4>Trip Information</h4>
        <hr />
        <div className="d-flex align-items-center justify-content-around text-center">
          <div className="d-flex flex-column align-items-center">
            <FaMapMarkerAlt className="text-success mb-2" size={24} />
            <span className="fw-bold">Pickup</span>
            <span className="text-muted">{startLocation}</span>
          </div>

          <div className="position-relative d-flex flex-column align-items-center">
            <FaMotorcycle className="text-primary" size={30} />
          </div>

          <div className="d-flex flex-column align-items-center">
            <FaMapMarkerAlt className="text-danger mb-2" size={24} />
            <span className="fw-bold">Drop-off</span>
            <span className="text-muted">{endLocation}</span>
          </div>
        </div>
        <hr />
        <p><strong>Trip ID:</strong> {id}</p>
        <p><strong>Status:</strong> {status}</p>
        <p><strong>Fare:</strong> ₹{fare}</p>
        <p><strong>Distance:</strong> {distance ? `${distance} km` : "N/A"}</p>
        <p><strong>Ride Type:</strong> {RideType?.name || rideTypeId || "N/A"}</p>
        <p><strong>Payment Status:</strong> {paymentStatus}</p>
        <p><strong>Scheduled Time:</strong> {scheduledTime ? new Date(scheduledTime).toLocaleString() : "N/A"}</p>
        <p><strong>Trip Time:</strong> {pickupTime || "N/A"} - {dropTime || "N/A"}</p>
        {completedAt && <p><strong>Completed At:</strong> {new Date(completedAt).toLocaleString()}</p>}
        {cancelledAt && <p><strong>Cancelled At:</strong> {new Date(cancelledAt).toLocaleString()}</p>}
        {emergencyTriggeredAt && <p><strong>Emergency Triggered At:</strong> {new Date(emergencyTriggeredAt).toLocaleString()}</p>}
        {deletedAt && <p><strong>Deleted At:</strong> {new Date(deletedAt).toLocaleString()}</p>}
        <p><strong>Emergency Ride:</strong> {emergencyRide ? "Yes" : "No"}</p>
        <p><strong>Created At:</strong> {new Date(createdAt).toLocaleString()}</p>
      </Card>

      <Row>
        <Col md={6}>
          <Card className="p-4 mb-4 shadow-sm">
            <h4>Rider Information</h4>
            <hr />
            <p><strong>Rider ID: </strong>
              <a href={`/rider/profile`} className="rider-id-link">
                {riderId}
              </a>
            </p>
            <p><strong>Active: </strong> {Rider?.isActive ? "Yes" : "No"}</p>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="p-4 mb-4 shadow-sm">
            <h4>Driver Information</h4>
            <hr />
            <p><strong>Driver ID: </strong>
              <a href={`/drivers/details/view`} className="rider-id-link">
                {driverId}
              </a>
            </p>
            <p><strong>Status: </strong> {Driver?.User?.status || "Unknown"}</p>
            <p><strong>Mobile: </strong> {Driver?.User?.mobile || "N/A"}</p>
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
}