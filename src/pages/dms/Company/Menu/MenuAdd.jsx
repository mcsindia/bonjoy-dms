import React, { useState, useEffect } from 'react';
import { Button, Container, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';
import axios from 'axios';
import { getModuleId, getToken } from '../../../../utils/authhelper';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const MenuAdd = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        parent_id: '0',
    });

    const [parentMenus, setParentMenus] = useState([]);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const token = getToken();
    const moduleId = getModuleId('menu'); // dynamic module ID

    useEffect(() => {
        fetchParentMenus();
    }, []);

    const fetchParentMenus = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/getAllParentMenu`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { module_id: moduleId } // dynamic module_id
            });

            if (res.data.success && Array.isArray(res.data.data)) {
                setParentMenus(res.data.data);
            }
        } catch (err) {
            console.error("Error fetching parent menus:", err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) return setError('Menu Name is required.');

        setError('');
        setIsLoading(true);

        try {
            const res = await axios.post(
                `${API_BASE_URL}/createMenu`,
                {
                    name: formData.name.trim(),
                    parent_id: formData.parent_id,
                    module_id: moduleId, // include dynamic module_id
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (res.data?.success) {
                setSuccessMessage('Menu created successfully!');
                setFormData({ name: '', parent_id: '0' });

                setTimeout(() => navigate('/dms/menu'), 1500);
            } else {
                setError(res.data?.message || 'Failed to create menu.');
            }
        } catch (err) {
            console.error("Create menu error:", err);
            setError(err?.response?.data?.message || 'Something went wrong.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AdminLayout>
            <Container className="dms-container">
                <h4>Add New Menu</h4>

                <div className="dms-form-container">
                    {error && (
                        <Alert variant="danger" onClose={() => setError('')} dismissible>
                            {error}
                        </Alert>
                    )}

                    {successMessage && (
                        <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>
                            {successMessage}
                        </Alert>
                    )}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="dms-form-group">
                            <Form.Label>Parent Menu</Form.Label>
                            <Form.Select
                                name="parent_id"
                                value={formData.parent_id}
                                onChange={handleChange}
                            >
                                <option value="0">No Parent</option>
                                {parentMenus.map(menu => (
                                    <option key={menu.id} value={menu.id}>
                                        {menu.name}
                                    </option>
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

                        <div className="save-and-cancel-btn">
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
