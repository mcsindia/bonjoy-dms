import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";

export const DriverPayoutEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract payout data passed from Driver Payouts page
  const { payout } = location.state || {};

  // Initialize state with the current payout data
  const [payoutDate, setPayoutDate] = useState(payout?.payoutDate || "");
  const [rideId, setRideId] = useState(payout?.rideId || "");
  const [driverName, setDriverName] = useState(payout?.driverName || "");
  const [totalEarnings, setTotalEarnings] = useState(payout?.totalEarnings || "");
  const [commissionDeduction, setCommissionDeduction] = useState(payout?.commissionDeduction || "");
  const [payoutMethod, setPayoutMethod] = useState(payout?.payoutMethod || "");
  const [payoutStatus, setPayoutStatus] = useState(payout?.payoutStatus || "");

  // Handle form submission (Update payout)
  const handleSubmit = (e) => {
    e.preventDefault();
    // Navigate back to the driver payouts list page after updating
    navigate("/dms/driverpayout");
  };

  return (
    <AdminLayout>
      <div className="dms-container">
        <h4>Edit Driver Payout</h4>
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

            {/* Driver Name */}
            <Form.Group controlId="driverName" className="dms-form-group">
              <Form.Label>Driver Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter driver name"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                required
              />
            </Form.Group>

            {/* Total Earnings */}
            <Form.Group controlId="totalEarnings" className="dms-form-group">
              <Form.Label>Total Earnings</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter total earnings"
                value={totalEarnings}
                onChange={(e) => setTotalEarnings(e.target.value)}
                required
              />
            </Form.Group>

            {/* Commission Deduction */}
            <Form.Group controlId="commissionDeduction" className="dms-form-group">
              <Form.Label>Commission Deduction</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter commission deduction"
                value={commissionDeduction}
                onChange={(e) => setCommissionDeduction(e.target.value)}
                required
              />
            </Form.Group>

            {/* Payout Method */}
            <Form.Group controlId="payoutMethod" className="dms-form-group">
              <Form.Label>Payout Method</Form.Label>
              <Form.Control
                as="select"
                value={payoutMethod}
                onChange={(e) => setPayoutMethod(e.target.value)}
                required
              >
                <option value="">Select payout method</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Wallet">Wallet</option>
                <option value="UPI">UPI</option>
              </Form.Control>
            </Form.Group>

             {/* Payout Date */}
             <Form.Group controlId="payoutDate" className="dms-form-group">
              <Form.Label>Payout Date</Form.Label>
              <Form.Control
                type="date"
                value={payoutDate}
                onChange={(e) => setPayoutDate(e.target.value)}
                required
              />
            </Form.Group>

            {/* Payout Status */}
            <Form.Group controlId="payoutStatus" className="dms-form-group">
              <Form.Label>Payout Status</Form.Label>
              <Form.Control
                as="select"
                value={payoutStatus}
                onChange={(e) => setPayoutStatus(e.target.value)}
                required
              >
                <option value="">Select status</option>
                <option value="Pending">Pending</option>
                <option value="Processed">Processed</option>
                <option value="Failed">Failed</option>
              </Form.Control>
            </Form.Group>

            {/* Buttons */}
            <div className="save-and-cancel-btn">
              <Button type="submit" className="me-2">
                Save Changes
              </Button>
              <Button type="cancel" className="ms-2" onClick={() => navigate("/dms/driverpayout")}>Cancel</Button>
            </div>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
};
