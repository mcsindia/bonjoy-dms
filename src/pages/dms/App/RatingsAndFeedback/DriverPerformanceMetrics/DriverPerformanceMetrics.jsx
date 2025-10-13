import React, { useState, useEffect } from "react";
import { Table, Form, InputGroup, Pagination, Spinner } from "react-bootstrap";
import { FaStar, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";
import axios from "axios";
import { getModuleId, getToken } from "../../../../../utils/authhelper";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
});

export const DriverPerformanceMetrics = () => {
  const navigate = useNavigate();

  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [date, setDate] = useState("");

  // 🔹 Fetch API Driver Performance
  const fetchDrivers = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: itemsPerPage,
        module_id: getModuleId("driverperformancemetrics"),
      };

      if (date) params.date = date;

      const response = await axios.get(`${API_BASE_URL}/getAllDriverPerformance`, {
        headers: getAuthHeaders(),
        params,
      });

      const apiData = response.data?.data?.models || [];
      const totalPageCount = response.data?.data?.totalPages || 1;

      // Transform API to frontend-friendly structure
      const formatted = apiData.map((item) => ({
        performance_id: item.id,
        driver_id: item.users?.id,
        username: item.users?.fullName || "-",
        total_rides: item.total_rides,
        cancelled_rides: item.cancelled_rides,
        emergency_rides: item.emergency_rides,
        late_pickups: item.late_pickups,
        complaints_received: item.complaints_received,
        average_rating: item.average_rating,
        last_reviewed: item.last_reviewed,
        performance_flag: item.performance_flag,
      }));

      setDrivers(formatted);
      setTotalPages(totalPageCount);
      setCurrentPage(response.data?.data?.currentPage || 1);
    } catch (err) {
      console.error("Error fetching driver performance:", err);
      setDrivers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers(currentPage);
  }, [currentPage, itemsPerPage, date]);

  // Filtered & Paginated Drivers
  const filteredDrivers = drivers.filter((d) =>
    d.username.toLowerCase().includes(search.toLowerCase())
  );

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

      {/* Filters */}
      <div className="filter-search-container">
        <div className="filter-container">
          <p className="btn btn-primary mb-0">Filter by Date -</p>
          <Form.Group className="me-3">
            <Form.Control
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setCurrentPage(1);
              }}
            />
          </Form.Group>
        </div>
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
          <div className="text-center py-5 fs-4">
            <Spinner animation="border" size="sm" /> Loading...
          </div>
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
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {displayedDrivers.length > 0 ? (
                  displayedDrivers.map((driver, idx) => (
                    <tr key={driver.performance_id}>
                      <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                      <td>
                        <span
                          className="driver-id-link"
                          onClick={() =>
                            navigate(`/dms/driver/view/${driver.driver_id}`, {
                              state: {
                                driver: {
                                  userId: driver.driver_id,  // <- use userId here
                                  fullName: driver.username,
                                  email: driver.email || null,
                                  profileImage: driver.profileImage || null,
                                }
                              }
                            })
                          }
                        >
                          {driver.username}
                        </span>
                      </td>
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
                        <FaEye
                          title="View Details"
                          className="icon icon-blue"
                          style={{ cursor: "pointer" }}
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
                    <td colSpan="11" className="text-center">
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
