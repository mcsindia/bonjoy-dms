import React, { useState, useEffect } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';
import { QuillEditor } from '../../../../components/dms/QuillEditor/QuillEditor';
import axios from 'axios';
import Select from 'react-select';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const EmployeeRoleAdd = () => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [modules, setModules] = useState([]);
  const [loadingModules, setLoadingModules] = useState(true);
  const [selectedModules, setSelectedModules] = useState([]);

  const [formData, setFormData] = useState({
    role_name: '',
    responsibility: '',
  });

  const token = JSON.parse(localStorage.getItem("userData"))?.token;

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/getAllModules`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page: 1,
            limit: 100,
            module_id: "role", 
          },
        });

        const result = response.data?.data?.result || [];

        const flattenedModules = result
          .filter(mod => mod.is_active)
          .map(mod => ({
            value: mod.id,
            label: `${mod.parentMenuName || '--'} > ${mod.childMenuName || '--'} > ${mod.moduleName}`
          }));

        setModules(flattenedModules);
      } catch (err) {
        console.error('Error fetching modules:', err);
      } finally {
        setLoadingModules(false);
      }
    };

    fetchModules();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const missingFields = [];
    if (!formData.role_name.trim()) missingFields.push("Role Name");
    if (!formData.responsibility.trim()) missingFields.push("Description");
    if (selectedModules.length === 0) missingFields.push("Modules");

    if (missingFields.length > 0) {
      setError(`Please fill the following field: ${missingFields.join(', ')}`);
      return;
    }

    try {
      const res = await axios.post(
        `${API_BASE_URL}/createRole?module_id=role`,
        {
          roleName: formData.role_name,
          responsibility: formData.responsibility,
          moduleId: selectedModules.map(mod => mod.value),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setSuccess('Role added successfully!');
        setTimeout(() => navigate('/dms/role'), 1500);
      } else {
        // Check if backend sends a duplicate error
        if (res.data.message?.toLowerCase().includes('already exists')) {
          setError(`Role "${formData.role_name}" already exists. Please choose a different name.`);
        } else {
          setError(res.data.message || 'Failed to add role.');
        }
      }
    } catch (err) {
      console.error('Error creating role:', err.response?.data || err.message);

      const apiMessage = err.response?.data?.message;

      if (apiMessage?.toLowerCase() === 'validation error') {
        // Show user-friendly message
        setError(`Role "${formData.role_name}" already exists. Please choose a different name.`);
      } else {
        setError(apiMessage || 'Something went wrong. Please try again.');
      }
    }
  };

  return (
    <AdminLayout>
      <div className="dms-container">
        <h4>Add New Role</h4>
        <div className="dms-form-container">
          {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
          {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

          {loadingModules ? (
            <div className="text-center my-4">
              <div>Loading modules...</div>
            </div>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="dms-form-group">
                <Form.Label>Role Name</Form.Label>
                <Form.Control
                  type="text"
                  name="role_name"
                  placeholder="Enter role name"
                  value={formData.role_name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="dms-form-group">
                <Form.Label>Select Modules</Form.Label>
                <Select
                  isMulti
                  options={modules}
                  value={selectedModules}
                  onChange={setSelectedModules}
                  placeholder="Select modules..."
                />
              </Form.Group>

              <Form.Group className="dms-form-group">
                <Form.Label>Description</Form.Label>
                <QuillEditor
                  value={formData.responsibility}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, responsibility: value }))
                  }
                />
              </Form.Group>

              <div className="save-and-cancel-btn">
                <Button type="submit" className="me-2">Save changes</Button>
                <Button variant="secondary" onClick={() => navigate('/dms/role')}>Cancel</Button>
              </div>
            </Form>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
