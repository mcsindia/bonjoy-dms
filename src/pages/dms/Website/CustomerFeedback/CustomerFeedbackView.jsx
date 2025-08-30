import React from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';
import { FaArrowLeft, FaStar } from 'react-icons/fa';

export const CustomerFeedbackView = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const feedback = state?.feedback;

  if (!feedback) {
    return (
      <AdminLayout>
        <div className="p-4 text-center">
          <h5>No feedback data found.</h5>
          <Button variant="primary" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Go Back
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>Customer Feedback Details</h3>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            <FaArrowLeft className="me-1" /> Back to List
          </Button>
        </div>

        <Card>
          <Card.Body>
            <Row className="mb-3">
              <Col md={6}>
                <strong>Customer Name:</strong>
                <p>{feedback.customerName}</p>
              </Col>
              <Col md={6}>
                <strong>Mobile:</strong>
                <p>{feedback.mobile}</p>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <strong>Feedback Date:</strong>
                <p>{feedback.feedbackDate}</p>
              </Col>
              <Col md={6}>
                <strong>Rating:</strong>
                <p><FaStar className="icon star-icon"/>{feedback.rating} / 5</p>
              </Col>
            </Row>

            <Row>
              <Col>
                <strong>Comment:</strong>
                <p>{feedback.comment}</p>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>
    </AdminLayout>
  );
};
