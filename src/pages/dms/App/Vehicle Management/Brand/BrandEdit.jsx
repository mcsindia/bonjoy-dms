import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { getModuleId, getToken } from '../../../../../utils/authhelper';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const BrandEdit = () => {
  const location = useLocation();
  const brandData = location.state || {};
  const navigate = useNavigate();

  const [models, setModels] = useState([]);
  const [modelId, setModelId] = useState(
    typeof brandData.modelId === 'object' ? brandData.modelId.id : brandData.modelId || ''
  );
  const [brandName, setBrandName] = useState(brandData.brandName || '');
  const [status, setStatus] = useState(brandData.status || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const token = getToken();               // 🔹 dynamic token
  const moduleId = getModuleId('brand');  // 🔹 dynamic module ID

  // Fetch all models
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/getAllModels`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { module_id: getModuleId('model') }, // dynamic module_id for model
        });
        if (response.data?.success) {
          setModels(response.data.data.models || []);
        }
      } catch (error) {
        console.error('Error fetching models:', error);
      }
    };

    fetchModels();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setMessageType('');

    try {
      const payload = {
        modelId,
        brandName,
        status,
        module_id: moduleId, // 🔹 use dynamic module_id
      };

      const response = await axios.put(
        `${API_BASE_URL}/updateBrand/${brandData.id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data?.success) {
        setMessage('Brand updated successfully!');
        setMessageType('success');
        setTimeout(() => navigate('/dms/brand'), 1500);
      } else {
        setMessage(response.data?.message || 'Failed to update brand.');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error updating brand:', error);
      setMessage(error.response?.data?.message || 'Failed to update brand.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="dms-container">
        <h4>Edit Brand</h4>

        <div className="dms-form-container">
          {message && (
            <Alert variant={messageType === 'success' ? 'success' : 'danger'}>
              {message}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            {/* Brand Name */}
            <Form.Group className="dms-form-group" controlId="brandName">
              <Form.Label>Brand Name</Form.Label>
              <Form.Control
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                required
              />
            </Form.Group>

            {/* Status */}
            <Form.Group className="dms-form-group" controlId="status">
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

            {/* Buttons */}
            <div className="mt-3">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                type="button"
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
