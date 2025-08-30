import React from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';
import { FaArrowLeft } from 'react-icons/fa';

export const OngoingTripsView = () => {
    const navigate = useNavigate();

    // Dummy trip data (replace with dynamic data)
    const trip = {
        tripId: 'T001',
        driverId: 'D001',
        riderId: 'R1001',
        vehicleId: 'V1001',
        pickup: 'Downtown',
        dropoff: 'Airport',
        currentLocation: 'Highway',
        estimatedFare: '₹25.50',
        paymentStatus: 'Pending',
        tripStatus: 'Ongoing',
        lat: 28.6139,  // Example: New Delhi coordinates
        lng: 77.2090,
    };

    return (
        <AdminLayout>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Ongoing Trip Details</h4>
                <Button className='back-button' onClick={() => navigate(-1)}>
                    <FaArrowLeft/> Back
                </Button>
            </div>

            <Card className="p-4 mb-4">
                <h5>Trip Info</h5>
                <Row>
                    <Col md={6}>
                        <p><strong>Trip ID:</strong> {trip.tripId}</p>
                        <p><strong>Driver ID:</strong> {trip.driverId}</p>
                        <p><strong>Rider ID:</strong> {trip.riderId}</p>
                        <p><strong>Vehicle ID:</strong> {trip.vehicleId}</p>
                    </Col>
                    <Col md={6}>
                        <p><strong>Pickup Location:</strong> {trip.pickup}</p>
                        <p><strong>Dropoff Location:</strong> {trip.dropoff}</p>
                        <p><strong>Current Location:</strong> {trip.currentLocation}</p>
                        <p><strong>Estimated Fare:</strong> {trip.estimatedFare}</p>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <p><strong>Payment Status:</strong> {trip.paymentStatus}</p>
                        <p><strong>Trip Status:</strong> {trip.tripStatus}</p>
                    </Col>
                </Row>
            </Card>

            <Card className="p-4">
                <h5>Current Trip Location Map</h5>
                <div className='trip-map-container'>
                    <iframe
                        title="Trip Location Map"
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
