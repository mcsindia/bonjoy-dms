import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';

export const IdleDriversEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract driver data passed from Idle Drivers List page
  const { driver } = location.state || {};

  // Initialize state with the current driver data
  const [formData, setFormData] = useState({
    driver_id: driver?.driver_id || '',
    vehicle_id: driver?.vehicle_id || '',
    latitude: driver?.latitude || '',
    longitude: driver?.longitude || '',
    last_active: driver?.last_active || '',
    idle_since: driver?.idle_since || '',
    rating: driver?.rating || '',
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

    // Simulate updating the data and navigating back
    navigate('/dms/idle-drivers'); // Redirect back to Idle Drivers List
  };

  return (
    <AdminLayout>
      <div className='dms-container'>
        <h4>Edit Idle Driver</h4>
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

            {/* Location */}
            <Form.Group className='dms-form-group'>
              <Form.Label>Latitude</Form.Label>
              <Form.Control type='text' name='latitude' value={formData.latitude} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className='dms-form-group'>
              <Form.Label>Longitude</Form.Label>
              <Form.Control type='text' name='longitude' value={formData.longitude} onChange={handleChange} required />
            </Form.Group>

            {/* Last Active & Idle Since */}
            <Form.Group className='dms-form-group'>
              <Form.Label>Last Active</Form.Label>
              <Form.Control type='datetime-local' name='last_active' value={formData.last_active} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className='dms-form-group'>
              <Form.Label>Idle Since</Form.Label>
              <Form.Control type='datetime-local' name='idle_since' value={formData.idle_since} onChange={handleChange} required />
            </Form.Group>

            {/* Rating */}
            <Form.Group className='dms-form-group'>
              <Form.Label>Rating</Form.Label>
              <Form.Control type='number' step='0.1' name='rating' value={formData.rating} onChange={handleChange} required />
            </Form.Group>

            {/* Buttons */}
            <div className='save-and-cancel-btn'>
              <Button type='submit' className='me-2'>
                Save Changes
              </Button>
              <Button type='cancel' onClick={() => navigate('/dms/idle-drivers')}>
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
};