import React, { useEffect, useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ModelAdd = () => {
  const navigate = useNavigate();
  const [brandList, setBrandList] = useState([]);
  const [brandId, setBrandId] = useState('');
  const [modelName, setModelName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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
        setBrandList([]);
      }
    };

    fetchBrands();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await axios.post(`${API_BASE_URL}/createModel`, {
        brandId,
        modelName,
        module_id: 'model', // 🔹 Added module_id
      });

      if (response.data.success) {
        setSuccessMessage('Model added successfully!');
        setTimeout(() => {
          navigate('/dms/model');
        }, 1500);
      } else {
        setErrorMessage('Failed to add model. Please try again.');
      }
    } catch (error) {
      console.error('Error creating model:', error);
      setErrorMessage('Something went wrong while creating the model.');
    }
  };

  return (
    <AdminLayout>
      <div className='dms-container'>
        <h3>Add Model</h3>
        <div className='dms-form-container'>
          {successMessage && (
            <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>
              {successMessage}
            </Alert>
          )}
          {errorMessage && (
            <Alert variant="danger" onClose={() => setErrorMessage('')} dismissible>
              {errorMessage}
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

            <Button type="submit">Add Model</Button>
            <Button className="ms-2" onClick={() => navigate("/dms/model")}>
              Cancel
            </Button>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
};
