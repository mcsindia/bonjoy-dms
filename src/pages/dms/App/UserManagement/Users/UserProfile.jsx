import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button, Table, Pagination, Card, Badge } from "react-bootstrap";
import { FaEdit, FaPlus, FaStar, } from "react-icons/fa";
import defaultProfileImg from "../../../../../assets/images/profile.png";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

export const UserProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id: paramId } = useParams();
  const [user, setUser] = useState(location.state?.user || null);
  const [loading, setLoading] = useState(!user);
  const userData = JSON.parse(localStorage.getItem("userData"));
  let permissions = [];

  if (Array.isArray(userData?.employeeRole)) {
    for (const role of userData.employeeRole) {
      for (const child of role.childMenus || []) {
        for (const mod of child.modules || []) {
          if (mod.moduleUrl?.toLowerCase() === "user") {
            permissions = mod.permission
              ?.toLowerCase()
              .split(',')
              .map(p => p.trim()) || [];
          }
        }
      }
    }
  }

  const handlePermissionCheck = (permissionType, action, fallbackMessage = null) => {
    if (permissions.includes(permissionType)) {
      action(); // allowed, run the actual function
    } else {
      alert(fallbackMessage || `You don't have permission to ${permissionType} this employee.`);
    }
  };

  useEffect(() => {
    const userId = location.state?.user?.id || paramId;
    if (!user && userId) {
      setLoading(true);
      axios
        .get(`${API_BASE_URL}/getUserById/${userId}`)
        .then((res) => {
          if (res.data.success) {
            setUser(res.data.data.user);
          } else {
            console.error("User not found");
          }
        })
        .catch((err) => console.error("Error fetching user:", err))
        .finally(() => setLoading(false));
    }
  }, [location.state, paramId, user]);

  const feedbackData = [
    { tripId: 'TRIP001', driverId: 'DRV001', rating: 4, remark: 'Great ride!' },
    { tripId: 'TRIP002', driverId: 'DRV002', rating: 5, remark: 'Excellent service!' },
    { tripId: 'TRIP003', driverId: 'DRV003', rating: 3, remark: 'Could be better.' },
  ];

  const walletData = [
    { date: '2023-12-18', transactionId: 'TID001', amount: '+ ₹20' },
    { date: '2023-12-17', transactionId: 'TID002', amount: '- ₹15' },
    { date: '2023-12-16', transactionId: 'TID003', amount: '+ ₹50' },
  ];

  // Pagination state for each section
  const [feedbackPage, setFeedbackPage] = useState(1);
  const [walletPage, setWalletPage] = useState(1);

  const itemsPerPage = 3;

  // Helper function to paginate data
  const paginate = (data, currentPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const feedbackPages = Math.ceil(feedbackData.length / itemsPerPage);
  const walletPages = Math.ceil(walletData.length / itemsPerPage);

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center mt-5">
          <h3>Loading user profile...</h3>
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout>
        <div className="text-center mt-5">
          <h3>User not found</h3>
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
    userProfile,
    createdAt,
    userType
  } = user;

  const is_active = status === "Active";
  const profile_img = user.profileImage && user.profileImage.trim() !== ''
    ? `${IMAGE_BASE_URL}${user.profileImage}`
    : defaultProfileImg;
  const username = fullName;
  const account_creation_date = createdAt?.split("T")[0];

  // Render stars for rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} style={{ color: "gold" }} />
        ) : (
          <FaStar key={i} style={{ color: "silver" }} />
        )
      );
    }
    return stars;
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

            {/* Back Section */}
            <Button
              onClick={() => handlePermissionCheck("edit", () => navigate('/dms/user/edit', { state: { user } }))}
              className="edit-button"
            >
              <FaEdit /> Edit
            </Button>
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

        {/* Activity Summary */}
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
          <div className="dms-pages-header ">
            <h4>Ratings & Feedback</h4>
            <div className="d-flex">
              <Button variant="primary" onClick={() => navigate('/')}>
                View All
              </Button>
            </div>
          </div>

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
              {paginate(feedbackData, feedbackPage).map((feedback, index) => (
                <tr key={index}>
                  <td>
                    <a role="button" className='trip-id-link' onClick={() => navigate('/trip/details', { state: { trip: feedback } })}>
                      {feedback.tripId}
                    </a>
                  </td>
                  <td>
                    <a role="button" className='driver-id-link' onClick={() => navigate('/drivers/details/view', { state: { driver: feedback } })}>
                      {feedback.driverId}
                    </a>
                  </td>
                  <td>{renderStars(feedback.rating)}</td>
                  <td>{feedback.remark}</td>
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
          <div className="dms-pages-header">
            <h4>Wallet & Payments</h4>
            <div className="d-flex">
              <Button variant="primary" className="me-3" >
                <FaPlus /> Add Money
              </Button>
              <Button variant="primary" onClick={() => navigate('/')}>
                View All
              </Button>
            </div>
          </div>
          <p>
            <strong>Wallet Balance:</strong> ₹150
          </p>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>Transaction ID</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {paginate(walletData, walletPage).map((transaction, index) => (
                <tr key={index}>
                  <td>{transaction.date}</td>
                  <td>{transaction.transactionId}</td>
                  <td>{transaction.amount}</td>
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
        <hr className="table-hr" />

        {/* Account Settings */}
        <section className="mt-4">
          <h4>Account Settings</h4>
          <p>
            <strong>Language Preferences:</strong> English
          </p>
          <p>
            <strong>Privacy Settings:</strong> Public Profile
          </p>
          <p>
            <strong>Notification Preferences:</strong> Enabled
          </p>
          <Button variant="danger" className="me-2">
            Logout
          </Button>
          <Button variant="danger">Delete Account</Button>
        </section>
      </div>
    </AdminLayout>
  );
};
