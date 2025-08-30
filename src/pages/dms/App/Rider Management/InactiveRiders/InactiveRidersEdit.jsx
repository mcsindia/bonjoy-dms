import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';

export const InactiveRidersEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract blocked rider data passed from Blocked Riders List page
  const { rider } = location.state || {};

  // Initialize state with the current blocked rider data
  const [formData, setFormData] = useState({
    rider_id: rider?.rider_id || '',
    blocked_by: rider?.blocked_by || '',
    reason: rider?.reason || '',
    reported_by: rider?.reported_by || '',
    ride_id: rider?.ride_id || '',
    block_type: rider?.block_type || '',
    start_date: rider?.start_date || '',
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

    console.log('Updated Blocked Rider:', formData);

    // Simulate updating the data and navigating back
    navigate('/dms/inactive-riders'); // Redirect back to Blocked Riders List
  };

  return (
    <AdminLayout>
      <div className='dms-container'>
        <h4>Edit Inactive Rider</h4>
        <div className='dms-form-container'>
          <Form onSubmit={handleSubmit}>
            {/* Rider ID */}
            <Form.Group className='dms-form-group'>
              <Form.Label>Rider ID</Form.Label>
              <Form.Control type='text' name='rider_id' value={formData.rider_id} onChange={handleChange} required />
            </Form.Group>

            {/* Blocked By */}
            <Form.Group className='dms-form-group'>
              <Form.Label>Blocked By</Form.Label>
              <Form.Control type='text' name='blocked_by' value={formData.blocked_by} onChange={handleChange} required />
            </Form.Group>

            {/* Reason */}
            <Form.Group className='dms-form-group'>
              <Form.Label>Reason</Form.Label>
              <Form.Control as='textarea' name='reason' value={formData.reason} onChange={handleChange} rows={3} required />
            </Form.Group>

            {/* Reported By */}
            <Form.Group className='dms-form-group'>
              <Form.Label>Reported By</Form.Label>
              <Form.Control type='text' name='reported_by' value={formData.reported_by} onChange={handleChange} required />
            </Form.Group>

            {/* Ride ID */}
            <Form.Group className='dms-form-group'>
              <Form.Label>Ride ID</Form.Label>
              <Form.Control type='text' name='ride_id' value={formData.ride_id} onChange={handleChange} required />
            </Form.Group>

            {/* Block Type */}
            <Form.Group className='dms-form-group'>
              <Form.Label>Block Type</Form.Label>
              <Form.Select name='block_type' value={formData.block_type} onChange={handleChange} required>
                <option value=''>Select Block Type</option>
                <option value='Permanent'>Permanent</option>
                <option value='Temporary'>Temporary</option>
              </Form.Select>
            </Form.Group>

            {/* Start Date */}
            <Form.Group className='dms-form-group'>
              <Form.Label>Start Date</Form.Label>
              <Form.Control type='date' name='start_date' value={formData.start_date} onChange={handleChange} required />
            </Form.Group>

            {/* Buttons */}
            <div className='save-and-cancel-btn'>
              <Button type='submit' className='me-2'>
                Save Changes
              </Button>
              <Button type='cancel' onClick={() => navigate('/dms/inactive-riders')}>
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
};
