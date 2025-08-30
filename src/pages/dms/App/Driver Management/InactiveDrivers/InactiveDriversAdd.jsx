import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';

export const InactiveDriversAdd = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    driver_id: '',
    full_name: '',
    vehicle_id: '',
    inactive_reason: '',
    inactive_type: 'Temporary',
    suspended_at: '',
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
    if (!formData.driver_id || !formData.full_name || !formData.vehicle_id || !formData.inactive_reason || !formData.suspended_at) {
      setError('All fields are required except Suspension Type.');
      return;
    }
    console.log('Suspended Driver Added:', formData);
    navigate('/dms/inactive-drivers');
  };

  return (
    <AdminLayout>
      <div className='dms-container'>
        <h4>Add Inactive Driver</h4>
        <div className='dms-form-container'>
          {error && <Alert variant='danger' onClose={() => setError('')} dismissible>{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className='dms-form-group'>
              <Form.Label>Driver ID</Form.Label>
              <Form.Control type='text' name='driver_id' placeholder='Enter Driver ID' value={formData.driver_id} onChange={handleChange} required />
            </Form.Group>
            
            <Form.Group className='dms-form-group'>
              <Form.Label>Full Name</Form.Label>
              <Form.Control type='text' name='full_name' placeholder='Enter Full Name' value={formData.full_name} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className='dms-form-group'>
              <Form.Label>Vehicle ID</Form.Label>
              <Form.Control type='text' name='vehicle_id' placeholder='Enter Vehicle ID' value={formData.vehicle_id} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className='dms-form-group'>
              <Form.Label>Inactive Reason</Form.Label>
              <Form.Control as='textarea' rows={3} name='inactive_reason' placeholder='Enter Suspension Reason' value={formData.inactive_reason} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className='dms-form-group'>
              <Form.Label>Inactive Type</Form.Label>
              <Form.Select name='inactive_type' value={formData.inactive_type} onChange={handleChange}>
                <option value='Temporary'>Temporary</option>
                <option value='Permanent'>Permanent</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className='dms-form-group'>
              <Form.Label>Inactive At</Form.Label>
              <Form.Control type='datetime-local' name='suspended_at' value={formData.suspended_at} onChange={handleChange} required />
            </Form.Group>

            <div className='save-and-cancel-btn'>
              <Button type='submit' className='me-2'>Save changes</Button>
              <Button type='cancel' onClick={() => navigate('/dms/inactive-drivers')}>Cancel</Button>
            </div>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
};
