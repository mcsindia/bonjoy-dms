import React, { useState, useEffect } from "react";
import {
    Table,
    Form,
    Pagination,
    Dropdown,
    DropdownButton,
    Button,
} from "react-bootstrap";
import { FaEye, FaEdit, FaFileExport, FaFileExcel, FaFilePdf } from "react-icons/fa";
import { AdminLayout } from "../../../../layouts/dms/AdminLayout/AdminLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getModuleId, getToken } from "../../../../utils/authhelper";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = () => ({
    Authorization: `Bearer ${getToken()}`,
});

export const TripList = () => {
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(false);

    // Filters
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [dateFilter, setDateFilter] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("All");
    const [emergencyRide, setEmergencyRide] = useState("All");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Permissions
    const userData = JSON.parse(localStorage.getItem("userData"));
    let permissions = [];
    if (Array.isArray(userData?.employeeRole)) {
        for (const role of userData.employeeRole) {
            for (const child of role.childMenus || []) {
                for (const mod of child.modules || []) {
                    if (mod.moduleUrl?.toLowerCase() === "trip") {
                        permissions = mod.permission?.toLowerCase().split(",").map((p) => p.trim()) || [];
                    }
                }
            }
        }
    }

    const fetchTrips = async () => {
        setLoading(true);
        try {
            const params = {
                page: currentPage,
                limit: itemsPerPage,
                module_id: getModuleId("trip"),
            };

            if (search) params.search = search;
            if (statusFilter !== "All") params.status = statusFilter;
            if (dateFilter) params.date = dateFilter;
            if (paymentStatus !== "All") params.payment_status = paymentStatus;
            if (emergencyRide !== "All") params.emergency_ride = emergencyRide;

            const response = await axios.get(`${API_BASE_URL}/getAllRides`, {
                headers: getAuthHeaders(),
                params,
            });

            const data = response.data?.data || [];
            setTrips(data);
            setTotalItems(response.data?.totalItems || 0);
            setTotalPages(response.data?.totalPages || 1);
        } catch (error) {
            console.error("Error fetching trips:", error);
            setTrips([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrips();
    }, [search, statusFilter, dateFilter, paymentStatus, emergencyRide, currentPage, itemsPerPage]);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) setCurrentPage(pageNumber);
    };

    return (
        <AdminLayout>
            <div className="dms-pages-header sticky-header">
                <div className="live-count">
                    <h3>Trips List</h3>
                    <div className="live-count-container">
                        <Button className="green-button">🏍️ Total Trips: {totalItems}</Button>
                    </div>
                </div>
                <div className="export-import-container">
                    <DropdownButton variant="primary" title={<><FaFileExport /> Export</>} className="me-2">
                        <Dropdown.Item>
                            <FaFileExcel className="icon-green" /> Export to Excel
                        </Dropdown.Item>
                        <Dropdown.Item>
                            <FaFilePdf className="icon-red" /> Export to PDF
                        </Dropdown.Item>
                    </DropdownButton>
                </div>
            </div>

            {/* Filters */}
            <div className="filter-search-container">
                <div className="filter-container">
                    {/* Status Filter */}
                    <DropdownButton
                        title={`Filter by Status`}
                        className="me-2"
                        onSelect={(val) => {
                            setStatusFilter(val);
                            setCurrentPage(1);
                        }}
                    >
                        <Dropdown.Item eventKey="All">All</Dropdown.Item>
                        <Dropdown.Item eventKey="booked">Booked</Dropdown.Item>
                        <Dropdown.Item eventKey="completed">Completed</Dropdown.Item>
                        <Dropdown.Item eventKey="cancelled">Cancelled</Dropdown.Item>
                        <Dropdown.Item eventKey="emergency">Emergency</Dropdown.Item>
                    </DropdownButton>

                    {/* Payment Status Filter */}
                    <DropdownButton
                        title={`Filter by Payment`}
                        className="me-2"
                        onSelect={(val) => {
                            setPaymentStatus(val);
                            setCurrentPage(1);
                        }}
                    >
                        <Dropdown.Item eventKey="All">All</Dropdown.Item>
                        <Dropdown.Item eventKey="pending">Pending</Dropdown.Item>
                        <Dropdown.Item eventKey="completed">Completed</Dropdown.Item>
                    </DropdownButton>

                    {/* Emergency Filter */}
                    <DropdownButton
                        title={`Filter by Emergency`}
                        className="me-2"
                        onSelect={(val) => {
                            setEmergencyRide(val);
                            setCurrentPage(1);
                        }}
                    >
                        <Dropdown.Item eventKey="All">All</Dropdown.Item>
                        <Dropdown.Item eventKey="1">Yes</Dropdown.Item>
                        <Dropdown.Item eventKey="0">No</Dropdown.Item>
                    </DropdownButton>

                    {/* Date Filter */}
                    <DropdownButton variant="primary" title="Filter by Date" className="me-2">
                        <Form.Control
                            type="date"
                            value={dateFilter}
                            onChange={(e) => {
                                setDateFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            max={new Date().toISOString().split("T")[0]}
                        />
                    </DropdownButton>

                    <Button
                        variant="secondary"
                        onClick={() => {
                            setSearch("");
                            setStatusFilter("All");
                            setDateFilter("");
                            setPaymentStatus("All");
                            setEmergencyRide("All");
                            setCurrentPage(1);
                        }}
                    >
                        Clear Filters
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="dms-table-container">
                {loading ? (
                    <div className="text-center py-5 fs-4">Loading...</div>
                ) : (
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Rider Name</th>
                                <th>Driver Name</th>
                                <th>Ride Type</th>
                                <th>Pickup</th>
                                <th>Drop</th>
                                <th>Fare</th>
                                <th>Status</th>
                                <th>Payment</th>
                                <th>Emergency</th>
                                <th>Trip Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trips.length > 0 ? (
                                trips.map((trip, idx) => (
                                    <tr key={trip.id}>
                                        <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>

                                        {/* Rider Name clickable */}
                                        <td>
                                            <span
                                                className="rider-id-link "
                                                onClick={() =>
                                                    navigate(`/dms/rider/view/${trip.rider_id}`, {
                                                        state: {
                                                            rider: {
                                                                id: trip.rider_id,
                                                                userId: trip.rider_user_id,
                                                                fullName: trip.rider_name,
                                                                profileImage: trip.rider_profile_image
                                                            }
                                                        }
                                                    })
                                                }
                                            >
                                                {trip.rider_name || "-"}
                                            </span>
                                        </td>

                                        {/* Driver Name clickable */}
                                        <td>
                                            <span
                                                className="driver-id-link"
                                                onClick={() =>
                                                    navigate(`/dms/driver/view/${trip.driver_id}`, {
                                                        state: {
                                                            driver: {
                                                                id: trip.driver_id,
                                                                userId: trip.driver_user_id, // ensure this field exists
                                                                fullName: trip.driver_name,
                                                                profileImage: trip.driver_profile_image
                                                            }
                                                        }
                                                    })
                                                }
                                            >
                                                {trip.driver_name || "-"}
                                            </span>
                                        </td>

                                        <td>{trip.ride_type}</td>
                                        <td>{trip.pickup_address}</td>
                                        <td>{trip.drop_address}</td>
                                        <td>₹{trip.fare}</td>
                                        <td>{trip.status}</td>
                                        <td>{trip.payment_status}</td>
                                        <td>{trip.emergency_ride === 1 ? "Yes" : "No"}</td>
                                        <td>{trip.createdAt ? new Date(trip.createdAt).toLocaleDateString() : "-"}</td>
                                        <td>
                                            {permissions.includes("view") && (
                                                <FaEye
                                                    title="View"
                                                    className="icon icon-blue"
                                                    onClick={() => navigate(`/dms/trip/view/${trip.id}`, { state: { trip } })}
                                                />
                                            )}
                                            {permissions.includes("edit") && (
                                                <FaEdit
                                                    title="Edit"
                                                    className="icon icon-green"
                                                    onClick={() => navigate("/dms/trip/edit", { state: { trip } })}
                                                />
                                            )}
                                            {!permissions.includes("view") && !permissions.includes("edit") && "—"}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="12" className="text-center">
                                        No trips found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                )}

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
            </div>
        </AdminLayout>
    );
};
