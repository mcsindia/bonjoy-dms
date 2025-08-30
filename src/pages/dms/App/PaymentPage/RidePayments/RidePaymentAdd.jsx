import React, { useState } from "react";
import { Form, Button, InputGroup} from "react-bootstrap";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";
import { useNavigate } from "react-router-dom";

export const RidePaymentAdd = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    trip_id: "",
    amount: "",
    payment_method: "",
    payment_status: "",
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

    // Redirect to PaymentList after submission (replace this with actual API logic)
    navigate("/dms/trippayment");
  };

  return (
    <AdminLayout>
      <div className="dms-container">
        <h4>Add Payment</h4>
        <div className="dms-form-container">
        <Form onSubmit={handleSubmit}>
          {/* Trip ID */}
          <Form.Group className="dms-form-group" controlId="tripId">
            <Form.Label>Trip ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter trip ID"
              name="trip_id"
              value={formData.trip_id}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Amount */}
          <Form.Group className="dms-form-group" controlId="amount">
            <Form.Label>Amount</Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                placeholder="Enter amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </InputGroup>
          </Form.Group>

          {/* Payment Method */}
          <Form.Group className="dms-form-group" controlId="paymentMethod">
            <Form.Label>Payment Method</Form.Label>
            <Form.Control
              as="select"
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
              required
            >
              <option value="">Select a method</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </Form.Control>
          </Form.Group>

          {/* Payment Status */}
          <Form.Group className="dms-form-group" controlId="paymentStatus">
            <Form.Label>Payment Status</Form.Label>
            <Form.Control
              as="select"
              name="payment_status"
              value={formData.payment_status}
              onChange={handleChange}
              required
            >
              <option value="">Select status</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </Form.Control>
          </Form.Group>

<div className="save-and-cancel-btn">
          {/* Submit Button */}
          <Button  type="submit">
            Save changes
          </Button>

          {/* Cancel Button */}
          <Button
            type="cancel"
            className="ms-2"
            onClick={() => navigate("/dms/trippayment")}
          >
            Cancel
          </Button>
          </div>
        </Form>
        </div>
      </div>
    </AdminLayout>
  );
};
