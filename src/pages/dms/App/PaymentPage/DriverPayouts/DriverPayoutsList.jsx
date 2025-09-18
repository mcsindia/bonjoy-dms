import React, { useState } from "react";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";
import { Table, Button, Pagination, Dropdown, DropdownButton, InputGroup, Form } from 'react-bootstrap';
import { FaEdit, FaTrash, FaFileExport, FaPlus, FaFileExcel, FaFilePdf } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

export const DriverPayoutsList = () => {
    const initialPayoutData = [
        { S_No: 1, payoutDate: "2025-03-12", tripId: "RID12345", driverName: "John Doe", totalEarnings: "₹150.00", commissionDeduction: "₹30.00", payoutMethod: "Bank Transfer", payoutStatus: "Pending" },
        { S_No: 2, payoutDate: "2025-03-11", tripId: "RID12346", driverName: "Jane Smith", totalEarnings: "₹200.00", commissionDeduction: "₹40.00", payoutMethod: "Wallet", payoutStatus: "Processed" },
        { S_No: 3, payoutDate: "2025-03-10", tripId: "RID12347", driverName: "Michael Brown", totalEarnings: "₹250.00", commissionDeduction: "₹50.00", payoutMethod: "UPI", payoutStatus: "Failed" },
    ];

    const navigate = useNavigate();
    const [payoutData, setPayoutData] = useState(initialPayoutData);
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
                    if (mod.moduleUrl?.toLowerCase() === "driverpayout") {
                        permissions = mod.permission
                            ?.toLowerCase()
                            .split(',')
                            .map(p => p.trim()) || [];
                    }
                }
            }
        }
    }

    const handleDelete = (payoutId) => {
        if (window.confirm(`Are you sure you want to delete payout record #${payoutId}?`)) {
            setPayoutData(payoutData.filter((payout) => payout.S_No !== payoutId));
        }
    };

    const filteredData = payoutData.filter(payout =>
        (filter ? payout.payoutStatus === filter : true) &&
        (search ? payout.driverName.toLowerCase().includes(search.toLowerCase()) ||
            payout.tripId.toLowerCase().includes(search.toLowerCase()) : true)
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    return (
        <AdminLayout>
            <div className="dms-pages-header sticky-header">
                <h3>Driver Payouts</h3>
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
                        <Button variant="primary" onClick={() => navigate('/dms/driverpayout/add')}>
                            <FaPlus /> Add Payout
                        </Button>
                    )}
                </div>
            </div>

            <div className="filter-search-container">
                <DropdownButton variant="primary" title={`Filter: ${filter || 'All'}`} id="filter-dropdown">
                    <Dropdown.Item onClick={() => setFilter('')}>All</Dropdown.Item>
                    <Dropdown.Item onClick={() => setFilter('Pending')}>Pending</Dropdown.Item>
                    <Dropdown.Item onClick={() => setFilter('Processed')}>Processed</Dropdown.Item>
                    <Dropdown.Item onClick={() => setFilter('Failed')}>Failed</Dropdown.Item>
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
                        <th>Total Earnings</th>
                        <th>Commission Deduction</th>
                        <th>Payout Method</th>
                        <th>Payout Date</th>
                        <th>Payout Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.length > 0 ? (
                        currentItems.map((payout) => (
                            <tr key={payout.S_No}>
                                <td>{payout.S_No}</td>
                                <td>
                                    <a href="#" role="button" className='trip-id-link' onClick={() => navigate('/trip/details', { state: { trip: payout } })}>
                                        {payout.tripId}
                                    </a>
                                </td>
                                <td>{payout.driverName}</td>
                                <td>{payout.totalEarnings}</td>
                                <td>{payout.commissionDeduction}</td>
                                <td>{payout.payoutMethod}</td>
                                <td>{payout.payoutDate}</td>
                                <td>{payout.payoutStatus}</td>
                                <td>
                                    {permissions.includes("edit") || permissions.includes("delete") ? (
                                        <>
                                            {permissions.includes("edit") ? (
                                                <FaEdit
                                                    title="Edit"
                                                    className="icon-green me-2"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => navigate("/dms/driverpayout/edit", { state: { payout } })}
                                                />
                                            ) : null}

                                            {permissions.includes("delete") ? (
                                                <FaTrash
                                                    title="Delete"
                                                    className="icon-red"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => handleDelete(payout.S_No)}
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
                            <td colSpan="9" className="text-center">No driver payouts found.</td>
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
