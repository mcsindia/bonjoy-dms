import React from 'react';
import { Card, Row, Col, Button, Badge } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';
import { FaArrowLeft } from 'react-icons/fa';

export const PaymentView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Static example data for now
  const paymentDetails = {
    tripId: id,
    riderId: 'R1001',
    driverId: 'D001',
    paymentAmount: '₹30.50',
    baseFare: '₹15.00',
    distanceFare: '₹10.00',
    discount: '₹0.00',
    finalPayout: '₹30.50',
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',
    refundStatus: 'None',
    createdAt: '2025-03-15',
  };

  return (
    <AdminLayout>
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Payment Report</h4>
        <Button className='back-button' onClick={() => navigate(-1)}><FaArrowLeft/> Back</Button>
      </div>

      <Card>
        <Card.Body>
          <Row>
            <Col md={6}>
              <p><strong>Trip ID:</strong> {paymentDetails.tripId}</p>
              <p><strong>Rider ID:</strong> {paymentDetails.riderId}</p>
              <p><strong>Driver ID:</strong> {paymentDetails.driverId}</p>
              <p><strong>Base Fare:</strong> {paymentDetails.baseFare}</p>
              <p><strong>Distance Fare:</strong> {paymentDetails.distanceFare}</p>
              <p><strong>Discount Applied:</strong> {paymentDetails.discount}</p>
            </Col>
            <Col md={6}>
              <p><strong>Total Payment Amount:</strong> {paymentDetails.paymentAmount}</p>
              <p><strong>Final Payout:</strong> {paymentDetails.finalPayout}</p>
              <p><strong>Payment Method:</strong> {paymentDetails.paymentMethod}</p>
              <p><strong>Payment Status:</strong> 
                <Badge bg={paymentDetails.paymentStatus === 'Paid' ? 'success' : 'warning'} className="ms-2">
                  {paymentDetails.paymentStatus}
                </Badge>
              </p>
              <p><strong>Refund Status:</strong> {paymentDetails.refundStatus}</p>
              <p><strong>Created At:</strong> {paymentDetails.createdAt}</p>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
    </AdminLayout>
  );
};

