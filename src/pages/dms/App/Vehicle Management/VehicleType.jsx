import React, { useState } from 'react';
import { Button, Table, InputGroup, Form, Pagination, Dropdown, DropdownButton } from 'react-bootstrap';
import { FaEdit, FaTrash, FaEye, FaFileExport, FaPlus, FaFileExcel, FaFilePdf } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';

export const VehicleType = () => {
    const navigate = useNavigate();

    // Initial Vehicle Data
    const initialVehicles = [
        { id: 1, image: 'https://via.placeholder.com/50', type: 'Bike', cost_per_km: 5, status: 'Active' },
        { id: 2, image: 'https://via.placeholder.com/50', type: 'Car', cost_per_km: 10, status: 'Inactive' },
        { id: 3, image: 'https://via.placeholder.com/50', type: 'Auto', cost_per_km: 7, status: 'Active' },
        { id: 4, image: 'https://via.placeholder.com/50', type: 'Truck', cost_per_km: 15, status: 'Active' },
    ];

    const [vehicles, setVehicles] = useState(initialVehicles);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    // Search Functionality
    const handleSearch = (e) => setSearch(e.target.value);

    // Filtered Vehicles
    const filteredVehicles = vehicles.filter((vehicle) => {
        const matchesSearch = vehicle.type.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter ? vehicle.status === filter : true;
        return matchesSearch && matchesFilter;
    });

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentVehicles = filteredVehicles.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    // Edit Action
    const handleEdit = (vehicle) => {
        navigate('/dms/vehicle/type/edit', { state: { vehicle } });
    };

    // Delete Action
    const handleDelete = (id) => {
        const updatedVehicles = vehicles.filter((vehicle) => vehicle.id !== id);
        setVehicles(updatedVehicles);
    };

    return (
        <AdminLayout>
            <div className="dms-pages-header sticky-header">
                <h3>Vehicle Types</h3>

                <div className="export-import-container">
                    <DropdownButton variant="primary" title={<><FaFileExport /> Export</>} className="me-2 ">
                        <Dropdown.Item> <FaFileExcel className="icon-green" /> Export to Excel</Dropdown.Item>
                        <Dropdown.Item> <FaFilePdf className="icon-red" /> Export to PDF</Dropdown.Item>
                    </DropdownButton>
                    <DropdownButton variant="primary" title={<><FaFileExport /> Import</>} className="me-2">
                        <Dropdown.Item> <FaFileExcel className="icon-green" /> Import from Excel</Dropdown.Item>
                        <Dropdown.Item> <FaFilePdf className="icon-red" /> Import from PDF</Dropdown.Item>
                    </DropdownButton>
                    <Button variant="primary" onClick={() => navigate('/dms/vehicle/type/add')}>
                        <FaPlus /> Add Vehicle Type
                    </Button>
                </div>
            </div>
            {/* Search and Filter */}
            <div className="filter-search-container">
                <DropdownButton variant="primary" title="Filter" id="filter-dropdown">
                    <Dropdown.Item onClick={() => setFilter('')}>All</Dropdown.Item>
                    <Dropdown.Item onClick={() => setFilter('Active')}>Active</Dropdown.Item>
                    <Dropdown.Item onClick={() => setFilter('Inactive')}>Inactive</Dropdown.Item>
                </DropdownButton>
                <InputGroup className="dms-custom-width">
                    <Form.Control
                        placeholder="Search vehicle types..."
                        value={search}
                        onChange={handleSearch}
                    />
                </InputGroup>
            </div>

            {/* Table */}
            <div className="dms-table-container">
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Image</th>
                            <th>Type</th>
                            <th>Cost per Km</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentVehicles.length > 0 ? (
                            currentVehicles.map((vehicle, index) => (
                                <tr key={vehicle.id}>
                                    <td>{indexOfFirstItem + index + 1}</td>
                                    <td><img src={vehicle.image} alt={vehicle.type} width="50" /></td>
                                    <td>{vehicle.type}</td>
                                    <td>₹{vehicle.cost_per_km}</td>
                                    <td>{vehicle.status}</td>
                                    <td>
                                        <FaEye
                                            title="View"
                                            className="icon-blue me-2"
                                            onClick={() => navigate('/dms/vehicle/view', { state: { vehicle } })}
                                        />
                                        <FaEdit
                                            title="Edit"
                                            className="icon-green me-2"
                                            onClick={() => handleEdit(vehicle)}
                                        />
                                        <FaTrash
                                            title="Delete"
                                            className="icon-red"
                                            onClick={() => handleDelete(vehicle.id)}
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">No vehicle types found.</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>

            {/* Pagination */}
            <Pagination className="justify-content-center">
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
        </AdminLayout>
    );
};
