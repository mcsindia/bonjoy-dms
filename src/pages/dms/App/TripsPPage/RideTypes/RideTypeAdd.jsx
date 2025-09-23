import React, { useState } from 'react';
import { Button, Container, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';
import axios from 'axios';
import { QuillEditor } from '../../../../../components/dms/QuillEditor/QuillEditor';
import { getModuleId, getToken } from '../../../../../utils/authhelper';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const RideTypeAdd = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    fareMultiplier: '',
    description: '',
    status: 'Active'
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('Ride Type Name is required.');
      return;
    }

    if (!formData.fareMultiplier || isNaN(formData.fareMultiplier)) {
      setError('Fare Multiplier must be a number.');
      return;
    }

    if (!formData.description.trim()) {
      setError('Description is required.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const token = getToken(); 
      const moduleId = getModuleId('ridetypes'); 

      const response = await axios.post(
        `${API_BASE_URL}/createRideType`,
        {
          name: formData.name,
          multiplier: parseFloat(formData.fareMultiplier),
          description: formData.description,
          status: formData.status,
          module_id: moduleId, 
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setSuccessMessage(response.data.message || 'Ride Type created successfully.');
        setFormData({ name: '', fareMultiplier: '', description: '', status: 'Active' });

        setTimeout(() => {
          navigate('/dms/ridetypes');
        }, 1500);
      } else {
        setError(response.data.message || 'Something went wrong.');
      }
    } catch (err) {
      console.error('Error adding ride type:', err);
      setError('Failed to add ride type. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Container className="dms-container">
        <h4>Add New Ride Type</h4>
        <div className="dms-form-container">
          {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
          {successMessage && <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>{successMessage}</Alert>}

          <Form onSubmit={handleSubmit}>
            {/* Name */}
            <Form.Group className="dms-form-group">
              <Form.Label>Ride Type Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter ride type name (e.g., Normal, Emergency, Rental)"
                required
              />
            </Form.Group>

            {/* Fare Multiplier */}
            <Form.Group className="dms-form-group">
              <Form.Label>Fare Multiplier</Form.Label>
              <Form.Control
                type="number"
                step="0.1"
                name="fareMultiplier"
                value={formData.fareMultiplier}
                onChange={handleChange}
                placeholder="Enter fare multiplier (e.g., 1.0, 1.5, 2.0)"
                required
              />
            </Form.Group>

            {/* Description */}
            <Form.Group className="dms-form-group">
              <Form.Label>Description</Form.Label>
              <QuillEditor
                value={formData.description}
                onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
              />
            </Form.Group>

            <div className="save-and-cancel-btn">
              <Button type="submit" className="me-2" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save changes'}
              </Button>
              <Button variant="secondary" onClick={() => navigate('/dms/ridetypes')}>
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      </Container>
    </AdminLayout>
  );
};
