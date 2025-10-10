import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Row, Col, Card, Button, Table } from "react-bootstrap";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";
import { FaArrowLeft, FaStar } from "react-icons/fa";

export const DriverPerformanceView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const driver = location.state?.driver;

  // If driver data is not passed
  if (!driver) {
    return (
      <AdminLayout>
        <div className="text-center mt-5">
          <h5>No driver data available.</h5>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="dms-container">
        {/* Header */}
        <div className="dms-pages-header sticky-header d-flex justify-content-between align-items-center mb-4">
          <h3>Driver Performance Details</h3>
          <Button className="back-button" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Back to List
          </Button>
        </div>

        {/* Driver Info */}
        <Row className="mb-4">
          <Col md={12}>
            <Card className="p-3">
              <h5><strong>Driver Information</strong></h5>
              <hr />
              <Row>
                <Col md={6}>
                  <p><strong>Driver ID:</strong> {driver.driver_id}</p>
                  <p><strong>Username:</strong> {driver.username}</p>
                  <p><strong>Performance Flag:</strong> {driver.performance_flag}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Average Rating:</strong> 
                    <FaStar className="icon star-icon ms-1 me-1" /> {driver.average_rating.toFixed(1)}
                  </p>
                  <p><strong>Last Reviewed:</strong> {new Date(driver.last_reviewed).toLocaleString()}</p>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        {/* Performance Metrics */}
        <Row className="mb-4">
          <Col md={12}>
            <Card className="p-3">
              <h5><strong>Performance Metrics</strong></h5>
              <hr />
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Total Rides</th>
                    <th>Cancelled Rides</th>
                    <th>Emergency Rides</th>
                    <th>Late Pickups</th>
                    <th>Complaints Received</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{driver.total_rides}</td>
                    <td>{driver.cancelled_rides}</td>
                    <td>{driver.emergency_rides}</td>
                    <td>{driver.late_pickups}</td>
                    <td>{driver.complaints_received}</td>
                  </tr>
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>

        {/* Last Trip Details */}
        <Row className="mb-4">
          <Col md={12}>
            <Card className="p-3">
              <h5><strong>Last Trip Details</strong></h5>
              <hr />
              {driver.trip_details ? (
                <Row>
                  <Col md={6}>
                    <p><strong>Trip Date:</strong> {driver.trip_details.last_trip_date}</p>
                    <p><strong>Pickup Location:</strong> {driver.trip_details.last_trip_pickup}</p>
                    <p><strong>Drop Location:</strong> {driver.trip_details.last_trip_drop}</p>
                  </Col>
                  <Col md={6}>
                    <p><strong>Fare:</strong> ₹{driver.trip_details.last_trip_fare}</p>
                    <p><strong>Distance:</strong> {driver.trip_details.last_trip_distance} km</p>
                  </Col>
                </Row>
              ) : (
                <p>No trip details available.</p>
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </AdminLayout>
  );
};
