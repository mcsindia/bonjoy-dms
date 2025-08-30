import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, Badge } from 'react-bootstrap';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';
import { FaArrowLeft } from 'react-icons/fa';

export const ComplaintAndResolutionView = () => {
  const { id } = useParams(); // Assuming ID is Trip ID like S7001
  const navigate = useNavigate();

  // Sample static complaint details (you can replace with fetched data later)
  const data = {
    tripId: 'S7001',
    complainantId: 'R1001',
    complainantType: 'Rider',
    againstId: 'D001',
    againstType: 'Driver',
    category: 'Rude Behavior',
    description: 'Driver was rude',
    filedAt: '2025-03-10',
    supportAgentId: 'A001',
    resolutionStatus: 'Resolved',
    resolvedAt: '2025-03-12',
    resolutionNote: 'Driver was warned after investigation. Apology issued to rider.',
  };

  return (
    <AdminLayout>
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>
          Complaint Details
        </h4>
        <Button className='back-button' onClick={() => navigate(-1)}>
          <FaArrowLeft/> Back
        </Button>
      </div>

      <Card className="shadow-sm">
        <Card.Body>
          <Row>
            <Col md={6}>
              <p><strong>Trip ID:</strong> {data.tripId}</p>
              <p><strong>Complainant ID:</strong> {data.complainantId}</p>
              <p><strong>Complainant Type:</strong> {data.complainantType}</p>
              <p><strong>Against ID:</strong> {data.againstId}</p>
              <p><strong>Against Type:</strong> {data.againstType}</p>
              <p><strong>Category:</strong> {data.category}</p>
            </Col>
            <Col md={6}>
              <p><strong>Description:</strong> {data.description}</p>
              <p><strong>Filed At:</strong> {data.filedAt}</p>
              <p><strong>Support Agent ID:</strong> {data.supportAgentId}</p>
              <p>
                <strong>Resolution Status:</strong>{' '}
                <Badge bg={data.resolutionStatus === 'Resolved' ? 'success' : 'warning'}>
                  {data.resolutionStatus}
                </Badge>
              </p>
              <p><strong>Resolved At:</strong> {data.resolvedAt}</p>
              <p><strong>Resolution Note:</strong> {data.resolutionNote}</p>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
    </AdminLayout>
  );
};

