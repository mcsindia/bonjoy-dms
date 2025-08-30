import React, { useState } from 'react';
import { Button, Table, InputGroup, Form, Pagination, Dropdown, DropdownButton } from 'react-bootstrap';
import { FaEye, FaEdit, FaTrash, FaPlus, FaFileExport, FaFileExcel, FaFilePdf } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';

export const PerformanceReportList = () => {
    const navigate = useNavigate();

    const initialReports = [
        { id: 1, user_id: 'U1001', user_type: 'Driver', total_trips: 120, completed_trips: 110, canceled_trips: 10, response_time: '5 mins', average_rating: 4.8, total_reviews: 95, late_pickups: 3, earnings_generated: 50000, distance_traveled: 1200, loyalty_status: 'Gold', report_date: '2025-03-15' },
        { id: 2, user_id: 'U1002', user_type: 'Rider', total_trips: 80, completed_trips: 75, canceled_trips: 5, response_time: '3 mins', average_rating: 4.5, total_reviews: 80, late_pickups: 1, earnings_generated: 0, distance_traveled: 700, loyalty_status: 'Silver', report_date: '2025-03-16' },
    ];

    const [reports, setReports] = useState(initialReports);
    const [search, setSearch] = useState('');
    const [filterUserType, setFilterUserType] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const handleSearch = (e) => setSearch(e.target.value);

    const filteredReports = reports.filter((report) => {
        const matchesSearch = report.user_id.toLowerCase().includes(search.toLowerCase());
        const matchesUserType = filterUserType ? report.user_type === filterUserType : true;
        return matchesSearch && matchesUserType;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentReports = filteredReports.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <AdminLayout>
            <div className="report-list-container p-3">
                <div className="dms-pages-header sticky-header">
                    <h3>Performance Reports</h3>
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
                        <Button variant="primary" onClick={() => navigate('/dms/performance-report/add')}>
                            <FaPlus /> Add Report
                        </Button>
                    </div>
                </div>

                <div className="filter-search-container">
                    <DropdownButton variant="primary" title="Filter" id="filter-user-dropdown" className="me-2">
                        <Dropdown.Item onClick={() => setFilterUserType('')}>All</Dropdown.Item>
                        <Dropdown.Item onClick={() => setFilterUserType('Driver')}>Driver</Dropdown.Item>
                        <Dropdown.Item onClick={() => setFilterUserType('Rider')}>Rider</Dropdown.Item>
                    </DropdownButton>
                    <InputGroup className="dms-custom-width">
                        <Form.Control placeholder="Search by User ID..." value={search} onChange={handleSearch} />
                    </InputGroup>
                </div>

                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>User Type</th>
                            <th>Total Trips</th>
                            <th>Completed Trips</th>
                            <th>Canceled Trips</th>
                            <th>Response Time</th>
                            <th>Average Rating</th>
                            <th>Total Reviews</th>
                            <th>Late Pickups</th>
                            <th>Earnings Generated</th>
                            <th>Distance Traveled</th>
                            <th>Loyalty Status</th>
                            <th>Report Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentReports.length > 0 ? (
                            currentReports.map((report, index) => (
                                <tr key={report.id}>
                                    <td>{report.user_id}</td>
                                    <td>{report.user_type}</td>
                                    <td>{report.total_trips}</td>
                                    <td>{report.completed_trips}</td>
                                    <td>{report.canceled_trips}</td>
                                    <td>{report.response_time}</td>
                                    <td>{report.average_rating}</td>
                                    <td>{report.total_reviews}</td>
                                    <td>{report.late_pickups}</td>
                                    <td>₹{report.earnings_generated.toFixed(2)}</td>
                                    <td>{report.distance_traveled} km</td>
                                    <td>{report.loyalty_status}</td>
                                    <td>{report.report_date}</td>
                                    <td>
                                        <FaEye title="View" className="icon-blue me-2" onClick={() => navigate("/dms/performance-report/view", { state: { report } })} />
                                        <FaEdit title="Edit" className="icon-green me-2" onClick={() => navigate("/dms/performance-report/edit", { state: { report } })} />
                                        <FaTrash title="Delete" className="icon-red" />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="15" className="text-center">No performance reports found.</td>
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
