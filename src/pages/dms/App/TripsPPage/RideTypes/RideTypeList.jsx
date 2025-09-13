import React, { useState, useEffect } from 'react';
import { Button, Table, Form, InputGroup, Pagination, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const RideTypelIST = () => {
    const navigate = useNavigate();
    const [rideTypes, setRideTypes] = useState([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedRideType, setSelectedRideType] = useState(null);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [loading, setLoading] = useState(false);

    const userData = JSON.parse(localStorage.getItem("userData"));
    let permissions = [];

    if (Array.isArray(userData?.employeeRole)) {
        for (const role of userData.employeeRole) {
            for (const child of role.childMenus || []) {
                for (const mod of child.modules || []) {
                    if (mod.moduleUrl?.toLowerCase() === "ridetypes") {
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
            action();
        } else {
            alert(fallbackMessage || `You don't have permission to ${permissionType} ride type.`);
        }
    };

    const fetchRideTypes = async (page = 1, searchValue = '') => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/getAllRideType`, {
                params: {
                    page,
                    limit: itemsPerPage,
                    name: searchValue || undefined
                }
            });

            const apiData = response.data?.data?.models || [];
            const totalItems = response.data?.data?.totalItems || 0;
            const totalPages = response.data?.data?.totalPages || 1;

            setRideTypes(apiData);
            setTotalPages(totalPages);
        } catch (error) {
            console.error("Error fetching ride types:", error);
            setRideTypes([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRideTypes(currentPage, search);
    }, [currentPage, itemsPerPage]);

    // Search
    const handleSearch = (e) => {
        const searchValue = e.target.value;
        setSearch(searchValue);
        setCurrentPage(1);
        fetchRideTypes(1, searchValue);
    };

    const handleDelete = (rideType) => {
        setSelectedRideType(rideType);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {

            await axios.delete(`${API_BASE_URL}/deleteRideType/${selectedRideType.id}`, {
            });

            // Refresh list after deletion
            fetchRideTypes(currentPage, search);

            alert("Ride type deleted successfully!");
        } catch (error) {
            console.error("Failed to delete ride type:", error);
            alert("Failed to delete ride type. Please try again.");
        }

        setShowDeleteModal(false);
        setSelectedRideType(null);
    };

    function stripHtmlTags(html) {
        const tmp = document.createElement('DIV');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    }

    return (
        <AdminLayout>
            <div className="dms-pages-header sticky-header">
                <h3>Ride Type List</h3>
                <Button
                    variant="primary"
                    onClick={() => handlePermissionCheck("add", () => navigate('/dms/ridetypes/add'))}
                >
                    <FaPlus /> Add Ride Type
                </Button>
            </div>

            <div className="filter-search-container">
                <InputGroup className="dms-custom-width">
                    <Form.Control
                        placeholder="Search ride type..."
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
                                <th>Name</th>
                                <th>Fare Multiplier</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Created At</th>
                                <th>Updated At</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rideTypes.length > 0 ? (
                                rideTypes.map((ride, index) => (
                                    <tr key={ride.id}>
                                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                        <td>{ride.name}</td>
                                        <td>{ride.multiplier}</td>
                                        <td>{stripHtmlTags(ride.description)}</td>
                                        <td>{ride.status}</td>
                                        <td>{new Date(ride.createdAt).toLocaleString()}</td>
                                        <td>{new Date(ride.updatedAt).toLocaleString()}</td>
                                        <td className="actions">
                                            <FaEdit
                                                className="icon icon-green"
                                                title="Edit"
                                                onClick={() =>
                                                    handlePermissionCheck("edit", () =>
                                                        navigate('/dms/ridetypes/edit', { state: { rideType: ride } })
                                                    )
                                                }
                                            />
                                            <FaTrash
                                                className="icon icon-red"
                                                title="Delete"
                                                onClick={() =>
                                                    handlePermissionCheck("delete", () => handleDelete(ride))
                                                }
                                            />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center">No ride types found.</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                )}

                {/* Pagination */}
                <div className="pagination-container">
                    <Pagination className="mb-0">
                        <Pagination.Prev
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        />
                        {[...Array(totalPages)].map((_, index) => (
                            <Pagination.Item
                                key={index + 1}
                                active={index + 1 === currentPage}
                                onClick={() => setCurrentPage(index + 1)}
                            >
                                {index + 1}
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

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete <strong>{selectedRideType?.name}</strong>?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </AdminLayout>
    );
};
