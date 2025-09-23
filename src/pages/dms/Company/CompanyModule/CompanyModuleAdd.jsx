import React, { useState, useEffect } from 'react';
import { Button, Container, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';
import axios from 'axios';
import { QuillEditor } from '../../../../components/dms/QuillEditor/QuillEditor';
import { getModuleId, getToken } from '../../../../utils/authhelper';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const CompanyModuleAdd = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    parent_menu_id: '',
    secondary_menu_id: '',
    module_name: '',
    module_url: '',
  });

  const [parentMenus, setParentMenus] = useState([]);
  const [secondaryMenus, setSecondaryMenus] = useState([]);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const token = getToken();  
  const moduleId = getModuleId("module"); 

  // Fetch secondary menus
  const fetchSecondaryMenus = async (parentId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getAllChildMenuById/${parentId}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { module_id: moduleId }
      });
      setSecondaryMenus(response.data?.data || []);
    } catch (err) {
      console.error('Error fetching secondary menus:', err);
      setSecondaryMenus([]);
    }
  };

  // Fetch parent menus
  useEffect(() => {
    const fetchParentMenus = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/getAllParentMenu`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { module_id: moduleId }
        });
        const result = response.data?.data || [];
        setParentMenus(result);

        if (formData.parent_menu_id) {
          await fetchSecondaryMenus(formData.parent_menu_id);
        }
      } catch (err) {
        console.error('Error fetching parent menus:', err);
        setParentMenus([]);
      }
    };

    fetchParentMenus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'parent_menu_id') {
      setFormData(prev => ({ ...prev, secondary_menu_id: '' }));
      fetchSecondaryMenus(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.module_name.trim()) return setError('Module Name is required.');
    if (!formData.module_url.trim()) return setError('Control URL is required.');
    if (!description.trim()) return setError('Description is required.');

    try {
      setIsLoading(true);
      setError('');

      const payload = {
        moduleName: formData.module_name.trim(),
        moduleUrl: formData.module_url.trim(),
        description: description.trim(),
        menuId: formData.parent_menu_id ? parseInt(formData.parent_menu_id) : 0,
        childmenuId: formData.secondary_menu_id ? parseInt(formData.secondary_menu_id) : 0,
        module_id: moduleId 
      };

      const response = await axios.post(`${API_BASE_URL}/createModule`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setSuccessMessage(response.data.message || 'Module created successfully.');
        setFormData({ parent_menu_id: '', secondary_menu_id: '', module_name: '', module_url: '' });
        setDescription('');
        setTimeout(() => navigate('/dms/module'), 2000);
      } else {
        setError(response.data.message || 'Something went wrong.');
      }
    } catch (err) {
      console.error('Error adding module:', err);
      setError(err.response?.data?.message || 'Failed to add module. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Container className="dms-container">
        <h4>Add New Module</h4>
        <div className="dms-form-container">
          {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
          {successMessage && <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>{successMessage}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="dms-form-group">
              <Form.Label>Parent Menu</Form.Label>
              <Form.Select
                name="parent_menu_id"
                value={formData.parent_menu_id}
                onChange={handleChange}
              >
                <option value="">-- Select Parent Menu --</option>
                {parentMenus.map(menu => (
                  <option key={menu.id} value={menu.id}>{menu.name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Secondary Menu</Form.Label>
              <Form.Select
                name="secondary_menu_id"
                value={formData.secondary_menu_id}
                onChange={handleChange}
              >
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
              <QuillEditor value={description} onChange={setDescription} />
            </Form.Group>

            <div className="save-and-cancel-btn">
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
