import React, { useState } from "react";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";
import { Table, Button, Pagination, Dropdown, DropdownButton, InputGroup, Form } from 'react-bootstrap';
import { FaEdit, FaTrash, FaFileExport, FaPlus, FaFileExcel, FaFilePdf } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

export const RefundRequestList = () => {
    const initialRefundData = [
        { S_No: 1, refundRequestDate: "2025-03-12", tripId: "RID12345", userName: "Alice Johnson", refundAmount: "₹150.00", reason: "Overcharged", paymentMethod: "Card", refundStatus: "Pending" },
        { S_No: 2, refundRequestDate: "2025-03-11", tripId: "RID12346", userName: "Bob Smith", refundAmount: "₹200.00", reason: "Canceled Ride", paymentMethod: "UPI", refundStatus: "Approved" },
        { S_No: 3, refundRequestDate: "2025-03-10", tripId: "RID12347", userName: "Charlie Brown", refundAmount: "₹250.00", reason: "Payment Error", paymentMethod: "Wallet", refundStatus: "Rejected" },
    ];

    const navigate = useNavigate();
    const [refundData, setRefundData] = useState(initialRefundData);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('');
    const itemsPerPage = 5;
    const requestCount = refundData.length;

    const userData = JSON.parse(localStorage.getItem("userData"));
    let permissions = [];

    if (Array.isArray(userData?.employeeRole)) {
        for (const role of userData.employeeRole) {
            for (const child of role.childMenus || []) {
                for (const mod of child.modules || []) {
                    if (mod.moduleUrl?.toLowerCase() === "refundrequest") {
                        permissions = mod.permission
                            ?.toLowerCase()
                            .split(',')
                            .map(p => p.trim()) || [];
                    }
                }
            }
        }
    }

    const handleDelete = (refundId) => {
        if (window.confirm(`Are you sure you want to delete refund request #${refundId}?`)) {
            setRefundData(refundData.filter((refund) => refund.S_No !== refundId));
        }
    };

    const filteredData = refundData.filter(refund =>
        (filter ? refund.refundStatus === filter : true) &&
        (search ? refund.userName.toLowerCase().includes(search.toLowerCase()) ||
            refund.tripId.toLowerCase().includes(search.toLowerCase()) : true)
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    return (
        <AdminLayout>
            <div className="dms-pages-header sticky-header">
                <div className="live-count">
                    <h3>Refund Requests</h3>
                    <div className="live-count-container">
                        <Button className='green-button'>
                            🔄 Total Requests: {requestCount}
                        </Button>
                    </div>
                </div>
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
                        <Button variant="primary" onClick={() => navigate('/dms/refundrequest/add')}>
                            <FaPlus /> Add Request
                        </Button>
                    )}
                </div>
            </div>

            <div className="filter-search-container">
                <DropdownButton variant="primary" title={`Filter: ${filter || 'All'}`} id="filter-dropdown">
                    <Dropdown.Item onClick={() => setFilter('')}>All</Dropdown.Item>
                    <Dropdown.Item onClick={() => setFilter('Pending')}>Pending</Dropdown.Item>
                    <Dropdown.Item onClick={() => setFilter('Approved')}>Approved</Dropdown.Item>
                    <Dropdown.Item onClick={() => setFilter('Rejected')}>Rejected</Dropdown.Item>
                    <Dropdown.Item onClick={() => setFilter('Processed')}>Processed</Dropdown.Item>
                </DropdownButton>
                <InputGroup className="dms-custom-width">
                    <Form.Control
                        placeholder="Search by User or Ride ID..."
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
                        <th>User Name</th>
                        <th>Refund Amount</th>
                        <th>Reason</th>
                        <th>Payment Method</th>
                        <th>Refund Status</th>
                        <th>Refund Request Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.length > 0 ? (
                        currentItems.map((refund) => (
                            <tr key={refund.S_No}>
                                <td>{refund.S_No}</td>
                                <td>
                                    <a
                                        href="#"
                                        className='trip-id-link'
                                        onClick={() => navigate('/trip/details', { state: { trip: refund } })}
                                    >
                                        {refund.tripId}
                                    </a>
                                </td>
                                <td>{refund.userName}</td>
                                <td>{refund.refundAmount}</td>
                                <td>{refund.reason}</td>
                                <td>{refund.paymentMethod}</td>
                                <td>{refund.refundStatus}</td>
                                <td>{refund.refundRequestDate}</td>
                                <td>
                                    {permissions.includes("edit") || permissions.includes("delete") ? (
                                        <>
                                            {permissions.includes("edit") && (
                                                <FaEdit
                                                    title="Edit"
                                                    className="icon-green me-2"
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => navigate("/dms/refundrequest/edit", { state: { refund } })}
                                                />
                                            )}
                                            {permissions.includes("delete") && (
                                                <FaTrash
                                                    title="Delete"
                                                    className="icon-red"
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => handleDelete(refund.S_No)}
                                                />
                                            )}
                                        </>
                                    ) : (
                                        <span>-</span>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="9" className="text-center">No refund requests found.</td>
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
