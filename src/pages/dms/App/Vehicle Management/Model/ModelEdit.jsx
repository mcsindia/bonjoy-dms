import React, { useEffect, useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ModelEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const modelData = location.state;

  const [brandList, setBrandList] = useState([]);
  const [brandId, setBrandId] = useState('');
  const [modelName, setModelName] = useState('');
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('');

  // Load model data
  useEffect(() => {
    if (modelData) {
      setBrandId(modelData.brandId || '');
      setModelName(modelData.modelName || '');
      setStatus(modelData.status || '');
    }
  }, [modelData]);

  // Fetch brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/getAllBrands`, {
          params: {
            module_id: 'model', // 🔹 Added module_id
          },
        });

        if (Array.isArray(response.data.data.data)) {
          setBrandList(response.data.data.data);
        } else {
          setBrandList([]);
        }
      } catch (error) {
        console.error('Error fetching brands:', error);
        setBrandList([]);
      }
    };

    fetchBrands();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${API_BASE_URL}/updateModel/${modelData.id}`,
        {
          brandId,
          modelName,
          status,
          module_id: 'model', // 🔹 Added module_id
        }
      );

      if (response.data.success) {
        setVariant('success');
        setMessage('Model updated successfully!');
        setTimeout(() => navigate('/dms/model'), 1500);
      } else {
        setVariant('danger');
        setMessage('Failed to update model.');
      }
    } catch (error) {
      console.error('Error updating model:', error);
      setVariant('danger');
      setMessage('Something went wrong while updating the model.');
    }
  };

  return (
    <AdminLayout>
      <div className='dms-container'>
        <h3>Edit Model</h3>
        <div className='dms-form-container'>
          {message && (
            <Alert variant={variant} onClose={() => setMessage('')} dismissible>
              {message}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>

            {/* Brand Dropdown */}
            <Form.Group controlId="brandId" className="dms-form-group">
              <Form.Label>Brand</Form.Label>
              <Form.Select
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                required
              >
                <option value="">Select brand</option>
                {brandList.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.brandName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Model Name */}
            <Form.Group controlId="modelName" className="dms-form-group">
              <Form.Label>Model Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter model name"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
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
                <option value="">Select status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Form.Select>
            </Form.Group>

            {/* Submit & Cancel */}
            <Button type="submit">Update Model</Button>
            <Button className="ms-2" onClick={() => navigate('/dms/model')}>
              Cancel
            </Button>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
};
