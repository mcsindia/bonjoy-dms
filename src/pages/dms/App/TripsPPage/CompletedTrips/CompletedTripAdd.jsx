import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';

export const CompletedTripAdd = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    trip_id: '',
    driver_id: '',
    rider_id: '',
    vehicle_id: '',
    pickup_location: '',
    dropoff_location: '',
    fare_amount: '',
    payment_status: 'Completed',
    trip_distance: '',
    trip_rating: '',
    driver_rating: '',
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
    if (!formData.trip_id || !formData.driver_id || !formData.rider_id || !formData.vehicle_id || !formData.pickup_location || !formData.dropoff_location || !formData.fare_amount || !formData.trip_distance || !formData.trip_rating || !formData.driver_rating) {
      setError('All fields are required.');
      return;
    }
    navigate('/dms/completed-trips');
  };

  return (
    <AdminLayout>
      <div className='dms-container'>
        <h4>Add New Completed Trip</h4>
        <div className='dms-form-container'>
          {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="dms-form-group">
              <Form.Label>Trip ID</Form.Label>
              <Form.Control type="text" name="trip_id" placeholder="Enter Trip ID" value={formData.trip_id} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Driver ID</Form.Label>
              <Form.Control type="text" name="driver_id" placeholder="Enter Driver ID" value={formData.driver_id} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Rider ID</Form.Label>
              <Form.Control type="text" name="rider_id" placeholder="Enter Rider ID" value={formData.rider_id} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Vehicle ID</Form.Label>
              <Form.Control type="text" name="vehicle_id" placeholder="Enter Vehicle ID" value={formData.vehicle_id} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Pickup Location</Form.Label>
              <Form.Control type="text" name="pickup_location" placeholder="Enter Pickup Location" value={formData.pickup_location} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Dropoff Location</Form.Label>
              <Form.Control type="text" name="dropoff_location" placeholder="Enter Dropoff Location" value={formData.dropoff_location} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Fare Amount</Form.Label>
              <Form.Control type="number" step="0.01" name="fare_amount" placeholder="Enter Fare Amount" value={formData.fare_amount} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Trip Distance</Form.Label>
              <Form.Control type="text" name="trip_distance" placeholder="Enter Trip Distance" value={formData.trip_distance} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Trip Rating</Form.Label>
              <Form.Control type="number" step="0.1" name="trip_rating" placeholder="Enter Trip Rating" value={formData.trip_rating} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Driver Rating</Form.Label>
              <Form.Control type="number" step="0.1" name="driver_rating" placeholder="Enter Driver Rating" value={formData.driver_rating} onChange={handleChange} required />
            </Form.Group>

            <div className="save-and-cancel-btn">
              <Button type="submit" className="me-2">Save changes</Button>
              <Button type='cancel' onClick={() => navigate('/dms/completed-trips')}>Cancel</Button>
            </div>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
};
