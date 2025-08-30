import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Badge, Button} from 'react-bootstrap';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ActivityView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activity } = location.state || {};
  const [activityDetails, setActivityDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Success': return 'success';
      case 'Pending': return 'warning';
      case 'Failed': return 'danger';
      default: return 'secondary';
    }
  };

  const fetchActivityDetails = async (id) => {
     const token = JSON.parse(localStorage.getItem("userData"))?.token;
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const res = await axios.get(`${API_BASE_URL}/getActivityById/${id}`, { headers });
      setActivityDetails(res.data.data);
    } catch (err) {
      console.error('Failed to fetch activity details', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activity?.id) {
      fetchActivityDetails(activity.id);
    } else {
      setLoading(false); 
    }
  }, [activity]);

  if (loading) {
         return (
             <AdminLayout>
                 <div className="text-center mt-5">
                     <h3>Loading Activity...</h3>
                 </div>
             </AdminLayout>
         );
     }

  if (!activityDetails) {
    return (
      <AdminLayout>
        <div className="text-center mt-5">
          <p>Activity not found.</p>
          <Button className='back-button' onClick={() => navigate(-1)}><FaArrowLeft/> Back</Button>
        </div>
      </AdminLayout>
    );
  }

  const { riderId, description, status, createdAt, updatedAt } = activityDetails;

  return (
    <AdminLayout>
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4>Activity Log Details</h4>
          <Button className='back-button' onClick={() => navigate(-1)}> <FaArrowLeft/> Back</Button>
        </div>

        <Card className="p-4 shadow-sm">
          <Row className="mb-3">
            <Col md={6}>
              <p><strong>User ID:</strong> {riderId?.userId?.id || 'N/A'}</p>
              <p><strong>Ride ID:</strong> {riderId?.id || 'N/A'}</p>
              <p><strong>User Type:</strong> {riderId?.userId?.userType || 'N/A'}</p>
              <p><strong>Mobile:</strong> {riderId?.userId?.mobile || 'N/A'}</p>
            </Col>
            <Col md={6}>
            <p>
                <strong>Status:</strong>{' '}
                <Badge bg={getStatusVariant(status)}>{status}</Badge>
              </p>
              <p><strong>Description:</strong> {description}</p>
              <p><strong>Created At:</strong> {new Date(createdAt).toLocaleString()}</p>
              <p><strong>Updated At:</strong> {new Date(updatedAt).toLocaleString()}</p>
            </Col>
          </Row>
        </Card>
      </div>
    </AdminLayout>
  );
};
