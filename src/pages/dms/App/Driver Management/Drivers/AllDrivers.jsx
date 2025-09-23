import React, { useState, useEffect, useRef } from "react";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";
import { Button, Table, InputGroup, Form, Pagination, Dropdown, DropdownButton, Modal } from 'react-bootstrap';
import { FaEdit, FaEye, FaStar, FaFileExport, FaFileExcel, FaFilePdf, FaBell, FaHistory, FaSignInAlt } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getModuleId, getToken, getModulePermissions } from '../../../../../utils/authhelper';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const AllDrivers = () => {
    const [driverData, setDriverData] = useState([]);
    const [search, setSearch] = useState("");
    const [filterRating, setFilterRating] = useState(null);
    const [filterDriverStatus, setFilterDriverStatus] = useState("");
    const [filterCity, setFilterCity] = useState("");
    const [filterRideStatus, setFilterRideStatus] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [driverToDelete, setDriverToDelete] = useState(null);
    const [showActions, setShowActions] = useState(null);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const navigate = useNavigate();
    const actionMenuRef = useRef(null);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [allCities, setAllCities] = useState([]);
    const userData = JSON.parse(localStorage.getItem("userData"));
    const moduleId = getModuleId("driver"); // 🔹 dynamic module ID
    const token = getToken();               // 🔹 dynamic token
    let permissions = [];

    if (Array.isArray(userData?.employeeRole)) {
        for (const role of userData.employeeRole) {
            for (const child of role.childMenus || []) {
                for (const mod of child.modules || []) {
                    if (mod.moduleUrl?.toLowerCase() === "driver") {
                        permissions = mod.permission
                            ?.toLowerCase()
                            .split(',')
                            .map(p => p.trim()) || [];
                    }
                }
            }
        }
    }

    const fetchDrivers = async (
        page = 1,
        limit = itemsPerPage,
        name = search,
        city = filterCity,
        status = filterDriverStatus,
        rideStatus = filterRideStatus,
        rating = filterRating
    ) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append("page", page);
            params.append("limit", limit);
            if (name) params.append("name", name);
            if (city) params.append("city", city);
            if (status) params.append("status", status);
            if (rideStatus) params.append("rideStatus", rideStatus);
            if (rating) params.append("ratings", rating);
            params.append("module_id", moduleId);

            const res = await axios.get(`${API_BASE_URL}/getAllDriverProfiles?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const result = res.data?.data;
            console.log(result)
            if (result?.data) {
                const sortedDrivers = result.data.sort((a, b) => parseInt(a.id) - parseInt(b.id));
                setDriverData(sortedDrivers);
                setTotalRecords(result.totalRecords || sortedDrivers.length);
                setTotalPages(result.totalPages || 1);
            } else {
                setDriverData([]);
                setTotalRecords(0);
                setTotalPages(1);
            }
        } catch (error) {
            console.error("Error fetching drivers:", error);
            setDriverData([]);
            setTotalRecords(0);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    // Update your delete request
    const confirmDelete = async () => {
        if (!driverToDelete) return;
        try {
            const res = await axios.delete(`${API_BASE_URL}/deleteDriverProfile/${driverToDelete.id}`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { module_id: moduleId }, // 🔹 dynamic module_id
            });

            if (res.status === 200) {
                const newPage = (driverData.length === 1 && currentPage > 1) ? currentPage - 1 : currentPage;
                setCurrentPage(newPage);
                await fetchDrivers(currentPage, itemsPerPage, search, filterCity, filterDriverStatus, filterRideStatus, filterRating);
            }
        } catch (error) {
            console.error("Error deleting driver:", error);
        } finally {
            setShowDeleteModal(false);
            setDriverToDelete(null);
        }
    };

    useEffect(() => {
        fetchDrivers(currentPage, itemsPerPage, search, filterCity, filterDriverStatus, filterRideStatus, filterRating);
    }, [currentPage, itemsPerPage, search, filterCity, filterDriverStatus, filterRideStatus, filterRating]);

    const fetchAllCities = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/getAllDriverProfiles?page=1&limit=1000`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { module_id: moduleId }
            });
            const allDrivers = res.data?.data?.data || [];
            const cities = Array.from(
                new Set(allDrivers.map(driver => driver.city || driver.WorkingCity).filter(Boolean))
            );
            setAllCities(cities);
        } catch (error) {
            console.error("Error fetching cities:", error);
        }
    };

    useEffect(() => {
        fetchAllCities();
    }, []);

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearch(query);
        fetchDrivers(1, itemsPerPage, query, filterCity, filterDriverStatus, filterRideStatus, filterRating);
    };

    const uniqueCities = Array.from(
        new Set(driverData.map(driver => driver.city || driver.WorkingCity).filter(Boolean))
    );

    const handleFilterCity = (city) => {
        setFilterCity(city);
        fetchDrivers(1, itemsPerPage, search, city, filterDriverStatus, filterRideStatus, filterRating);
    };

    const handleFilterStatus = (status) => {
        setFilterDriverStatus(status);
        fetchDrivers(1, itemsPerPage, search, filterCity, status, filterRideStatus, filterRating);
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const handleFilterRideStatus = (status) => {
        setFilterRideStatus(status);
        fetchDrivers(1, itemsPerPage, search, filterCity, filterDriverStatus, status, filterRating);
    };


    const handleFilterRating = (rating) => {
        setFilterRating(rating);
        fetchDrivers(1, itemsPerPage, search, filterCity, filterDriverStatus, filterRideStatus, rating);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (actionMenuRef.current && !actionMenuRef.current.contains(event.target)) {
                setShowActions(null); // Close menu if clicked outside
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <AdminLayout>
            <div className="dms-pages-header sticky-header">
                <div className="live-count">
                    <h3>Driver List</h3>
                    <div className="live-count-container">
                        <Button className='green-button'>🚗 Drivers: {totalRecords}</Button>
                    </div>
                </div>
                <div className="export-import-container">
                    <DropdownButton variant="primary" title={<><FaFileExport /> Export</>} className="me-2">
                        <Dropdown.Item> <FaFileExcel className="icon-green" /> Export to Excel</Dropdown.Item>
                        <Dropdown.Item> <FaFilePdf className="icon-red" /> Export to PDF</Dropdown.Item>
                    </DropdownButton>
                    <DropdownButton variant="primary" title={<><FaFileExport /> Import</>} className="me-2">
                        <Dropdown.Item> <FaFileExcel className="icon-green" /> Import from Excel</Dropdown.Item>
                        <Dropdown.Item> <FaFilePdf className="icon-red" /> Import from PDF</Dropdown.Item>
                    </DropdownButton>
                </div>
            </div>

            <div className="filter-search-container">
                <div className="filter-container">
                    <DropdownButton title={`Filter: ${filterRating !== null ? filterRating : "All"}`} id="filter-rating-dropdown">
                        <Dropdown.Item onClick={() => handleFilterRating(null)}>All Ratings</Dropdown.Item>
                        {[1, 2, 3, 4, 5].map((rating) => (
                            <Dropdown.Item key={rating} onClick={() => handleFilterRating(rating)}>
                                {rating} Stars
                            </Dropdown.Item>
                        ))}
                    </DropdownButton>

                    <DropdownButton title={`Driver Status`} className="me-2">
                        <Dropdown.Item onClick={() => handleFilterStatus("")}>All</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleFilterStatus("Active")}>Active</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleFilterStatus("Inactive")}>Inactive</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleFilterStatus("Pending")}></Dropdown.Item>
                    </DropdownButton>

                    <DropdownButton title={`City: ${filterCity || "All"}`} className="me-2">
                        <Dropdown.Item as="button" onClick={() => handleFilterCity("")}>
                            All
                        </Dropdown.Item>
                        {allCities.map((city, idx) => (
                            <Dropdown.Item as="button" key={idx} onClick={() => handleFilterCity(city)}>
                                {city}
                            </Dropdown.Item>
                        ))}
                    </DropdownButton>

                    <DropdownButton title={`Ride Status: ${filterRideStatus || "All"}`} className="me-2">
                        <Dropdown.Item onClick={() => handleFilterRideStatus("")}>All</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleFilterRideStatus("Available")}>Available</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleFilterRideStatus("Offline")}>Offline</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleFilterRideStatus("Suspended")}>Suspended</Dropdown.Item>
                    </DropdownButton>
                </div>

                <InputGroup className="dms-custom-width">
                    <Form.Control
                        placeholder="Search drivers by name..."
                        value={search}
                        onChange={handleSearchChange}
                    />
                </InputGroup>
            </div>

            {loading ? (
                <div className="text-center py-5 fs-4">Loading...</div>
            ) : (
                <>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>S.no</th>
                                <th>Full Name</th>
                                <th>Rating</th>
                                <th>Status</th>
                                <th>Ride Status</th>
                                <th>Created At</th>
                                <th>Updated At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {driverData.length > 0 ? (
                                driverData.map((driver, index) => (
                                    <tr key={driver.id}>
                                        <td>{index + 1}</td>
                                        <td>{driver.fullName || 'NA'}</td>
                                        <td>
                                            <div className='d-flex'>
                                                <FaStar className='icon star-icon' />
                                                {driver.ratings || 'NA'}
                                            </div>
                                        </td>
                                        <td>{driver.status || 'NA'}</td>
                                        <td>{driver.rideStatus || 'NA'}</td>
                                        <td>{driver.createdAt ? new Date(driver.createdAt).toLocaleDateString() : 'NA'}</td>
                                        <td>{driver.updatedAt ? new Date(driver.updatedAt).toLocaleDateString() : 'NA'}</td>
                                        <td className="action">
                                            {permissions.length === 0 ? (
                                                <span>-</span> // Show hyphen if no permissions at all
                                            ) : (
                                                <>
                                                    <span
                                                        className="dms-span-action"
                                                        onClick={() =>
                                                            setShowActions(driver.id === showActions ? null : driver.id)
                                                        }
                                                    >
                                                        ⋮
                                                    </span>
                                                    {showActions === driver.id && (
                                                        <div ref={actionMenuRef} className="dms-show-actions-menu">
                                                            <ul>
                                                                {['Approved', 'Active', 'Inactive'].includes(driver.status) ? (
                                                                    <>
                                                                        {permissions.includes("view") && (
                                                                            <li onClick={() => navigate(`/dms/driver/view/${driver.id}`, { state: { driver } })}>
                                                                                <FaEye className="dms-menu-icon" /> View
                                                                            </li>
                                                                        )}
                                                                        {permissions.includes("edit") && (
                                                                            <li onClick={() => navigate("/dms/driver/edit", { state: { driver } })}>
                                                                                <FaEdit className="dms-menu-icon" /> Edit
                                                                            </li>
                                                                        )}
                                                                        {permissions.includes("view") && (
                                                                            <li onClick={() => navigate("/dms/driver/ride-history/list", { state: { driver } })}>
                                                                                <FaHistory className="dms-menu-icon" /> Ride History
                                                                            </li>
                                                                        )}
                                                                        <li onClick={() => alert(`Reminder sent to ${driver.fullName} to complete their profile.`)}>
                                                                            <FaBell className="dms-menu-icon icon-orange" /> Profile Reminder
                                                                        </li>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        {permissions.includes("view") && (
                                                                            <li onClick={() => navigate(`/dms/driver-approval/view/${driver.id}`, { state: { driver } })}>
                                                                                <FaEye className="dms-menu-icon" /> View
                                                                            </li>
                                                                        )}
                                                                        {permissions.includes("view") && (
                                                                            <li onClick={() => navigate("/dms/drivers/login-logs", { state: { driver } })}>
                                                                                <FaSignInAlt className="dms-menu-icon" /> Login Logs
                                                                            </li>
                                                                        )}
                                                                    </>
                                                                )}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center">
                                        No drivers found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>

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
                </>
            )}

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete <strong> {driverToDelete?.fullName} (Driver ID: {driverToDelete?.id}) </strong> ?
                </Modal.Body>
                <Modal.Footer>
                    <Button type="cancel" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                    <Button type="submit" onClick={confirmDelete}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </AdminLayout>
    );
};
