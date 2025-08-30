import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';

export const PaymentRefundIssueAdd = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    trip_id: '',
    rider_id: '',
    driver_id: '',
    issue_type: '',
    reported_at: '',
    refund_amount: '',
    payment_method: '',
    issue_description: '',
    support_status: 'Pending',
    resolved_at: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.trip_id || !formData.rider_id || !formData.issue_type || !formData.reported_at || !formData.refund_amount || !formData.payment_method || !formData.issue_description) {
      setError('All required fields must be filled.');
      return;
    }
    console.log('Payment Refund Issue Added:', formData);
    navigate('/dms/refund-issues');
  };

  return (
    <AdminLayout>
      <div className='dms-container'>
        <h4>Add New Payment Refund Issue</h4>
        <div className='dms-form-container'>
          {error && <Alert variant='danger' onClose={() => setError('')} dismissible>{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className='dms-form-group'>
              <Form.Label>Trip ID</Form.Label>
              <Form.Control type='text' name='trip_id' placeholder='Enter Trip ID' value={formData.trip_id} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className='dms-form-group'>
              <Form.Label>Rider ID</Form.Label>
              <Form.Control type='text' name='rider_id' placeholder='Enter Rider ID' value={formData.rider_id} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className='dms-form-group'>
              <Form.Label>Driver ID (Optional)</Form.Label>
              <Form.Control type='text' name='driver_id' placeholder='Enter Driver ID' value={formData.driver_id} onChange={handleChange} />
            </Form.Group>

            <Form.Group className='dms-form-group'>
              <Form.Label>Issue Type</Form.Label>
              <Form.Control type='text' name='issue_type' placeholder='Enter Issue Type' value={formData.issue_type} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className='dms-form-group'>
              <Form.Label>Reported At</Form.Label>
              <Form.Control type='datetime-local' name='reported_at' value={formData.reported_at} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className='dms-form-group'>
              <Form.Label>Refund Amount</Form.Label>
              <Form.Control type='number' step='0.01' name='refund_amount' placeholder='Enter Refund Amount' value={formData.refund_amount} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className='dms-form-group'>
              <Form.Label>Payment Method</Form.Label>
              <Form.Control type='text' name='payment_method' placeholder='Enter Payment Method' value={formData.payment_method} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className='dms-form-group'>
              <Form.Label>Issue Description</Form.Label>
              <Form.Control as='textarea' rows={3} name='issue_description' placeholder='Describe the issue' value={formData.issue_description} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className='dms-form-group'>
              <Form.Label>Support Status</Form.Label>
              <Form.Select name='support_status' value={formData.support_status} onChange={handleChange} required>
                <option value='Pending'>Pending</option>
                <option value='Resolved'>Resolved</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className='dms-form-group'>
              <Form.Label>Resolved At (Optional)</Form.Label>
              <Form.Control type='datetime-local' name='resolved_at' value={formData.resolved_at} onChange={handleChange} />
            </Form.Group>

            <div className='save-and-cancel-btn'>
              <Button type='submit' className='me-2'>Save changes</Button>
              <Button type='cancel' onClick={() => navigate('/dms/refund-payment-issue')}>Cancel</Button>
            </div>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
};
