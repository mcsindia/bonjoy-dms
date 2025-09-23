import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';
import { QuillEditor } from '../../../../components/dms/QuillEditor/QuillEditor';
import Select from 'react-select';
import { getModuleId, getToken } from '../../../../utils/authhelper';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const EmployeePermissionEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { permission } = location.state || {};

  const token = getToken();
  const moduleId = getModuleId('permission'); // dynamic module_id

  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [formData, setFormData] = useState({
    permission_name: '',
    description: '',
    permissions: { view: false, add: false, edit: false, delete: false },
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loadingModules, setLoadingModules] = useState(true);

  // Fetch modules
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/getAllModules?page=1&limit=1000`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { module_id: moduleId }, // pass module_id dynamically
        });

        if (res.data.success) {
          const flatData = res.data.data.result || [];
          const formattedModules = flatData
            .filter(mod => mod.is_active)
            .map(mod => ({
              value: mod.id,
              label: `${mod.parentMenuName || '--'} > ${mod.childMenuName || '--'} > ${mod.moduleName}`,
            }));
          setModules(formattedModules);

          // Preselect module if editing
          if (permission?.moduleId) {
            const preSelected = formattedModules.find(m => m.value === permission.moduleId);
            setSelectedModule(preSelected || null);
          }
        } else {
          setError('Failed to fetch modules');
        }
      } catch (err) {
        console.error(err);
        setError('API error while fetching modules');
      } finally {
        setLoadingModules(false);
      }
    };

    fetchModules();
  }, [permission, token, moduleId]);

  // Initialize permissions and description
  useEffect(() => {
    if (permission) {
      const detectedPermissions = {
        view: permission.permission_name.includes('view'),
        add: permission.permission_name.includes('add'),
        edit: permission.permission_name.includes('edit'),
        delete: permission.permission_name.includes('delete'),
      };
      setFormData({
        permission_name: permission.permission_name,
        description: permission.description || '',
        permissions: detectedPermissions,
      });
    }
  }, [permission]);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      permissions: { ...prev.permissions, [name]: checked },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedModule) {
      setError('Module is required.');
      return;
    }

    const selectedPermissions = Object.entries(formData.permissions)
      .filter(([_, value]) => value)
      .map(([key]) => key);

    if (selectedPermissions.length === 0) {
      setError('Select at least one permission.');
      return;
    }

    const payload = {
      moduleId: selectedModule.value, // numeric module ID
      module_id: moduleId,            // dynamic string module_id
      permission_name: selectedPermissions.join(','),
      description: formData.description || 'No description provided',
    };

    try {
      const response = await axios.put(
        `${API_BASE_URL}/updatePermission/${permission.id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );

      if (response.data.success) {
        setSuccess('Permission updated successfully!');
        setTimeout(() => navigate('/dms/permission'), 1000);
      } else {
        setError(response.data.message || 'Failed to update permission.');
      }
    } catch (err) {
      console.error(err);
      setError('API error: Failed to update permission.');
    }
  };

  return (
    <AdminLayout>
      <div className='dms-container'>
        <h4>Edit Permission</h4>
        <div className='dms-form-container'>
          {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
          {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

          {loadingModules ? (
            <div className="text-center my-4">Loading modules...</div>
          ) : (
            <Form onSubmit={handleSubmit}>
              {/* Module Select */}
              <Form.Group className="dms-form-group mt-3">
                <Form.Label>Module</Form.Label>
                <Select
                  options={modules}
                  value={selectedModule}
                  onChange={setSelectedModule}
                  placeholder="Select module..."
                />
              </Form.Group>

              {/* Permissions */}
              <Form.Group className="dms-form-group mt-3">
                <Form.Label>Permissions</Form.Label>
                <div className="d-flex gap-4">
                  {['view', 'add', 'edit', 'delete'].map(perm => (
                    <Form.Check
                      key={perm}
                      type="checkbox"
                      label={perm.charAt(0).toUpperCase() + perm.slice(1)}
                      name={perm}
                      checked={formData.permissions[perm]}
                      onChange={handleCheckboxChange}
                    />
                  ))}
                </div>
              </Form.Group>

              {/* Description */}
              <Form.Group controlId='description' className="dms-form-group mt-3">
                <Form.Label>Description</Form.Label>
                <QuillEditor
                  value={formData.description}
                  onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                />
              </Form.Group>

              <div className="save-and-cancel-btn mt-4">
                <Button type="submit" className="me-2">Save changes</Button>
                <Button variant="secondary" onClick={() => navigate("/dms/permission")}>Cancel</Button>
              </div>
            </Form>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
