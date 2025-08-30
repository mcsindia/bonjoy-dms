import React, {useState} from "react";
import { Container, Card, Row, Col, Image, Button, Modal, Form } from "react-bootstrap";
import { AdminLayout } from "../../../../layouts/dms/AdminLayout/AdminLayout";
import profile_img from '../../../../assets/images/profile.png';
import { FaMapMarkerAlt, FaMotorcycle } from "react-icons/fa";

export const SupportDetails = () => {
  // Dummy Data for Example
  const supportRequest = {
    id: 101,
    user_id: 1,
    user_type: "Rider",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone_number: "+91 9876543211",
    trip_id: "T123456",
    category: "Ride Issue",
    subject: "Driver took a wrong route",
    description: "The driver did not follow the suggested route, causing a delay in my ride.",
    attachments: ["https://lh3.googleusercontent.com/a/AGNmyxbL6bZLFSl8UVGLC4IFKmpOMFSZU6ifNbsWWGtj=s96-c"],
    priority: "High",
    status: "Open",
    assigned_to: "Nikhil",
    created_at: "2025-02-08 10:30 AM",
    updated_at: "2025-02-08 11:00 AM"
  };

  const driver = {
    name: "John Doe",
    mobile: "+91 9876543210",
    email: "john.doe@example.com",
    photo: profile_img,
    profileLink: "/dms/drivers/details/view",
  };

  const rider = {
    name: "Jane Smith",
    mobile: supportRequest.phone_number,
    email: supportRequest.email,
    photo: profile_img,
    profileLink: "/dms/rider/profile",
  };

  const trip = {
    trip_id: "TRIP001",
    source_location: "Shapura",
    destination_location: "Kolar",
    fare: "₹25",
    trip_status: "Ongoing",
    trip_date: "2024-12-19",
    trip_time: "10:00 AM",
    tripLink: "/dms/trip/details",
  };
   
  const [isToggled, setIsToggled] = useState(supportRequest.status === "Open"); // Set based on status
  const [showModal, setShowModal] = useState(false);
  const [remark, setRemark] = useState("");

  const handleToggleChange = () => {
    if (isToggled) {
      setShowModal(true); // Open modal when switching OFF
    } else {
      setIsToggled(true); // If switching back ON, update status
    }
  };

  const handleUpdateStatus = () => {
    if (remark.trim()) {
      setIsToggled(false); // Set status to Resolved (OFF)
      setShowModal(false); // Close modal
      setRemark(""); // Clear remark input
    }
  };

  return (
    <AdminLayout>
      <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Support Request Details</h2>
          
          {/* Toggle Switch */}
          <Form>
            <Form.Check
              type="switch"
              id="support-status-toggle"
              label={isToggled ? "Open" : "Resolved"}
              checked={isToggled}
              onChange={handleToggleChange}
            />
          </Form>
        </div>

        {/* Support Request Details */}
        <Card className="mb-3">
          <Card.Body>
            <h5>Support Request</h5>
            <Row>
              <Col md={6}>
                <p><strong>Category:</strong> {supportRequest.category}</p>
                <p><strong>Subject:</strong> {supportRequest.subject}</p>
                <p><strong>Priority:</strong> {supportRequest.priority}</p>
                <p><strong>Status:</strong> {isToggled ? "Open" : "Resolved"}</p>
                <p><strong>Description:</strong> {supportRequest.description}</p>
              </Col>
              <Col md={6}>
                <p><strong>Assigned To:</strong> {supportRequest.assigned_to}</p>
                <p><strong>Created At:</strong> {supportRequest.created_at}</p>
                <p><strong>Updated At:</strong> {supportRequest.updated_at}</p>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Modal for Remark Input */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Enter Remark to Resolve</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Remark</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Add a remark before resolving..."
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleUpdateStatus}>Confirm</Button>
          </Modal.Footer>
        </Modal>

        {/* Driver & Rider Details in Single Row */}
        <Card className="mb-3">
          <Card.Body>
            <Row>
              {/* Driver Details */}
              <Col md={6} className="text-left">
                <Image src={driver.photo} roundedCircle fluid className="support-profile-image" />
                <h5>Driver Details</h5>
                <p><strong>Name: </strong><a href={driver.profileLink} className="support-details-link">{driver.name}</a></p>
                <p><strong>Mobile:</strong> {driver.mobile}</p>
                <p><strong>Email:</strong> {driver.email}</p>
              </Col>

              {/* Rider Details */}
              <Col md={6} className="text-left">
                <Image src={rider.photo} roundedCircle fluid className="support-profile-image" />
                <h5>Rider Details</h5>
                <p><strong>Name:</strong> <a href={rider.profileLink} className="support-details-link">{rider.name}</a></p>
                <p><strong>Mobile:</strong> {rider.mobile}</p>
                <p><strong>Email:</strong> {rider.email}</p>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Trip Information Card */}
        <Card className="p-4 mb-4 shadow-sm">
          <h4>Trip Information</h4>
          <hr />
          <div className="d-flex align-items-center justify-content-around text-center">
            {/* Source Location */}
            <div className="d-flex flex-column align-items-center">
              <FaMapMarkerAlt className="text-success mb-2" size={24} />
              <span className="fw-bold">Pickup</span>
              <span className="text-muted">{trip.source_location}</span>
            </div>

            {/* Path with Motorcycle */}
            <div className="position-relative d-flex flex-column align-items-center">
              <FaMotorcycle className="text-primary" size={30} />
            </div>

            {/* Destination Location */}
            <div className="d-flex flex-column align-items-center">
              <FaMapMarkerAlt className="text-danger mb-2" size={24} />
              <span className="fw-bold">Drop-off</span>
              <span className="text-muted">{trip.destination_location}</span>
            </div>
          </div>
          <hr />
          <p><strong>Trip ID: </strong><a href={trip.tripLink} className="support-details-link">{trip.trip_id}</a></p>
          <p><strong>Fare:</strong> ₹{trip.fare}</p>
          <p><strong>Status:</strong> {trip.trip_status}</p>
          <p><strong>Trip Date & Time:</strong> {trip.trip_date}, {trip.trip_time}</p>
        </Card>
      </Container>
    </AdminLayout>
  );
};

export default SupportDetails;
