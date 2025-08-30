import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';

export const InactiveDriversEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract driver data passed from Suspended Drivers List page
  const { driver } = location.state || {};

  // Initialize state with the current driver data
  const [formData, setFormData] = useState({
    driver_id: driver?.driver_id || '',
    full_name: driver?.full_name || '',
    vehicle_id: driver?.vehicle_id || '',
    inactive_reason: driver?.inactive_reason || '',
    inactive_type: driver?.inactive_type || 'Temporary',
    suspended_at: driver?.suspended_at || '',
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

    console.log('Updated Suspended Driver:', formData);

    // Simulate updating the data and navigating back
    navigate('/dms/inactive-drivers'); // Redirect back to Suspended Drivers List
  };

  return (
    <AdminLayout>
      <div className='dms-container'>
        <h4>Edit Inactive Driver</h4>
        <div className='dms-form-container'>
          <Form onSubmit={handleSubmit}>
            {/* Driver ID */}
            <Form.Group className='dms-form-group'>
              <Form.Label>Driver ID</Form.Label>
              <Form.Control type='text' name='driver_id' value={formData.driver_id} onChange={handleChange} required />
            </Form.Group>

            {/* Full Name */}
            <Form.Group className='dms-form-group'>
              <Form.Label>Full Name</Form.Label>
              <Form.Control type='text' name='full_name' value={formData.full_name} onChange={handleChange} required />
            </Form.Group>

            {/* Vehicle ID */}
            <Form.Group className='dms-form-group'>
              <Form.Label>Vehicle ID</Form.Label>
              <Form.Control type='text' name='vehicle_id' value={formData.vehicle_id} onChange={handleChange} required />
            </Form.Group>

            {/* Inactive Reason */}
            <Form.Group className='dms-form-group'>
              <Form.Label>Inactive Reason</Form.Label>
              <Form.Control type='text' name='inactive_reason' value={formData.inactive_reason} onChange={handleChange} required />
            </Form.Group>

            {/* Inactive Type */}
            <Form.Group className='dms-form-group'>
              <Form.Label>Inactive Type</Form.Label>
              <Form.Select name='inactive_type' value={formData.inactive_type} onChange={handleChange} required>
                <option value='Temporary'>Temporary</option>
                <option value='Permanent'>Permanent</option>
              </Form.Select>
            </Form.Group>

            {/* Inactive At */}
            <Form.Group className='dms-form-group'>
              <Form.Label>Inactive At</Form.Label>
              <Form.Control type='datetime-local' name='suspended_at' value={formData.suspended_at} onChange={handleChange} required />
            </Form.Group>

            {/* Buttons */}
            <div className='save-and-cancel-btn'>
              <Button type='submit' className='me-2'>
                Save Changes
              </Button>
              <Button type='cancel' onClick={() => navigate('/dms/inactive-drivers')}>
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
};
