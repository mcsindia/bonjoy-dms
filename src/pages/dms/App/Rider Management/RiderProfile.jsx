import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Table, Row, Col } from "react-bootstrap";
import { AdminLayout } from "../../../../layouts/dms/AdminLayout/AdminLayout";
import axios from "axios";
import rider_profile_img from "../../../../assets/images/profile.png";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

export const RiderProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const rider = location.state?.rider || {};
  const [riderProfile, setRiderProfile] = useState(null);
  const [riderContacts, setRiderContacts] = useState([]);
  const walletAmt = 100;

  useEffect(() => {
    const riderId = rider?.id || rider?.userId;
    if (!riderId) return;

    const token = JSON.parse(localStorage.getItem("userData"))?.token;

    const fetchRiderProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/getRiderProfileById/${riderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setRiderProfile(res.data.data.results[0]);
          setRiderContacts(res.data.data.userContact || []);
  
        }
      } catch (err) {
        console.error("Error fetching rider profile:", err);
      }
    };

    fetchRiderProfile();
  }, [rider?.id]);

  const displayRider = riderProfile || rider;
  const contacts = displayRider?.userContact || [];

  return (
    <AdminLayout>
      <div className="rider-profile-page container mt-4">

        {/* Rider Core Info Card */}
        <Card className="mb-4">
          <Card.Body className="d-flex align-items-center m-4 card-body-custom">
            <a
              href={displayRider?.profileImage ? `${IMAGE_BASE_URL}${displayRider.profileImage}` : rider_profile_img}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={displayRider?.profileImage ? `${IMAGE_BASE_URL}${displayRider.profileImage}` : rider_profile_img}
                alt={`${displayRider?.fullName || "Rider"}'s Profile`}
                className="rounded-circle border profile-img"
                style={{ width: "120px", height: "120px", objectFit: "cover" }}
                onError={(e) => { e.target.onerror = null; e.target.src = rider_profile_img; }}
              />
            </a>
            <div className="ms-4">
              <h2>{displayRider?.fullName || "N/A"}</h2>
              <p><strong>Phone:</strong> {displayRider?.User?.mobile || "N/A"}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={`badge ${displayRider?.User?.status === "Active" ? "bg-success" : "bg-secondary"}`}>
                  {displayRider?.User?.status || "Inactive"}
                </span>
              </p>
              <p><strong>User ID:</strong> {displayRider?.User?.id || displayRider?.userId || "N/A"}</p>
            </div>
          </Card.Body>
        </Card>

        {/* Rider Info Card */}
        <Card className="mb-4">
          <Card.Header><h4>Rider Info</h4></Card.Header>
          <Card.Body>
            <Row className="mb-2">
              <Col md={4}><strong>Gender:</strong> {displayRider?.gender || "N/A"}</Col>
              <Col md={4}><strong>City:</strong> {displayRider?.city || "N/A"}</Col>
              <Col md={4}><strong>Date of Birth:</strong> {displayRider?.date_of_birth || "N/A"}</Col>
            </Row>
            <Row className="mb-2">
              <Col md={4}><strong>Wallet Balance:</strong> ₹{displayRider?.wallet || walletAmt}</Col>
              <Col md={4}><strong>Preferred Payment Method:</strong> {displayRider?.preferredPaymentMethod || "N/A"}</Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Contact Details Card */}
        <Card className="mb-4">
          <Card.Header><h4>Contact Details</h4></Card.Header>
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>S No</th>
                  <th>Contact Type</th>
                  <th>Contact Name</th>
                  <th>Contact Number</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                </tr>
              </thead>
              <tbody>
                {riderContacts.length > 0 ? (
                  riderContacts.map((contact, index) => (
                    <tr key={contact.id}>
                      <td>{index + 1}</td>
                      <td className="text-capitalize">{contact.relationship || "N/A"}</td>
                      <td>{contact.contactName || "N/A"}</td>
                      <td>{contact.contactNumber || "N/A"}</td>
                      <td>{new Date(contact.createdAt).toLocaleString()}</td>
                      <td>{new Date(contact.updatedAt).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center">No contact details found.</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

      </div>
    </AdminLayout>
  );
};
