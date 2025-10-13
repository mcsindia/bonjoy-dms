import React, { useState } from "react";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";
import { Table, Button, Pagination, Dropdown, DropdownButton, InputGroup, Form } from 'react-bootstrap';
import { FaEdit, FaTrash, FaFileExport, FaPlus, FaFileExcel, FaFilePdf } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

export const CommissionFeeList = () => {
    const initialCommissionData = [
        { S_No: 1, paymentDate: "2025-03-12", tripid: "RID12345", driverName: "John Doe", totalCommission: 50, platformFee: 10 },
        { S_No: 2, paymentDate: "2025-03-11", tripid: "RID12346", driverName: "Jane Smith", totalCommission: 60, platformFee: 15 },
        { S_No: 3, paymentDate: "2025-03-10", tripid: "RID12347", driverName: "Michael Brown", totalCommission: 70, platformFee: 20 },
    ];

    const navigate = useNavigate();
    const [commissionData, setCommissionData] = useState(initialCommissionData);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('');
    const itemsPerPage = 5;
    const userData = JSON.parse(localStorage.getItem("userData"));
    let permissions = [];

    if (Array.isArray(userData?.employeeRole)) {
        for (const role of userData.employeeRole) {
            for (const child of role.childMenus || []) {
                for (const mod of child.modules || []) {
                    if (mod.moduleUrl?.toLowerCase() === "commissionfee") {
                        permissions = mod.permission
                            ?.toLowerCase()
                            .split(',')
                            .map(p => p.trim()) || [];
                    }
                }
            }
        }
    }

    const handleDelete = (commissionId) => {
        if (window.confirm(`Are you sure you want to delete commission record #${commissionId}?`)) {
            setCommissionData(commissionData.filter((commission) => commission.S_No !== commissionId));
        }
    };

    const filteredData = commissionData.filter(commission =>
        (filter ? commission.totalCommission <= filter : true) &&
        (search ? commission.driverName.toLowerCase().includes(search.toLowerCase()) ||
            commission.tripid.toLowerCase().includes(search.toLowerCase()) : true)
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    return (
        <AdminLayout>
            <div className="dms-pages-header sticky-header">
                <h3>Commission Fees</h3>
                <div className="export-import-container">
                    <DropdownButton variant="primary" title={<><FaFileExport /> Import</>} className="me-2">
                        <Dropdown.Item> <FaFileExcel className="icon-green" /> Import from Excel</Dropdown.Item>
                        <Dropdown.Item> <FaFilePdf className="icon-red" /> Import from PDF</Dropdown.Item>
                    </DropdownButton>
                    <DropdownButton variant="primary" title={<><FaFileExport /> Export</>} className="me-2">
                        <Dropdown.Item> <FaFileExcel className="icon-green" /> Export to Excel</Dropdown.Item>
                        <Dropdown.Item> <FaFilePdf className="icon-red" /> Export to PDF</Dropdown.Item>
                    </DropdownButton>
                    {permissions.includes("add") && (
                        <Button variant="primary" onClick={() => navigate('/dms/commissionfee/add')}>
                            <FaPlus /> Add Commission
                        </Button>
                    )}
                </div>
            </div>

            <div className="filter-search-container">
                <DropdownButton variant="primary" title="Filter Commission Amount" id="filter-dropdown">
                    <Dropdown.Item onClick={() => setFilter('')}>All</Dropdown.Item>
                    <Dropdown.Item onClick={() => setFilter(50)}>Up to ₹50</Dropdown.Item>
                    <Dropdown.Item onClick={() => setFilter(60)}>Up to ₹60</Dropdown.Item>
                    <Dropdown.Item onClick={() => setFilter(70)}>Up to ₹70</Dropdown.Item>
                </DropdownButton>
                <InputGroup className="dms-custom-width">
                    <Form.Control
                        placeholder="Search by Driver or Ride ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </InputGroup>
            </div>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Trip ID</th>
                        <th>Driver Name</th>
                        <th>Total Commission Amount</th>
                        <th>Platform Fee</th>
                        <th>Payment Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.length > 0 ? (
                        currentItems.map((commission) => (
                            <tr key={commission.S_No}>
                                <td>{commission.S_No}</td>
                                <td><a href="#" role="button" className='trip-id-link' onClick={() => navigate('/dms/trip/details', { state: { trip: commission } })}>
                                    {commission.tripid}
                                </a></td>
                                <td>{commission.driverName}</td>
                                <td>₹{commission.totalCommission}</td>
                                <td>₹{commission.platformFee}</td>
                                <td>{commission.paymentDate}</td>
                                <td>
                                    {permissions.includes("edit") || permissions.includes("delete") ? (
                                        <>
                                            {permissions.includes("edit") ? (
                                                <FaEdit
                                                    title="Edit"
                                                    className="icon icon-green"
                                                    onClick={() => navigate("/dms/commissionfee/edit", { state: { commission } })}
                                                />
                                            ) : null}

                                            {permissions.includes("delete") ? (
                                                <FaTrash
                                                    title="Delete"
                                                    className="icon icon-red"
                                                    onClick={() => handleDelete(commission.S_No)}
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
                            <td colSpan="7" className="text-center">No commission records found.</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* Pagination */}
            <Pagination className="justify-content-center">
                <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />
                {[...Array(totalPages)].map((_, index) => (
                    <Pagination.Item
                        key={index + 1}
                        active={index + 1 === currentPage}
                        onClick={() => setCurrentPage(index + 1)}
                    >
                        {index + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} />
            </Pagination>
        </AdminLayout>
    );
};
