import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';
import axios from 'axios';
import { QuillEditor } from '../../../../components/dms/QuillEditor/QuillEditor';
import Select from 'react-select';
import { getModuleId, getToken } from '../../../../utils/authhelper';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const EmployeeRoleEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = location.state || {};

  const token = getToken();
  const moduleId = getModuleId("role");

  const [modules, setModules] = useState([]);
  const [selectedModules, setSelectedModules] = useState([]);
  const [roleName, setRoleName] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [loadingModules, setLoadingModules] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch all modules and role details together
  useEffect(() => {
    const fetchModulesAndRole = async () => {
      try {
        // 1️⃣ Fetch all modules
        const moduleResp = await axios.get(`${API_BASE_URL}/getAllModules`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { page: 1, limit: 100, module_id: moduleId },
        });

        const moduleList = moduleResp.data?.data?.result || [];
        const flattened = moduleList
          .filter((mod) => mod.is_active)
          .map((mod) => ({
            value: mod.id,
            label: `${mod.parentMenuName || '--'} > ${mod.childMenuName || '--'} > ${mod.moduleName}`,
          }));
        setModules(flattened);

        // 2️⃣ Fetch full role details
        const roleResp = await axios.get(`${API_BASE_URL}/getRoleById/${role?.id}`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { module_id: moduleId }, // 🔹 include module_id
        });

        if (roleResp.data.success) {
          const fullRole = roleResp.data.data;

          setRoleName(fullRole.roleName || '');
          setResponsibilities(fullRole.responsibility || '');

          const modIds = fullRole.Modules?.map((mod) => mod.id) || [];
          const preSelected = flattened.filter((opt) => modIds.includes(opt.value));
          setSelectedModules(preSelected);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load modules or role details.');
      } finally {
        setLoadingModules(false);
      }
    };

    if (role?.id) fetchModulesAndRole();
  }, [role, token, moduleId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roleName.trim() || selectedModules.length === 0) {
      setError('Role name and at least one module selection are required.');
      return;
    }

    const payload = {
      roleName: roleName.trim(),
      responsibility: responsibilities.trim(),
      moduleId: selectedModules.map((mod) => mod.value),
      module_id: moduleId, // 🔹 include module_id in body
    };

    try {
      const response = await axios.put(
        `${API_BASE_URL}/updateRole/${role?.id}`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          params: { module_id: moduleId }, // 🔹 include module_id in query
        }
      );

      if (response.data.success) {
        setSuccess('Role updated successfully!');
        setTimeout(() => navigate('/dms/role'), 1500);
      } else {
        setError(response.data.message || 'Failed to update role');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update role. Please try again later.');
    }
  };

  return (
    <AdminLayout>
      <div className="dms-container">
        <h4>Edit Role</h4>
        <div className="dms-form-container">
          {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
          {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

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
                <Button type="submit" className="me-2">Save Changes</Button>
                <Button variant="secondary" onClick={() => navigate('/dms/role')}>Cancel</Button>
              </div>
            </Form>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
