import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';

export const CanceledTripEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract trip data passed from Canceled Trips List page
  const { trip } = location.state || {};

  // Initialize state with the current trip data
  const [formData, setFormData] = useState({
    trip_id: trip?.trip_id || '',
    driver_id: trip?.driver_id || '',
    rider_id: trip?.rider_id || '',
    vehicle_id: trip?.vehicle_id || '',
    pickup_location: trip?.pickup_location || '',
    dropoff_location: trip?.dropoff_location || '',
    cancellation_reason: trip?.cancellation_reason || '',
    canceled_by: trip?.canceled_by || '',
    refund_status: trip?.refund_status || 'Pending',
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
    console.log('Updated Canceled Trip:', formData);
    navigate('/dms/canceled-trips'); // Redirect back to Canceled Trips List
  };

  return (
    <AdminLayout>
      <div className='dms-container'>
        <h4>Edit Canceled Trip</h4>
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

            {/* Cancellation Reason */}
            <Form.Group className='dms-form-group'>
              <Form.Label>Cancellation Reason</Form.Label>
              <Form.Control type='text' name='cancellation_reason' value={formData.cancellation_reason} onChange={handleChange} required />
            </Form.Group>

            {/* Canceled By */}
            <Form.Group className='dms-form-group'>
              <Form.Label>Canceled By</Form.Label>
              <Form.Select name='canceled_by' value={formData.canceled_by} onChange={handleChange} required>
                <option value='Rider'>Rider</option>
                <option value='Driver'>Driver</option>
                <option value='Admin'>Admin</option>
              </Form.Select>
            </Form.Group>

            {/* Refund Status */}
            <Form.Group className='dms-form-group'>
              <Form.Label>Refund Status</Form.Label>
              <Form.Select name='refund_status' value={formData.refund_status} onChange={handleChange} required>
                <option value='Pending'>Pending</option>
                <option value='Processed'>Processed</option>
                <option value='Not Applicable'>Not Applicable</option>
              </Form.Select>
            </Form.Group>

            {/* Buttons */}
            <div className='save-and-cancel-btn'>
              <Button type='submit' className='me-2'>
                Save Changes
              </Button>
              <Button type='cancel' onClick={() => navigate('/dms/canceled-trips')}>
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
};
