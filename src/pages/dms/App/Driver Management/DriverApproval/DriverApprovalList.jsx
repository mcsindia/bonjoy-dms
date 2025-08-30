import React, { useState, useEffect } from 'react';
import { Table, InputGroup, Form, Pagination, Dropdown, DropdownButton, Button } from 'react-bootstrap';
import { FaEye, FaSignInAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const DriverApprovalList = () => {
    const navigate = useNavigate();
    const [drivers, setDrivers] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalDriverCount, setTotalDriverCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const fetchDrivers = async () => {
        setLoading(true);
        try {
            let endpoint = '';
            let params = { page: currentPage, limit: itemsPerPage };

            if (search.trim() !== '') {
                const driverId = parseInt(search.trim());
                if (!isNaN(driverId)) {
                    endpoint = `${API_BASE_URL}/searchDriver`;
                    params.driverId = driverId;
                } else {
                    setDrivers([]);
                    setTotalPages(1);
                    setTotalDriverCount(0);
                    setLoading(false);
                    return;
                }
            } else if (filter) {
                endpoint = `${API_BASE_URL}/filterByStatus`;
                params.overAllstatus = filter;
            } else {
                endpoint = `${API_BASE_URL}/getAllDriverOnBoardingStatus`;
            }

            const response = await axios.get(endpoint, { params });

            const apiData = response.data.data || [];
            const apiDrivers = Array.isArray(apiData.data) ? apiData.data : apiData;

            const mappedDrivers = apiDrivers.map((driver) => ({
                driver_id: driver.driverId.id,
                onboarding_id: driver.id,
                profile_status: driver.profileStatus || 'N/A',
                document_status: driver.documentStatus || 'N/A',
                vehicle_status: driver.vehicleStatus || 'N/A',
                bank_status: driver.bankStatus || 'N/A',
                overall_status: driver.approvedByAdmin ? 'Approved' : 'Pending',
                submitted_to_admin: driver.submittedToAdmin ? 'Yes' : 'No',
                approved_by_admin: driver.approvedByAdmin ? 'Yes' : 'No',
                created_at: new Date(driver.createdAt).toLocaleString(),
                raw: driver,
            }));

            setDrivers(mappedDrivers);
            setTotalPages(response.data.totalPages || 1);
            setTotalDriverCount(apiData.totalDriverCount || 0);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setDrivers([]); // Clear table data
                setTotalPages(1);
                setTotalDriverCount(0);
            } else {
                console.error('Error fetching drivers:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDrivers();
    }, [search, filter, currentPage, itemsPerPage]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setSearch('');
        setCurrentPage(1);
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <AdminLayout>
            <div className="dms-pages-header sticky-header">
                <div className='live-count'>
                    <h3>Registered Drivers</h3>
                    <div className="live-count-container">
                        <Button className='green-button'>
                            🚗 Drivers: {totalDriverCount}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="filter-search-container d-flex justify-content-between align-items-center mb-3">
                <DropdownButton variant="primary" title="Filter by overall status" id="filter-dropdown">
                    <Dropdown.Item onClick={() => handleFilterChange('')}>All</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleFilterChange('Pending')}>Pending</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleFilterChange('Complete')}>Complete</Dropdown.Item>
                </DropdownButton>

                <InputGroup className="dms-custom-width">
                    <Form.Control placeholder="Search drivers by ID..." value={search} onChange={handleSearch} />
                </InputGroup>
            </div>

            <div className="dms-table-container">
                {loading ? (
                    <div className="text-center py-5 fs-4">Loading...</div>
                ) : (
                    <>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>S.no</th>
                                    <th>Driver id</th>
                                    <th>Profile Status</th>
                                    <th>Document Status</th>
                                    <th>Vehicle Status</th>
                                    <th>Bank Status</th>
                                    <th>Overall Status</th>
                                    <th>Submitted to Admin</th>
                                    <th>Approved by Admin</th>
                                    <th>Created At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {drivers.length > 0 ? (
                                    drivers.map((driver, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{driver.driver_id}</td>
                                            <td>{driver.profile_status}</td>
                                            <td>{driver.document_status}</td>
                                            <td>{driver.vehicle_status}</td>
                                            <td>{driver.bank_status}</td>
                                            <td>{driver.overall_status}</td>
                                            <td>{driver.submitted_to_admin}</td>
                                            <td>{driver.approved_by_admin}</td>
                                            <td>{driver.created_at}</td>
                                            <td>
                                                <FaEye
                                                    title="View"
                                                    className="icon-blue me-2"
                                                    onClick={() => navigate("/dms/driver-approval/view", { state: { driverId: driver.onboarding_id } })}
                                                />
                                                <FaSignInAlt
                                                    title="login logs"
                                                    className="dms-menu-icon"
                                                    onClick={() => navigate("/dms/drivers/login-logs", { state: { driver } })}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="10" className="text-center">No driver approvals found.</td>
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
            </div>
        </AdminLayout>
    );
};
