import React, { useState } from "react";
import { Button, Table, Form, Pagination, Modal, InputGroup, Dropdown, DropdownButton } from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";
import { useNavigate } from "react-router-dom";

export const FareRegionList = () => {
    const navigate = useNavigate();

    // Dummy schema-aligned data
    const dummyRegions = [
        { region_id: "R001", city: "Mumbai", state: "Maharashtra", tier: "tier1", base_fare: 50, per_km_fare: 12, per_km_fare_night: 15, waiting_charge_per_min: 2, fuel_type: "petrol", peak_multiplier: 1.2, effective_from: "2025-01-01 10:00:00", updated_at: "2025-01-10 14:30:00" },
        { region_id: "R002", city: "Pune", state: "Maharashtra", tier: "tier2", base_fare: 40, per_km_fare: 10, per_km_fare_night: 12, waiting_charge_per_min: 1.5, fuel_type: "cng", peak_multiplier: 1, effective_from: "2025-02-01 09:00:00", updated_at: "2025-02-05 11:00:00" },
        { region_id: "R003", city: "Delhi", state: "Delhi", tier: "tier1", base_fare: 60, per_km_fare: 14, per_km_fare_night: 16, waiting_charge_per_min: 2.5, fuel_type: "ev", peak_multiplier: 1.3, effective_from: "2025-03-01 08:00:00", updated_at: "2025-03-02 15:45:00" },
    ];

    const [fareRegions, setFareRegions] = useState(dummyRegions);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState(null);

    const [searchText, setSearchText] = useState("");
    const [tierFilter, setTierFilter] = useState("");
    const [fuelFilter, setFuelFilter] = useState("");

    const permissions = ["add", "edit", "delete"];

    const handleDelete = (region) => {
        setSelectedRegion(region);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        setFareRegions(fareRegions.filter((r) => r.region_id !== selectedRegion.region_id));
        setShowDeleteModal(false);
        setSelectedRegion(null);
    };

    // 🔹 Filter & Search
    const filteredRegions = fareRegions.filter((region) => {
        const matchesSearch = region.city.toLowerCase().includes(searchText.toLowerCase()) ||
            region.state.toLowerCase().includes(searchText.toLowerCase());
        const matchesTier = tierFilter ? region.tier === tierFilter : true;
        const matchesFuel = fuelFilter ? region.fuel_type === fuelFilter : true;
        return matchesSearch && matchesTier && matchesFuel;
    });

    // Pagination
    const totalPages = Math.ceil(filteredRegions.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentRegions = filteredRegions.slice(indexOfFirstItem, indexOfLastItem);

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

            {/* Filter & Search */}
            <div className="filter-search-container">
                <div className='filter-container'>
                    {/* Tier Dropdown */}
                    <DropdownButton
                        title={tierFilter ? `Tier: ${tierFilter}` : "Filter by Tier"}
                    >
                        <Dropdown.Item onClick={() => { setTierFilter(""); setCurrentPage(1); }}>All Tiers</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setTierFilter("tier1"); setCurrentPage(1); }}>Tier 1</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setTierFilter("tier2"); setCurrentPage(1); }}>Tier 2</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setTierFilter("tier3"); setCurrentPage(1); }}>Tier 3</Dropdown.Item>
                    </DropdownButton>

                    {/* Fuel Type Dropdown */}
                    <DropdownButton
                        title={fuelFilter ? `Fuel: ${fuelFilter}` : "Filter by Fuel"}
                    >
                        <Dropdown.Item onClick={() => { setFuelFilter(""); setCurrentPage(1); }}>All Fuel Types</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setFuelFilter("petrol"); setCurrentPage(1); }}>Petrol</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setFuelFilter("cng"); setCurrentPage(1); }}>CNG</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setFuelFilter("ev"); setCurrentPage(1); }}>EV</Dropdown.Item>
                    </DropdownButton>
                </div>
                {/* Search */}
                <InputGroup className="dms-custom-width">
                    <Form.Control
                        placeholder="Search by City/State"
                        value={searchText}
                        onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1); }}
                    />
                </InputGroup>
            </div>

            {/* Table */}
            <div className="dms-table-container">
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
                            <th>Updated At</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRegions.length > 0 ? (
                            currentRegions.map((region, index) => (
                                <tr key={region.region_id}>
                                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
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
                                    <td>{region.updated_at}</td>
                                    <td>
                                        {(!permissions.includes("edit") && !permissions.includes("delete")) ? (
                                            <span>-</span>
                                        ) : (
                                            <>
                                                {permissions.includes("edit") && (
                                                    <FaEdit className="icon icon-green me-2" title="Edit"
                                                        onClick={() => navigate("/dms/fareregion/edit", { state: { region } })} />
                                                )}
                                                {permissions.includes("delete") && (
                                                    <FaTrash className="icon icon-red" title="Delete"
                                                        onClick={() => handleDelete(region)} />
                                                )}
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="13" className="text-center">No fare regions found.</td>
                            </tr>
                        )}
                    </tbody>
                </Table>

                {/* Pagination */}
                <div className="pagination-container">
                    <Pagination className="mb-0">
                        <Pagination.Prev
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        />
                        {[...Array(totalPages)].map((_, i) => (
                            <Pagination.Item
                                key={i + 1}
                                active={i + 1 === currentPage}
                                onClick={() => setCurrentPage(i + 1)}
                            >
                                {i + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next
                            onClick={() => setCurrentPage(currentPage + 1)}
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
