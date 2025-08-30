import React from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';
import { FaArrowLeft } from 'react-icons/fa';

export const CompletedTripView = () => {
    const navigate = useNavigate();

    // Dummy completed trip data (based on your table)
    const trip = {
        tripId: 'T5002',
        driverId: 'D002',
        riderId: 'R1002',
        vehicleId: 'V1002',
        pickup: 'LA',
        dropoff: 'Santa Monica',
        completedLocation: 'Main Blvd, Santa Monica',
        fareAmount: '₹32.00',
        paymentStatus: 'Completed',
        tripStatus: 'Completed',
        tripDistance: '8 km',
        tripRating: '4.5',
        driverRating: '4.6',
        lat: 34.0195,
        lng: -118.4912,
    };

    return (
        <AdminLayout>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Completed Trip Details</h4>
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
                        <p><strong>Pickup Location:</strong> {trip.pickup}</p>
                        <p><strong>Dropoff Location:</strong> {trip.dropoff}</p>
                        <p><strong>Completed At:</strong> {trip.completedLocation}</p>
                    </Col>
                    <Col md={6}>
                        <p><strong>Fare Amount:</strong> {trip.fareAmount}</p>
                        <p><strong>Payment Status:</strong> {trip.paymentStatus}</p>
                        <p><strong>Trip Distance:</strong> {trip.tripDistance}</p>
                        <p><strong>Trip Rating:</strong> ⭐ {trip.tripRating}</p>
                        <p><strong>Driver Rating:</strong> ⭐ {trip.driverRating}</p>
                        <p><strong>Trip Status:</strong> {trip.tripStatus}</p>
                    </Col>
                </Row>
            </Card>

            <Card className="p-4">
                <h5>Final Trip Location Map</h5>
                <div className='trip-map-container'>
                    <iframe
                        title="Completed Trip Location"
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
