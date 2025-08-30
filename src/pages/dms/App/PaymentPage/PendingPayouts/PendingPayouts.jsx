import React, { useState } from "react";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";
import { Table, Button, Pagination, Dropdown, DropdownButton, InputGroup, Form } from 'react-bootstrap';
import { FaEdit, FaTrash, FaFileExport, FaPlus, FaFileExcel, FaFilePdf } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

export const PendingPayouts = () => {
    const initialPayoutData = [
        { S_No: 1, pendingFor: "Rider", name: "Alice Johnson", profileId: "R12345", pendingAmount: "₹120.50", status: "Payment Pending", dateTime: "2025-03-12 14:30" },
        { S_No: 2, pendingFor: "Driver", name: "Jane Smith", profileId: "D98765", pendingAmount: "₹85.75", status: "Failed Transaction", dateTime: "2025-03-11 09:15" },
        { S_No: 3, pendingFor: "Rider", name: "Charlie Davis", profileId: "R67890", pendingAmount: "₹200.00", status: "Awaiting Confirmation", dateTime: "2025-03-10 18:45" },
    ];

    const navigate = useNavigate();
    const [payoutData, setPayoutData] = useState(initialPayoutData);
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState('');
    const [search, setSearch] = useState('');
    const itemsPerPage = 5;
    const payoutCount = payoutData.length
    const userData = JSON.parse(localStorage.getItem("userData"));
    let permissions = [];

    if (Array.isArray(userData?.employeeRole)) {
        for (const role of userData.employeeRole) {
            for (const child of role.childMenus || []) {
                for (const mod of child.modules || []) {
                    if (mod.moduleUrl?.toLowerCase() === "pendingpayments") {
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
            alert(fallbackMessage || `You don't have permission to ${permissionType} this setting.`);
        }
    };

    const handleDelete = (payoutId) => {
        if (window.confirm(`Are you sure you want to delete payout record #₹{payoutId}?`)) {
            setPayoutData(payoutData.filter((payout) => payout.S_No !== payoutId));
        }
    };

    const filteredData = payoutData.filter(payout =>
        (filter ? payout.status === filter : true) &&
        (search ? payout.riderName.toLowerCase().includes(search.toLowerCase()) ||
            payout.driverName.toLowerCase().includes(search.toLowerCase()) : true)
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    return (
        <AdminLayout>
            <div className="dms-pages-header sticky-header">
                <div className="live-count">
                    <h3>Pending Payouts</h3>
                    <div className="live-count-container">
                        <Button className='green-button'>
                            🔄Pendings: {payoutCount}
                        </Button>
                    </div>
                </div>
                <div className="export-import-container">
                    <DropdownButton variant="primary" title={<><FaFileExport /> Export</>} className="me-2">
                        <Dropdown.Item> <FaFileExcel className="icon-green" /> Export to Excel</Dropdown.Item>
                        <Dropdown.Item> <FaFilePdf className="icon-red" /> Export to PDF</Dropdown.Item>
                    </DropdownButton>
                    <DropdownButton variant="primary" title={<><FaFileExport /> Import</>} className="me-2">
                        <Dropdown.Item> <FaFileExcel className="icon-green" /> Import from Excel</Dropdown.Item>
                        <Dropdown.Item> <FaFilePdf className="icon-red" /> Import from PDF</Dropdown.Item>
                    </DropdownButton>
                    <Button variant="primary" onClick={() => handlePermissionCheck("add", () => navigate('/dms/pendingpayments/add'))}>
                        <FaPlus /> Add payment
                    </Button>
                </div>
            </div>

            <div className="filter-search-container">
                <DropdownButton variant="primary" title="Filter Status" id="filter-dropdown">
                    <Dropdown.Item onClick={() => setFilter('')}>All</Dropdown.Item>
                    <Dropdown.Item onClick={() => setFilter('Payment Pending')}>Payment Pending</Dropdown.Item>
                    <Dropdown.Item onClick={() => setFilter('Failed Transaction')}>Failed Transaction</Dropdown.Item>
                    <Dropdown.Item onClick={() => setFilter('Awaiting Confirmation')}>Awaiting Confirmation</Dropdown.Item>
                </DropdownButton>
                <InputGroup className="dms-custom-width">
                    <Form.Control
                        placeholder="Search by Rider or Driver..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </InputGroup>
            </div>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Pending For</th>
                        <th>Profile Id</th>
                        <th>Pending Amount</th>
                        <th>Status</th>
                        <th>Date & Time</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.length > 0 ? (
                        currentItems.map((payout) => (
                            <tr key={payout.S_No}>
                                <td>{payout.S_No}</td>
                                <td>{payout.pendingFor}</td>
                                <td>
                                    <a href={payout.pendingFor === "Rider"
                                        ? `/rider/profile`
                                        : `/drivers/details/view`}
                                        target="_blank" rel="noopener noreferrer" className="rider-id-link"
                                    >
                                        {payout.profileId}
                                    </a>
                                </td>
                                <td>{payout.pendingAmount}</td>
                                <td>{payout.status}</td>
                                <td>{payout.dateTime}</td>
                                <td>
                                    <FaEdit title="Edit" className="icon-green me-2"
                                        onClick={() => handlePermissionCheck("edit", () => navigate("/dms/pendingpayments/edit", { state: { payout } }))} />
                                    <FaTrash title="Delete" className="icon-red"
                                        onClick={() => handlePermissionCheck("delete", () => handleDelete(payout.S_No))} />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center">No pending payouts found.</td>
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