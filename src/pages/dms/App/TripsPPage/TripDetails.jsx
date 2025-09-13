import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, Row, Col, Image } from "react-bootstrap";
import { FaMotorcycle, FaMapMarkerAlt, FaEdit } from "react-icons/fa";
import { AdminLayout } from "../../../../layouts/dms/AdminLayout/AdminLayout";

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

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

  const handlePermissionCheck = (permissionType, action, fallbackMessage = null) => {
    if (permissions.includes(permissionType)) {
      action();
    } else {
      alert(fallbackMessage || `You don't have permission to ${permissionType} this trip.`);
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

  // ✅ Correct fields from API
  const {
    id,
    rider_name,
    rider_profile_image,
    driver_name,
    driver_profile_image,
    ride_type,
    status,
    fare,
    distance,
    emergency_ride,
    payment_status,
    pickup_address,
    drop_address,
    scheduled_time,
    pickup_time,
    drop_time,
    completed_at,
    cancelled_at,
    emergency_triggeredAt,
    createdAt,
  } = trip;

  const source = encodeURIComponent(pickup_address);
  const destination = encodeURIComponent(drop_address);

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
              <span className="text-muted">{pickup_address}</span>
            </div>

            <div className="position-relative d-flex flex-column align-items-center">
              <FaMotorcycle className="text-primary" size={30} />
            </div>

            <div className="d-flex flex-column align-items-center">
              <FaMapMarkerAlt className="text-danger mb-2" size={24} />
              <span className="fw-bold">Drop-off</span>
              <span className="text-muted">{drop_address}</span>
            </div>
          </div>

          <hr />

          {/* Trip Info Grid */}
          <Row className="mb-2">
            <Col md={6}><p><strong>Trip ID:</strong> {id}</p></Col>
            <Col md={6}><p><strong>Status:</strong> {status}</p></Col>
          </Row>
          <Row className="mb-2">
            <Col md={6}><p><strong>Fare:</strong> ₹{fare}</p></Col>
            <Col md={6}><p><strong>Distance:</strong> {distance || "N/A"} km</p></Col>
          </Row>
          <Row className="mb-2">
            <Col md={6}><p><strong>Ride Type:</strong> {ride_type}</p></Col>
            <Col md={6}><p><strong>Emergency:</strong> {emergency_ride ? "Yes" : "No"}</p></Col>
          </Row>
          <Row className="mb-2">
            <Col md={6}><p><strong>Payment Status:</strong> {payment_status || "N/A"}</p></Col>
            <Col md={6}><p><strong>Scheduled Time:</strong> {scheduled_time || "N/A"}</p></Col>
          </Row>
          <Row className="mb-2">
            <Col md={6}><p><strong>Pickup Time:</strong> {pickup_time || "N/A"}</p></Col>
            <Col md={6}><p><strong>Drop Time:</strong> {drop_time || "N/A"}</p></Col>
          </Row>
          <Row className="mb-2">
            <Col md={6}><p><strong>Completed At:</strong> {completed_at || "N/A"}</p></Col>
            <Col md={6}><p><strong>Cancelled At:</strong> {cancelled_at || "N/A"}</p></Col>
          </Row>
          <Row className="mb-2">
            <Col md={6}><p><strong>Emergency Triggered At:</strong> {emergency_triggeredAt || "N/A"}</p></Col>
            <Col md={6}><p><strong>Created At:</strong> {new Date(createdAt).toLocaleString()}</p></Col>
          </Row>
        </Card>

        <Row>
          <Col md={6}>
            <Card className="p-4 mb-4 shadow-sm">
              <h4>Rider Information</h4>
              <hr />
              <Row className="align-items-center">
                {/* Image Left */}
                <Col xs={4} className="text-center">
                  <Image
                    src={IMAGE_BASE_URL + rider_profile_image}
                    alt="Rider"
                    roundedCircle
                    width={80}
                    height={80}
                  />
                </Col>

                {/* Info Right */}
                <Col xs={8}>
                  <p><strong>Name:</strong> {rider_name}</p>
                  <p><strong>User ID:</strong> {trip.rider_user_id}</p>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="p-4 mb-4 shadow-sm">
              <h4>Driver Information</h4>
              <hr />
              <Row className="align-items-center">
                {/* Image Left */}
                <Col xs={4} className="text-center">
                  <Image
                    src={IMAGE_BASE_URL + driver_profile_image}
                    alt="Driver"
                    roundedCircle
                    width={80}
                    height={80}
                  />
                </Col>

                {/* Info Right */}
                <Col xs={8}>
                  <p><strong>Name:</strong> {driver_name}</p>
                  <p><strong>User ID:</strong> {trip.driver_user_id}</p>
                </Col>
              </Row>
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
