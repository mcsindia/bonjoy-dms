import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';

export const CanceledTripAdd = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    trip_id: '',
    driver_id: '',
    rider_id: '',
    vehicle_id: '',
    pickup_location: '',
    dropoff_location: '',
    cancellation_reason: '',
    canceled_by: 'Rider',
    canceled_at: '',
    refund_status: 'Not Applicable',
    cancellation_fee: '',
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
    if (!formData.trip_id || !formData.rider_id || !formData.pickup_location || !formData.dropoff_location || !formData.cancellation_reason || !formData.canceled_at || !formData.refund_status) {
      setError('All required fields must be filled.');
      return;
    }
    console.log('Canceled Trip Added:', formData);
    navigate('/dms/canceled-trips');
  };

  return (
    <AdminLayout>
      <div className='dms-container'>
        <h4>Add New Canceled Trip</h4>
        <div className='dms-form-container'>
          {error && <Alert variant='danger' onClose={() => setError('')} dismissible>{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className='dms-form-group'>
              <Form.Label>Trip ID</Form.Label>
              <Form.Control type='text' name='trip_id' placeholder='Enter Trip ID' value={formData.trip_id} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className='dms-form-group'>
              <Form.Label>Driver ID (Optional)</Form.Label>
              <Form.Control type='text' name='driver_id' placeholder='Enter Driver ID' value={formData.driver_id} onChange={handleChange} />
            </Form.Group>

            <Form.Group className='dms-form-group'>
              <Form.Label>Rider ID</Form.Label>
              <Form.Control type='text' name='rider_id' placeholder='Enter Rider ID' value={formData.rider_id} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className='dms-form-group'>
              <Form.Label>Vehicle ID (Optional)</Form.Label>
              <Form.Control type='text' name='vehicle_id' placeholder='Enter Vehicle ID' value={formData.vehicle_id} onChange={handleChange} />
            </Form.Group>

            <Form.Group className='dms-form-group'>
              <Form.Label>Pickup Location</Form.Label>
              <Form.Control type='text' name='pickup_location' placeholder='Enter Pickup Location' value={formData.pickup_location} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className='dms-form-group'>
              <Form.Label>Dropoff Location</Form.Label>
              <Form.Control type='text' name='dropoff_location' placeholder='Enter Dropoff Location' value={formData.dropoff_location} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className='dms-form-group'>
              <Form.Label>Cancellation Reason</Form.Label>
              <Form.Control as='textarea' name='cancellation_reason' placeholder='Enter Reason for Cancellation' value={formData.cancellation_reason} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className='dms-form-group'>
              <Form.Label>Canceled By</Form.Label>
              <Form.Select name='canceled_by' value={formData.canceled_by} onChange={handleChange} required>
                <option value='Driver'>Driver</option>
                <option value='Rider'>Rider</option>
                <option value='System'>System</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className='dms-form-group'>
              <Form.Label>Cancellation Time</Form.Label>
              <Form.Control type='datetime-local' name='canceled_at' value={formData.canceled_at} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className='dms-form-group'>
              <Form.Label>Refund Status</Form.Label>
              <Form.Select name='refund_status' value={formData.refund_status} onChange={handleChange} required>
                <option value='Not Applicable'>Not Applicable</option>
                <option value='Pending'>Pending</option>
                <option value='Refunded'>Refunded</option>
                <option value='Rejected'>Rejected</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className='dms-form-group'>
              <Form.Label>Cancellation Fee</Form.Label>
              <Form.Control type='number' step='0.01' name='cancellation_fee' placeholder='Enter Cancellation Fee' value={formData.cancellation_fee} onChange={handleChange} />
            </Form.Group>

            <div className='save-and-cancel-btn'>
              <Button type='submit' className='me-2'>Save changes</Button>
              <Button type='cancel' onClick={() => navigate('/dms/canceled-trips')}>Cancel</Button>
            </div>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
};
