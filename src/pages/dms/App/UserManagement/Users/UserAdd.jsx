import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const UserAdd = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    userType: 'Select option',
    userProfile: null, 
    status: 'Select status',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { fullName, mobile, email, userType } = formData;

    if (!fullName || !mobile || !email || userType === 'Select option') {
      setError('Name, Mobile, Email, and User Type are required.');
      return;
    }

    try {
      
      const token = JSON.parse(localStorage.getItem("userData"))?.token;
      const data = new FormData();
      data.append('fullName', formData.fullName);
      data.append('mobile', formData.mobile);
      data.append('email', formData.email);
      data.append('userType', formData.userType);
      data.append('status', formData.status);
      if (formData.userProfile) {
        data.append('userProfile', formData.userProfile);
      }

      const res = await axios.post(
        '${API_BASE_URL}/createUser',
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (res.status === 200 || res.status === 201) {
        setSuccess('User added successfully!');
        setTimeout(() => navigate('/dms/user'), 1000);
      } else {
        setError('Failed to add user. Please try again.');
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        const serverMessage = err.response.data.message || err.response.data.error;
        if (serverMessage === 'Failed to create user') {
          setError('Failed to add user. Please check if email or mobile already exists.');
        } else {
          setError(serverMessage || 'Failed to add user. Please try again.');
        }
      } else {
        setError('Failed to add user. Please check your server or network connection.');
      }
    }
  };

  return (
    <AdminLayout>
      <div className='dms-container'>
        <h4>Add New User</h4>

        <div className='dms-form-container'>
          {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="dms-form-group">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                placeholder="Enter full name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="mobile"
                placeholder="Enter phone"
                value={formData.mobile}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>User Type</Form.Label>
              <Form.Select
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                required
              >
                <option value="Select option">Select option</option>
                <option value="Driver">Driver</option>
                <option value="Rider">Rider</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>User Profile Image</Form.Label>
              <Form.Control
                type="file"
                name="userProfile"
                accept="image/*"
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="">Select status</option>
                <option value="Pending">Pending</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Form.Select>
            </Form.Group>

            <div className="save-and-cancel-btn">
              <Button type="submit" className="me-2">Save Changes</Button>
              <Button type='cancel' onClick={() => navigate('/dms/user')}>Cancel</Button>
            </div>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
};
