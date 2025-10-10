import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';

export const VehicleTypeAdd = () => {
  const navigate = useNavigate();

  // State for form fields
  const [formData, setFormData] = useState({
    image: null,
    type: '',
    cost_per_km: '',
    status: 'Active',
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file)); // Preview the uploaded image
    }
  };

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Form Validation
    if (!formData.image || !formData.type || !formData.cost_per_km) {
      setError('All fields are required.');
      return;
    }
    // Simulate saving the data and navigating back
    navigate('/dms/vehicle/type'); // Redirect back to Vehicle Type List
  };

  return (
    <AdminLayout>
        
      <div className='dms-container'>
        <h4>Add New Vehicle Type</h4>

        <div className='dms-form-container'>
          {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            {/* Image Upload */}
            <Form.Group className="dms-form-group">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              {imagePreview && (
                <div className="mt-2">
                  <img src={imagePreview} alt="Vehicle Preview" width="100" />
                </div>
              )}
            </Form.Group>

            {/* Vehicle Type */}
            <Form.Group className="dms-form-group">
              <Form.Label>Vehicle Type</Form.Label>
              <Form.Control
                type="text"
                name="type"
                placeholder="Enter vehicle type"
                value={formData.type}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Cost per KM */}
            <Form.Group className="dms-form-group">
              <Form.Label>Cost per Km (₹)</Form.Label>
              <Form.Control
                type="number"
                name="cost_per_km"
                placeholder="Enter cost per km"
                value={formData.cost_per_km}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Status */}
            <Form.Group className="dms-form-group">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Form.Select>
            </Form.Group>

            {/* Buttons */}
            <div className="save-and-cancel-btn">
              <Button type="submit"  className="me-2">
                Save Changes
              </Button>
              <Button type='cancel' onClick={() => navigate('/dms/vehicle/type')}>
                Cancel
              </Button>
            </div>
          </Form>
        </div>
        </div>
    </AdminLayout>
  );
};
