import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button, Table, Pagination, Card, Badge } from "react-bootstrap";
import { FaEdit, FaStar } from "react-icons/fa";
import defaultProfileImg from "../../../../../assets/images/profile.png";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";
import axios from "axios";
import { getModuleId, getToken } from '../../../../../utils/authhelper';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

export const UserProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id: paramId } = useParams();
  const [user, setUser] = useState(location.state?.user || null);
  const [loading, setLoading] = useState(!user);
  const [error, setError] = useState(null);

  const userData = JSON.parse(localStorage.getItem("userData"));
  const token = getToken();
  let permissions = [];

  if (Array.isArray(userData?.employeeRole)) {
    for (const role of userData.employeeRole) {
      for (const child of role.childMenus || []) {
        for (const mod of child.modules || []) {
          if (mod.moduleUrl?.toLowerCase() === "user") {
            permissions =
              mod.permission?.toLowerCase().split(",").map((p) => p.trim()) ||
              [];
          }
        }
      }
    }
  }

  useEffect(() => {
    const userId = location.state?.user?.id || paramId;
    if (!user && userId) {
      setLoading(true);
      const moduleId = getModuleId("user");
      axios
        .get(`${API_BASE_URL}/getUserById/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { module_id: moduleId },
        })
        .then((res) => {
          if (res.data.success) {
            setUser(res.data.data.user);
            setError(null);
          } else {
            setError(res.data.message || "User not found");
          }
        })
        .catch((err) => {
          console.error("Error fetching user:", err.response || err.message);
          setError("Error fetching user.");
        })
        .finally(() => setLoading(false));
    }
  }, [location.state, paramId, user, token]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center mt-5">
          <h3>Loading user profile...</h3>
        </div>
      </AdminLayout>
    );
  }

  if (error || !user) {
    return (
      <AdminLayout>
        <div className="text-center mt-5">
          <h3>{error || "User not found"}</h3>
          <Button onClick={() => navigate("/dms/users")}>Go Back</Button>
        </div>
      </AdminLayout>
    );
  }

  const {
    id,
    fullName,
    email,
    mobile = "N/A",
    status,
    createdAt,
    userType,
    profileImage,
  } = user;

  const is_active = status === "Active";
  const profile_img =
    profileImage && profileImage.trim() !== ""
      ? `${IMAGE_BASE_URL}${profileImage}`
      : defaultProfileImg;
  const username = fullName;
  const account_creation_date = createdAt?.split("T")[0];

  //  Dummy Feedback Data
  const feedbackData = [
    { tripId: "TRIP001", driverId: "DRV001", rating: 4, remark: "Great ride!" },
    { tripId: "TRIP002", driverId: "DRV002", rating: 5, remark: "Excellent service!" },
    { tripId: "TRIP003", driverId: "DRV003", rating: 3, remark: "Could be better." },
  ];

  //  Dummy Wallet Data
  const walletData = [
    {
      date: "2023-12-18",
      transactionId: "TID001",
      rideId: "RID123",
      type: "credit",
      amount: 20,
      description: "Wallet top-up",
      createdAt: "2023-12-18 10:15 AM",
    },
    {
      date: "2023-12-17",
      transactionId: "TID002",
      rideId: "RID124",
      type: "debit",
      amount: 15,
      description: "Ride payment",
      createdAt: "2023-12-17 05:20 PM",
    },
    {
      date: "2023-12-16",
      transactionId: "TID003",
      rideId: null,
      type: "bonus",
      amount: 50,
      description: "Referral bonus",
      createdAt: "2023-12-16 09:45 AM",
    },
  ];

  // Pagination state
  const [feedbackPage, setFeedbackPage] = useState(1);
  const [walletPage, setWalletPage] = useState(1);
  const itemsPerPage = 3;

  const paginate = (data, currentPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  const feedbackPages = Math.ceil(feedbackData.length / itemsPerPage);
  const walletPages = Math.ceil(walletData.length / itemsPerPage);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar key={i} style={{ color: i < rating ? "gold" : "silver" }} />
    ));
  };

  return (
    <AdminLayout>
      <div className="user-profile-page container mt-4">
        <Card className="mb-4">
          <Card.Body className="d-flex justify-content-between align-items-center m-4 card-body-custom">
            {/* Profile Section */}
            <div className="d-flex align-items-center">
              <img
                src={profile_img}
                alt={`${username}'s Profile`}
                className="rounded-circle border profile-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultProfileImg;
                }}
              />
              <div>
                <h2>{username}</h2>
                <p>
                  <strong>User ID:</strong> {id}
                </p>
                <p>
                  <strong>Status:</strong>
                  {is_active ? (
                    <Badge bg="success">Active</Badge>
                  ) : (
                    <Badge bg="danger">Inactive</Badge>
                  )}
                </p>
              </div>
            </div>

            {permissions.includes("edit") && (
              <Button
                onClick={() => navigate("/dms/user/edit", { state: { user } })}
                className="edit-button"
              >
                <FaEdit /> Edit
              </Button>
            )}
          </Card.Body>
        </Card>

        {/* Basic Information */}
        <section className="mt-4">
          <h4>Basic Information</h4>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>User Type</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Account Creation Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{userType || "N/A"}</td>
                <td>{email}</td>
                <td>{mobile}</td>
                <td>{account_creation_date}</td>
              </tr>
            </tbody>
          </Table>
        </section>

        <hr className="table-hr" />

        {/* Activity Summary (Dummy) */}
        <section className="mt-4">
          <h4>Activity Summary</h4>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Total Rides Taken</th>
                <th>Total Distance Travelled</th>
                <th>Total Amount Spent</th>
                <th>Recent Activity</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>15</td>
                <td>250 km</td>
                <td>₹500</td>
                <td>2023-12-17</td>
              </tr>
            </tbody>
          </Table>
        </section>

        <hr className="table-hr" />

        {/* Ratings & Feedback */}
        <section className="mt-4">
          <h4>Ratings & Feedback</h4>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Trip ID</th>
                <th>Driver ID</th>
                <th>Rating</th>
                <th>Feedback</th>
              </tr>
            </thead>
            <tbody>
              {paginate(feedbackData, feedbackPage).map((fb, i) => (
                <tr key={i}>
                  <td>{fb.tripId}</td>
                  <td>{fb.driverId}</td>
                  <td>{renderStars(fb.rating)}</td>
                  <td>{fb.remark}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination className="justify-content-center">
            <Pagination.Prev
              onClick={() => setFeedbackPage(feedbackPage - 1)}
              disabled={feedbackPage === 1}
            />
            {[...Array(feedbackPages)].map((_, idx) => (
              <Pagination.Item
                key={idx + 1}
                active={idx + 1 === feedbackPage}
                onClick={() => setFeedbackPage(idx + 1)}
              >
                {idx + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => setFeedbackPage(feedbackPage + 1)}
              disabled={feedbackPage === feedbackPages}
            />
          </Pagination>
        </section>

        <hr className="table-hr" />

        {/* Wallet & Payments */}
        <section className="mt-4">
          <h4>Wallet Transaction List</h4>
          <Card className="mb-3">
            <Card.Body className="d-flex justify-content-between">
              <div>
                <p><strong>Wallet Balance:</strong> ₹150</p>
                <p><strong>Currency:</strong> INR</p>
              </div>
              <div>
                <p><strong>Last Updated:</strong> 2023-12-18</p>
              </div>
            </Card.Body>
          </Card>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>Transaction ID</th>
                <th>Ride ID</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {paginate(walletData, walletPage).map((tx, i) => (
                <tr key={i}>
                  <td>{tx.date}</td>
                  <td>{tx.transactionId}</td>
                  <td>{tx.rideId || "—"}</td>
                  <td>
                    <Badge
                      bg={
                        tx.type === "credit"
                          ? "success"
                          : tx.type === "debit"
                          ? "danger"
                          : tx.type === "bonus"
                          ? "primary"
                          : "warning"
                      }
                    >
                      {tx.type}
                    </Badge>
                  </td>
                  <td>{tx.amount}</td>
                  <td>{tx.description || "—"}</td>
                  <td>{tx.createdAt || "—"}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination className="justify-content-center">
            <Pagination.Prev
              onClick={() => setWalletPage(walletPage - 1)}
              disabled={walletPage === 1}
            />
            {[...Array(walletPages)].map((_, idx) => (
              <Pagination.Item
                key={idx + 1}
                active={idx + 1 === walletPage}
                onClick={() => setWalletPage(idx + 1)}
              >
                {idx + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => setWalletPage(walletPage + 1)}
              disabled={walletPage === walletPages}
            />
          </Pagination>
        </section>
      </div>
    </AdminLayout>
  );
};
