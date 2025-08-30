import React, { useState } from 'react';
import { Button, Table, InputGroup, Form, Pagination, Dropdown, DropdownButton } from 'react-bootstrap';
import { FaEye, FaFileExport, FaPlus, FaFileExcel, FaFilePdf, FaTrash, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';

export const PaymentRefundIssuesList = () => {
    const navigate = useNavigate();

    const initialIssues = [
        { id: 1, trip_id: 'S7001', rider_id: 'R1001', driver_id: 'D001', issue_type: 'Overcharge', reported_at: '2025-03-10 12:30', refund_amount: 10.50, payment_method: 'Credit Card', issue_description: 'Charged extra for the ride.', support_status: 'Pending', resolved_at: '' },
        { id: 2, trip_id: 'S7002', rider_id: 'R1002', driver_id: 'D002', issue_type: 'Payment Failure', reported_at: '2025-03-11 15:00', refund_amount: 25.00, payment_method: 'PayPal', issue_description: 'Payment deducted but ride not booked.', support_status: 'Resolved', resolved_at: '2025-03-12 10:00' },
    ];

    const [issues, setIssues] = useState(initialIssues);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const refundCount = issues.length;
    const handleSearch = (e) => setSearch(e.target.value);
    const handleFilterStatus = (status) => setFilterStatus(status);

    const filteredIssues = issues.filter((issue) => {
        const matchesSearch = issue.trip_id.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = filterStatus ? issue.support_status === filterStatus : true;
        return matchesSearch && matchesStatus;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentIssues = filteredIssues.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredIssues.length / itemsPerPage);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <AdminLayout>
            <div className="refund-issues-container p-3">
                <div className="dms-pages-header sticky-header">
                    <div className="live-count">
                    <h3>Payment Refund Issues</h3>
                        <div className="live-count-container">
                            <Button className='green-button'>
                            🔄Total Issues: {refundCount}
                            </Button>
                        </div>
                    </div>
                    <div className="export-import-container">
                        <DropdownButton variant="primary" title={<><FaFileExport /> Export</>} className="me-2">
                            <Dropdown.Item> <FaFileExcel className="icon-green" /> Export to Excel</Dropdown.Item>
                            <Dropdown.Item> <FaFilePdf className="icon-red" /> Export to PDF</Dropdown.Item>
                        </DropdownButton>
                        <DropdownButton variant="primary" title={<><FaFileExport /> Import</>} className="me-2">
                            <Dropdown.Item>
                                <FaFileExcel className='icon-green' /> Import from Excel
                            </Dropdown.Item>
                            <Dropdown.Item>
                                <FaFilePdf className='icon-red' /> Import from PDF
                            </Dropdown.Item>
                        </DropdownButton>
                        <Button variant="primary" onClick={() => navigate('/dms/refund-payment-issue/add')}>
                            <FaPlus /> Add Issue
                        </Button>
                    </div>
                </div>

                <div className="filter-search-container">
                    <DropdownButton variant="primary" title="Filter" id="filter-status-dropdown" className="me-2">
                        <Dropdown.Item onClick={() => handleFilterStatus('')}>All</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleFilterStatus('Pending')}>Pending</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleFilterStatus('Resolved')}>Resolved</Dropdown.Item>
                    </DropdownButton>
                    <InputGroup className="dms-custom-width">
                        <Form.Control placeholder="Search by Trip ID..." value={search} onChange={handleSearch} />
                    </InputGroup>
                </div>

                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Trip ID</th>
                            <th>Rider ID</th>
                            <th>Driver ID</th>
                            <th>Issue Type</th>
                            <th>Reported At</th>
                            <th>Refund Amount</th>
                            <th>Payment Method</th>
                            <th>Issue Description</th>
                            <th>Support Status</th>
                            <th>Resolved At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentIssues.length > 0 ? (
                            currentIssues.map((issue, index) => (
                                <tr key={issue.id}>
                                    <td>
                                        <a href='' role="button" className='trip-id-link' onClick={() => navigate('/dms/trip/details', { state: { trip: issue } })}>
                                            {issue.trip_id}
                                        </a>
                                    </td>
                                    <td>
                                        <a href='#' role="button" className='driver-id-link' onClick={() => navigate('/dms/rider/profile', { state: { rider: index } })}>
                                            {issue.rider_id}
                                        </a>
                                    </td>
                                    <td>
                                        <a href='#' role="button" className='driver-id-link' onClick={() => navigate('/dms/drivers/details/view', { state: { driver: issue } })}>
                                            {issue.driver_id}
                                        </a>
                                    </td>
                                    <td>{issue.issue_type}</td>
                                    <td>{issue.reported_at}</td>
                                    <td>₹{issue.refund_amount.toFixed(2)}</td>
                                    <td>{issue.payment_method}</td>
                                    <td>{issue.issue_description}</td>
                                    <td>{issue.support_status}</td>
                                    <td>{issue.resolved_at || 'N/A'}</td>
                                    <td>
                                        <FaEye title="View" className="icon-blue me-2" onClick={() => navigate("/dms/refund-issues/view", { state: { issue } })} />
                                        <FaEdit title="Edit" className="icon-green me-2" onClick={() => navigate("/dms/refund-payment-issue/edit", { state: { issue } })} />
                                        <FaTrash title="Delete" className="icon-red" />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="12" className="text-center">No refund issues found.</td>
                            </tr>
                        )}
                    </tbody>
                </Table>

                <Pagination className="justify-content-center">
                    <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                    {[...Array(totalPages)].map((_, index) => (
                        <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => handlePageChange(index + 1)}>
                            {index + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                </Pagination>
            </div>
        </AdminLayout>
    );
};
