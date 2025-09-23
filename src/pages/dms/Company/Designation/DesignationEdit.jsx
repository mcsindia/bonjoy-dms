import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Container, Form, Alert } from 'react-bootstrap';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';
import axios from 'axios';
import { QuillEditor } from '../../../../components/dms/QuillEditor/QuillEditor';
import { getModuleId, getToken } from '../../../../utils/authhelper';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const DesignationEdit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id, designation, departmentId, description } = location.state;

  const [formData, setFormData] = useState({
    id: id || '',
    designation: designation || '',
    departmentId: departmentId.id || '',
    description: description || '',
  });

  const [departmentList, setDepartmentList] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const moduleId = getModuleId('designation'); // dynamic module ID

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const token = getToken();
        const response = await axios.get(`${API_BASE_URL}/getAllDepartments`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { module_id: moduleId },
        });

        if (response.data.success && Array.isArray(response.data.data.data)) {
          setDepartmentList(response.data.data.data);
        } else {
          setError('Failed to load departments.');
        }
      } catch (err) {
        console.error('Error fetching departments:', err);
        setError('Error fetching departments. Please try again later.');
      }
    };

    fetchDepartments();
  }, [moduleId]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = {
      designation: formData.designation,
      departmentId: formData.departmentId,
      description: formData.description,
      module_id: moduleId, // include dynamic module_id
    };

    try {
      const token = getToken();
      const response = await axios.put(
        `${API_BASE_URL}/updateDesiganation/${formData.id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        setSuccessMessage('Designation updated successfully!');
        setTimeout(() => navigate('/dms/designation'), 1500);
      } else {
        setError(response.data.message || 'Failed to update designation');
      }
    } catch (err) {
      console.error('Error updating designation:', err);
      setError(err.response?.data?.message || 'Backend error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Container className="dms-container">
        <h4>Edit Designation Details</h4>
        <div className="dms-form-container">
          {error && <Alert variant="danger">{error}</Alert>}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}

          <Form onSubmit={handleSave}>
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
                {departmentList.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.departmentName}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            {/* Designation Name */}
            <Form.Group className="dms-form-group">
              <Form.Label>Designation Name</Form.Label>
              <Form.Control
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

            <div className="save-and-cancel-btn">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                variant="secondary"
                className="ms-2"
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
