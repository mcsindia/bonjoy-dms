import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';

export const SupportRequestAdd = () => {
  const navigate = useNavigate();

  // State for form fields
  const [formData, setFormData] = useState({
    requestType: '',
    userType: '',
    title: '',
    status: 'Open',
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
    if (!formData.customerName || !formData.requestType || !formData.userType || !formData.title) {
      setError('All fields are required.');
      return;
    }

    // Simulate saving the data and navigating back
    navigate('/dms/support'); // Redirect back to Support Request List
  };

  return (
    <AdminLayout>
      <div className='dms-container'>
        <h4>Add New Support Request</h4>

        <div className='dms-form-container'>
          {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

          <Form onSubmit={handleSubmit}>
           

            {/* Request Type */}
            <Form.Group className="dms-form-group">
              <Form.Label>Request Type</Form.Label>
              <Form.Control
                type="text"
                name="requestType"
                placeholder="Enter request type (e.g. Technical, Billing)"
                value={formData.requestType}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* User Type */}
            <Form.Group className="dms-form-group">
              <Form.Label>User Type</Form.Label>
              <Form.Select
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                required
              >
                <option value="">Select User Type</option>
                <option value="Rider">Rider</option>
                <option value="Driver">Driver</option>
              </Form.Select>
            </Form.Group>

            {/* Request Title */}
            <Form.Group className="dms-form-group">
              <Form.Label>Request Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                placeholder="Enter request title"
                value={formData.title}
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
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </Form.Select>
            </Form.Group>

            {/* Buttons */}
            <div className="save-and-cancel-btn">
              <Button type="submit" className="me-2">
                Save changes
              </Button>
              <Button type="cancel" onClick={() => navigate('/dms/support-request')}>
                Back
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
};
