import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';

export const CompletedTripEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract trip data passed from Completed Trips List page
  const { trip } = location.state || {};

  // Initialize state with the current trip data
  const [formData, setFormData] = useState({
    trip_id: trip?.trip_id || '',
    driver_id: trip?.driver_id || '',
    rider_id: trip?.rider_id || '',
    vehicle_id: trip?.vehicle_id || '',
    pickup_location: trip?.pickup_location || '',
    dropoff_location: trip?.dropoff_location || '',
    fare_amount: trip?.fare_amount || '',
    payment_status: trip?.payment_status || 'Completed',
    trip_distance: trip?.trip_distance || '',
    trip_rating: trip?.trip_rating || '',
    driver_rating: trip?.driver_rating || '',
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
    navigate('/dms/completed-trips'); // Redirect back to Completed Trips List
  };

  return (
    <AdminLayout>
      <div className='dms-container'>
        <h4>Edit Completed Trip</h4>
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

            {/* Fare Amount */}
            <Form.Group className='dms-form-group'>
              <Form.Label>Fare Amount (₹)</Form.Label>
              <Form.Control type='number' step='0.01' name='fare_amount' value={formData.fare_amount} onChange={handleChange} required />
            </Form.Group>

            {/* Payment Status */}
            <Form.Group className='dms-form-group'>
              <Form.Label>Payment Status</Form.Label>
              <Form.Select name='payment_status' value={formData.payment_status} onChange={handleChange} required>
                <option value='Completed'>Completed</option>
                <option value='Pending'>Pending</option>
                <option value='Failed'>Failed</option>
              </Form.Select>
            </Form.Group>

            {/* Trip Distance */}
            <Form.Group className='dms-form-group'>
              <Form.Label>Trip Distance (km)</Form.Label>
              <Form.Control type='text' name='trip_distance' value={formData.trip_distance} onChange={handleChange} required />
            </Form.Group>

            {/* Trip Rating */}
            <Form.Group className='dms-form-group'>
              <Form.Label>Trip Rating</Form.Label>
              <Form.Control type='number' step='0.1' name='trip_rating' value={formData.trip_rating} onChange={handleChange} required />
            </Form.Group>

            {/* Driver Rating */}
            <Form.Group className='dms-form-group'>
              <Form.Label>Driver Rating</Form.Label>
              <Form.Control type='number' step='0.1' name='driver_rating' value={formData.driver_rating} onChange={handleChange} required />
            </Form.Group>

            {/* Buttons */}
            <div className='save-and-cancel-btn'>
              <Button type='submit' className='me-2'>
                Save Changes
              </Button>
              <Button type='cancel' onClick={() => navigate('/dms/completed-trips')}>
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
};