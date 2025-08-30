import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';

export const DriverEarningAdd = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    driver_id: '',
    ride_id: '',
    base_fare: '',
    distance_fare: '',
    time_fare: '',
    surge_fare: '',
    tips: '',
    bonuses: '',
    cancellation_fee: '',
    deductions: '',
    service_fee: '',
    total_earnings: '',
    status: '',
    created_at: '',
    updated_at: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const requiredFields = ['driver_id', 'ride_id', 'base_fare', 'distance_fare', 'time_fare', 'service_fee', 'total_earnings', 'status', 'created_at', 'updated_at'];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      setError(`Please fill out all required fields.`);
      return;
    }

    console.log('Earning Added:', formData);
    navigate('/dms/driver-earnings');
  };

  return (
    <AdminLayout>
      <div className='dms-container'>
        <h4>Add Driver Earning</h4>
        <div className='dms-form-container'>
          {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="dms-form-group">
              <Form.Label>Driver ID</Form.Label>
              <Form.Control type="text" name="driver_id" placeholder="Enter Driver ID" value={formData.driver_id} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Ride ID</Form.Label>
              <Form.Control type="text" name="ride_id" placeholder="Enter Ride ID" value={formData.ride_id} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Base Fare</Form.Label>
              <Form.Control type="number" step="0.01" name="base_fare" placeholder="₹" value={formData.base_fare} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Distance Fare</Form.Label>
              <Form.Control type="number" step="0.01" name="distance_fare" placeholder="₹" value={formData.distance_fare} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Time Fare</Form.Label>
              <Form.Control type="number" step="0.01" name="time_fare" placeholder="₹" value={formData.time_fare} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Surge Fare</Form.Label>
              <Form.Control type="number" step="0.01" name="surge_fare" placeholder="₹" value={formData.surge_fare} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Tips</Form.Label>
              <Form.Control type="number" step="0.01" name="tips" placeholder="₹" value={formData.tips} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Bonuses</Form.Label>
              <Form.Control type="number" step="0.01" name="bonuses" placeholder="₹" value={formData.bonuses} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Cancellation Fee</Form.Label>
              <Form.Control type="number" step="0.01" name="cancellation_fee" placeholder="₹" value={formData.cancellation_fee} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Deductions</Form.Label>
              <Form.Control type="number" step="0.01" name="deductions" placeholder="₹" value={formData.deductions} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Service Fee</Form.Label>
              <Form.Control type="number" step="0.01" name="service_fee" placeholder="₹" value={formData.service_fee} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Total Earnings</Form.Label>
              <Form.Control type="number" step="0.01" name="total_earnings" placeholder="₹" value={formData.total_earnings} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Status</Form.Label>
              <Form.Select name="status" value={formData.status} onChange={handleChange} required>
                <option value="">Select Status</option>
                <option value="Pending">Pending</option>
                <option value="Processed">Processed</option>
                <option value="Paid">Paid</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Created At</Form.Label>
              <Form.Control type="datetime-local" name="created_at" value={formData.created_at} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="dms-form-group">
              <Form.Label>Updated At</Form.Label>
              <Form.Control type="datetime-local" name="updated_at" value={formData.updated_at} onChange={handleChange} required />
            </Form.Group>

            <div className="save-and-cancel-btn">
              <Button type="submit" className="me-2">Save changes</Button>
              <Button type='cancel' onClick={() => navigate('/dms/drivers-earning')}>Cancel</Button>
            </div>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
};
