import React, { useState, useEffect } from 'react';
import { Button, Table, InputGroup, Form, Pagination, Dropdown, DropdownButton, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const BrandList = () => {
    const navigate = useNavigate();
    const [brands, setBrands] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [brandToDelete, setBrandToDelete] = useState(null);
    const [loading, setLoading] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const userData = JSON.parse(localStorage.getItem("userData"));
    let permissions = [];

    if (Array.isArray(userData?.employeeRole)) {
        for (const role of userData.employeeRole) {
            for (const child of role.childMenus || []) {
                for (const mod of child.modules || []) {
                    if (mod.moduleUrl?.toLowerCase() === "brand") {
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

    // Fetch brand data from API
    const fetchBrands = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/getAllBrands`, {
                params: {
                    page: currentPage,
                    limit: itemsPerPage,
                    module_id: 'brand', // 🔹 added module_id
                }
            });
            setBrands(response.data.data.data || []);
            setTotalPages(response.data.data.totalPages || 1);
        } catch (error) {
            console.error('Error fetching brand data:', error);
        } finally {
            setLoading(false);
        }
    };

    const searchBrands = async (brandName) => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/searchBrands`, {
                params: {
                    brandName,
                    module_id: 'brand', // 🔹 added module_id
                }
            });
            if (response.data.success) {
                setBrands(response.data.data.brands || []);
                setTotalPages(1);
                setCurrentPage(1);
            }
        } catch (error) {
            console.error('Error searching brands:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterBrands = async (status) => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/filterBrands`, {
                params: {
                    status,
                    module_id: 'brand', // 🔹 added module_id
                }
            });
            if (response.data.success) {
                setBrands(response.data.data.brands || []);
                setTotalPages(1);
                setCurrentPage(1);
            }
        } catch (error) {
            console.error('Error filtering brands:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle search input change
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);

        if (value.trim() === '') {
            if (filter) {
                filterBrands(filter);
            } else {
                fetchBrands();
            }
        } else {
            searchBrands(value);
        }
    };

    // Handle filter change
    const handleFilterChange = (status) => {
        setFilter(status);
        setSearch('');

        if (status === '') {
            fetchBrands();
        } else {
            filterBrands(status);
        }
    };

    // Pagination logic
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Handle deletion of a brand
    const handleDelete = async () => {
        if (brandToDelete) {
            try {
                await axios.delete(`${API_BASE_URL}/deleteBrand/${brandToDelete}`, {
                    params: { module_id: 'brand' } // 🔹 added module_id
                });
                if (search.trim()) {
                    searchBrands(search);
                } else if (filter) {
                    filterBrands(filter);
                } else {
                    fetchBrands();
                }
                setShowModal(false);
                setBrandToDelete(null);
            } catch (error) {
                console.error('Error deleting brand:', error);
            }
        }
    };

    // Open modal for deletion confirmation
    const openDeleteModal = (brandId) => {
        setBrandToDelete(brandId);
        setShowModal(true);
    };

    // Close modal
    const closeDeleteModal = () => {
        setShowModal(false);
        setBrandToDelete(null);
    };

    useEffect(() => {
        if (!search.trim() && !filter) {
            fetchBrands();
        }
    }, [currentPage, itemsPerPage]);

    return (
        <AdminLayout>
            <div className="dms-pages-header sticky-header">
                <h3>Brand List</h3>
                {permissions.includes("add") && (
                    <Button variant="primary" onClick={() => navigate('/dms/brand/add')}>
                        <FaPlus /> Add Brand
                    </Button>
                )}
            </div>

            {/* Search and Filter */}
            <div className="filter-search-container">
                <DropdownButton variant="primary" title={`Filter: ${filter || 'All'}`} id="filter-dropdown">
                    <Dropdown.Item onClick={() => handleFilterChange('')}>All</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleFilterChange('Active')}>Active</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleFilterChange('Inactive')}>Inactive</Dropdown.Item>
                </DropdownButton>
                <InputGroup className="dms-custom-width">
                    <Form.Control
                        placeholder="Search by brand name"
                        value={search}
                        onChange={handleSearch}
                    />
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
                                    <th>S.No</th>
                                    <th>Brand Name</th>
                                    <th>Status</th>
                                    <th>Created At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {brands.length > 0 ? (
                                    brands.map((brand, index) => (
                                        <tr key={brand.id}>
                                            <td>{index + 1}</td>
                                            <td>{brand.brandName}</td>
                                            <td>{brand.status}</td>
                                            <td>{new Date(brand.createdAt).toLocaleString()}</td>
                                            <td>
                                                {permissions.includes("edit") || permissions.includes("delete") ? (
                                                    <>
                                                        {permissions.includes("edit") ? (
                                                            <FaEdit
                                                                title="Edit"
                                                                className="icon-green me-2"
                                                                onClick={() => navigate('/dms/brand/edit', { state: brand })}
                                                            />
                                                        ) : null}

                                                        {permissions.includes("delete") ? (
                                                            <FaTrash
                                                                title="Delete"
                                                                className="icon-red"
                                                                onClick={() => openDeleteModal(brand.id)}
                                                            />
                                                        ) : null}
                                                    </>
                                                ) : (
                                                    <span>-</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center">No brands found.</td>
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

            {/* Deletion Confirmation Modal */}
            <Modal show={showModal} onHide={closeDeleteModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this brand?
                </Modal.Body>
                <Modal.Footer>
                    <Button type='cancel' onClick={closeDeleteModal}>
                        Cancel
                    </Button>
                    <Button type='submit' onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </AdminLayout>
    );
};
