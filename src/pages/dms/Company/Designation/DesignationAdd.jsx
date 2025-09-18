import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Form, Alert } from 'react-bootstrap';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';
import axios from 'axios';
import { QuillEditor } from '../../../../components/dms/QuillEditor/QuillEditor';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const DesignationAdd = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    designation: '',
    description: '',
    departmentId: '',
  });

  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch Departments from backend
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("userData"))?.token;
        const response = await axios.get(`${API_BASE_URL}/getAllDepartments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            module_id: "designation",
          },
        });

        if (response.data.success && Array.isArray(response.data.data.data)) {
          setDepartments(response.data.data.data);
        } else {
          setError('Failed to load departments.');
        }
      } catch (err) {
        console.error('Error fetching departments:', err);
        setError('Error fetching departments. Please try again later.');
      }
    };

    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.departmentId) {
      setError('Please select a department.');
      setIsLoading(false);
      return;
    }

    if (!formData.designation.trim()) {
      setError('Designation is required.');
      setIsLoading(false);
      return;
    }

    if (!formData.description.trim()) {
      setError('Description is required.');
      setIsLoading(false);
      return;
    }

    const data = {
      departmentId: parseInt(formData.departmentId, 10),
      designation: formData.designation,
      description: formData.description,
      module_id: "designation",
    };

    try {
      const token = JSON.parse(localStorage.getItem("userData"))?.token;
      const response = await axios.post(`${API_BASE_URL}/createDesignation`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        setSuccessMessage(response.data.message);
        setFormData({ designation: '', description: '', departmentId: '' });
        setTimeout(() => navigate('/dms/designation'), 2000);
      } else {
        setError(response.data.message || 'Failed to create designation.');
      }
    } catch (err) {
      console.error('Error creating designation:', err);
      setError('Failed to create designation. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Container className="dms-container">
        <h4>Add Designation</h4>
        <div className="dms-form-container">
          {error && <Alert variant="danger">{error}</Alert>}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}

          <Form onSubmit={handleSubmit}>
            {/* Department Dropdown */}
            <Form.Group className="dms-form-group">
              <Form.Label>Department</Form.Label>
              <Form.Control
                as="select"
                name="departmentId"
                value={formData.departmentId}
                onChange={handleChange}
                required
              >
                <option value="">Select a department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.departmentName}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            {/* Designation */}
            <Form.Group className="dms-form-group">
              <Form.Label>Designation</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Description with Quill Editor */}
            <Form.Group className="dms-form-group">
              <Form.Label>Description</Form.Label>
              <QuillEditor
                value={formData.description}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, description: value }))
                }
              />
            </Form.Group>

            {/* Buttons */}
            <div className="save-and-cancel-btn">
              <Button type="submit" className="me-2" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save changes'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/dms/designation')}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      </Container>
    </AdminLayout>
  );
};
