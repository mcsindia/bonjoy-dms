import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';
import axios from 'axios';
import { QuillEditor } from '../../../../../components/dms/QuillEditor/QuillEditor';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const JobPostAdd = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    status: 'Open',
    positions: '',
    jobType: '',
    experience: '',
    skills: '',
    description: '',
    responsibilities: ''
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
      const res = await axios.post(`${API_BASE_URL}/careers`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.status === 200 || res.status === 201) {
        setSuccess('Career added successfully!');
        setTimeout(() => navigate('/dms/job-post'), 1000);
      } else {
        setError('Failed to add career. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <AdminLayout>
      <div className='dms-container'>
        <h4>Add New Career</h4>

        <div className='dms-form-container'>
          {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="dms-form-group">
              <Form.Label>Job Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                placeholder="Enter job title"
                value={formData.title}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Department</Form.Label>
              <Form.Control
                type="text"
                name="department"
                placeholder="Enter department"
                value={formData.department}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                placeholder="Enter job location"
                value={formData.location}
                onChange={handleChange}
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
                placeholder="Enter number of positions"
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
                placeholder="e.g. 3+ years"
                value={formData.experience}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Skills (comma-separated)</Form.Label>
              <Form.Control
                type="text"
                name="skills"
                placeholder="e.g. JavaScript, React, Node.js"
                value={formData.skills}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Job Description</Form.Label>
              <QuillEditor
                value={formData.description}
                onChange={(value) =>
                  setFormData(prev => ({ ...prev, description: value }))
                }
              />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Responsibilities</Form.Label>
              <QuillEditor
                value={formData.responsibilities}
                onChange={(value) =>
                  setFormData(prev => ({ ...prev, responsibilities: value }))
                }
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
