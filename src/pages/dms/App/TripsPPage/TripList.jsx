import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Table,
    InputGroup,
    Form,
    Pagination,
    Dropdown,
    DropdownButton,
    Button
} from "react-bootstrap";
import { FaEye, FaEdit, FaFileExport, FaFileExcel, FaFilePdf } from "react-icons/fa";
import { AdminLayout } from "../../../../layouts/dms/AdminLayout/AdminLayout";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const TripList = () => {
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const userData = JSON.parse(localStorage.getItem("userData"));

    let permissions = [];

    if (Array.isArray(userData?.employeeRole)) {
        for (const role of userData.employeeRole) {
            for (const child of role.childMenus || []) {
                for (const mod of child.modules || []) {
                    if (mod.moduleUrl?.toLowerCase() === "trip") {
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
        fetchTrips(currentPage);
    }, [currentPage, itemsPerPage]);

    const fetchTrips = async (page) => {
        setLoading(true); // Start loading
        try {
            const res = await axios.get(`${API_BASE_URL}/getAllRides?page=${page}&limit=${itemsPerPage}`);
            setTrips(res.data.data);
            setTotalItems(res.data.totalItems);
            setTotalPages(res.data.totalPages);
            setCurrentPage(res.data.currentPage);
        } catch (err) {
            console.error("Failed to fetch trips:", err);
        } finally {
            setLoading(false); // End loading
        }
    };

    const handleSearch = (e) => setSearch(e.target.value);

    // Filter and search only on current page trips fetched from API
    const filteredTrips = trips.filter((trip) => {
        const matchesSearch =
            trip.id.toString().includes(search) ||
            trip.riderId.toString().includes(search) ||
            trip.driverId.toString().includes(search);
        const matchesFilter = filter ? trip.paymentStatus === filter : true;
        return matchesSearch && matchesFilter;
    });

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
                        <Button className='green-button'>
                            🏍️ Total Trips: {totalItems}
                        </Button>
                    </div>
                </div>
                <div className="export-import-container">
                    <DropdownButton variant="primary" title={<><FaFileExport /> Export</>} className="me-2">
                        <Dropdown.Item><FaFileExcel className="icon-green" /> Export to Excel</Dropdown.Item>
                        <Dropdown.Item><FaFilePdf className="icon-red" /> Export to PDF</Dropdown.Item>
                    </DropdownButton>
                </div>
            </div>

            <div className="filter-search-container">
                <DropdownButton variant="primary" title="Filter Payment Status" id="filter-dropdown">
                    <Dropdown.Item onClick={() => setFilter("")}>All</Dropdown.Item>
                    <Dropdown.Item onClick={() => setFilter("completed")}>Completed</Dropdown.Item>
                    <Dropdown.Item onClick={() => setFilter("cancelled")} className="text-custom-danger">Cancelled</Dropdown.Item>
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
                                <th>Trip Name</th>
                                <th>Rider Name</th>
                                <th>Driver Name</th>
                                <th>Ride Type</th>
                                <th>Source</th>
                                <th>Destination</th>
                                <th>Fare</th>
                                <th>Status</th>
                                <th>Trip Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTrips.length > 0 ? (
                                filteredTrips.map((trip, idx) => (
                                    <tr key={trip.id}>
                                        <td>{idx + 1}</td>
                                        <td>{trip.tripName || "-"}</td>
                                        <td>{trip.riderName || "-"}</td>
                                        <td>{trip.driverName || "-"}</td>
                                        <td>{trip.rideType || "-"}</td>
                                        <td>{trip.startLocation}</td>
                                        <td>{trip.endLocation}</td>
                                        <td>{`₹${trip.fare}`}</td>
                                        <td>{trip.paymentStatus}</td>
                                        <td>{new Date(trip.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <FaEye
                                                title="View"
                                                className="icon icon-blue"
                                                onClick={() =>
                                                    handlePermissionCheck("view", () =>
                                                        navigate(`/dms/trip/view/${trip.id}`, {
                                                            state: { tripId: trip.id },
                                                        })
                                                    )
                                                }
                                            />
                                            <FaEdit
                                                title="Edit"
                                                className="icon icon-green"
                                                onClick={() =>
                                                    handlePermissionCheck("edit", () =>
                                                        navigate("/dms/trip/edit", { state: { trip } })
                                                    )
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
                        className='pagination-option w-auto'
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
