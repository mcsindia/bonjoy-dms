import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Row, Col, Card, Button, Table, Spinner } from "react-bootstrap";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";
import { FaArrowLeft, FaStar } from "react-icons/fa";
import axios from "axios";
import { getToken, getModuleId } from "../../../../../utils/authhelper";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const DriverPerformanceView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams(); // /driverperformancemetrics/view/:id

  const [driver, setDriver] = useState(location.state?.driver || null);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch API
  const fetchDriverPerformance = async (driverId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/getDriverPerformanceById/${driverId}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
          params: { module_id: getModuleId("driverperformancemetrics") },
        }
      );

      const data = response.data?.data;
      if (data) {
        setDriver({
          performance_id: data.id,
          driver_id: data.userId,
          total_rides: data.total_rides,
          cancelled_rides: data.cancelled_rides,
          emergency_rides: data.emergency_rides,
          late_pickups: data.late_pickups,
          complaints_received: data.complaints_received,
          average_rating: data.average_rating,
          last_reviewed: data.last_reviewed,
          performance_flag: data.performance_flag,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        });
      }
    } catch (err) {
      console.error("Error fetching driver performance details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!driver && id) {
      fetchDriverPerformance(id);
    }
  }, [id]);

  // 🔹 Loading State
  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center mt-5 fs-5">
          <Spinner animation="border" size="sm" /> Loading driver details...
        </div>
      </AdminLayout>
    );
  }

  // 🔹 No Data Case
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

  // 🔹 Navigate to Driver Profile
  const handleNavigateToDriver = () => {
    navigate(`/dms/driver/view/${driver.driver_id}`, {
      state: {
        driver: {
          userId: driver.driver_id,
          fullName: driver.username || "Unknown Driver",
          email: driver.email || null,
          profileImage: driver.profileImage || null,
        },
      },
    });
  };

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
              <h5>
                <strong>Driver Information</strong>
              </h5>
              <hr />
              <Row>
                <Col md={6}>
                  {/* 🔹 Clickable Driver ID */}
                  <p>
                    <strong>Driver ID:</strong>{" "}
                    <span
                      className="driver-id-link"
                      onClick={handleNavigateToDriver}
                    >
                      {driver.driver_id}
                    </span>
                  </p>

                  <p>
                    <strong>Performance Flag:</strong> {driver.performance_flag}
                  </p>
                </Col>
                <Col md={6}>
                  <p>
                    <strong>Average Rating:</strong>{" "}
                    <FaStar className="icon star-icon ms-1 me-1" />
                    {driver.average_rating?.toFixed(1)}
                  </p>
                  <p>
                    <strong>Last Reviewed:</strong>{" "}
                    {new Date(driver.last_reviewed).toLocaleString()}
                  </p>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        {/* Performance Metrics */}
        <Row className="mb-4">
          <Col md={12}>
            <Card className="p-3">
              <h5>
                <strong>Performance Metrics</strong>
              </h5>
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
      </div>
    </AdminLayout>
  );
};
