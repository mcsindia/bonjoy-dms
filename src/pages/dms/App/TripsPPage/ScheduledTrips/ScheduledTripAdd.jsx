import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';

export const ScheduledTripAdd = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    trip_id: '',
    driver_id: '',
    rider_id: '',
    vehicle_id: '',
    pickup_location: '',
    dropoff_location: '',
    scheduled_at: '',
    status: 'Scheduled',
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
    if (!formData.trip_id || !formData.rider_id || !formData.pickup_location || !formData.dropoff_location || !formData.scheduled_at) {
      setError('All required fields must be filled.');
      return;
    }
    console.log('Scheduled Trip Added:', formData);
    navigate('/dms/scheduled-trips');
  };

  return (
    <AdminLayout>
      <div className='dms-container'>
        <h4>Add New Scheduled Trip</h4>
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
              <Form.Label>Scheduled Time</Form.Label>
              <Form.Control type='datetime-local' name='scheduled_at' value={formData.scheduled_at} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className='dms-form-group'>
              <Form.Label>Status</Form.Label>
              <Form.Select name='status' value={formData.status} onChange={handleChange} required>
                <option value='Scheduled'>Scheduled</option>
                <option value='Completed'>Completed</option>
                <option value='Canceled'>Canceled</option>
              </Form.Select>
            </Form.Group>

            <div className='save-and-cancel-btn'>
              <Button type='submit' className='me-2'>Save changes</Button>
              <Button type='cancel' onClick={() => navigate('/dms/scheduled-trips')}>Cancel</Button>
            </div>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
};
