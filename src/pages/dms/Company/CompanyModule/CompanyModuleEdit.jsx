import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';
import axios from 'axios';
import { QuillEditor } from '../../../../components/dms/QuillEditor/QuillEditor';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const CompanyModuleEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { module } = location.state || {};
  const token = JSON.parse(localStorage.getItem("userData"))?.token;
  const moduleId = "company_module"; // 🔹 module_id for all API requests

  const [formData, setFormData] = useState({
    parent_menu_id: '',
    secondary_menu_id: '',
    module_name: '',
    module_url: '',
    description: '',
  });

  const [parentMenus, setParentMenus] = useState([]);
  const [secondaryMenus, setSecondaryMenus] = useState([]);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchSecondaryMenus = async (parentId, autoSelect = false) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getAllChildMenuById/${parentId}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { module_id: moduleId }, // 🔹 module_id
      });
      const data = response.data?.data || [];
      setSecondaryMenus(data);

      if (autoSelect && module?.childMenuName) {
        const selectedSecondary = data.find(menu => menu.name === module.childMenuName);
        if (selectedSecondary) {
          setFormData(prev => ({
            ...prev,
            secondary_menu_id: selectedSecondary.id.toString(),
          }));
        }
      }
    } catch (err) {
      console.error('Error fetching secondary menus:', err);
      setSecondaryMenus([]);
    }
  };

  useEffect(() => {
    const fetchParentMenus = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/getAllParentMenu`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { module_id: moduleId }, // 🔹 module_id
        });
        setParentMenus(response.data?.data || []);
      } catch (err) {
        console.error('Error fetching parent menus:', err);
        setParentMenus([]);
      }
    };

    fetchParentMenus();
  }, []);

  useEffect(() => {
    const initParentMenu = async () => {
      if (module && parentMenus.length > 0 && !hasInitialized) {
        const selectedParent = parentMenus.find(menu => menu.name === module.parentMenuName);
        const parentId = selectedParent?.id?.toString() || '';

        setFormData(prev => ({
          ...prev,
          parent_menu_id: parentId,
          module_name: module.moduleName || '',
          module_url: module.moduleUrl || '',
          description: module.description || '',
        }));

        await fetchSecondaryMenus(parentId, true);
        setHasInitialized(true);
      }
    };

    initParentMenu();
  }, [module, parentMenus, hasInitialized]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'parent_menu_id') {
      setFormData(prev => ({
        ...prev,
        parent_menu_id: value,
        secondary_menu_id: '',
      }));
      fetchSecondaryMenus(value);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.module_name.trim()) return setError('Module Name is required.');
    if (!formData.module_url.trim()) return setError('Module URL is required.');
    if (!formData.description.trim()) return setError('Description is required.');

    try {
      setIsLoading(true);
      setError('');

      const response = await axios.put(
        `${API_BASE_URL}/updateModule/${module.id}`,
        {
          moduleName: formData.module_name,
          moduleUrl: formData.module_url,
          description: formData.description,
          menuId: formData.parent_menu_id,
          childmenuId: formData.secondary_menu_id || "0",
          module_id: moduleId, // 🔹 include module_id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // 🔹 added Authorization header
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        setSuccessMessage(response.data.message || 'Module updated successfully.');
        setTimeout(() => navigate('/dms/module'), 1500);
      } else {
        setError(response.data.message || 'Update failed.');
      }
    } catch (err) {
      console.error('Error updating module:', err);
      setError('Failed to update module. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Container className="dms-container">
        <h4>Edit Module</h4>
        <div className="dms-form-container">
          {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
          {successMessage && (
            <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>
              {successMessage}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="dms-form-group">
              <Form.Label>Parent Menu</Form.Label>
              <Form.Select name="parent_menu_id" value={formData.parent_menu_id} onChange={handleChange}>
                <option value="">-- Select Parent Menu --</option>
                {parentMenus.map(menu => (
                  <option key={menu.id} value={menu.id.toString()}>{menu.name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Secondary Menu</Form.Label>
              <Form.Select name="secondary_menu_id" value={formData.secondary_menu_id} onChange={handleChange}>
                <option value="">-- Select Secondary Menu --</option>
                {secondaryMenus.map(menu => (
                  <option key={menu.id} value={menu.id}>{menu.name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Module Name</Form.Label>
              <Form.Control
                type="text"
                name="module_name"
                value={formData.module_name}
                onChange={handleChange}
                placeholder="Enter module name"
                required
              />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Module URL</Form.Label>
              <Form.Control
                type="text"
                name="module_url"
                value={formData.module_url}
                onChange={handleChange}
                placeholder="Enter module URL"
                required
              />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Description</Form.Label>
              {hasInitialized && (
                <QuillEditor
                  key={formData.module_name}
                  value={formData.description}
                  onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                />
              )}
            </Form.Group>

            <div className="save-and-cancel-btn mt-4">
              <Button type="submit" className="me-2" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save changes'}
              </Button>
              <Button variant="secondary" onClick={() => navigate('/dms/module')}>
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      </Container>
    </AdminLayout>
  );
};
