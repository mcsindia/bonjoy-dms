import React, { useState } from 'react';
import { AdminLayout } from '../../../layouts/dms/AdminLayout/AdminLayout';
import { Dropdown, DropdownButton, Form } from "react-bootstrap";
import { FaUserCheck, FaFileAlt, FaCalendarAlt } from "react-icons/fa";
import { Bar, Pie, Line } from "react-chartjs-2";
import { Link, useNavigate } from 'react-router-dom';
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

export const Dashboard3 = () => {
    const [filter, setFilter] = useState("Last 7 Days");
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const navigate = useNavigate();
    const driverPendingCount = 7;
    const newDocumentsCount = 4;
    const userData = JSON.parse(localStorage.getItem("userData"));
     let permissions = [];

if (Array.isArray(userData?.employeeRole)) {
  for (const role of userData.employeeRole) {
    for (const child of role.childMenus || []) {
      for (const mod of child.modules || []) {
        if (mod.moduleUrl?.toLowerCase() === "dashboard") {
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

    const handleFilterChange = (selectedFilter) => {
        setFilter(selectedFilter);
        console.log(`Filter changed to: ${selectedFilter}`);
    };

    const stats = [
        {
            category: "Ride Statistics",
            icon: "🚖",
            status: "✅",
            link: '/dms/rider',
            items: [
                {
                    title: "Total Rides",
                    feature: "Total",
                    value: "550",
                    emergency: "5",
                    commission: "2"
                },
                {
                    title: "Active Rides",
                    feature: "Active",
                    value: "11",
                    emergency: "4",
                    commission: "3"
                },
                {
                    title: "Pending Rides",
                    feature: "Pending",
                    value: "10",
                    emergency: "1",
                    commission: "1"
                },
                {
                    title: "Completed Rides",
                    feature: "Completed",
                    value: "22",
                    emergency: "0",
                    commission: "2"
                },
                {
                    title: "Canceled Rides",
                    feature: "Canceled",
                    value: "22",
                    emergency: "0",
                    commission: "1"
                }
            ],
            color: "#500073"
        },
        {
            category: "Driver Performance",
            icon: "👨‍✈️",
            status: "⚠",
            link: '/dms/driver',
            items: [
                {
                    title: "Total Drivers",
                    feature: "Total",
                    value: "100",
                    emergency: "4",
                    commission: "2"
                },
                {
                    title: "Active Drivers",
                    feature: "Active",
                    value: "45",
                    emergency: "4",
                    commission: "2"
                },
                {
                    title: "Idle Drivers",
                    feature: "Idle",
                    value: "30",
                    emergency: "3",
                    commission: "6"
                },
                {
                    title: "Driver Approval Pending",
                    feature: "Pending",
                    value: "15",
                    emergency: "0",
                    commission: "0"
                },
                {
                    title: "Driver Suspended",
                    feature: "Suspended",
                    value: "10",
                    emergency: "0",
                    commission: "0"
                },
                {
                    title: "Top Rated Drivers",
                    feature: "Top Rated (4.5 to 5 ★)",
                    value: "12",
                    emergency: "1",
                    commission: "2"
                }
            ],
            color: "#118B50"
        },

        {
            category: "Payment Overview",
            icon: "💰",
            status: "❌",
            link: '/dms/payment',
            table: true,
            headers: ["Metrics", "Total", "Payroll", "Commission"],
            rows: [
                { metric: "Total Revenue", total: "₹50000", payroll: "₹30000", commission: "₹20000" },
                { metric: "Driver Pending Payout", total: "₹7000", payroll: "₹7000", commission: "-" },
                { metric: "Refund Requests", total: "₹2000", payroll: "-", commission: "-" },
                { metric: "Pending Payments", total: "₹5000", payroll: "₹4000", commission: "₹1000" }
            ],
            color: "#F72C5B"
        },
        {
            category: "Rider Engagement",
            icon: "🧑‍🤝‍🧑",
            status: "✅",
            link: '/dms/rider',
            items: [
                { title: "Total Riders", value: "2000" },
                { title: "Active Riders (Last 7 Days)", value: "450" },
                { title: "New Sign-ups (24 hrs)", value: "50" },
                { title: "Top Rated Riders (★ 4.5 - 5)", value: "100" }
            ],
            color: "#006BFF"
        },
        {
            category: "Support & Complaints",
            icon: "📞",
            status: "⚠",
            link: "/dms/support-request",
            items: [
                { title: "Total Support Tickets", value: "50" },
                { title: "Pending Complaints", value: "20" },
                { title: "Resolved Complaints", value: "25" },
                { title: "Refund Requests Pending", value: "5" }
            ],
            color: "#ff9800"
        },
    ];

    const revenueData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
            {
                label: "Normal Revenue (₹)",
                data: [30000, 18000, 25000, 28000, 35000, 22000, 32000, 31000, 20000, 34000, 23000, 36000],
                backgroundColor: "#007bff", // blue
                borderRadius: 2
            },
            {
                label: "Emergency Revenue (₹)",
                data: [12000, 7000, 10000, 12000, 15000, 13000, 15000, 12000, 10000, 14000, 12000, 14000],
                backgroundColor: "#dc3545", // red
                borderRadius: 2
            }
        ]
    };

    const revenueOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: "top"
            },
            tooltip: {
                callbacks: {
                    label: (context) => `₹${context.raw.toLocaleString()}`
                }
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { font: { weight: "bold" } }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value) => `₹${value / 1000}k`,
                    font: { weight: "bold" }
                },
                grid: { drawBorder: false }
            }
        },
        animation: {
            duration: 1000,
            easing: "easeInOutQuart"
        }
    };

    const driverAvailabilityData = {
        labels: ["Emergency Drivers", "Commission Drivers"],
        datasets: [
            {
                data: [12, 15],
                backgroundColor: ["#FF6384", "#36A2EB"],
            },
        ],
    };

    const pieOptions = {
        responsive: true,
        plugins: {
            legend: { position: "bottom", labels: { boxWidth: 15 } },
            tooltip: { callbacks: { label: (context) => `${context.label}: ${context.raw}%` } },
        },
        maintainAspectRatio: false,
    };

    const rideVolumeData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
            {
                label: "Emergency Rides",
                data: [20, 30, 25, 40, 35, 45, 50, 60, 55, 65, 60, 70],
                fill: false,
                borderColor: "rgba(255, 99, 132, 1)", // red line
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderWidth: 2,
                tension: 0.3,
                pointBackgroundColor: "#FF4D4D",
            },
            {
                label: "Normal Rides",
                data: [180, 220, 275, 310, 365, 405, 450, 490, 545, 585, 640, 680],
                fill: false,
                borderColor: "rgba(54, 162, 235, 1)", // blue line
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                borderWidth: 2,
                tension: 0.3,
                pointBackgroundColor: "#36A2EB",
            }
        ]
    };

    const rideOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: "top",
            },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.dataset.label}: ${context.raw}`
                }
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { font: { weight: "bold" } }
            },
            y: {
                beginAtZero: true,
                ticks: { font: { weight: "bold" } }
            }
        },
        elements: {
            line: { tension: 0.3 }
        }
    };

    const userEngagementData = {
        labels: ["Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Jaipur", "Hyderabad"],
        datasets: [
            {
                label: "Engagement Level",
                data: [0.8, 0.7, 0.9, 0.6, 0.5, 0.4, 0.8],
                backgroundColor: [
                    "#500073",
                    "#118B50",
                    "#006BFF",
                    "#F72C5B",
                    "#ff9800",
                    "#4CAF50",
                    "#FE5D26"
                ],
                borderRadius: 8,
                barThickness: 20
            }
        ]
    };

    const userEngagementOptions = {
        indexAxis: 'y',
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (context) => `Engagement: ${Math.round(context.raw * 100)}%`
                }
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                max: 1,
                ticks: {
                    callback: (value) => `${Math.round(value * 100)}%`
                }
            },
            y: {
                ticks: {
                    font: { weight: 'bold' }
                }
            }
        }
    };

    return (
        <AdminLayout>
            <div className="dashboard-container container-fluid">
                <div className="dms-pages-header">
                    <h2>Dashboard</h2>
                    <div className='filter-container'>
                        <DropdownButton
                            id="dropdown-filter"
                            title={<><FaCalendarAlt /> {filter}</>}
                            onSelect={handleFilterChange}
                        >
                            <Dropdown.Item eventKey="Last 7 Days">Last 7 Days</Dropdown.Item>
                            <Dropdown.Item eventKey="Last 30 Days">Last 30 Days</Dropdown.Item>
                            <Dropdown.Item eventKey="Last 365 Days">Last 365 Days</Dropdown.Item>
                        </DropdownButton>
                        <p className='btn btn-primary'>Filter by Date -</p>
                        <Form.Group controlId="fromDate">
                            <Form.Control type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="toDate">
                            <Form.Control type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                        </Form.Group>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="row mb-4">
                    <div className="col-md-6">
                        <div
                            className="card quick-action-card shadow-sm p-3 d-flex flex-row align-items-center justify-content-between bg-warning-subtle border-start border-4 border-warning"
                            onClick={() => handlePermissionCheck("view", () => navigate("/dms/driver"))}
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
                            onClick={() => handlePermissionCheck("view", () => navigate("/dms/driver"))}
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
                                <div className={`${["Payment Overview", "Ride Statistics", "Driver Performance"].includes(stat.category) ? 'col-12' : 'col-md-6'} mb-4`} key={index}>
                                    <div className="card p-shadow-sm">
                                        <h4 className="card-header d-flex align-items-center justify-content-between mb-2" style={{ color: 'white', backgroundColor: stat.color, padding: '10px', fontWeight: 'bold' }}>
                                            <span>
                                                {stat.icon}
                                                <span
                                                    onClick={() =>
                                                        handlePermissionCheck("view", () => navigate(stat.link), "You don't have permission to view this page.")
                                                    }
                                                    style={{ color: 'white', textDecoration: 'none', cursor: 'pointer' }}
                                                >
                                                    {stat.category}
                                                </span>
                                            </span>
                                            <span style={{ fontSize: '1.2rem' }}>{stat.status}</span>
                                        </h4>
                                        <div className="p-2">
                                            {(stat.category === "Ride Statistics" || stat.category === "Driver Performance") ? (
                                                <>
                                                    <div className="row fw-bold border-bottom pb-1 mb-2 stat-item d-flex justify-content-between">
                                                        <div className="col">Metric</div>
                                                        <div className="col text-center">Total</div>
                                                        <div className="col text-center">Emergency</div>
                                                        <div className="col text-center">Commission</div>
                                                    </div>
                                                    {stat.items.map((item, idx) => (
                                                        <div className="row mb-2 stat-item d-flex justify-content-between" key={idx}>
                                                            <div className="col stat-title mb-1">{item.feature || item.title}</div>
                                                            <div className="col text-center stat-value mb-1 font-weight-bold">{item.value || '-'}</div>
                                                            <div className="col text-center stat-value mb-1 font-weight-bold">{item.emergency || '0'}</div>
                                                            <div className="col text-center stat-value mb-1 font-weight-bold">{item.commission || '0'}</div>
                                                        </div>
                                                    ))}
                                                </>
                                            ) : stat.table ? (
                                                <>
                                                    <div className="row fw-bold border-bottom pb-1 mb-2 stat-item d-flex justify-content-between">
                                                        <div className="col">Metric</div>
                                                        <div className="col text-center">Total</div>
                                                        <div className="col text-center">Payroll</div>
                                                        <div className="col text-center">Commission</div>
                                                    </div>
                                                    {stat.rows.map((row, idx) => (
                                                        <div className="row mb-2 stat-item d-flex justify-content-between" key={idx}>
                                                            <div className="col stat-title mb-1">{row.metric}</div>
                                                            <div className="col text-center stat-value mb-1 font-weight-bold">{row.total || '-'}</div>
                                                            <div className="col text-center stat-value mb-1 font-weight-bold">{row.payroll || '-'}</div>
                                                            <div className="col text-center stat-value mb-1 font-weight-bold">{row.commission || '-'}</div>
                                                        </div>
                                                    ))}
                                                </>
                                            ) : (
                                                stat.items.map((item, idx) => (
                                                    <div className="stat-item d-flex justify-content-between" key={idx}>
                                                        <p className="stat-title mb-1">{item.title}</p>
                                                        <p className="stat-value mb-1 font-weight-bold">{item.value}</p>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="col-lg-5 dms-right-section">
                        <h5 className=" mb-2">Revenue Growth (₹)</h5>
                        <div className="card p-4 shadow-sm mb-4">
                            <div style={{ height: "250px", width: "100%" }}>
                                <Bar data={revenueData} options={revenueOptions} />
                            </div>
                        </div>

                        {/* Driver Availability Pie Chart */}
                        <h5 className=" mb-2">Driver Availability</h5>
                        <div className="card p-4 shadow-sm mb-4">
                            <div style={{ height: "250px", width: "100%" }}>
                                <Pie data={driverAvailabilityData} options={pieOptions} />
                            </div>
                        </div>

                        {/* Ride Volume Line Graph */}
                        <h5 className=" mb-2">Ride Volume Over Time</h5>
                        <div className="card p-4 shadow-sm mb-4">
                            <div style={{ height: "250px", width: "100%" }}>
                                <Line data={rideVolumeData} options={rideOptions} />
                            </div>
                        </div>

                        {/* User Engagement */}
                        <h5 className="mb-2">User Engagement by City</h5>
                        <div className="card p-4 shadow-sm mb-4">
                            <div style={{ height: "250px", width: "100%" }}>
                                <Bar data={userEngagementData} options={userEngagementOptions} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};
