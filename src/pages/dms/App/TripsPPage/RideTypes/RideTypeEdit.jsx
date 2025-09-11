import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Container, Form, Alert } from 'react-bootstrap';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';
import { QuillEditor } from '../../../../../components/dms/QuillEditor/QuillEditor';

export const RideTypeEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { rideType } = location.state || {}; // comes from list page

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    fareMultiplier: '',
    description: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (rideType && !hasInitialized) {
      setFormData({
        id: rideType.id || '',
        name: rideType.name || '',
        fareMultiplier: rideType.fareMultiplier || '',
        description: rideType.description || ''
      });
      setHasInitialized(true);
    }
  }, [rideType, hasInitialized]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('Ride Type Name is required!');
      return;
    }

    if (!formData.fareMultiplier || isNaN(formData.fareMultiplier)) {
      setError('Fare Multiplier must be a valid number!');
      return;
    }

    if (!formData.description.trim()) {
      setError('Description is required!');
      return;
    }

    try {
      setError('');
      // dummy success since no API
      setSuccess('Ride Type updated successfully!');
      setTimeout(() => navigate('/dms/ridetypes'), 1500);
    } catch (err) {
      console.error('Update failed:', err);
      setError('Failed to update Ride Type. Please try again later.');
    }
  };

  return (
    <AdminLayout>
      <Container className="dms-container">
        <h4>Edit Ride Type</h4>
        <div className="dms-form-container">

          {error && (
            <Alert variant="danger" onClose={() => setError('')} dismissible>
              {error}
            </Alert>
          )}
          {success && (
            <Alert variant="success" onClose={() => setSuccess('')} dismissible>
              {success}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            {/* Ride Type Name */}
            <Form.Group className="dms-form-group mt-3">
              <Form.Label>Ride Type Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter ride type name"
                required
              />
            </Form.Group>

            {/* Fare Multiplier */}
            <Form.Group className="dms-form-group mt-3">
              <Form.Label>Fare Multiplier</Form.Label>
              <Form.Control
                type="number"
                step="0.1"
                name="fareMultiplier"
                value={formData.fareMultiplier}
                onChange={handleChange}
                placeholder="Enter fare multiplier"
                required
              />
            </Form.Group>

            {/* Description */}
            <Form.Group className="dms-form-group mt-3">
              <Form.Label>Description</Form.Label>
              {hasInitialized && (
                <QuillEditor
                  key={formData.id}
                  value={formData.description}
                  onChange={(value) =>
                    setFormData(prev => ({ ...prev, description: value }))
                  }
                />
              )}
            </Form.Group>

            <div className="save-and-cancel-btn mt-4">
              <Button type="submit" className="me-2">
                Save Changes
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate('/dms/ridetypes')}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      </Container>
    </AdminLayout>
  );
};
