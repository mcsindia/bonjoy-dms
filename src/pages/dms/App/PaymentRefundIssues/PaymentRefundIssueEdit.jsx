import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';

export const PaymentRefundIssueEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract issue data passed from Refund Issues List page
  const { issue } = location.state || {};

  // Initialize state with the current refund issue data
  const [formData, setFormData] = useState({
    trip_id: issue?.trip_id || '',
    rider_id: issue?.rider_id || '',
    driver_id: issue?.driver_id || '',
    issue_type: issue?.issue_type || '',
    reported_at: issue?.reported_at || '',
    refund_amount: issue?.refund_amount || '',
    payment_method: issue?.payment_method || '',
    issue_description: issue?.issue_description || '',
    support_status: issue?.support_status || 'Pending',
    resolved_at: issue?.resolved_at || '',
  });

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Updated Refund Issue:', formData);
    navigate('/dms/refund-payment-issue'); // Redirect back to Refund Issues List
  };

  return (
    <AdminLayout>
      <div className='dms-container'>
        <h4>Edit Payment Refund Issue</h4>
        <div className='dms-form-container'>
          <Form onSubmit={handleSubmit}>
            <Form.Group className='dms-form-group'>
              <Form.Label>Trip ID</Form.Label>
              <Form.Control type='text' name='trip_id' value={formData.trip_id} onChange={handleChange} required disabled />
            </Form.Group>

            <Form.Group className='dms-form-group'>
              <Form.Label>Rider ID</Form.Label>
              <Form.Control type='text' name='rider_id' value={formData.rider_id} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className='dms-form-group'>
              <Form.Label>Driver ID</Form.Label>
              <Form.Control type='text' name='driver_id' value={formData.driver_id} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className='dms-form-group'>
              <Form.Label>Issue Type</Form.Label>
              <Form.Control type='text' name='issue_type' value={formData.issue_type} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className='dms-form-group'>
              <Form.Label>Reported At</Form.Label>
              <Form.Control type='datetime-local' name='reported_at' value={formData.reported_at} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className='dms-form-group'>
              <Form.Label>Refund Amount</Form.Label>
              <Form.Control type='number' name='refund_amount' value={formData.refund_amount} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className='dms-form-group'>
              <Form.Label>Payment Method</Form.Label>
              <Form.Control type='text' name='payment_method' value={formData.payment_method} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className='dms-form-group'>
              <Form.Label>Issue Description</Form.Label>
              <Form.Control as='textarea' name='issue_description' value={formData.issue_description} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className='dms-form-group'>
              <Form.Label>Support Status</Form.Label>
              <Form.Select name='support_status' value={formData.support_status} onChange={handleChange} required>
                <option value='Pending'>Pending</option>
                <option value='Resolved'>Resolved</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className='dms-form-group'>
              <Form.Label>Resolved At</Form.Label>
              <Form.Control type='datetime-local' name='resolved_at' value={formData.resolved_at} onChange={handleChange} />
            </Form.Group>

            <div className='save-and-cancel-btn'>
              <Button type='submit' className='me-2'>Save Changes</Button>
              <Button type='cancel' onClick={() => navigate('/dms/refund-payment-issue')}>Cancel</Button>
            </div>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
};
