import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const UserEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { user } = location.state || {};

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [email, setEmail] = useState(user?.email || '');
  const [userType, setUserType] = useState(user?.userType || 'Rider');
  const [status, setStatus] = useState(user?.status || 'Active');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      fullName,
      mobile,
      email,
      userType,
      status
    };

    try {
      const res = await axios.put(
        `${API_BASE_URL}/updateUser/${user.id}`,
        payload
      );

      if (res.status === 200) {
        setSuccess('User updated successfully!');
        setTimeout(() => navigate('/dms/user'), 1000);
      } else {
        setError('Failed to update the user.');
      }
    } catch (err) {
      console.error("Error updating user:", err);
      setError('There was an error updating the user.');
    }
  };

  return (
    <AdminLayout>
      <div className="dms-container">
        <h4>Edit User</h4>
        <div className="dms-form-container">
          {/* Error and Success Alerts */}
          {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            {/* Full Name */}
            <Form.Group className="dms-form-group">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </Form.Group>

            {/* Mobile */}
            <Form.Group className="dms-form-group">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
            </Form.Group>

            {/* Email */}
            <Form.Group className="dms-form-group">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            {/* User Type */}
            <Form.Group className="dms-form-group">
              <Form.Label>User Type</Form.Label>
              <Form.Select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                required
              >
                <option value="Driver">Driver</option>
                <option value="Rider">Rider</option>
              </Form.Select>
            </Form.Group>

            {/* Status */}
            <Form.Group className="dms-form-group">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option> 
              </Form.Select>
            </Form.Group>

            {/* Buttons */}
            <div className="save-and-cancel-btn">
              <Button type="submit" className="me-2">
                Save Changes
              </Button>
              <Button variant="secondary" onClick={() => navigate('/dms/user')}>
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
};
