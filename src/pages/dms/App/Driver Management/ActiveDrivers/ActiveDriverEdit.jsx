import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';

export const ActiveDriverEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract driver data passed from Active Drivers List page
  const { driver } = location.state || {};

  // Initialize state with the current driver data
  const [formData, setFormData] = useState({
    driver_id: driver?.driver_id || '',
    vehicle_id: driver?.vehicle_id || '',
    status: driver?.status || 'Active',
    current_lat: driver?.current_lat || '',
    current_lng: driver?.current_lng || '',
    last_seen: driver?.last_seen || '',
    trip_id: driver?.trip_id || '',
    rating: driver?.rating || '',
    earnings_today: driver?.earnings_today || '',
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

    console.log('Updated Driver:', formData);

    // Simulate updating the data and navigating back
    navigate('/dms/active-drivers'); // Redirect back to Active Drivers List
  };

  return (
    <AdminLayout>
      <div className='dms-container'>
        <h4>Edit Active Driver</h4>
        <div className='dms-form-container'>
          <Form onSubmit={handleSubmit}>
            {/* Driver ID */}
            <Form.Group className='dms-form-group'>
              <Form.Label>Driver ID</Form.Label>
              <Form.Control type='text' name='driver_id' value={formData.driver_id} onChange={handleChange} required />
            </Form.Group>

            {/* Vehicle ID */}
            <Form.Group className='dms-form-group'>
              <Form.Label>Vehicle ID</Form.Label>
              <Form.Control type='text' name='vehicle_id' value={formData.vehicle_id} onChange={handleChange} required />
            </Form.Group>

            {/* Status */}
            <Form.Group className='dms-form-group'>
              <Form.Label>Status</Form.Label>
              <Form.Select name='status' value={formData.status} onChange={handleChange} required>
                <option value='Active'>Active</option>
                <option value='Inactive'>Inactive</option>
              </Form.Select>
            </Form.Group>

            {/* Current Location */}
            <Form.Group className='dms-form-group'>
              <Form.Label>Current Latitude</Form.Label>
              <Form.Control type='text' name='current_lat' value={formData.current_lat} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className='dms-form-group'>
              <Form.Label>Current Longitude</Form.Label>
              <Form.Control type='text' name='current_lng' value={formData.current_lng} onChange={handleChange} required />
            </Form.Group>

            {/* Last Seen */}
            <Form.Group className='dms-form-group'>
              <Form.Label>Last Seen</Form.Label>
              <Form.Control type='datetime-local' name='last_seen' value={formData.last_seen} onChange={handleChange} required />
            </Form.Group>

            {/* Trip ID */}
            <Form.Group className='dms-form-group'>
              <Form.Label>Trip ID</Form.Label>
              <Form.Control type='text' name='trip_id' value={formData.trip_id} onChange={handleChange} />
            </Form.Group>

            {/* Rating */}
            <Form.Group className='dms-form-group'>
              <Form.Label>Rating</Form.Label>
              <Form.Control type='number' step='0.1' name='rating' value={formData.rating} onChange={handleChange} required />
            </Form.Group>

            {/* Earnings Today */}
            <Form.Group className='dms-form-group'>
              <Form.Label>Earnings Today ($)</Form.Label>
              <Form.Control type='number' step='0.01' name='earnings_today' value={formData.earnings_today} onChange={handleChange} required />
            </Form.Group>

            {/* Buttons */}
            <div className='save-and-cancel-btn'>
              <Button type='submit' className='me-2'>
                Save Changes
              </Button>
              <Button type='cancel' onClick={() => navigate('/dms/active-drivers')}>
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
};
