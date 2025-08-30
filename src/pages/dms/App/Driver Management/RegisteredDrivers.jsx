import React, { useState } from "react";
import { Table, InputGroup, Form, Pagination, Dropdown, DropdownButton, ProgressBar } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import { AdminLayout } from "../../../../layouts/dms/AdminLayout/AdminLayout";
import { useNavigate } from "react-router-dom";

export const RegisteredDrivers = () => {
    const navigate = useNavigate();
    const drivers = [
        { sno: 1, name: "John Doe", mobile: "9876543210", profileCompletion: 80, documentCompletion: 100, Date: "2024-02-10 ", time: "14:30 PM"},
        { sno: 2, name: "Jane Smith", mobile: "8765432109", profileCompletion: 100, documentCompletion: 100, Date: "2024-02-09 ", time: "10:15 AM" },
        { sno: 3, name: "Michael Johnson", mobile: "7654321098", profileCompletion: 60, documentCompletion: 90, Date: "2024-02-08 ", time: "18:45 AM" },
    ];

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    const handleSearch = (e) => setSearch(e.target.value);
    const handleFilter = (status) => setFilter(status);

    const filteredDrivers = drivers.filter(driver =>
        (driver.name.toLowerCase().includes(search.toLowerCase()) ||
        driver.mobile.includes(search)) &&
        (filter ? driver.profileCompletion >= filter : true)
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentDrivers = filteredDrivers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredDrivers.length / itemsPerPage);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <AdminLayout>
            <div className="dms-pages-header sticky-header">
                <h3>Registered Drivers</h3>
            </div>
            
            {/* Search and Filter */}
            <div className="filter-search-container">
                <DropdownButton variant="primary" title="Filter" id="filter-dropdown">
                    <Dropdown.Item onClick={() => handleFilter("")}>All</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleFilter(80)}>80% and above</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleFilter(100)}>100%</Dropdown.Item>
                </DropdownButton>
                <InputGroup className="dms-custom-width">
                    <Form.Control
                        placeholder="Search drivers..."
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
                            <th>Name</th>
                            <th>Mobile Number</th>
                            <th>Profile Completion</th>
                            <th>Document Submission</th>
                            <th>Registration Date & Time</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentDrivers.length > 0 ? (
                            currentDrivers.map(driver => (
                                <tr key={driver.sno}>
                                    <td>{driver.sno}</td>
                                    <td>{driver.name}</td>
                                    <td>{driver.mobile}</td>
                                    <td><ProgressBar now={driver.profileCompletion} label={`${driver.profileCompletion}%`} variant="success" /></td>
                                    <td><ProgressBar now={driver.documentCompletion} label={`${driver.documentCompletion}%`} variant="success" /></td>
                                    <td>{driver.Date} <br/> {driver.time}</td>
                                    <td>
                                        <FaEye
                                            title="View"
                                            className="icon icon-blue"
                                            onClick={() => navigate('/dms/registered/drivers/view', { state: { driver } })}
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center">No drivers found.</td>
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
