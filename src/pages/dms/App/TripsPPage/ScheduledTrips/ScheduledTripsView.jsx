import React from 'react';
import { Card, Row, Col, Button, Badge } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';
import { FaArrowLeft } from 'react-icons/fa';

export const ScheduledTripsView = () => {
  const navigate = useNavigate();
  const { tripId } = useParams(); // Optional if you're routing with dynamic ID

  // Mock data — replace with actual API fetch
  const trip = {
    tripId: 'S7001',
    riderId: 'R1001',
    driverId: 'D001',
    vehicleId: 'V1001',
    pickup: 'NYC',
    dropoff: 'Brooklyn',
    scheduledTime: '2025-03-15 10:00',
    rideType: 'Standard',
    estimatedFare: '₹25.50',
    paymentStatus: 'Paid',
    paymentMode: 'UPI',
    status: 'Scheduled',
    lat: 40.7128,
    lng: -74.0060,
  };

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Scheduled Trip Details</h4>
        <Button className='back-button' onClick={() => navigate(-1)}>
         <FaArrowLeft/> Back
        </Button>
      </div>

      <Card className="p-4 mb-4">
        <Row>
          <Col md={6}>
            <p><strong>Trip ID:</strong> {trip.tripId}</p>
            <p><strong>Rider ID:</strong> {trip.riderId}</p>
            <p><strong>Driver ID:</strong> {trip.driverId}</p>
            <p><strong>Vehicle ID:</strong> {trip.vehicleId}</p>
            <p><strong>Pickup Location:</strong> {trip.pickup}</p>
            <p><strong>Dropoff Location:</strong> {trip.dropoff}</p>
          </Col>
          <Col md={6}>
            <p><strong>Scheduled Pickup Time:</strong> {trip.scheduledTime}</p>
            <p><strong>Ride Type:</strong> {trip.rideType}</p>
            <p><strong>Estimated Fare:</strong> {trip.estimatedFare}</p>
            <p><strong>Payment Status:</strong> 
              <Badge bg={trip.paymentStatus === 'Paid' ? 'success' : 'danger'} className="ms-2">
                {trip.paymentStatus}
              </Badge>
            </p>
            <p><strong>Trip Status:</strong> <Badge bg="warning">{trip.status}</Badge></p>
          </Col>
        </Row>
      </Card>

      <Card className="p-4">
        <h5>Pickup Location on Map</h5>
        <div className='trip-map-container'>
          <iframe
            title="Pickup Map"
            className='trip-iframe'
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps?q=${trip.lat},${trip.lng}&hl=es;&output=embed`}
          />
        </div>
      </Card>
    </AdminLayout>
  );
};
