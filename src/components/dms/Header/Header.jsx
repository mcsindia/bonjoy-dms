import React, { useState, useEffect, useRef } from "react";
import { Dropdown } from "react-bootstrap";
import { FaBars, FaSearch, FaBell, FaEnvelope, FaUserCircle, FaSignOutAlt, FaEdit, FaUser, FaExclamationCircle, FaComment, FaUserPlus, FaEnvelopeOpenText } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export const DMSHeader = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('userData')) || {};
  let notificationPermissions = [];

  if (Array.isArray(userData?.employeeRole)) {
    for (const role of userData.employeeRole) {
      for (const child of role.childMenus || []) {
        for (const mod of child.modules || []) {
          if (mod.moduleUrl?.toLowerCase() === "notifications") {
            notificationPermissions = mod.permission
              ?.toLowerCase()
              .split(',')
              .map(p => p.trim()) || [];
          }
        }
      }
    }
  }

  const [notifications, setNotifications] = useState([
    { id: 1, icon: <FaExclamationCircle />, type: "Server Error", message: "Server Error Reports", time: "3 minutes ago" },
    { id: 2, icon: <FaComment />, type: "Message", message: "New message from John", time: "25 minutes ago" },
    { id: 3, icon: <FaUserPlus />, type: "User Registered", message: "New User Registered", time: "1 hour ago" },
    { id: 4, icon: <FaEnvelopeOpenText />, type: "Email", message: "New Email From John", time: "2 hours ago" },
  ]);

  const handleLogout = () => {
    // Clear token or session data
    localStorage.removeItem("authToken"); // or sessionStorage.removeItem("token") depending on where it's stored

    // Redirect to login or landing page
    navigate("/dms");
  };

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef(null);

  const handleViewAll = () => {
    navigate("/dms/notifications");
  };

  const toggleNotificationDropdown = () => {
    setIsNotificationOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="dms-header">
      <button className="btn btn-light me-3" onClick={toggleSidebar}>
        <FaBars size={20} />
      </button>
      <nav className="dms-header-nav">
        <a href="/dms/dashboard" className="dms-header-link">Home</a>
      </nav>

      <div className="dms-header-right d-flex align-items-center">
        <button className="btn btn-light">
          <FaSearch size={20} />
        </button>

        {notificationPermissions.includes("view") && (
          <div className="position-relative" ref={notificationRef}>
            <button
              className="dms-btn btn-light position-relative"
              onClick={toggleNotificationDropdown}
            >
              <FaBell size={20} />
              <span className="badge bg-danger position-absolute">
                {notifications.length}
              </span>
            </button>

            {isNotificationOpen && (
              <div className="dms-notification-list shadow p-3">
                <h6>Notifications</h6>
                <ul>
                  {notifications.map((notification) => (
                    <li key={notification.id}>
                      <div>{notification.icon}</div>
                      <div>
                        <div>{notification.message}</div>
                        <small>{notification.time}</small>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="text-center mt-2">
                  <button
                    className="btn btn-link text-primary"
                    onClick={handleViewAll}
                  >
                    View More
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <button className="dms-btn btn-light mx-2">
          <FaEnvelope size={20} />
        </button>

        <Dropdown align="end">
          <Dropdown.Toggle variant="light">
            <FaUserCircle size={30} />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item href="#profile"><FaUser /> My Profile</Dropdown.Item>
            <Dropdown.Item href="#edit-profile"><FaEdit /> Edit Profile</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout}><FaSignOutAlt /> Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};
