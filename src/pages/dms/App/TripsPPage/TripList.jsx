import React, { useState, useEffect } from "react";
import {
    Table,
    InputGroup,
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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const TripList = () => {
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [loading, setLoading] = useState(false);

    const fetchTrips = async (page = 1, searchValue = "", statusFilter = "") => {
        setLoading(true);
        try {
            const token = JSON.parse(localStorage.getItem("userData"))?.token;

            const response = await axios.get(`${API_BASE_URL}/getAllRides`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    page,
                    limit: itemsPerPage,
                    search: searchValue || undefined,
                    status: statusFilter || undefined,
                },
            });

            const apiData = response.data?.data || [];
            const totalItems = response.data?.totalItems || 0;
            const totalPages = response.data?.totalPages || 1;

            setTrips(apiData);
            setTotalItems(totalItems);
            setTotalPages(totalPages);
        } catch (error) {
            console.error("Error fetching trips:", error);
            setTrips([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrips(currentPage, search, filter);
    }, [currentPage, itemsPerPage, filter]);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        setCurrentPage(1);
        fetchTrips(1, value, filter);
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <AdminLayout>
            <div className="dms-pages-header sticky-header">
                <div className="live-count">
                    <h3>Trips List</h3>
                    <div className="live-count-container">
                        <Button className="green-button">
                            🏍️ Total Trips: {totalItems}
                        </Button>
                    </div>
                </div>
                <div className="export-import-container">
                    <DropdownButton
                        variant="primary"
                        title={
                            <>
                                <FaFileExport /> Export
                            </>
                        }
                        className="me-2"
                    >
                        <Dropdown.Item>
                            <FaFileExcel className="icon-green" /> Export to Excel
                        </Dropdown.Item>
                        <Dropdown.Item>
                            <FaFilePdf className="icon-red" /> Export to PDF
                        </Dropdown.Item>
                    </DropdownButton>
                </div>
            </div>

            <div className="filter-search-container">
                <DropdownButton
                    variant="primary"
                    title="Filter Status"
                    id="filter-dropdown"
                >
                    <Dropdown.Item onClick={() => setFilter("")}>All</Dropdown.Item>
                    <Dropdown.Item onClick={() => setFilter("completed")}>
                        Completed
                    </Dropdown.Item>
                    <Dropdown.Item
                        onClick={() => setFilter("cancelled")}
                        className="text-custom-danger"
                    >
                        Cancelled
                    </Dropdown.Item>
                    <Dropdown.Item
                        onClick={() => setFilter("emergency")}
                        className="text-custom-warning"
                    >
                        Emergency
                    </Dropdown.Item>
                </DropdownButton>

                <InputGroup className="dms-custom-width">
                    <Form.Control
                        placeholder="Search trips..."
                        value={search}
                        onChange={handleSearch}
                    />
                </InputGroup>
            </div>

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
                                <th>Trip Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trips.length > 0 ? (
                                trips.map((trip, idx) => (
                                    <tr key={trip.id}>
                                        <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                                        <td>{trip.rider_name}</td>
                                        <td>{trip.driver_name}</td>
                                        <td>{trip.ride_type}</td>
                                        <td>{trip.pickup_address}</td>
                                        <td>{trip.drop_address}</td>
                                        <td>₹{trip.fare}</td>
                                        <td>{trip.status}</td>
                                        <td>
                                            {trip.createdAt
                                                ? new Date(trip.createdAt).toLocaleDateString()
                                                : "-"}
                                        </td>
                                        <td>
                                            <FaEye
                                                title="View"
                                                className="icon icon-blue"
                                                onClick={() =>
                                                    navigate(`/dms/trip/view/${trip.id}`, { state: { trip } })
                                                }
                                            />
                                            <FaEdit
                                                title="Edit"
                                                className="icon icon-green"
                                                onClick={() =>
                                                    navigate("/dms/trip/edit", { state: { trip } })
                                                }
                                            />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="11" className="text-center">
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
