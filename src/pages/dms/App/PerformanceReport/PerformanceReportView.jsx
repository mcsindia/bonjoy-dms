import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, Badge } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';

export const PerformanceReportView = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  // Sample static data (replace with API or props later)
  const data = {
    userId: 'U1001',
    userType: 'Driver',
    totalTrips: 120,
    completedTrips: 110,
    canceledTrips: 10,
    responseTime: '5 mins',
    avgRating: 4.8,
    totalReviews: 95,
    latePickups: 3,
    earnings: '₹50000.00',
    distance: '1200 km',
    loyaltyStatus: 'Gold',
    reportDate: '2025-03-15',
    feedbackComments: [
      {
        date: '2025-03-10',
        comment: 'Driver was very professional and courteous.',
        rating: 5
      },
      {
        date: '2025-03-12',
        comment: 'Was a bit late, but drove safely.',
        rating: 4
      }
    ]
  };

  return (
    <AdminLayout>
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>
          Performance Report
        </h4>
        <Button className='back-button' onClick={() => navigate(-1)}><FaArrowLeft/> Back</Button>
      </div>

      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Row>
            <Col md={6}>
              <p><strong>User ID:</strong> {data.userId}</p>
              <p><strong>User Type:</strong> {data.userType}</p>
              <p><strong>Total Trips:</strong> {data.totalTrips}</p>
              <p><strong>Completed Trips:</strong> {data.completedTrips}</p>
              <p><strong>Canceled Trips:</strong> {data.canceledTrips}</p>
              <p><strong>Response Time:</strong> {data.responseTime}</p>
            </Col>
            <Col md={6}>
              <p><strong>Average Rating:</strong> {data.avgRating} ⭐</p>
              <p><strong>Total Reviews:</strong> {data.totalReviews}</p>
              <p><strong>Late Pickups:</strong> {data.latePickups}</p>
              <p><strong>Earnings:</strong> {data.earnings}</p>
              <p><strong>Distance Traveled:</strong> {data.distance}</p>
              <p>
                <strong>Loyalty Status:</strong>{' '}
                <Badge bg={data.loyaltyStatus === 'Gold' ? 'warning' : 'secondary'}>
                  {data.loyaltyStatus}
                </Badge>
              </p>
              <p><strong>Report Date:</strong> {data.reportDate}</p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Header>
          <h5 className="mb-0">User Feedback & Ratings</h5>
        </Card.Header>
        <Card.Body>
          {data.feedbackComments.map((item, index) => (
            <div key={index} className="mb-3 border-bottom pb-2">
              <p className="mb-1"><strong>Date:</strong> {item.date}</p>
              <p className="mb-1"><strong>Rating:</strong> {item.rating} ⭐</p>
              <p className="mb-1"><strong>Comment:</strong> {item.comment}</p>
            </div>
          ))}
        </Card.Body>
      </Card>
    </div>
    </AdminLayout>
  );
};

