import React, { useState } from 'react';
import { Button, Container, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';
import axios from 'axios';
import { QuillEditor } from '../../../../components/dms/QuillEditor/QuillEditor';
import { getModuleId, getToken } from '../../../../utils/authhelper';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const DepartmentAdd = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    departmentName: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.departmentName.trim()) {
      setError('Department Name is required.');
      return;
    }

    if (!formData.description.trim()) {
      setError('Description is required.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const token = getToken(); // Get token
      const moduleId = getModuleId('department'); // dynamically get module id

      const response = await axios.post(
        `${API_BASE_URL}/createDepartment`,
        {
          departmentName: formData.departmentName,
          description: formData.description,
          module_id: moduleId, // include module_id in body
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        setSuccessMessage(response.data.message || 'Department created successfully.');
        setFormData({ departmentName: '', description: '' });

        setTimeout(() => {
          navigate('/dms/department');
        }, 2000);
      } else {
        setError(response.data.message || 'Something went wrong.');
      }
    } catch (err) {
      console.error('Error adding department:', err);
      setError('Failed to add department. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Container className="dms-container">
        <h4>Add New Department</h4>
        <div className="dms-form-container">
          {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
          {successMessage && <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>{successMessage}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="dms-form-group">
              <Form.Label>Department Name</Form.Label>
              <Form.Control
                type="text"
                name="departmentName"
                value={formData.departmentName}
                onChange={handleChange}
                placeholder="Enter department name"
                required
              />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Description</Form.Label>
              <QuillEditor
                value={formData.description}
                onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
              />
            </Form.Group>

            <div className="save-and-cancel-btn">
              <Button type="submit" className="me-2" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save changes'}
              </Button>
              <Button variant="secondary" onClick={() => navigate('/dms/department')}>
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      </Container>
    </AdminLayout>
  );
};
