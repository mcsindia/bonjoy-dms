import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';

export const SupportRequestEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract support request data passed from the SupportRequestList page
  const { supportRequest } = location.state || {};

  // Initialize state with the current support request data
  const [requestType, setRequestType] = useState(supportRequest?.requestType || '');
  const [userType, setUserType] = useState(supportRequest?.userType || '');
  const [title, setTitle] = useState(supportRequest?.title || '');
  const [status, setStatus] = useState(supportRequest?.status || 'Open');

  // Handle form submission (Update support request)
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/dms/support');
  };

  return (
    <AdminLayout>
      <div className="dms-container">
        <h4>Edit Support Request</h4>
        <div className="dms-form-container">
          <Form onSubmit={handleSubmit}>
          
            {/* Request Type */}
            <Form.Group controlId="requestType" className="dms-form-group">
              <Form.Label>Request Type</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter request type (e.g. Technical, Billing)"
                value={requestType}
                onChange={(e) => setRequestType(e.target.value)}
                required
              />
            </Form.Group>

            {/* User Type */}
            <Form.Group controlId="userType" className="dms-form-group">
              <Form.Label>User Type</Form.Label>
              <Form.Select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                required
              >
                <option value="">Select User Type</option>
                <option value="Rider">Rider</option>
                <option value="Driver">Driver</option>
              </Form.Select>
            </Form.Group>

            {/* Request Title */}
            <Form.Group controlId="title" className="dms-form-group">
              <Form.Label>Request Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter request title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>

            {/* Status */}
            <Form.Group controlId="status" className="dms-form-group">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </Form.Select>
            </Form.Group>

            {/* Buttons */}
            <div className='save-and-cancel-btn'>
            <Button type="submit">
              Save Changes
            </Button>
            <Button type="cancel" className="ms-2" onClick={() => navigate('/dms/support-request')}>
              Cancel
            </Button>
            </div>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
};
