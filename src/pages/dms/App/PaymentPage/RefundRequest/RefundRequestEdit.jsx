import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";

export const RefundRequestEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract refund request data passed from Refund Request List page
  const { refund } = location.state || {};

  // Initialize state with the current refund request data
  const [refundDate, setRefundDate] = useState(refund?.refundDate || "");
  const [rideId, setRideId] = useState(refund?.rideId || "");
  const [userName, setUserName] = useState(refund?.userName || "");
  const [refundAmount, setRefundAmount] = useState(refund?.refundAmount || "");
  const [refundReason, setRefundReason] = useState(refund?.refundReason || "");
  const [paymentMethod, setPaymentMethod] = useState(refund?.paymentMethod || "");
  const [refundStatus, setRefundStatus] = useState(refund?.refundStatus || "");

  // Handle form submission (Update refund request)
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated refund request:", { refundDate, rideId, userName, refundAmount, refundReason, paymentMethod, refundStatus });

    // Navigate back to the refund request list page after updating
    navigate("/dms/refundrequest");
  };

  return (
    <AdminLayout>
      <div className="dms-container">
        <h4>Edit Refund Request</h4>
        <div className="dms-form-container">
          <Form onSubmit={handleSubmit}>
            {/* Ride ID */}
            <Form.Group controlId="rideId" className="dms-form-group">
              <Form.Label>Trip ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter ride ID"
                value={rideId}
                onChange={(e) => setRideId(e.target.value)}
                required
              />
            </Form.Group>

            {/* User Name */}
            <Form.Group controlId="userName" className="dms-form-group">
              <Form.Label>User Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter user name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </Form.Group>

            {/* Refund Amount */}
            <Form.Group controlId="refundAmount" className="dms-form-group">
              <Form.Label>Refund Amount</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter refund amount"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                required
              />
            </Form.Group>

            {/* Reason for Refund */}
            <Form.Group controlId="refundReason" className="dms-form-group">
              <Form.Label>Reason for Refund</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter refund reason"
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                required
              />
            </Form.Group>

            {/* Payment Method */}
            <Form.Group controlId="paymentMethod" className="dms-form-group">
              <Form.Label>Payment Method</Form.Label>
              <Form.Control
                as="select"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                required
              >
                <option value="">Select payment method</option>
                <option value="Card">Card</option>
                <option value="UPI">UPI</option>
                <option value="Wallet">Wallet</option>
              </Form.Control>
            </Form.Group>

            {/* Refund Request Date */}
            <Form.Group controlId="refundDate" className="dms-form-group">
              <Form.Label>Refund Request Date</Form.Label>
              <Form.Control
                type="date"
                value={refundDate}
                onChange={(e) => setRefundDate(e.target.value)}
                required
              />
            </Form.Group>

            {/* Refund Status */}
            <Form.Group controlId="refundStatus" className="dms-form-group">
              <Form.Label>Refund Status</Form.Label>
              <Form.Control
                as="select"
                value={refundStatus}
                onChange={(e) => setRefundStatus(e.target.value)}
                required
              >
                <option value="">Select status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Processed">Processed</option>
              </Form.Control>
            </Form.Group>

            {/* Buttons */}
            <div className="save-and-cancel-btn">
              <Button type="submit" className="me-2">
                Save Changes
              </Button>
              <Button type="cancel" className="ms-2" onClick={() => navigate("/dms/refundrequest")}>Cancel</Button>
            </div>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
};