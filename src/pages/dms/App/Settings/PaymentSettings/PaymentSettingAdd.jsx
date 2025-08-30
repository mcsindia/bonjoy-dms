import React, { useState } from 'react';
import { Button, Form, Container } from 'react-bootstrap';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';
import { useNavigate } from 'react-router-dom';

export const PaymentSettingAdd = () => {
  const [payment, setPayment] = useState({
    name: '',
    status: ''
  });

  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayment({ ...payment, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Payment method added:', payment);
    // You can call an API or save the data here
    navigate('/dms/payment/settings'); // Redirect to Payment Settings List after adding
  };

  return (
    <AdminLayout>
      <Container className='dms-container'>
        <h3>Add New Payment Method</h3>
        <div className='dms-form-container'>
          <Form onSubmit={handleSubmit}>
            <Form.Group className='dms-form-group' controlId="name">
              <Form.Label>Payment Method Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={payment.name}
                onChange={handleChange}
                placeholder="Enter payment method name"
                required
              />
            </Form.Group>

            <Form.Group className='dms-form-group' controlId="status">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={payment.status}
                onChange={handleChange}
                required
              >
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Form.Select>
            </Form.Group>

            <div className='save-and-cancel-btn'>
              <Button type="submit">
                Save changes
              </Button>
              <Button
                type='cancel'
                className="ms-3"
                onClick={() => navigate('/dms/payment/settings')}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      </Container>
    </AdminLayout>
  );
};
