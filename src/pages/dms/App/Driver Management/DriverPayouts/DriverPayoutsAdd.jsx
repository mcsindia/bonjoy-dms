import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';

export const DriverPayoutsAdd = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    driver_id: '',
    payout_amount: '',
    payment_method: '',
    transaction_id: '',
    payout_status: '',
    payout_date: '',
    notes: '',
    created_at: '',
    updated_at: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const requiredFields = ['driver_id', 'payout_amount', 'payment_method', 'payout_status', 'payout_date', 'created_at', 'updated_at'];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      setError(`Please fill out all required fields.`);
      return;
    }
    navigate('/dms/driver-payouts');
  };

  return (
    <AdminLayout>
      <div className='dms-container'>
        <h4>Add Driver Payout</h4>
        <div className='dms-form-container'>
          {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="dms-form-group">
              <Form.Label>Driver ID</Form.Label>
              <Form.Control type="text" name="driver_id" placeholder="Enter Driver ID" value={formData.driver_id} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Payout Amount</Form.Label>
              <Form.Control type="number" step="0.01" name="payout_amount" placeholder="₹" value={formData.payout_amount} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Payment Method</Form.Label>
              <Form.Select name="payment_method" value={formData.payment_method} onChange={handleChange} required>
                <option value="">Select Method</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="UPI">UPI</option>
                <option value="Wallet">Wallet</option>
                <option value="Cash">Cash</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Transaction ID</Form.Label>
              <Form.Control type="text" name="transaction_id" placeholder="Enter Transaction ID" value={formData.transaction_id} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Payout Status</Form.Label>
              <Form.Select name="payout_status" value={formData.payout_status} onChange={handleChange} required>
                <option value="">Select Status</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Completed">Completed</option>
                <option value="Failed">Failed</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Payout Date</Form.Label>
              <Form.Control type="datetime-local" name="payout_date" value={formData.payout_date} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Notes</Form.Label>
              <Form.Control as="textarea" rows={3} name="notes" placeholder="Optional notes" value={formData.notes} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Created At</Form.Label>
              <Form.Control type="datetime-local" name="created_at" value={formData.created_at} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Updated At</Form.Label>
              <Form.Control type="datetime-local" name="updated_at" value={formData.updated_at} onChange={handleChange} required />
            </Form.Group>

            <div className="save-and-cancel-btn">
              <Button type="submit" className="me-2">Save changes</Button>
              <Button type="cancel" onClick={() => navigate('/dms/drivers-payout')}>Cancel</Button>
            </div>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
};
