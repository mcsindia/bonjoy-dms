import React, { useState, useEffect } from "react";
import { Table, Form, Pagination, DropdownButton, Dropdown, Button } from "react-bootstrap";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { getModuleId, getToken } from '../../../../../utils/authhelper';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

export const DriverRideHistory = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const driverId = location.state?.driverId;
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(false);

    // Filters
    const [paymentStatus, setPaymentStatus] = useState("completed");
    const [dateFilter, setDateFilter] = useState("");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const token = getToken();
    const moduleId = getModuleId("driverridehistory");

    const fetchRides = async () => {
        setLoading(true);
        try {
            const params = {
                driverId,
                module_id: moduleId,
                payment_status: paymentStatus,
                date: dateFilter,
                page: currentPage,
                limit: itemsPerPage
            };

            const response = await axios.get(`${API_BASE_URL}/getAllRides`, {
                headers: { Authorization: `Bearer ${token}` },
                params
            });

            setRides(response.data?.data || []);
            setTotalPages(response.data?.totalPages || 1);
        } catch (error) {
            console.error("Error fetching ride history:", error);
            setRides([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (driverId) fetchRides();
    }, [driverId, paymentStatus, dateFilter, currentPage, itemsPerPage]);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) setCurrentPage(pageNumber);
    };

    return (
        <AdminLayout>
            <div className="dms-pages-header sticky-header">
                <h3>Driver Ride History</h3>

                <div className="filter-search-container">
                    {/* Payment Status Filter */}
                    <DropdownButton
                        title={`Filter by payment: `}
                        className="me-2"
                        onSelect={(val) => {
                            setPaymentStatus(val);
                            setCurrentPage(1);
                        }}
                    >
                        <Dropdown.Item eventKey="completed">Completed</Dropdown.Item>
                        <Dropdown.Item eventKey="pending">Pending</Dropdown.Item>
                        <Dropdown.Item eventKey="failed">Failed</Dropdown.Item>
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
                                <th>Rider</th>
                                <th>Pickup Time</th>
                                <th>Drop Time</th>
                                <th>Pickup Address</th>
                                <th>Drop Address</th>
                                <th>Fare (₹)</th>
                                <th>Distance (km)</th>
                                <th>Payment Status</th>
                                <th>Ride Status</th>
                                <th>Trip Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rides.length > 0 ? (
                                rides.map((ride, idx) => (
                                    <tr key={ride.id}>
                                        <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                                        <td>
                                            <span
                                                className="rider-id-link "
                                                onClick={() =>
                                                    navigate(`/dms/rider/view/${ride.rider_id}`, {
                                                        state: {
                                                            rider: {
                                                                id: ride.rider_id,
                                                                userId: ride.rider_user_id,
                                                                fullName: ride.rider_name,
                                                                profileImage: ride.rider_profile_image
                                                            }
                                                        }
                                                    })
                                                }
                                            >
                                                <img
                                                    src={ride.rider_profile_image ? `${IMAGE_BASE_URL}${ride.rider_profile_image}` : ""}
                                                    alt={ride.rider_name}
                                                    className="rounded-circle me-2"
                                                    style={{ width: 30, height: 30 }}
                                                />
                                                {ride.rider_name || "-"}
                                            </span>
                                        </td>
                                        <td>{ride.pickup_time || "-"}</td>
                                        <td>{ride.drop_time || "-"}</td>
                                        <td>{ride.pickup_address || "-"}</td>
                                        <td>{ride.drop_address || "-"}</td>
                                        <td>₹{ride.fare || 0}</td>
                                        <td>{ride.distance || 0}</td>
                                        <td>{ride.payment_status || "-"}</td>
                                        <td>{ride.status || "-"}</td>
                                        <td>{ride.createdAt ? new Date(ride.createdAt).toLocaleDateString() : "-"}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="11" className="text-center">
                                        No rides found.
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
