import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';

export const VehicleTypeEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract vehicle type data passed from the VehicleTypeList page
  const { vehicleType } = location.state || {};

  // Initialize state with the current vehicle type data
  const [type, setType] = useState(vehicleType?.type || '');
  const [costPerKm, setCostPerKm] = useState(vehicleType?.cost_per_km || '');
  const [status, setStatus] = useState(vehicleType?.status || 'Active');
  const [image, setImage] = useState(vehicleType?.image || null);
  const [imagePreview, setImagePreview] = useState(vehicleType?.image || null);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // Preview the uploaded image
    }
  };

  // Handle form submission (Update vehicle type)
  const handleSubmit = (e) => {
    e.preventDefault();
    // You can make an API call here to update the vehicle type in the backend

    // Navigate back to the vehicle type list page after updating
    navigate('/dms/vehicle/type');
  };

  return (
    <AdminLayout>
      <div className="dms-container">
        <h4>Edit Vehicle Type</h4>
        <div className="dms-form-container">
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
            <Form.Group controlId="type" className="dms-form-group">
              <Form.Label>Vehicle Type</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter vehicle type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              />
            </Form.Group>

            {/* Cost per KM */}
            <Form.Group controlId="costPerKm" className="dms-form-group">
              <Form.Label>Cost per Km (₹)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter cost per km"
                value={costPerKm}
                onChange={(e) => setCostPerKm(e.target.value)}
                required
              />
            </Form.Group>

            {/* Status */}
            <Form.Group controlId="status" className="dms-form-group">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Form.Select>
            </Form.Group>

            {/* Buttons */}
            <div className='save-and-cancel-btn'>
            <Button type="submit">
              Save Changes
            </Button>
            <Button type='cancel' className="ms-2" onClick={() => navigate('/dms/vehicle/type')}>
              Cancel
            </Button>
            </div>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
};
