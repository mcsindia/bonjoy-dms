import React, { useState, useEffect } from "react";
import {
    Table,
    Form,
    Pagination,
    Button,
    Modal,
} from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getToken, getModuleId } from "../../../../../utils/authhelper";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const getAuthHeaders = () => ({
    Authorization: `Bearer ${getToken()}`,
});

export const FareRegionList = () => {
    const navigate = useNavigate();

    const [fareRegions, setFareRegions] = useState([]);
    const [loading, setLoading] = useState(false);

    const [searchText, setSearchText] = useState("");
    const [tierFilter, setTierFilter] = useState("");
    const [fuelFilter, setFuelFilter] = useState("");
    const [dateFilter, setDateFilter] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState(null);

    const permissions = ["add", "edit", "delete"]; // dynamically controlled later

    const fetchFareRegions = async () => {
        setLoading(true);
        try {
            const params = {
                module_id: getModuleId("fareRegion"),
                page: currentPage,
                limit: itemsPerPage,
            };

            if (dateFilter) params.date = dateFilter;
            if (searchText) params.search = searchText;
            if (tierFilter) params.tier = tierFilter;
            if (fuelFilter) params.fuel_type = fuelFilter;

            const response = await axios.get(`${API_BASE_URL}/getAllFareRegionSetting`, {
                headers: getAuthHeaders(),
                params,
            });

            const data = response.data?.data || {};
            setFareRegions(data.models || []);
            setTotalItems(data.totalItems || 0);
            setTotalPages(data.totalPages || 1);
        } catch (error) {
            console.error("Error fetching fare regions:", error);
            setFareRegions([]);
            setTotalItems(0);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFareRegions();
    }, [searchText, tierFilter, fuelFilter, dateFilter, currentPage, itemsPerPage]);

    const handleDelete = (region) => {
        setSelectedRegion(region);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!selectedRegion || !selectedRegion.id) return;

        try {
            await axios.delete(`${API_BASE_URL}/deleteFareRegionSetting/${selectedRegion.id}`, {
                headers: getAuthHeaders(),
                params: { module_id: getModuleId("fareRegion") } // <-- add this
            });

            // Refresh list
            fetchFareRegions();

            // Reset modal
            setShowDeleteModal(false);
            setSelectedRegion(null);
        } catch (err) {
            console.error("Delete failed:", err);
            alert(err.response?.data?.message || "Failed to delete fare region. Please check console for details.");
        }
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) setCurrentPage(pageNumber);
    };

    return (
        <AdminLayout>
            <div className="dms-pages-header sticky-header">
                <h3>Fare Region Settings</h3>
                {permissions.includes("add") && (
                    <Button variant="primary" onClick={() => navigate("/dms/fareregion/add")}>
                        <FaPlus /> Add Fare Region
                    </Button>
                )}
            </div>

            {/* Filters */}
            <div className="filter-container">
                <p className="btn btn-primary">Filter by createdAt Date -</p>
                {/* Date Filter */}
                <Form.Group>
                    <Form.Control
                        type="date"
                        value={dateFilter}
                        onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
                    />
                </Form.Group>
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
                                <th>City</th>
                                <th>State</th>
                                <th>Tier</th>
                                <th>Base Fare</th>
                                <th>Day Fare/KM</th>
                                <th>Night Fare/KM</th>
                                <th>Waiting/min</th>
                                <th>Fuel Type</th>
                                <th>Peak Multiplier</th>
                                <th>Effective From</th>
                                <th>Created At</th>
                                <th>Updated At</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fareRegions.length > 0 ? (
                                fareRegions.map((region, idx) => (
                                    <tr key={region.id}>
                                        <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                                        <td>{region.city}</td>
                                        <td>{region.state}</td>
                                        <td>{region.tier}</td>
                                        <td>{region.base_fare}</td>
                                        <td>{region.per_km_fare}</td>
                                        <td>{region.per_km_fare_night}</td>
                                        <td>{region.waiting_charge_per_min}</td>
                                        <td>{region.fuel_type || "-"}</td>
                                        <td>{region.peak_multiplier || 1}</td>
                                        <td>{region.effective_from}</td>
                                        <td>{new Date(region.createdAt).toLocaleString()}</td>
                                        <td>{new Date(region.updatedAt).toLocaleString()}</td>
                                        <td>
                                            {permissions.includes("edit") && (
                                                <FaEdit
                                                    className="icon icon-green me-2"
                                                    title="Edit"
                                                    onClick={() => navigate("/dms/fareregion/edit", { state: { region } })}
                                                />
                                            )}
                                            {permissions.includes("delete") && (
                                                <FaTrash
                                                    className="icon icon-red"
                                                    title="Delete"
                                                    onClick={() => handleDelete(region)}
                                                />
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="13" className="text-center">
                                        No fare regions found.
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
                        {[...Array(totalPages)].map((_, i) => (
                            <Pagination.Item
                                key={i + 1}
                                active={i + 1 === currentPage}
                                onClick={() => handlePageChange(i + 1)}
                            >
                                {i + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        />
                    </Pagination>

                    <Form.Select
                        value={itemsPerPage}
                        onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
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

            {/* Delete Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Fare Region</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete fare region for <strong>{selectedRegion?.city}, {selectedRegion?.state}</strong>?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={confirmDelete}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </AdminLayout>
    );
};
