import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';

export const IdleDriverAdd = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    driver_id: '',
    vehicle_id: '',
    latitude: '',
    longitude: '',
    last_active: '',
    idle_since: '',
    rating: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.driver_id || !formData.vehicle_id || !formData.latitude || !formData.longitude || !formData.last_active || !formData.idle_since || !formData.rating) {
      setError('All fields are required.');
      return;
    }
    navigate('/dms/idle-drivers');
  };

  return (
    <AdminLayout>
      <div className='dms-container'>
        <h4>Add New Idle Driver</h4>
        <div className='dms-form-container'>
          {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="dms-form-group">
              <Form.Label>Driver ID</Form.Label>
              <Form.Control type="text" name="driver_id" placeholder="Enter Driver ID" value={formData.driver_id} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Vehicle ID</Form.Label>
              <Form.Control type="text" name="vehicle_id" placeholder="Enter Vehicle ID" value={formData.vehicle_id} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Latitude</Form.Label>
              <Form.Control type="text" name="latitude" placeholder="Enter Latitude" value={formData.latitude} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Longitude</Form.Label>
              <Form.Control type="text" name="longitude" placeholder="Enter Longitude" value={formData.longitude} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Last Active</Form.Label>
              <Form.Control type="datetime-local" name="last_active" value={formData.last_active} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Idle Since</Form.Label>
              <Form.Control type="datetime-local" name="idle_since" value={formData.idle_since} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Rating</Form.Label>
              <Form.Control type="number" step="0.1" name="rating" placeholder="Enter Rating" value={formData.rating} onChange={handleChange} required />
            </Form.Group>

            <div className="save-and-cancel-btn">
              <Button type="submit" className="me-2">Save changes</Button>
              <Button type='cancel' onClick={() => navigate('/dms/idle-drivers')}>Cancel</Button>
            </div>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
};
