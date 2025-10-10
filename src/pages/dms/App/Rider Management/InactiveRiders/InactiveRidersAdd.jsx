import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';

export const InactiveRidersAdd = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    rider_id: '',
    blocked_by: '',
    reason: '',
    reported_by: '',
    ride_id: '',
    block_type: '',
    start_date: '',
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
    
    if (!formData.rider_id || !formData.blocked_by || !formData.reason || !formData.reported_by || !formData.ride_id || !formData.block_type || !formData.start_date) {
      setError('All fields are required.');
      return;
    }
    navigate('/dms/inactive-riders');
  };

  return (
    <AdminLayout>
      <div className='dms-container'>
        <h4>Add Inactive Rider</h4>
        <div className='dms-form-container'>
          {error && <Alert variant='danger' onClose={() => setError('')} dismissible>{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className='dms-form-group'>
              <Form.Label>Rider ID</Form.Label>
              <Form.Control type='text' name='rider_id' placeholder='Enter Rider ID' value={formData.rider_id} onChange={handleChange} required />
            </Form.Group>
            
            <Form.Group className='dms-form-group'>
              <Form.Label>Blocked By</Form.Label>
              <Form.Control type='text' name='blocked_by' placeholder='Enter Blocker' value={formData.blocked_by} onChange={handleChange} required />
            </Form.Group>
            
            <Form.Group className='dms-form-group'>
              <Form.Label>Reason</Form.Label>
              <Form.Control as='textarea' name='reason' placeholder='Enter Reason' value={formData.reason} onChange={handleChange} rows={3} required />
            </Form.Group>
            
            <Form.Group className='dms-form-group'>
              <Form.Label>Reported By</Form.Label>
              <Form.Control type='text' name='reported_by' placeholder='Enter Reporter ID' value={formData.reported_by} onChange={handleChange} required />
            </Form.Group>
            
            <Form.Group className='dms-form-group'>
              <Form.Label>Trip ID</Form.Label>
              <Form.Control type='text' name='ride_id' placeholder='Enter Trip ID' value={formData.ride_id} onChange={handleChange} required />
            </Form.Group>
            
            <Form.Group className='dms-form-group'>
              <Form.Label>Block Type</Form.Label>
              <Form.Select name='block_type' value={formData.block_type} onChange={handleChange} required>
                <option value=''>Select Block Type</option>
                <option value='Permanent'>Permanent</option>
                <option value='Temporary'>Temporary</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className='dms-form-group'>
              <Form.Label>Start Date</Form.Label>
              <Form.Control type='date' name='start_date' value={formData.start_date} onChange={handleChange} required />
            </Form.Group>
            
            <div className='save-and-cancel-btn'>
              <Button type='submit' className='me-2'>Save</Button>
              <Button type='cancel' onClick={() => navigate('/dms/inactive-riders')}>Cancel</Button>
            </div>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
};
