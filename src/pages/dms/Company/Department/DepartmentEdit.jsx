import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Container, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';
import { QuillEditor } from '../../../../components/dms/QuillEditor/QuillEditor';
import { getModuleId, getToken } from '../../../../utils/authhelper';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const DepartmentEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { department } = location.state || {};

  const [formData, setFormData] = useState({
    id: '',
    departmentName: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (department && !hasInitialized) {
      setFormData({
        id: department.id || '',
        departmentName: department.departmentName || '',
        description: department.description || ''
      });
      setHasInitialized(true);
    }
  }, [department, hasInitialized]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.departmentName.trim()) {
      setError('Department Name is required!');
      return;
    }

    if (!formData.description.trim()) {
      setError('Description is required!');
      return;
    }

    try {
      const token = getToken(); // use helper
      const moduleId = getModuleId('department'); // dynamic module id

      const response = await axios.put(
        `${API_BASE_URL}/updateDepartment/${formData.id}`,
        {
          departmentName: formData.departmentName,
          description: formData.description,
          module_id: moduleId, // include module_id in body
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setSuccess(response.data.message || 'Department updated successfully.');
        setTimeout(() => navigate('/dms/department'), 1500);
      } else {
        setError(response.data.message || 'Something went wrong.');
      }
    } catch (err) {
      console.error('Update failed:', err);
      setError('Failed to update department. Please try again later.');
    }
  };

  return (
    <AdminLayout>
      <Container className="dms-container">
        <h4>Edit Department</h4>
        <div className="dms-form-container">

          {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
          {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="dms-form-group mt-3">
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

            <Form.Group className="dms-form-group mt-3">
              <Form.Label>Description</Form.Label>
              {hasInitialized && (
                <QuillEditor
                  key={formData.id}
                  value={formData.description}
                  onChange={(value) =>
                    setFormData(prev => ({ ...prev, description: value }))
                  }
                />
              )}
            </Form.Group>

            <div className="save-and-cancel-btn mt-4">
              <Button type="submit" className="me-2">Save Changes</Button>
              <Button variant="secondary" onClick={() => navigate('/dms/department')}>Cancel</Button>
            </div>
          </Form>
        </div>
      </Container>
    </AdminLayout>
  );
};
