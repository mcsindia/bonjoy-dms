import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';
import axios from 'axios';
import { QuillEditor } from '../../../../../components/dms/QuillEditor/QuillEditor';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const JobPostEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { career } = location.state || {};

  const [formData, setFormData] = useState({
    title: career?.title || '',
    department: career?.department || '',
    location: career?.location || '',
    status: career?.status || 'Open',
    positions: career?.positions || '',
    jobType: career?.jobType || '',
    experience: career?.experience || '',
    skills: career?.skills || '',
    description: career?.description || '',
    responsibilities: career?.responsibilities || '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.department || !formData.location || !formData.positions) {
      setError('Please fill all required fields.');
      return;
    }

    try {
       const token = JSON.parse(localStorage.getItem("userData"))?.token;
      const res = await axios.put(`${API_BASE_URL}/updateCareer/${career.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.status === 200) {
        setSuccess('Career updated successfully!');
        setTimeout(() => navigate('/dms/job-post'), 1000);
      } else {
        setError('Failed to update career.');
      }
    } catch (err) {
      console.error('Error updating career:', err);
      setError(err.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <AdminLayout>
      <div className="dms-container">
        <h4>Edit Career</h4>
        <div className="dms-form-container">
          {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="dms-form-group">
              <Form.Label>Job Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter job title"
              />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Department</Form.Label>
              <Form.Control
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Enter department"
              />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter location"
              />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Status</Form.Label>
              <Form.Select name="status" value={formData.status} onChange={handleChange}>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>No. of Positions</Form.Label>
              <Form.Control
                type="number"
                name="positions"
                value={formData.positions}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Job Type</Form.Label>
              <Form.Select name="jobType" value={formData.jobType} onChange={handleChange}>
                <option value="">Select job type</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Experience</Form.Label>
              <Form.Control
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="e.g. 2+ years"
              />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Skills (comma-separated)</Form.Label>
              <Form.Control
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g. React, Node.js"
              />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Job Description</Form.Label>
              <QuillEditor
                value={formData.description}
                onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
              />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Responsibilities</Form.Label>
              <QuillEditor
                value={formData.responsibilities}
                onChange={(value) => setFormData(prev => ({ ...prev, responsibilities: value }))}
              />
            </Form.Group>

            <div className="save-and-cancel-btn">
              <Button type="submit" className="me-2">Save Changes</Button>
              <Button type='cancel' onClick={() => navigate('/dms/job-post')}>Cancel</Button>
            </div>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
};
