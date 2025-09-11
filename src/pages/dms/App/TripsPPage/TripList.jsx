import React, { useState, useEffect } from "react";
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

export const TripList = () => {
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // 🔹 Dummy Trips
    const dummyTrips = [
        {
            ride_id: "1",
            tripName: "Morning Office Ride",
            riderName: "Rahul Sharma",
            driverName: "Amit Verma",
            rideType: "Normal",
            pickup_add: "MG Road, Pune",
            drop_add: "Infosys Phase 2, Hinjewadi",
            fare: 250.50,
            status: "completed",
            createdAt: "2025-09-01T09:00:00Z",
        },
        {
            ride_id: "2",
            tripName: "Emergency Ride",
            riderName: "Priya Mehta",
            driverName: "Rohit Kumar",
            rideType: "Emergency",
            pickup_add: "FC Road, Pune",
            drop_add: "Ruby Hall Clinic, Pune",
            fare: 450.00,
            status: "emergency",
            createdAt: "2025-09-03T15:30:00Z",
        },
        {
            ride_id: "3",
            tripName: "Airport Drop",
            riderName: "Ankit Joshi",
            driverName: "Sunil Patil",
            rideType: "Rental",
            pickup_add: "Kothrud, Pune",
            drop_add: "Pune Airport",
            fare: 800.75,
            status: "cancelled",
            createdAt: "2025-09-05T22:15:00Z",
        },
    ];

    useEffect(() => {
        // simulate pagination
        let filtered = dummyTrips.filter((trip) =>
            trip.tripName.toLowerCase().includes(search.toLowerCase()) ||
            trip.riderName.toLowerCase().includes(search.toLowerCase()) ||
            trip.driverName.toLowerCase().includes(search.toLowerCase())
        );

        if (filter) {
            filtered = filtered.filter((trip) => trip.status === filter);
        }

        const pageCount = Math.ceil(filtered.length / itemsPerPage);
        setTotalPages(pageCount);
        setTotalItems(filtered.length);

        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedData = filtered.slice(startIndex, startIndex + itemsPerPage);

        setTrips(paginatedData);
    }, [search, filter, currentPage, itemsPerPage]);

    const handleSearch = (e) => setSearch(e.target.value);

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
                <DropdownButton variant="primary" title="Filter Status" id="filter-dropdown">
                    <Dropdown.Item onClick={() => setFilter("")}>All</Dropdown.Item>
                    <Dropdown.Item onClick={() => setFilter("completed")}>Completed</Dropdown.Item>
                    <Dropdown.Item onClick={() => setFilter("cancelled")} className="text-custom-danger">Cancelled</Dropdown.Item>
                    <Dropdown.Item onClick={() => setFilter("emergency")} className="text-custom-warning">Emergency</Dropdown.Item>
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
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Trip Name</th>
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
                                <tr key={trip.ride_id}>
                                    <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                                    <td>{trip.tripName}</td>
                                    <td>{trip.riderName}</td>
                                    <td>{trip.driverName}</td>
                                    <td>{trip.rideType}</td>
                                    <td>{trip.pickup_add}</td>
                                    <td>{trip.drop_add}</td>
                                    <td>{`₹${trip.fare}`}</td>
                                    <td>{trip.status}</td>
                                    <td>{new Date(trip.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <FaEye
                                            title="View"
                                            className="icon icon-blue"
                                            onClick={() =>
                                                navigate(`/dms/trip/view/${trip.ride_id}`, {
                                                    state: { trip },
                                                })
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
