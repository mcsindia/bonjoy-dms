import React, { useState, useEffect } from "react";
import { Table, Form, InputGroup, Pagination, Button } from "react-bootstrap";
import { FaStar, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";

// Dummy data with trip details
const dummyData = [
  {
    user_id: "U001",
    username: "John Doe",
    total_rides: 45,
    total_ratings_received: 42,
    average_rating: 4.5,
    driving_quality_avg: 4.6,
    behavior_avg: 4.4,
    punctuality_avg: 4.7,
    last_updated: "2025-10-08T10:00:00Z",
    trip_details: {
      last_trip_date: "2025-10-08",
      last_trip_pickup: "MG Road, Bangalore",
      last_trip_drop: "HSR Layout, Bangalore",
      last_trip_fare: 450,
      last_trip_distance: 12,
    },
  },
  {
    user_id: "U002",
    username: "Jane Smith",
    total_rides: 30,
    total_ratings_received: 30,
    average_rating: 4.2,
    driving_quality_avg: 4.1,
    behavior_avg: 4.3,
    punctuality_avg: 4.0,
    last_updated: "2025-10-07T09:30:00Z",
    trip_details: {
      last_trip_date: "2025-10-07",
      last_trip_pickup: "Koramangala, Bangalore",
      last_trip_drop: "Indiranagar, Bangalore",
      last_trip_fare: 300,
      last_trip_distance: 8,
    },
  },
  {
    user_id: "U003",
    username: "Robert Johnson",
    total_rides: 20,
    total_ratings_received: 18,
    average_rating: 3.9,
    driving_quality_avg: 4.0,
    behavior_avg: 3.8,
    punctuality_avg: 3.9,
    last_updated: "2025-10-06T12:15:00Z",
    trip_details: {
      last_trip_date: "2025-10-06",
      last_trip_pickup: "Whitefield, Bangalore",
      last_trip_drop: "Electronic City, Bangalore",
      last_trip_fare: 600,
      last_trip_distance: 18,
    },
  },
];

export const UserRatingSummery = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setUsers(dummyData);
      setLoading(false);
    }, 500);
  }, []);

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const displayedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) setCurrentPage(pageNumber);
  };

  return (
    <AdminLayout>
      <div className="dms-pages-header sticky-header">
        <h3>User Rating Summary</h3>
      </div>

      {/* Search Filter */}
      <div className="filter-search-container mb-3">
        <InputGroup className="dms-custom-width">
          <Form.Control
            placeholder="Search by username..."
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
                  <th>Total Ratings</th>
                  <th>Average Rating</th>
                  <th>Driving Quality</th>
                  <th>Behavior</th>
                  <th>Punctuality</th>
                  <th>Last Trip Info</th>
                  <th>Last Updated</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {displayedUsers.length > 0 ? (
                  displayedUsers.map((user, idx) => (
                    <tr key={user.user_id}>
                      <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                      <td>{user.username}</td>
                      <td>{user.total_rides}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <FaStar className="icon star-icon me-1" />
                          {user.total_ratings_received}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <FaStar className="icon star-icon me-1" />
                          {user.average_rating.toFixed(1)}
                        </div>
                      </td>
                      <td>{user.driving_quality_avg?.toFixed(1) || "-"}</td>
                      <td>{user.behavior_avg?.toFixed(1) || "-"}</td>
                      <td>{user.punctuality_avg?.toFixed(1) || "-"}</td>
                      <td>
                        {user.trip_details
                          ? `${user.trip_details.last_trip_date} | ${user.trip_details.last_trip_pickup} → ${user.trip_details.last_trip_drop} | ₹${user.trip_details.last_trip_fare} | ${user.trip_details.last_trip_distance}km`
                          : "-"}
                      </td>
                      <td>{new Date(user.last_updated).toLocaleDateString()}</td>
                      <td>
                        <FaEye
                          title="View Details"
                          className="icon icon-blue"
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            navigate(`/dms/userratingsummary/view/${user.user_id}`, {
                              state: { user },
                            })
                          }
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="text-center">
                      No users found.
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
