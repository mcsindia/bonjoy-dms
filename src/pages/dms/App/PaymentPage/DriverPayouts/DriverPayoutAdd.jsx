import React, { useState } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";
import { useNavigate } from "react-router-dom";

export const DriverPayoutAdd = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    payout_date: "",
    trip_id: "",
    driver_name: "",
    total_earnings: "",
    commission_deduction: "",
    payout_method: "",
    payout_status: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/dms/driverpayout");
  };

  return (
    <AdminLayout>
      <div className="dms-container">
        <h4>Add Driver Payout</h4>
        <div className="dms-form-container">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="dms-form-group" controlId="rideId">
              <Form.Label>Trip ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Ride ID"
                name="trip_id"
                value={formData.trip_id}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="dms-form-group" controlId="driverName">
              <Form.Label>Driver Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Driver Name"
                name="driver_name"
                value={formData.driver_name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="dms-form-group" controlId="totalEarnings">
              <Form.Label>Total Earnings</Form.Label>
              <InputGroup>
                <Form.Control
                  type="number"
                  placeholder="Enter Total Earnings"
                  name="total_earnings"
                  value={formData.total_earnings}
                  onChange={handleChange}
                  required
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="dms-form-group" controlId="commissionDeduction">
              <Form.Label>Commission Deduction</Form.Label>
              <InputGroup>
                <Form.Control
                  type="number"
                  placeholder="Enter Commission Deduction"
                  name="commission_deduction"
                  value={formData.commission_deduction}
                  onChange={handleChange}
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="dms-form-group" controlId="payoutMethod">
              <Form.Label>Payout Method</Form.Label>
              <Form.Control
                as="select"
                name="payout_method"
                value={formData.payout_method}
                onChange={handleChange}
                required
              >
                <option value="">Select Payout Method</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Wallet">Wallet</option>
                <option value="UPI">UPI</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="dms-form-group" controlId="payoutDate">
              <Form.Label>Payout Date</Form.Label>
              <Form.Control
                type="date"
                name="payout_date"
                value={formData.payout_date}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="dms-form-group" controlId="payoutStatus">
              <Form.Label>Payout Status</Form.Label>
              <Form.Control
                as="select"
                name="payout_status"
                value={formData.payout_status}
                onChange={handleChange}
                required
              >
                <option value="">Select Payout Status</option>
                <option value="Pending">Pending</option>
                <option value="Processed">Processed</option>
                <option value="Failed">Failed</option>
              </Form.Control>
            </Form.Group>

            <div className="save-and-cancel-btn">
              <Button type="submit">Add Payout</Button>
              <Button type="cancel" className="ms-2" onClick={() => navigate("/dms/driverpayout")}>
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
};
