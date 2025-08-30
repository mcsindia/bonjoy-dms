import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';

export const ScheduledTripEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract trip data passed from Scheduled Trips List page
  const { trip } = location.state || {};

  // Initialize state with the current trip data
  const [formData, setFormData] = useState({
    trip_id: trip?.trip_id || '',
    driver_id: trip?.driver_id || '',
    rider_id: trip?.rider_id || '',
    vehicle_id: trip?.vehicle_id || '',
    pickup_location: trip?.pickup_location || '',
    dropoff_location: trip?.dropoff_location || '',
    scheduled_time: trip?.scheduled_time || '',
    status: trip?.status || 'Scheduled',
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
    console.log('Updated Scheduled Trip:', formData);
    navigate('/dms/scheduled-trips'); // Redirect back to Scheduled Trips List
  };

  return (
    <AdminLayout>
      <div className='dms-container'>
        <h4>Edit Scheduled Trip</h4>
        <div className='dms-form-container'>
          <Form onSubmit={handleSubmit}>
            {/* Trip ID */}
            <Form.Group className='dms-form-group'>
              <Form.Label>Trip ID</Form.Label>
              <Form.Control type='text' name='trip_id' value={formData.trip_id} onChange={handleChange} required disabled />
            </Form.Group>

            {/* Driver ID */}
            <Form.Group className='dms-form-group'>
              <Form.Label>Driver ID</Form.Label>
              <Form.Control type='text' name='driver_id' value={formData.driver_id} onChange={handleChange} required />
            </Form.Group>

            {/* Rider ID */}
            <Form.Group className='dms-form-group'>
              <Form.Label>Rider ID</Form.Label>
              <Form.Control type='text' name='rider_id' value={formData.rider_id} onChange={handleChange} required />
            </Form.Group>

            {/* Vehicle ID */}
            <Form.Group className='dms-form-group'>
              <Form.Label>Vehicle ID</Form.Label>
              <Form.Control type='text' name='vehicle_id' value={formData.vehicle_id} onChange={handleChange} required />
            </Form.Group>

            {/* Pickup Location */}
            <Form.Group className='dms-form-group'>
              <Form.Label>Pickup Location</Form.Label>
              <Form.Control type='text' name='pickup_location' value={formData.pickup_location} onChange={handleChange} required />
            </Form.Group>

            {/* Dropoff Location */}
            <Form.Group className='dms-form-group'>
              <Form.Label>Dropoff Location</Form.Label>
              <Form.Control type='text' name='dropoff_location' value={formData.dropoff_location} onChange={handleChange} required />
            </Form.Group>

            {/* Scheduled Time */}
            <Form.Group className='dms-form-group'>
              <Form.Label>Scheduled Time</Form.Label>
              <Form.Control type='datetime-local' name='scheduled_time' value={formData.scheduled_time} onChange={handleChange} required />
            </Form.Group>

            {/* Status */}
            <Form.Group className='dms-form-group'>
              <Form.Label>Status</Form.Label>
              <Form.Select name='status' value={formData.status} onChange={handleChange} required>
                <option value='Scheduled'>Scheduled</option>
                <option value='Completed'>Completed</option>
                <option value='Canceled'>Canceled</option>
              </Form.Select>
            </Form.Group>

            {/* Buttons */}
            <div className='save-and-cancel-btn'>
              <Button type='submit' className='me-2'>
                Save Changes
              </Button>
              <Button type='cancel' onClick={() => navigate('/dms/scheduled-trips')}>
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
};