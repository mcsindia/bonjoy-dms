import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';

export const ActivityAdd = () => {
  const navigate = useNavigate();

  // State for form fields
  const [formData, setFormData] = useState({
    user_id: '',
    ride_id: '',
    action: '',
    description: '',
    timestamp: '',
    status: '',
  });

  const [error, setError] = useState('');

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

    // Form Validation
    if (!formData.user_id || !formData.ride_id || !formData.action || !formData.timestamp || !formData.status) {
      setError('All fields are required.');
      return;
    }

    console.log('Activity Logged', formData);

    // Simulate saving the data and navigating back
    navigate('/dms/activity-log'); 
  };

  return (
    <AdminLayout>
      <div className='dms-container'>
        <h4>Add New Activity</h4>
        <div className='dms-form-container'>
          {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            {/* User ID */}
            <Form.Group className="dms-form-group">
              <Form.Label>User ID</Form.Label>
              <Form.Control type="text" name="user_id" placeholder="Enter User ID" value={formData.user_id} onChange={handleChange} required />
            </Form.Group>

            {/* Ride ID */}
            <Form.Group className="dms-form-group">
              <Form.Label>Ride ID</Form.Label>
              <Form.Control type="text" name="ride_id" placeholder="Enter Ride ID" value={formData.ride_id} onChange={handleChange} required />
            </Form.Group>

            {/* Action */}
            <Form.Group className="dms-form-group">
              <Form.Label>Action</Form.Label>
              <Form.Control type="text" name="action" placeholder="Enter Action" value={formData.action} onChange={handleChange} required />
            </Form.Group>

            {/* Description with Textarea */}
            <Form.Group className="dms-form-group">
              <Form.Label>Description</Form.Label>
              <Form.Control 
                as="textarea" 
                name="description" 
                placeholder="Enter Description" 
                value={formData.description} 
                onChange={handleChange} 
                rows={4} 
              />
            </Form.Group>

            {/* Timestamp */}
            <Form.Group className="dms-form-group">
              <Form.Label>Timestamp</Form.Label>
              <Form.Control type="datetime-local" name="timestamp" value={formData.timestamp} onChange={handleChange} required />
            </Form.Group>

            {/* Status */}
            <Form.Group className="dms-form-group">
              <Form.Label>Status</Form.Label>
              <Form.Select name="status" value={formData.status} onChange={handleChange} required>
                <option value="">Select Status</option>
                <option value="Success">Success</option>
                <option value="Failed">Failed</option>
                <option value="Pending">Pending</option>
              </Form.Select>
            </Form.Group>

            {/* Buttons */}
            <div className="save-and-cancel-btn">
              <Button type="submit" className="me-2">
                Save Activity
              </Button>
              <Button type="cancel" onClick={() => navigate('/dms/activity-logs')}>
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
};
