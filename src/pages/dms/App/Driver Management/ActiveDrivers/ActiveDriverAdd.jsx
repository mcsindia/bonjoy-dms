import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';

export const ActiveDriverAdd = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    driver_id: '',
    vehicle_id: '',
    status: 'Active',
    current_lat: '',
    current_lng: '',
    last_seen: '',
    trip_id: '',
    rating: '',
    earnings_today: '',
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
    if (!formData.driver_id || !formData.vehicle_id || !formData.current_lat || !formData.current_lng || !formData.last_seen || !formData.rating || !formData.earnings_today) {
      setError('All fields except Trip ID are required.');
      return;
    }
    navigate('/dms/active-drivers');
  };

  return (
    <AdminLayout>
      <div className='dms-container'>
        <h4>Add New Active Driver</h4>
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
              <Form.Label>Current Latitude</Form.Label>
              <Form.Control type="text" name="current_lat" placeholder="Enter Latitude" value={formData.current_lat} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Current Longitude</Form.Label>
              <Form.Control type="text" name="current_lng" placeholder="Enter Longitude" value={formData.current_lng} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Last Seen</Form.Label>
              <Form.Control type="datetime-local" name="last_seen" value={formData.last_seen} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Trip ID (Optional)</Form.Label>
              <Form.Control type="text" name="trip_id" placeholder="Enter Trip ID" value={formData.trip_id} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Rating</Form.Label>
              <Form.Control type="number" step="0.1" name="rating" placeholder="Enter Rating" value={formData.rating} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Earnings Today</Form.Label>
              <Form.Control type="number" step="0.01" name="earnings_today" placeholder="Enter Earnings" value={formData.earnings_today} onChange={handleChange} required />
            </Form.Group>

            <div className="save-and-cancel-btn">
              <Button type="submit" className="me-2">Save changes</Button>
              <Button type='cancel' onClick={() => navigate('/dms/active-drivers')}>Cancel</Button>
            </div>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
};
