import React from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';

export const TripPerformanceView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // You can later replace this with dynamic API/fetched data
  const tripData = {
    tripId: id,
    driverId: 'D001',
    riderId: 'R1001',
    pickupLocation: 'NYC',
    dropoffLocation: 'Brooklyn',
    tripDuration: '00:30:00',
    tripRating: 4.8,
    driverRating: 4.9,
    cancellationRate: '5%',
    onTimeRate: '98%',
    completedAt: '2025-03-15 10:30',
    status: 'Completed',
    feedback: 'Very smooth ride. Reached on time. Friendly driver.',
  };

  return (
    <AdminLayout>
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Trip Performance Details – <span className="text-primary">{tripData.tripId}</span></h4>
        <Button variant="secondary" onClick={() => navigate(-1)}>← Back</Button>
      </div>

      <Card>
        <Card.Body>
          <Row>
            <Col md={6}>
              <p><strong>Trip ID:</strong> {tripData.tripId}</p>
              <p><strong>Driver ID:</strong> {tripData.driverId}</p>
              <p><strong>Rider ID:</strong> {tripData.riderId}</p>
              <p><strong>Pickup Location:</strong> {tripData.pickupLocation}</p>
              <p><strong>Dropoff Location:</strong> {tripData.dropoffLocation}</p>
              <p><strong>Trip Duration:</strong> {tripData.tripDuration}</p>
            </Col>
            <Col md={6}>
              <p><strong>Trip Rating:</strong> {tripData.tripRating}</p>
              <p><strong>Driver Rating:</strong> {tripData.driverRating}</p>
              <p><strong>Cancellation Rate:</strong> {tripData.cancellationRate}</p>
              <p><strong>On-time Rate:</strong> {tripData.onTimeRate}</p>
              <p><strong>Completed At:</strong> {tripData.completedAt}</p>
              <p><strong>Status:</strong> <span className={`badge ${tripData.status === 'Completed' ? 'bg-success' : 'bg-danger'}`}>{tripData.status}</span></p>
            </Col>
          </Row>
          <hr />
          <h6>Rider Feedback</h6>
          <p>{tripData.feedback}</p>
        </Card.Body>
      </Card>
    </div>
    </AdminLayout>
  );
};

