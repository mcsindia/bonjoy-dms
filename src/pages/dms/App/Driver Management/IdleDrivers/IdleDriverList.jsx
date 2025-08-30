import React, { useState } from 'react';
import { Button, Table, InputGroup, Form, Pagination, Dropdown, DropdownButton } from 'react-bootstrap';
import { FaEdit, FaTrash, FaEye, FaFileExport, FaPlus, FaFileExcel, FaFilePdf } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';

export const IdleDriverList = () => {
    const navigate = useNavigate();

    const initialDrivers = [
        { id: 1, driver_id: 'D101', vehicle_id: 'V2001', latitude: '40.7128', longitude: '-74.0060', last_active: '2025-03-13 09:30 AM', idle_since: '2025-03-13 10:00 AM', rating: 4.2 },
        { id: 2, driver_id: 'D102', vehicle_id: 'V2002', latitude: '34.0522', longitude: '-118.2437', last_active: '2025-03-13 08:45 AM', idle_since: '2025-03-13 09:15 AM', rating: 4.7 },
    ];

    const [drivers, setDrivers] = useState(initialDrivers);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const handleSearch = (e) => setSearch(e.target.value);
    const handleFilter = (filterOption) => setFilter(filterOption);

    const filteredDrivers = drivers.filter((driver) => {
        const matchesSearch = driver.driver_id.toLowerCase().includes(search.toLowerCase());
        let matchesFilter = true;

        if (filter === 'More than 1 hour') {
            matchesFilter = new Date(driver.idle_since) <= new Date(Date.now() - 3600000);
        } else if (filter === 'More than 3 hours') {
            matchesFilter = new Date(driver.idle_since) <= new Date(Date.now() - 10800000);
        } else if (filter === 'More than 6 hours') {
            matchesFilter = new Date(driver.idle_since) <= new Date(Date.now() - 21600000);
        }

        return matchesSearch && matchesFilter;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentDrivers = filteredDrivers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredDrivers.length / itemsPerPage);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <AdminLayout>
            <div className="driver-list-container p-3">
                <div className="dms-pages-header sticky-header">
                    <h3>Idle Drivers</h3>
                    <div className="export-import-container">
                        <DropdownButton variant="primary" title={<><FaFileExport /> Export</>} className="me-2">
                            <Dropdown.Item> <FaFileExcel className="icon-green" /> Export to Excel</Dropdown.Item>
                            <Dropdown.Item> <FaFilePdf className="icon-red" /> Export to PDF</Dropdown.Item>
                        </DropdownButton>
                        <DropdownButton variant="primary" title={<><FaFileExport /> Import</>} className="me-2">
                            <Dropdown.Item> <FaFileExcel className="icon-green" /> Import from Excel</Dropdown.Item>
                            <Dropdown.Item> <FaFilePdf className="icon-red" /> Import from PDF</Dropdown.Item>
                        </DropdownButton>
                        <Button variant="primary" onClick={() => navigate('/dms/idle-drivers/add')}>
                            <FaPlus /> Add Driver
                        </Button>
                    </div>
                </div>

                <div className="filter-search-container">
                    <DropdownButton variant="primary" title="Filter Idle Time" id="filter-dropdown">
                        <Dropdown.Item onClick={() => handleFilter('')}>All</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleFilter('More than 1 hour')}>More than 1 hour</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleFilter('More than 3 hours')}>More than 3 hours</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleFilter('More than 6 hours')}>More than 6 hours</Dropdown.Item>
                    </DropdownButton>
                    <InputGroup className="dms-custom-width">
                        <Form.Control placeholder="Search drivers..." value={search} onChange={handleSearch} />
                    </InputGroup>
                </div>

                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>SNo</th>
                            <th>Driver ID</th>
                            <th>Vehicle ID</th>
                            <th>Latitude</th>
                            <th>Longitude</th>
                            <th>Last Active</th>
                            <th>Idle Since</th>
                            <th>Rating</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentDrivers.length > 0 ? (
                            currentDrivers.map((driver, index) => (
                                <tr key={driver.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <a href='#' role="button" className='driver-id-link' onClick={() => navigate('/dms/drivers/details/view', { state: { driver: driver } })}>
                                            {driver.driver_id}
                                        </a>
                                    </td>
                                    <td>{driver.vehicle_id}</td>
                                    <td>{driver.latitude}</td>
                                    <td>{driver.longitude}</td>
                                    <td>{driver.last_active}</td>
                                    <td>{driver.idle_since}</td>
                                    <td>{driver.rating}</td>
                                    <td>
                                        <FaEye title="View" className="icon-blue me-2" onClick={() => navigate("/dms/drivers/details/view", { state: { driver } })} />
                                        <FaEdit title="Edit" className="icon-green me-2" onClick={() => navigate("/dms/idle-drivers/edit", { state: { driver } })} />
                                        <FaTrash title="Delete" className="icon-red" />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="text-center">No idle drivers found.</td>
                            </tr>
                        )}
                    </tbody>
                </Table>

                <Pagination className="justify-content-center">
                    <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                    {[...Array(totalPages)].map((_, index) => (
                        <Pagination.Item
                            key={index + 1}
                            active={index + 1 === currentPage}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                </Pagination>
            </div>
        </AdminLayout>
    );
};
