import React, { useState } from 'react';
import { AdminLayout } from '../../../layouts/dms/AdminLayout/AdminLayout';
import { Dropdown, DropdownButton } from "react-bootstrap";
import { FaUserCheck, FaFileAlt, FaCalendarAlt } from "react-icons/fa";
import { Bar, Pie, Line } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  Filler,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  Filler,
  ArcElement
);
export const Dashboard2 = () => {
  const [filter, setFilter] = useState("This Year");
  const navigate = useNavigate();
  const driverPendingCount = 7; 
  const newDocumentsCount = 4;  

  const handleFilterChange = (selectedFilter) => {
    setFilter(selectedFilter);
    console.log(`Filter changed to: ${selectedFilter}`);
  };

  const stats = [
    {
      category: "Rides",
      items: [
        { title: "Total Rides", value: "550" },
        { title: "Confirmed Rides", value: "11" },
        { title: "Cancelled Rides", value: "22" },
        { title: "Completed Rides", value: "22" },
        { title: "Emergency Rides", value: "10" },
      ],
      color: "#500073", // Yellow
    },
    {
      category: "Earnings",
      items: [
        { title: "Total Earnings", value: "₹5000" },
        { title: "Driver Earnings", value: "₹500" },
        { title: "Company Earnings", value: "₹15000" },
      ],
      color: "#118B50", // Green
    },
    {
      category: "Driver Rating",
      items: [
        { title: "Five Star", value: "50" },
        { title: "Four Star", value: "30" },
        { title: "Three Star", value: "15" },
        { title: "Two Star", value: "3" },
        { title: "Single Star", value: "2" },
      ],
      color: "#006BFF", // Blue
    },
    {
      category: "Rider Rating",
      items: [
        { title: "Five Star", value: "60" },
        { title: "Four Star", value: "25" },
        { title: "Three Star", value: "10" },
        { title: "Two Star", value: "3" },
        { title: "Single Star", value: "2" },
      ],
      color: "#F72C5B", // Red
    },
    {
      category: "Complaints",
      items: [
        { title: "Total Complaints", value: "50" },
        { title: "Complaints by Rider", value: "25" },
        { title: "Complaints by Driver", value: "20" },
        { title: "Resolved", value: "40" },
        { title: "Pending", value: "10" },
      ],
      color: "#ff9800", // Orange
    },
  ];

  const revenueData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Revenue",
        data: [42000, 25000, 35000, 40000, 50000, 35000, 47000, 43000, 30000, 48000, 35000, 50000],
        backgroundColor: function (context) {
          const value = context.raw;
          return value > 40000 ? "#007bff" : "#6c757d";
        },
      },
    ],
  };

  const revenueOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `₹${context.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { weight: "bold" } } },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `₹${value / 1000}k`,
          font: { weight: "bold" },
        },
        grid: { drawBorder: false },
      },
    },
    elements: {
      bar: { borderRadius: 4 },
    },
    animation: {
      duration: 1000,
      easing: "easeInOutQuart",
    },
  };

  const pieData = {
    labels: ["Five Star", "Four Star", "Three Star", "Two Star", "Single Star"],
    datasets: [
      {
        data: [50, 30, 15, 3, 2],
        backgroundColor: ["#4CAF50", "#FFC107", "#FF9800", "#FF5722", "#F44336"],
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
        labels: {
          boxWidth: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `₹${context.label}: ${context.raw}`,
        },
      },
    },
    maintainAspectRatio: false,
  };

  const areaData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Completed Rides",
        data: [200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750],
        fill: true,
        backgroundColor: "#ffb3b3",
        borderColor: "#ff6666",
        borderWidth: 2,
      },
    ],
  };

  const areaOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `Rides: ${context.raw}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { weight: "bold" } },
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: { weight: "bold" },
        },
      },
    },
    elements: {
      line: { tension: 0.4 },
    },
  };

  return (
    <AdminLayout>
      <div className="dashboard-container container-fluid">
        <div className="dms-pages-header d-flex justify-content-between align-items-center mb-4">
          <h2>Dashboard</h2>
          <DropdownButton
            id="dropdown-filter"
            title={<><FaCalendarAlt /> {filter}</>}
            onSelect={handleFilterChange}
          >
            <Dropdown.Item eventKey="This Week">This Week</Dropdown.Item>
            <Dropdown.Item eventKey="This Month">This Month</Dropdown.Item>
            <Dropdown.Item eventKey="This Year">This Year</Dropdown.Item>
          </DropdownButton>
        </div>

        {/* Quick Actions */}
         <div className="row mb-4">
                <div className="col-md-6">
                  <div
                    className="card quick-action-card shadow-sm p-3 d-flex flex-row align-items-center justify-content-between bg-warning-subtle border-start border-4 border-warning"
                    onClick={() => navigate("/dms/drivers-approval")}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex flex-row align-items-center">
                      <FaUserCheck className="me-3 text-warning" size={24} />
                      <div>
                        <h6 className="mb-0">Approve Drivers</h6>
                        <small className="text-muted">Pending approvals</small>
                      </div>
                    </div>
                    <span className="badge bg-danger-subtle text-danger fw-bold px-3 py-2">
                      {driverPendingCount} New
                    </span>
                  </div>
                </div>
        
                <div className="col-md-6">
                  <div
                    className="card quick-action-card shadow-sm p-3 d-flex flex-row align-items-center justify-content-between bg-info-subtle border-start border-4 border-info"
                    onClick={() => navigate("/dms/driver-documents?filter=new")}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex flex-row align-items-center">
                      <FaFileAlt className="me-3 text-info" size={24} />
                      <div>
                        <h6 className="mb-0">Verify Documents</h6>
                        <small className="text-muted">New uploads waiting</small>
                      </div>
                    </div>
                    <span className="badge bg-danger-subtle text-danger fw-bold px-3 py-2">
                      {newDocumentsCount} New
                    </span>
                  </div>
                </div>
              </div>

        <div className="row">
          {/* Left Section */}
          <div className="col-lg-7 dms-left-section">
            <div className="row">
              {stats.map((stat, index) => (
                <div className="col-md-6 mb-4" key={index}>
                  <div className="card p-shadow-sm">
                    <h4 className="card-header mb-2" style={{ color: 'white', backgroundColor: stat.color, padding: '10px', fontWeight: 'bold' }}>
                      {stat.category}
                    </h4>
                    <div className='p-2'>
                      {stat.items.map((item, idx) => (
                        <div className="stat-item" key={idx}>
                          <p className="stat-title">{item.title}</p>
                          <p className="stat-value">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Section */}
          <div className="col-lg-5 dms-right-section">
            <h5 className="mb-2">Revenue Chart</h5>
            <div className="card p-4 shadow-sm mb-4">
              <div style={{ height: "250px", width: "100%" }}>
                <Bar data={revenueData} options={revenueOptions} />
              </div>
            </div>

            <h5 className="mb-2">Rating Average Distribution</h5>
            <div className="card p-4 shadow-sm mb-4" style={{ height: "300px" }}>
              <div style={{ height: "100%", width: "100%" }}>
                <Pie data={pieData} options={pieOptions} />
              </div>
            </div>

            <h5 className="mb-2">Completed Rides Over Time</h5>
            <div className="card p-4 shadow-sm">
              <div style={{ height: "250px", width: "100%" }}>
                <Line data={areaData} options={areaOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
