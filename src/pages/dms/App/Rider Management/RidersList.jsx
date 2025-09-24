import React, { useEffect, useState } from 'react';
import { Button, Table, Form, InputGroup, Pagination, Dropdown, DropdownButton, Modal } from 'react-bootstrap';
import { FaEye, FaStar, FaHistory } from 'react-icons/fa';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const RidersList = () => {
    const [riders, setRiders] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showRemarkModal, setShowRemarkModal] = useState(false);
    const [selectedRiderId, setSelectedRiderId] = useState(null);
    const [remark, setRemark] = useState('');
    const navigate = useNavigate();
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [intendedStatus, setIntendedStatus] = useState('');
    const userData = JSON.parse(localStorage.getItem("userData"));
    let permissions = [];

    if (Array.isArray(userData?.employeeRole)) {
        for (const role of userData.employeeRole) {
            for (const child of role.childMenus || []) {
                for (const mod of child.modules || []) {
                    if (mod.moduleUrl?.toLowerCase() === "rider") {
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

    // Fetch riders
    const fetchRiders = async (page = 1, searchName = '', filter = selectedFilter) => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/getAllRiderProfiles`, {
                params: {
                    page,
                    limit: itemsPerPage,
                    name: searchName || undefined,
                    preferredPaymentMethod: filter || undefined,
                    module_id: 'rider', // 🔹 added module_id
                }
            });

            const ridersList = response.data?.data?.data;
            const totalItems = response.data?.data?.totalRecords;
            const totalPages = response.data?.data?.totalPages;

            if (Array.isArray(ridersList)) {
                setRiders(ridersList);
                setTotalItems(totalItems);
                setTotalPages(totalPages);
            } else {
                console.error("Unexpected data format:", response.data);
                setRiders([]);
            }
        } catch (error) {
            console.error("Error fetching riders:", error);
            setRiders([]);
        } finally {
            setLoading(false);
        }
    };

    // Handle Search
    const handleSearch = (e) => {
        const searchValue = e.target.value;
        setSearch(searchValue);
        setCurrentPage(1);
        fetchRiders(1, searchValue, selectedFilter);
    };

    // Handle Filter
    const handleFilter = async (filter) => {
        setSelectedFilter(filter);
        setCurrentPage(1);
        fetchRiders(1, search, filter);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Handle Status Toggle
    const handleStatusChange = (riderId) => {
        const selectedRider = riders.find(r => r.id === riderId || r.rider_id === riderId);

        if (!selectedRider) {
            console.warn("Selected rider not found for ID:", riderId);
            return;
        }

        const newStatus = selectedRider.status === "Active" ? "Inactive" : "Active";

        setSelectedRiderId(riderId);
        setIntendedStatus(newStatus);
        setShowRemarkModal(true);
    };

    const handleRemarkSubmit = async () => {
        try {
            const response = await axios.put(`${API_BASE_URL}/updateRiderProfile/${selectedRiderId}`, {
                status: intendedStatus,
                remark: remark,
                module_id: 'rider'
            });

            if (response.data.success) {
                const updatedRiders = riders.map(rider =>
                    (rider.id === selectedRiderId || rider.rider_id === selectedRiderId)
                        ? { ...rider, status: intendedStatus, remark: remark }
                        : rider
                );
                setRiders(updatedRiders);
            }
        } catch (error) {
            console.error("Failed to update rider status with remark:", error);
        }

        setShowRemarkModal(false);
        setRemark('');
        setSelectedRiderId(null);
        setIntendedStatus('');
    };

    useEffect(() => {
        fetchRiders(currentPage, search, selectedFilter);
    }, [currentPage, itemsPerPage]);

    return (
        <AdminLayout>
            {/* Header Options */}
            <div className="dms-pages-header sticky-header">
                <div className="live-count">
                    <h3 className="mb-0">All Riders</h3>
                    <div className="live-count-container">
                        <Button className='green-button'>
                            🧍 Riders: {totalItems}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="filter-search-container">
                {/* Filter Dropdown */}
                <DropdownButton variant="primary" title="Filter" id="filter-dropdown">
                    <Dropdown.Item onClick={() => handleFilter('')}>All</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleFilter('Card')}>Card</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleFilter('Cash')}>Cash</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleFilter('Bank Transfer')}>Bank Transfer</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleFilter('Online')}>Online Payment</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleFilter('UPI')}>UPI</Dropdown.Item>
                    <Dropdown.Item className="text-custom-danger" onClick={() => handleFilter('')}>Cancel</Dropdown.Item>
                </DropdownButton>

                {/* Search Bar */}
                <InputGroup className="dms-custom-width">
                    <Form.Control
                        placeholder="Search by rider name..."
                        value={search}
                        onChange={handleSearch}
                    />
                </InputGroup>
            </div>

            {/* Riders Table */}
            <div className="dms-table-container">
                {loading ? (
                    <div className="text-center py-5 fs-4">Loading...</div>
                ) : (
                    <>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Rider Name</th>
                                    <th>Rider Mobile</th>
                                    <th>Preferred Payment Method</th>
                                    <th>Ratings</th>
                                    <th>Wallet</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {riders.length > 0 ? (
                                    riders.map((rider, index) => (
                                        <tr key={rider.id}>
                                            <td>
                                                {index + 1}
                                            </td>
                                            <td>{rider.fullName || 'NA'}</td>
                                            <td>
                                                {rider.mobile || 'NA'}
                                            </td>
                                            <td>{rider.preferredPaymentMethod || 'NA'}</td>
                                            <td>
                                                <div className='d-flex'>
                                                    <FaStar className='icon star-icon' />
                                                    {rider.ratings || 'NA'}
                                                </div>
                                            </td>
                                            <td>{rider.wallet || 'NA'}</td>
                                            <td>
                                                <Form.Check
                                                    type="switch"
                                                    id={`status-switch-${rider.id}`}
                                                    label={rider.status?.toLowerCase() === 'active' ? 'Active' : 'Inactive'}
                                                    checked={rider.status === "Active"}
                                                    onChange={() => handlePermissionCheck("edit", () => handleStatusChange(rider.id))}
                                                />
                                            </td>
                                            <td className="actions">
                                                {(!permissions.includes("view") && !permissions.includes("rideHistory")) ? (
                                                    <span>-</span>
                                                ) : (
                                                    <>
                                                        {permissions.includes("view") && (
                                                            <FaEye
                                                                className='icon icon-blue me-2'
                                                                title="View"
                                                                onClick={() => navigate(`/dms/rider/view/${rider.id}`, { state: { rider } })}
                                                            />
                                                        )}
                                                        {permissions.includes("rideHistory") && (
                                                            <FaHistory
                                                                className='icon-black'
                                                                title='Ride history'
                                                                onClick={() => navigate('/dms/ride-history/list')}
                                                            />
                                                        )}
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center">
                                            No riders found.
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
                    </>
                )}
            </div>

            <Modal show={showRemarkModal} onHide={() => setShowRemarkModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Reason for Deactivation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="remarkTextarea">
                            <Form.Label>Please enter the reason:</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={remark}
                                onChange={(e) => setRemark(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowRemarkModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleRemarkSubmit} disabled={!remark.trim()}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </AdminLayout>
    );
};
