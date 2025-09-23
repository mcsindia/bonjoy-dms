import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';
import { getModuleId, getToken } from '../../../../../utils/authhelper';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const BrandAdd = () => {
  const navigate = useNavigate();
  const [brandName, setBrandName] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const token = getToken();
  const moduleId = getModuleId('brand'); // 🔹 Dynamic module ID like MenuAdd

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!brandName.trim()) {
      setMessage('Brand Name is required!');
      setMessageType('error');
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/createBrand`,
        {
          brandName: brandName.trim(),
          module_id: moduleId, // 🔹 Use dynamic moduleId
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setMessage('Brand added successfully!');
        setMessageType('success');
        setTimeout(() => navigate('/dms/brand'), 1500);
      } else if (response.data.message === 'Brand already exists') {
        setMessage('Brand with this name already exists!');
        setMessageType('error');
      } else {
        setMessage('Failed to add brand!');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error adding brand:', error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message === 'Brand already exists'
      ) {
        setMessage('Brand with this name already exists!');
      } else {
        setMessage('Error adding brand!');
      }
      setMessageType('error');
    }
  };

  return (
    <AdminLayout>
      <div className="dms-container">
        <h4>Add New Brand</h4>
        <div className="dms-form-container">
          {message && (
            <Alert variant={messageType === 'success' ? 'success' : 'danger'}>
              {message}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="dms-form-group" controlId="brandName">
              <Form.Label>Brand Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter brand name"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
              />
            </Form.Group>

            <div className="save-and-cancel-btn">
              <Button type="submit">Add Brand</Button>
              <Button
                type="button"
                variant="secondary"
                className="ms-2"
                onClick={() => navigate('/dms/brand')}
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
