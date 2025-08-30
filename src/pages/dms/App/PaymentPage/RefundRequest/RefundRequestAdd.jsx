import React, { useState } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";
import { useNavigate } from "react-router-dom";

export const RefundRequestAdd = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    refund_request_date: "",
    trip_id: "",
    user_name: "",
    refund_amount: "",
    reason_for_refund: "",
    payment_method: "",
    refund_status: "",
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
    console.log("Form submitted:", formData);
    navigate("/dms/refundrequest");
  };

  return (
    <AdminLayout>
      <div className="dms-container">
        <h4>Add Refund Request</h4>
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

            <Form.Group className="dms-form-group" controlId="userName">
              <Form.Label>User Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter User Name"
                name="user_name"
                value={formData.user_name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="dms-form-group" controlId="refundAmount">
              <Form.Label>Refund Amount</Form.Label>
              <InputGroup>
                <Form.Control
                  type="number"
                  placeholder="Enter Refund Amount"
                  name="refund_amount"
                  value={formData.refund_amount}
                  onChange={handleChange}
                  required
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="dms-form-group" controlId="reasonForRefund">
              <Form.Label>Reason for Refund</Form.Label>
              <Form.Control
                as="select"
                name="reason_for_refund"
                value={formData.reason_for_refund}
                onChange={handleChange}
                required
              >
                <option value="">Select Reason</option>
                <option value="Overcharged">Overcharged</option>
                <option value="Canceled Ride">Canceled Ride</option>
                <option value="Payment Error">Payment Error</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="dms-form-group" controlId="paymentMethod">
              <Form.Label>Payment Method</Form.Label>
              <Form.Control
                as="select"
                name="payment_method"
                value={formData.payment_method}
                onChange={handleChange}
                required
              >
                <option value="">Select Payment Method</option>
                <option value="Card">Card</option>
                <option value="UPI">UPI</option>
                <option value="Wallet">Wallet</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="dms-form-group" controlId="refundStatus">
              <Form.Label>Refund Status</Form.Label>
              <Form.Control
                as="select"
                name="refund_status"
                value={formData.refund_status}
                onChange={handleChange}
                required
              >
                <option value="">Select Refund Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Processed">Processed</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="dms-form-group" controlId="refundRequestDate">
              <Form.Label>Refund Request Date</Form.Label>
              <Form.Control
                type="date"
                name="refund_request_date"
                value={formData.refund_request_date}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <div className="save-and-cancel-btn">
              <Button type="submit">Submit Request</Button>
              <Button type="cancel" className="ms-2" onClick={() => navigate("/dms/refundrequest")}>
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
};
