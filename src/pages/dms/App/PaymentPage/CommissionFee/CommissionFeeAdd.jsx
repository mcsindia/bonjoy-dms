import React, { useState } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";
import { useNavigate } from "react-router-dom";

export const CommissionFeeAdd = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    payment_date: "",
    trip_id: "",
    driver_name: "",
    total_commission: "",
    platform_fee: "",
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
    navigate("/dms/commissionfee");
  };

  return (
    <AdminLayout>
      <div className="dms-container">
        <h4>Add Commission Fee</h4>
        <div className="dms-form-container">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="dms-form-group" controlId="tripId">
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

            <Form.Group className="dms-form-group" controlId="totalCommission">
              <Form.Label>Total Commission Amount</Form.Label>
              <InputGroup>
                <Form.Control
                  type="number"
                  placeholder="Enter Commission Amount"
                  name="total_commission"
                  value={formData.total_commission}
                  onChange={handleChange}
                  required
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="dms-form-group" controlId="platformFee">
              <Form.Label>Platform Fee</Form.Label>
              <InputGroup>
                <Form.Control
                  type="number"
                  placeholder="Enter Platform Fee"
                  name="platform_fee"
                  value={formData.platform_fee}
                  onChange={handleChange}
                  required
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="dms-form-group" controlId="paymentDate">
              <Form.Label>Payment Date</Form.Label>
              <Form.Control
                type="date"
                name="payment_date"
                value={formData.payment_date}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <div className="save-and-cancel-btn">
              <Button type="submit">Save changes</Button>
              <Button type="cancel" className="ms-2" onClick={() => navigate("/dms/commissionfee")}>
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
};
