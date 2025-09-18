import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const MenuEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { menu } = location.state || {};

  const [formData, setFormData] = useState({
    name: '',
    parent_id: '0',
  });

  const [parentMenus, setParentMenus] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const userData = JSON.parse(localStorage.getItem('userData')) || {};
  const token = userData?.token;

  useEffect(() => {
    fetchParentMenus();
  }, []);

  useEffect(() => {
    if (menu) {
      setFormData({
        name: menu.name || '',
        parent_id: menu.parent?.id?.toString() || '0',
      });
    }
  }, [menu]);

  const fetchParentMenus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getAllParentMenu?module_id=menu`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data?.success) {
        setParentMenus(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch parent menus:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.name.trim()) return setError('Menu Name is required.');

  setIsLoading(true);
  setError('');

  try {
    const payload = {
      ...formData,
      module_id: "menu"
    };

    const res = await axios.put(
      `${API_BASE_URL}/updateMenu/${menu.id}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.data?.success) {
      setSuccessMessage('Menu updated successfully!');
      setTimeout(() => navigate('/dms/menu'), 1500);
    } else {
      setError(res.data?.message || 'Failed to update menu.');
    }
  } catch (err) {
    console.error('Update menu error:', err);
    setError(err?.response?.data?.message || 'Something went wrong.');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <AdminLayout>
      <Container className="dms-container">
        <h4>Edit Menu</h4>

        <div className="dms-form-container">
          {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
          {successMessage && <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>{successMessage}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="dms-form-group">
              <Form.Label>Parent Menu</Form.Label>
              <Form.Select name="parent_id" value={formData.parent_id} onChange={handleChange}>
                <option value="0">No Parent</option>
                {parentMenus.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Menu Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter menu name"
                required
              />
            </Form.Group>

            <div className="save-and-cancel-btn mt-4">
              <Button type="submit" className="me-2" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save changes'}
              </Button>
              <Button variant="secondary" onClick={() => navigate('/dms/menu')}>
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      </Container>
    </AdminLayout>
  );
};
