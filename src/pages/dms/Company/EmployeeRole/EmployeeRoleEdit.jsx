import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';
import axios from 'axios';
import { QuillEditor } from '../../../../components/dms/QuillEditor/QuillEditor';
import Select from 'react-select';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const EmployeeRoleEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = location.state || {};
  const [modules, setModules] = useState([]);
  const [selectedModules, setSelectedModules] = useState([]);
  const [roleName, setRoleName] = useState(role?.role || '');
  const [responsibilities, setResponsibilities] = useState(role?.responsibility || '');
  const [loadingModules, setLoadingModules] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = JSON.parse(localStorage.getItem("userData"))?.token;

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/getAllModules?page=1&limit=100`);

        // Flatten the nested module structure
        const moduleList = response.data?.data.result || [];

        const flattened = moduleList
          .filter((mod) => mod.is_active)
          .map((mod) => ({
            value: mod.id,
            label: `${mod.parentMenuName || '--'} > ${mod.childMenuName || '--'} > ${mod.moduleName}`,
          }));

        setModules(flattened);

        // Pre-select modules if role.moduleIds exist
        if (role?.moduleIds?.length) {
          const preSelected = flattened.filter((mod) =>
            role.moduleIds.includes(mod.value)
          );
          setSelectedModules(preSelected);
        }

        setModules(flattened);

        // Pre-select modules based on role data
        if (role?.moduleIds?.length) {
          const preSelected = flattened.filter((mod) =>
            role.moduleIds.includes(mod.value)
          );
          setSelectedModules(preSelected);
        }
      } catch (err) {
        console.error('Error fetching modules:', err);
        setError('Failed to load modules');
      } finally {
        setLoadingModules(false);
      }
    };

    fetchModules();
  }, [role]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!roleName || selectedModules.length === 0) {
      setError('Role name and at least one module selection are required.');
      return;
    }

    const updatedRole = {
      roleName: roleName,
      responsibility: responsibilities,
      moduleId: selectedModules.map((mod) => mod.value),
    };

    try {
      const response = await axios.put(
        `${API_BASE_URL}/updateRole/${role?.id}`,
        updatedRole,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setSuccess('Role updated successfully!');
        setTimeout(() => navigate('/dms/role'), 1500);
      } else {
        setError(response.data.message || 'Failed to update role');
      }
    } catch (err) {
      console.error('Error updating role:', err);
      setError('Failed to update role. Please try again later.');
    }
  };

  useEffect(() => {
    const fetchRoleDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/getRoleById/${role?.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data.success) {
          const fullRole = response.data.data;
          setRoleName(fullRole.roleName);
          setResponsibilities(fullRole.responsibility);

          const modIds = fullRole.Modules?.map(mod => mod.id) || [];

          // After setting module options
          const preSelected = modules.filter((opt) => modIds.includes(opt.value));
          setSelectedModules(preSelected);
        }
      } catch (err) {
        console.error('Error fetching full role data:', err);
        setError('Failed to load full role details.');
      }
    };

    if (modules.length > 0 && role?.id) {
      fetchRoleDetails();
    }
  }, [modules]);


  return (
    <AdminLayout>
      <div className="dms-container">
        <h4>Edit Role</h4>
        <div className="dms-form-container">
          {error && (
            <Alert variant="danger" onClose={() => setError('')} dismissible>
              {error}
            </Alert>
          )}
          {success && (
            <Alert variant="success" onClose={() => setSuccess('')} dismissible>
              {success}
            </Alert>
          )}

          {loadingModules ? (
            <div className="text-center my-4">Loading role details...</div>
          ) : (
            <Form onSubmit={handleSubmit}>
              {/* Role Name */}
              <Form.Group controlId="roleName" className="dms-form-group">
                <Form.Label>Role Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter role name"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  required
                />
              </Form.Group>

              {/* Module Selection */}
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

              {/* Responsibility */}
              <Form.Group controlId="responsibilities" className="dms-form-group">
                <Form.Label>Description</Form.Label>
                <QuillEditor
                  value={responsibilities}
                  onChange={(value) => setResponsibilities(value)}
                />
              </Form.Group>

              {/* Buttons */}
              <div className="save-and-cancel-btn">
                <Button type="submit" className="me-2">
                  Save Changes
                </Button>
                <Button variant="secondary" onClick={() => navigate('/dms/role')}>
                  Cancel
                </Button>
              </div>
            </Form>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
