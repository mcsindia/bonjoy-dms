import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";

export const PendingPayoutEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract payout data passed from Pending Payouts page
  const { payout } = location.state || {};

  // Initialize state with the current payout data
  const [pendingFor, setPendingFor] = useState(payout?.pendingFor || "");
  const [name, setName] = useState(payout?.name || "");
  const [profileId, setProfileId] = useState(payout?.profileId || "");
  const [pendingAmount, setPendingAmount] = useState(payout?.pendingAmount || "");
  const [status, setStatus] = useState(payout?.status || "");
  const [dateTime, setDateTime] = useState(payout?.dateTime || "");

  // Handle form submission (Update payout)
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated payout:", { pendingFor, name, profileId, pendingAmount, status, dateTime });

    // Navigate back to the pending payouts list page after updating
    navigate("/dms/pendingpayments");
  };

  return (
    <AdminLayout>
      <div className="dms-container">
        <h4>Edit Pending Payout</h4>
        <div className="dms-form-container">
          <Form onSubmit={handleSubmit}>
            {/* Pending For */}
            <Form.Group controlId="pendingFor" className="dms-form-group">
              <Form.Label>Pending For</Form.Label>
              <Form.Control
                as="select"
                value={pendingFor}
                onChange={(e) => setPendingFor(e.target.value)}
                required
              >
                <option value="">Select</option>
                <option value="Rider">Rider</option>
                <option value="Driver">Driver</option>
              </Form.Control>
            </Form.Group>

            {/* Name */}
            <Form.Group controlId="name" className="dms-form-group">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

            {/* Profile ID */}
            <Form.Group controlId="profileId" className="dms-form-group">
              <Form.Label>Profile ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter profile ID"
                value={profileId}
                onChange={(e) => setProfileId(e.target.value)}
                required
              />
            </Form.Group>

            {/* Pending Amount */}
            <Form.Group controlId="pendingAmount" className="dms-form-group">
              <Form.Label>Pending Amount</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter pending amount"
                value={pendingAmount}
                onChange={(e) => setPendingAmount(e.target.value)}
                required
              />
            </Form.Group>

            {/* Status */}
            <Form.Group controlId="status" className="dms-form-group">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="">Select status</option>
                <option value="Payment Pending">Payment Pending</option>
                <option value="Failed Transaction">Failed Transaction</option>
                <option value="Awaiting Confirmation">Awaiting Confirmation</option>
              </Form.Control>
            </Form.Group>

            {/* Date & Time */}
            <Form.Group controlId="dateTime" className="dms-form-group">
              <Form.Label>Date & Time</Form.Label>
              <Form.Control
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                required
              />
            </Form.Group>

            {/* Buttons */}
            <div className="save-and-cancel-btn">
              <Button type="submit" className="me-2">
                Save Changes
              </Button>
              <Button type="cancel" className="ms-2" onClick={() => navigate("/dms/pendingpayments")}>Cancel</Button>
            </div>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
};
