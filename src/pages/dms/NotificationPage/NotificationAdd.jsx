import React, { useState } from 'react';
import { Button, Form,  Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../layouts/dms/AdminLayout/AdminLayout';

export const NotificationAdd = () => {
  const navigate = useNavigate();

  // State for form fields
  const [formData, setFormData] = useState({
    userId: '',
    type: '',
    message: '',
    status: 'Sent',
    dateTime: '',
    category: '',
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
    if (!formData.userId || !formData.type || !formData.message || !formData.dateTime || !formData.category) {
      setError('All fields are required.');
      return;
    }

    // Simulate saving the data and navigating back
    navigate('/dms/notifications'); // Redirect back to Notifications List
  };

  return (
    <AdminLayout>
      <div className='dms-container'>
        <h4>Add New Notification</h4>

        <div className='dms-form-container'>
          {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

          <Form onSubmit={handleSubmit}>

            {/* Notification Type */}
            <Form.Group className="dms-form-group">
              <Form.Label>Type</Form.Label>
              <Form.Select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="">Select Type</option>
                <option value="Rider">Rider</option>
                <option value="Driver">Driver</option>
              </Form.Select>
            </Form.Group>

            {/* Message */}
            <Form.Group className="dms-form-group">
              <Form.Label>Message</Form.Label>
              <Form.Control
                type="text"
                name="message"
                placeholder="Enter notification message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Status */}
            <Form.Group className="dms-form-group">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="Sent">Sent</option>
                <option value="Delivered">Delivered</option>
                <option value="Read">Read</option>
              </Form.Select>
            </Form.Group>

            {/* Category */}
            <Form.Group className="dms-form-group">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                <option value="Rider">Rider</option>
                <option value="Driver">Driver</option>
              </Form.Select>
            </Form.Group>

            {/* Buttons */}
            <div className="save-and-cancel-btn">
              <Button type="submit" className="me-2">
                Save changes
              </Button>
              <Button type="cancel" onClick={() => navigate('/dms/notifications')}>
                Back
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
};
