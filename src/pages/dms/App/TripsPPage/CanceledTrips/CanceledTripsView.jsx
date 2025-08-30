import React from 'react';
import { Card, Row, Col, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';
import { FaArrowLeft } from 'react-icons/fa';

export const CancelledTripView = () => {
    const navigate = useNavigate();

    // Example data (can be fetched via params or API)
    const trip = {
        tripId: 'C6001',
        driverId: 'D001',
        riderId: 'R1001',
        vehicleId: 'V1001',
        pickup: 'NYC',
        dropoff: 'Brooklyn',
        cancellationReason: 'Driver No-show',
        cancelledBy: 'Driver',
        cancelledAt: '2025-03-10 14:30',
        refundStatus: 'Pending',
        cancellationFee: '₹5.00',
        status: 'Canceled',
        lat: 40.6782,
        lng: -73.9442,
    };

    return (
        <AdminLayout>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>View Canceled Trip</h4>
                <Button className='back-button' onClick={() => navigate(-1)}>
                   <FaArrowLeft/> Back
                </Button>
            </div>

            <Card className="p-4 mb-4">
                <Row>
                    <Col md={6}>
                        <p><strong>Trip ID:</strong> {trip.tripId}</p>
                        <p><strong>Driver ID:</strong> {trip.driverId}</p>
                        <p><strong>Rider ID:</strong> {trip.riderId}</p>
                        <p><strong>Vehicle ID:</strong> {trip.vehicleId}</p>
                        <p><strong>Pickup Location:</strong> {trip.pickup}</p>
                        <p><strong>Dropoff Location:</strong> {trip.dropoff}</p>
                    </Col>
                    <Col md={6}>
                        <p><strong>Cancellation Reason:</strong> {trip.cancellationReason}</p>
                        <p><strong>Canceled By:</strong> {trip.cancelledBy}</p>
                        <p><strong>Canceled At:</strong> {trip.cancelledAt}</p>
                        <p><strong>Refund Status:</strong> {trip.refundStatus}</p>
                        <p><strong>Cancellation Fee:</strong> {trip.cancellationFee}</p>
                        <p><strong>Status:</strong> <Badge bg="danger">{trip.status}</Badge></p>
                    </Col>
                </Row>
            </Card>
        </AdminLayout>
    );
};
