import React, { useState, useEffect } from 'react';
import { Button, Table, Form, InputGroup, Pagination, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';
import { useNavigate } from 'react-router-dom';

export const RideTypelIST = () => {
    const navigate = useNavigate();
    const [rideTypes, setRideTypes] = useState([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedRideType, setSelectedRideType] = useState(null);
    const [itemsPerPage, setItemsPerPage] = useState(10);
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
            action(); // allowed, run the actual function
        } else {
            alert(fallbackMessage || `You don't have permission to ${permissionType} this employee.`);
        }
    };

    // Dummy data
    const dummyRideTypes = [
        {
            id: 1,
            name: "Normal",
            fareMultiplier: 1.0,
            description: "Standard ride with regular fares.",
            createdAt: "2025-09-01T10:00:00Z",
            updatedAt: "2025-09-05T12:00:00Z",
        },
        {
            id: 2,
            name: "Emergency",
            fareMultiplier: 1.5,
            description: "Priority rides during urgent situations.",
            createdAt: "2025-09-02T11:30:00Z",
            updatedAt: "2025-09-06T14:20:00Z",
        },
        {
            id: 3,
            name: "Rental",
            fareMultiplier: 2.0,
            description: "Rent a car for multiple hours.",
            createdAt: "2025-09-03T09:15:00Z",
            updatedAt: "2025-09-07T16:45:00Z",
        },
    ];

    useEffect(() => {
        let filtered = dummyRideTypes.filter(rt =>
            rt.name.toLowerCase().includes(search.toLowerCase())
        );

        const pageCount = Math.ceil(filtered.length / itemsPerPage);
        setTotalPages(pageCount);

        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedData = filtered.slice(startIndex, startIndex + itemsPerPage);

        setRideTypes(paginatedData);
    }, [search, currentPage, itemsPerPage]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const handleDelete = (rideType) => {
        setSelectedRideType(rideType);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        const updatedList = rideTypes.filter(rt => rt.id !== selectedRideType.id);
        setRideTypes(updatedList);
        setShowDeleteModal(false);
        setSelectedRideType(null);
    };

    return (
        <AdminLayout>
            <div className="dms-pages-header sticky-header">
                <h3>Ride Type List</h3>
                <Button variant="primary" onClick={() => handlePermissionCheck("add", () => navigate('/dms/ridetypes/add'))}>
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
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Name</th>
                            <th>Fare Multiplier</th>
                            <th>Description</th>
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
                                    <td>{ride.fareMultiplier}</td>
                                    <td>{ride.description}</td>
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
                                            onClick={() => handleDelete(ride)}
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center">No ride types found.</td>
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
