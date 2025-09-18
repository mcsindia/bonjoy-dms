import React, { useState, useEffect } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';
import { QuillEditor } from '../../../../components/dms/QuillEditor/QuillEditor';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const EmployeePermissionAdd = () => {
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [formData, setFormData] = useState({
    module_id: '', // numeric selected module
    description: '',
    permissions: {
      view: false,
      add: false,
      edit: false,
      delete: false,
    },
  });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loadingModules, setLoadingModules] = useState(true);

  const MODULE_ID = "permission"; // fixed string for API

  // Fetch modules
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/getAllModules?page=1&limit=1000`);
        if (response.data.success) {
          const flatModules = response.data.data.result || [];
          const formattedModules = flatModules
            .filter((mod) => mod.is_active)
            .map((mod) => ({
              id: mod.id,
              moduleName: `${mod.parentMenuName || '--'} > ${mod.childMenuName || '--'} > ${mod.moduleName}`,
            }));
          setModules(formattedModules);
        } else {
          setError('Failed to load modules.');
        }
      } catch (err) {
        console.error('Error fetching modules:', err);
        setError('API error: Failed to load modules.');
      } finally {
        setLoadingModules(false);
      }
    };

    fetchModules();
  }, []);

  const handleModuleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      module_id: e.target.value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [name]: checked,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const missingFields = [];
    if (!formData.module_id) missingFields.push("Module");

    const selectedPermissions = Object.entries(formData.permissions)
      .filter(([_, value]) => value)
      .map(([key]) => key);

    if (selectedPermissions.length === 0) missingFields.push("Permission");

    if (!formData.description || formData.description.trim() === '' || formData.description === '<p><br></p>') {
      missingFields.push("Description");
    }

    if (missingFields.length > 0) {
      setError(`Please fill the following field: ${missingFields.join(', ')}`);
      return;
    }

    try {
      const payload = {
        moduleId: parseInt(formData.module_id), // numeric module ID
        module_id: MODULE_ID,                  // string identifier
        permission_name: selectedPermissions.join(','),
        description: formData.description,
      };

      const response = await axios.post(`${API_BASE_URL}/createPermission`, payload);

      if (response.data.success) {
        setSuccessMsg('Permission created successfully!');
        setTimeout(() => navigate('/dms/permission'), 1000);
      } else {
        setError(response.data.message || 'Failed to create permission.');
      }
    } catch (err) {
      console.error('Error creating permission:', err.response?.data || err.message);
      const apiMessage = err.response?.data?.message;
      setError(apiMessage || 'Something went wrong. Please try again.');
    }
  };

  return (
    <AdminLayout>
      <div className='dms-container'>
        <h4>Add Permission</h4>
        <div className='dms-form-container'>
          {error && (
            <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>
          )}
          {successMsg && (
            <Alert variant="success" onClose={() => setSuccessMsg('')} dismissible>{successMsg}</Alert>
          )}

          {loadingModules ? (
            <div className="text-center my-4">Loading modules...</div>
          ) : (
            <Form onSubmit={handleSubmit}>
              {/* Module Dropdown */}
              <Form.Group className="dms-form-group mt-3">
                <Form.Label>Module</Form.Label>
                <Form.Select
                  name="module_id"
                  value={formData.module_id}
                  onChange={handleModuleChange}
                  required
                >
                  <option value="">Select Module</option>
                  {modules.map(({ id, moduleName }) => (
                    <option key={id} value={id}>{moduleName}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* Permissions */}
              <Form.Group className="dms-form-group mt-3">
                <Form.Label>Permissions</Form.Label>
                <div className="d-flex gap-4">
                  {['view', 'add', 'edit', 'delete'].map((perm) => (
                    <Form.Check
                      key={perm}
                      type="checkbox"
                      label={perm.charAt(0).toUpperCase() + perm.slice(1)}
                      name={perm}
                      checked={formData.permissions[perm]}
                      onChange={handleCheckboxChange}
                      disabled={!formData.module_id}
                    />
                  ))}
                </div>
              </Form.Group>

              {/* Description */}
              <Form.Group className="dms-form-group mt-3">
                <Form.Label>Description</Form.Label>
                <QuillEditor
                  value={formData.description}
                  onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
                />
              </Form.Group>

              <div className="save-and-cancel-btn mt-4">
                <Button type="submit" className="me-2">Save changes</Button>
                <Button variant='secondary' onClick={() => navigate("/dms/permission")}>Cancel</Button>
              </div>
            </Form>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
