import React, { useState, useEffect } from "react";
import {
  Table,
  Form,
  InputGroup,
  Pagination,
} from "react-bootstrap";
import { FaEye, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";

// Dummy driver performance data with trip details
const dummyDrivers = [
  {
    performance_id: "P001",
    driver_id: "D001",
    username: "John Doe",
    total_rides: 120,
    cancelled_rides: 5,
    emergency_rides: 8,
    late_pickups: 3,
    complaints_received: 2,
    average_rating: 4.6,
    last_reviewed: "2025-10-08T10:00:00Z",
    performance_flag: "excellent",
    trip_details: {
      last_trip_date: "2025-10-08",
      last_trip_pickup: "MG Road, Bangalore",
      last_trip_drop: "HSR Layout, Bangalore",
      last_trip_fare: 450,
      last_trip_distance: 12,
    },
  },
  {
    performance_id: "P002",
    driver_id: "D002",
    username: "Jane Smith",
    total_rides: 90,
    cancelled_rides: 10,
    emergency_rides: 3,
    late_pickups: 7,
    complaints_received: 4,
    average_rating: 4.2,
    last_reviewed: "2025-10-07T09:30:00Z",
    performance_flag: "average",
    trip_details: {
      last_trip_date: "2025-10-07",
      last_trip_pickup: "Koramangala, Bangalore",
      last_trip_drop: "Indiranagar, Bangalore",
      last_trip_fare: 300,
      last_trip_distance: 8,
    },
  },
  {
    performance_id: "P003",
    driver_id: "D003",
    username: "Robert Johnson",
    total_rides: 60,
    cancelled_rides: 8,
    emergency_rides: 2,
    late_pickups: 5,
    complaints_received: 3,
    average_rating: 3.9,
    last_reviewed: "2025-10-06T12:15:00Z",
    performance_flag: "needs_review",
    trip_details: {
      last_trip_date: "2025-10-06",
      last_trip_pickup: "Whitefield, Bangalore",
      last_trip_drop: "Electronic City, Bangalore",
      last_trip_fare: 600,
      last_trip_distance: 18,
    },
  },
];

export const DriverPerformanceMetrics = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setDrivers(dummyDrivers);
      setLoading(false);
    }, 500);
  }, []);

  const filteredDrivers = drivers.filter((d) =>
    d.username.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDrivers.length / itemsPerPage);

  const displayedDrivers = filteredDrivers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) setCurrentPage(pageNumber);
  };

  return (
    <AdminLayout>
      <div className="dms-pages-header sticky-header">
        <h3>Driver Performance Metrics</h3>
      </div>

      {/* Search Filter */}
      <div className="filter-search-container">
        <InputGroup className="dms-custom-width">
          <Form.Control
            placeholder="Search by driver username..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </InputGroup>
      </div>

      {/* Table */}
      <div className="dms-table-container">
        {loading ? (
          <div className="text-center py-5 fs-4">Loading...</div>
        ) : (
          <>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Username</th>
                  <th>Total Rides</th>
                  <th>Cancelled Rides</th>
                  <th>Emergency Rides</th>
                  <th>Late Pickups</th>
                  <th>Complaints</th>
                  <th>Average Rating</th>
                  <th>Last Reviewed</th>
                  <th>Performance Flag</th>
                  <th>Last Trip Info</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {displayedDrivers.length > 0 ? (
                  displayedDrivers.map((driver, idx) => (
                    <tr key={driver.performance_id}>
                      <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                      <td>{driver.username}</td>
                      <td>{driver.total_rides}</td>
                      <td>{driver.cancelled_rides}</td>
                      <td>{driver.emergency_rides}</td>
                      <td>{driver.late_pickups}</td>
                      <td>{driver.complaints_received}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <FaStar className="icon star-icon me-1" />
                          {driver.average_rating.toFixed(1)}
                        </div>
                      </td>
                      <td>{new Date(driver.last_reviewed).toLocaleDateString()}</td>
                      <td>{driver.performance_flag}</td>
                      <td>
                        {driver.trip_details
                          ? `${driver.trip_details.last_trip_date} | ${driver.trip_details.last_trip_pickup} → ${driver.trip_details.last_trip_drop} | ₹${driver.trip_details.last_trip_fare} | ${driver.trip_details.last_trip_distance}km`
                          : "-"}
                      </td>
                      <td>
                        <FaEye
                          title="View Details"
                          className="icon icon-blue"
                          onClick={() =>
                            navigate(`/dms/driverperformancemetrics/view/${driver.driver_id}`, {
                              state: { driver },
                            })
                          }
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="12" className="text-center">
                      No drivers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>

            {/* Pagination */}
            <div className="pagination-container">
              <Pagination className="mb-0">
                <Pagination.Prev
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                />
                {[...Array(totalPages)].map((_, index) => (
                  <Pagination.Item
                    key={index + 1}
                    active={index + 1 === currentPage}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
              </Pagination>

              <Form.Select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="pagination-option w-auto"
              >
                <option value="5">Show 5</option>
                <option value="10">Show 10</option>
                <option value="20">Show 20</option>
                <option value="30">Show 30</option>
                <option value="50">Show 50</option>
              </Form.Select>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};
