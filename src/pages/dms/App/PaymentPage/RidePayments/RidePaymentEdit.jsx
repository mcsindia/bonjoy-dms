import React, { useState } from "react";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";
import { Button, Form, Alert} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export const RidePaymentEdit = () => {
  const [paymentData, setPaymentData] = useState({
    payment_id: "PAY001",
    trip_id: "TRIP001",
    amount: "25.00",
    payment_method: "Credit Card",
    payment_status: "Completed",
  });
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentData({
      ...paymentData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate a save operation
    try {
      setShowSuccess(true);
      setShowError(false);
    } catch (error) {
      setShowError(true);
      setShowSuccess(false);
    }
  };

  return (
    <AdminLayout>
      <div className="dms-container">
          <h4>Edit Payment</h4>
          <div className="dms-form-container">
            {showSuccess && <Alert variant="success">Payment details updated successfully!</Alert>}
            {showError && <Alert variant="danger">Failed to update payment details. Please try again.</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="dms-form-group" controlId="paymentId">
                <Form.Label>Payment ID</Form.Label>
                <Form.Control
                  type="text"
                  name="payment_id"
                  value={paymentData.payment_id}
                  readOnly
                />
              </Form.Group>

              <Form.Group className="dms-form-group" controlId="tripId">
                <Form.Label>Trip ID</Form.Label>
                <Form.Control
                  type="text"
                  name="trip_id"
                  value={paymentData.trip_id}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="dms-form-group" controlId="amount">
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="amount"
                  value={paymentData.amount}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="dms-form-group" controlId="paymentMethod">
                <Form.Label>Payment Method</Form.Label>
                <Form.Select
                  name="payment_method"
                  value={paymentData.payment_method}
                  onChange={handleChange}
                >
                  <option>Credit Card</option>
                  <option>Cash</option>
                  <option>UPI</option>
                  <option>Bank Transfer</option>
                </Form.Select>
              </Form.Group>


              <Form.Group className="dms-form-group" controlId="paymentStatus">
                <Form.Label>Payment Status</Form.Label>
                <Form.Select
                  name="payment_status"
                  value={paymentData.payment_status}
                  onChange={handleChange}
                >
                  <option>Completed</option>
                  <option>Failed</option>
                  <option>Pending</option>
                </Form.Select>
              </Form.Group>

              <div className="save-and-cancel-btn">
                <Button type="submit">
                  Save Changes
                </Button>
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
