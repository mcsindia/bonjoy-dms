import React, { useEffect, useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';
import { getModuleId, getToken } from '../../../../../utils/authhelper';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ModelAdd = () => {
  const navigate = useNavigate();
  const [brandList, setBrandList] = useState([]);
  const [brandId, setBrandId] = useState('');
  const [modelName, setModelName] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const token = getToken();
  const moduleId = getModuleId('model'); // 🔹 Dynamic module ID

  // Fetch brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/getAllBrands`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { module_id: moduleId },
        });
        setBrandList(response.data?.data?.data || []);
      } catch (error) {
        console.error('Error fetching brands:', error);
        setBrandList([]);
      }
    };
    fetchBrands();
  }, [moduleId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    if (!brandId || !modelName.trim()) {
      setMessage('All fields are required!');
      setMessageType('error');
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/createModel`,
        { brandId, modelName: modelName.trim(), module_id: moduleId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setMessage('Model added successfully!');
        setMessageType('success');
        setTimeout(() => navigate('/dms/model'), 1500);
      } else {
        setMessage(response.data.message || 'Failed to add model!');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error adding model:', error);
      setMessage(
        error.response?.data?.message || 'Something went wrong while adding the model.'
      );
      setMessageType('error');
    }
  };

  return (
    <AdminLayout>
      <div className="dms-container">
        <h3>Add Model</h3>
        <div className="dms-form-container">
          {message && (
            <Alert
              variant={messageType === 'success' ? 'success' : 'danger'}
              onClose={() => setMessage('')}
              dismissible
            >
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

            <div className="save-and-cancel-btn">
              <Button type="submit">Add Model</Button>
              <Button
                type="button"
                variant="secondary"
                className="ms-2"
                onClick={() => navigate('/dms/model')}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
};
