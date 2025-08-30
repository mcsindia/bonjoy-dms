import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";

export const CommissionFeeEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract commission fee data passed from the Commission Fee List page
  const { commission } = location.state || {};

  // Initialize state with the current commission fee data
  const [paymentDate, setPaymentDate] = useState(commission?.paymentDate || "");
  const [rideId, setRideId] = useState(commission?.rideId || "");
  const [driverName, setDriverName] = useState(commission?.driverName || "");
  const [totalCommission, setTotalCommission] = useState(commission?.totalCommission || "");
  const [platformFee, setPlatformFee] = useState(commission?.platformFee || "");

  // Handle form submission (Update commission fee record)
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated commission fee record:", { paymentDate, rideId, driverName, totalCommission, platformFee });

    // Navigate back to the commission fee list page after updating
    navigate("/dms/commissionfee");
  };

  return (
    <AdminLayout>
      <div className="dms-container">
        <h4>Edit Commission Fee</h4>
        <div className="dms-form-container">
          <Form onSubmit={handleSubmit}>
            {/* Ride ID */}
            <Form.Group controlId="rideId" className="dms-form-group">
              <Form.Label>Trip ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Ride ID"
                value={rideId}
                onChange={(e) => setRideId(e.target.value)}
                required
              />
            </Form.Group>

            {/* Driver Name */}
            <Form.Group controlId="driverName" className="dms-form-group">
              <Form.Label>Driver Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Driver Name"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                required
              />
            </Form.Group>

            {/* Total Commission Amount */}
            <Form.Group controlId="totalCommission" className="dms-form-group">
              <Form.Label>Total Commission Amount</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Total Commission Amount"
                value={totalCommission}
                onChange={(e) => setTotalCommission(e.target.value)}
                required
              />
            </Form.Group>

            {/* Platform Fee */}
            <Form.Group controlId="platformFee" className="dms-form-group">
              <Form.Label>Platform Fee</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Platform Fee"
                value={platformFee}
                onChange={(e) => setPlatformFee(e.target.value)}
                required
              />
            </Form.Group>

            {/* Payment Date */}
            <Form.Group controlId="paymentDate" className="dms-form-group">
              <Form.Label>Payment Date</Form.Label>
              <Form.Control
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                required
              />
            </Form.Group>

            {/* Buttons */}
            <div className="save-and-cancel-btn">
              <Button type="submit" className="me-2">
                Save Changes
              </Button>
              <Button type="cancel" className="ms-2" onClick={() => navigate("/dms/commissionfee")}>Cancel</Button>
            </div>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
};