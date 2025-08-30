import React, { useState } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";
import { useNavigate } from "react-router-dom";

export const PendingPayoutAdd = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    pendingFor: "", 
    name: "",
    profileId: "",
    pendingAmount: "",
    status: "",
    dateTime: "",
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
    navigate("/dms/pendingpayments");
  };

  return (
    <AdminLayout>
      <div className="dms-container">
        <h4>Add Pending Payout</h4>
        <div className="dms-form-container">
          <Form onSubmit={handleSubmit}>
            {/* Pending For (Rider/Driver) */}
            <Form.Group className="dms-form-group" controlId="pendingFor">
              <Form.Label>Pending For</Form.Label>
              <Form.Control
                as="select"
                name="pendingFor"
                value={formData.pendingFor}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="Rider">Rider</option>
                <option value="Driver">Driver</option>
              </Form.Control>
            </Form.Group>

            {/* Name */}
            <Form.Group className="dms-form-group" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Profile ID */}
            <Form.Group className="dms-form-group" controlId="profileId">
              <Form.Label>Profile ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter profile ID"
                name="profileId"
                value={formData.profileId}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Pending Amount */}
            <Form.Group className="dms-form-group" controlId="pendingAmount">
              <Form.Label>Pending Amount</Form.Label>
              <InputGroup>
                <InputGroup.Text>₹</InputGroup.Text>
                <Form.Control
                  type="number"
                  placeholder="Enter pending amount"
                  name="pendingAmount"
                  value={formData.pendingAmount}
                  onChange={handleChange}
                  required
                />
              </InputGroup>
            </Form.Group>

            {/* Status */}
            <Form.Group className="dms-form-group" controlId="status">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="">Select status</option>
                <option value="Payment Pending">Payment Pending</option>
                <option value="Failed Transaction">Failed Transaction</option>
                <option value="Awaiting Confirmation">Awaiting Confirmation</option>
              </Form.Control>
            </Form.Group>

            {/* Date & Time */}
            <Form.Group className="dms-form-group" controlId="dateTime">
              <Form.Label>Date & Time</Form.Label>
              <Form.Control
                type="datetime-local"
                name="dateTime"
                value={formData.dateTime}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Submit & Cancel Buttons */}
            <div className="save-and-cancel-btn">
              <Button type="submit">Save changes</Button>
              <Button type="cancel" className="ms-2" onClick={() => navigate("/dms/pendingpayments")}>
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
};
