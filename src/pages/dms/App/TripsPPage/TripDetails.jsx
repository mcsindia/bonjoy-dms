import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Row, Col, Image, Spinner } from "react-bootstrap";
import { FaMotorcycle, FaMapMarkerAlt, FaEdit } from "react-icons/fa";
import { AdminLayout } from "../../../../layouts/dms/AdminLayout/AdminLayout";
import axios from "axios";
import { getModuleId, getToken } from "../../../../utils/authhelper";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

export const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchTrip = async () => {
      setLoading(true);
      try {
        const token = getToken(); // 🔹 Use token helper
        const moduleId = getModuleId("trip"); // 🔹 dynamic module_id

        const response = await axios.get(`${API_BASE_URL}/getRideById/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { module_id: moduleId }, // 🔹 pass module_id
        });

        setTrip(response.data);
      } catch (error) {
        console.error("Error fetching trip:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [id]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      </AdminLayout>
    );
  }

  if (!trip) {
    return (
      <AdminLayout>
        <div className="text-center">
          <h3>Trip Not Found</h3>
          <Button onClick={() => navigate("/dms/trip")} variant="primary">
            Go Back
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const {
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
    rider_user_id,
    driver_user_id,
  } = trip;

  const source = encodeURIComponent(pickup_address || "");
  const destination = encodeURIComponent(drop_address || "");

  return (
    <AdminLayout>
      <div className="trip-details-page container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Trip Details</h4>
          {permissions.includes("edit") && (
            <Button
              className="edit-button"
              onClick={() => navigate("/dms/trip/edit", { state: { trip } })}
            >
              <FaEdit /> Edit
            </Button>
          )}
        </div>

        {/* Trip Info */}
        <Card className="p-4 mb-4 shadow-sm">
          <h4>Trip Information</h4>
          <hr />
          <Row>
            <Col md={6}><p><strong>Status:</strong> {status}</p></Col>
            <Col md={6}><p><strong>Fare:</strong> ₹{fare}</p></Col>
          </Row>
          <Row>
            <Col md={6}><p><strong>Distance:</strong> {distance} km</p></Col>
            <Col md={6}><p><strong>Ride Type:</strong> {ride_type}</p></Col>
          </Row>
          <Row>
            <Col md={6}><p><strong>Emergency:</strong> {emergency_ride ? "Yes" : "No"}</p></Col>
            <Col md={6}><p><strong>Payment:</strong> {payment_status}</p></Col>
          </Row>
          <Row>
            <Col md={6}><p><strong>Pickup:</strong> {pickup_address}</p></Col>
            <Col md={6}><p><strong>Drop:</strong> {drop_address}</p></Col>
          </Row>
          <Row>
            <Col md={6}><p><strong>Scheduled:</strong> {scheduled_time}</p></Col>
            <Col md={6}><p><strong>Pickup Time:</strong> {pickup_time}</p></Col>
          </Row>
          <Row>
            <Col md={6}><p><strong>Drop Time:</strong> {drop_time}</p></Col>
            <Col md={6}><p><strong>Completed At:</strong> {completed_at}</p></Col>
          </Row>
          <Row>
            <Col md={6}><p><strong>Cancelled At:</strong> {cancelled_at}</p></Col>
            <Col md={6}><p><strong>Emergency Triggered:</strong> {emergency_triggeredAt}</p></Col>
          </Row>
          <Row>
            <Col md={12}><p><strong>Created At:</strong> {new Date(createdAt).toLocaleString()}</p></Col>
          </Row>
        </Card>

        {/* Rider Info */}
        <Row>
          <Col md={6}>
            <Card className="p-4 mb-4 shadow-sm">
              <h4>Rider Information</h4>
              <hr />
              <Row className="align-items-center">
                <Col xs={4} className="text-center">
                  <Image
                    src={IMAGE_BASE_URL + rider_profile_image}
                    alt="Rider"
                    roundedCircle
                    width={80}
                    height={80}
                  />
                </Col>
                <Col xs={8}>
                  <p><strong>Name:</strong> {rider_name}</p>
                  <p><strong>User ID:</strong> {rider_user_id}</p>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="p-4 mb-4 shadow-sm">
              <h4>Driver Information</h4>
              <hr />
              <Row className="align-items-center">
                <Col xs={4} className="text-center">
                  <Image
                    src={IMAGE_BASE_URL + driver_profile_image}
                    alt="Driver"
                    roundedCircle
                    width={80}
                    height={80}
                  />
                </Col>
                <Col xs={8}>
                  <p><strong>Name:</strong> {driver_name}</p>
                  <p><strong>User ID:</strong> {driver_user_id}</p>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        {/* Trip Map */}
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
