import React, { useState } from 'react';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';
import { Table, InputGroup, Form, Pagination, Dropdown, DropdownButton, Button } from 'react-bootstrap';
import { FaFileExport, FaFileExcel, FaFilePdf, FaEye, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export const DriverEarningList = () => {
    const initialEarnings = [
        {
            earning_id: 1,
            driver_id: 'D001',
            trip_id: 'R123',
            base_fare: 50.00,
            distance_fare: 30.00,
            time_fare: 20.00,
            surge_fare: 10.00,
            tips: 5.00,
            bonuses: 15.00,
            cancellation_fee: 0.00,
            deductions: 5.00,
            service_fee: 20.00,
            total_earnings: 105.00,
            status: 'Paid',
            created_at: '2025-03-20 10:00 AM',
            updated_at: '2025-03-21 09:00 AM'
        },
        {
            earning_id: 2,
            driver_id: 'D002',
            trip_id: 'R124',
            base_fare: 60.00,
            distance_fare: 25.00,
            time_fare: 15.00,
            surge_fare: 0.00,
            tips: 0.00,
            bonuses: 10.00,
            cancellation_fee: 0.00,
            deductions: 0.00,
            service_fee: 18.00,
            total_earnings: 92.00,
            status: 'Pending',
            created_at: '2025-03-22 11:15 AM',
            updated_at: '2025-03-23 08:30 AM'
        }
    ];

    const navigate = useNavigate();
    const [earnings, setEarnings] = useState(initialEarnings);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const handleSearch = (e) => setSearch(e.target.value);

    const filteredEarnings = earnings.filter((earning) => {
        const matchesSearch = earning.driver_id.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter ? earning.status === filter : true;
        return matchesSearch && matchesFilter;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentEarnings = filteredEarnings.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredEarnings.length / itemsPerPage);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <AdminLayout>
            <div className="p-3">
                <div className="dms-pages-header sticky-header">
                    <h3>Driver Earnings</h3>
                    <div className="export-import-container">
                        <DropdownButton variant="primary" title={<><FaFileExport /> Export</>} className="me-2">
                            <Dropdown.Item> <FaFileExcel className="icon-green" /> Export to Excel</Dropdown.Item>
                            <Dropdown.Item> <FaFilePdf className="icon-red" /> Export to PDF</Dropdown.Item>
                        </DropdownButton>
                        <DropdownButton variant="primary" title={<><FaFileExport /> Import</>} className="me-2">
                            <Dropdown.Item> <FaFileExcel className="icon-green" /> Import from Excel</Dropdown.Item>
                            <Dropdown.Item> <FaFilePdf className="icon-red" /> Import from PDF</Dropdown.Item>
                        </DropdownButton>
                        <Button variant="primary" onClick={() => navigate('/dms/drivers-earning/add')}>
                            <FaPlus /> Add Earning
                        </Button>
                    </div>
                </div>

                <div className="filter-search-container">
                    <DropdownButton variant="primary" title="Filter" id="filter-dropdown">
                        <Dropdown.Item onClick={() => setFilter('')}>All</Dropdown.Item>
                        <Dropdown.Item onClick={() => setFilter('Pending')}>Pending</Dropdown.Item>
                        <Dropdown.Item onClick={() => setFilter('Processed')}>Processed</Dropdown.Item>
                        <Dropdown.Item onClick={() => setFilter('Paid')}>Paid</Dropdown.Item>
                    </DropdownButton>
                    <InputGroup className="dms-custom-width">
                        <Form.Control placeholder="Search by Driver ID..." value={search} onChange={handleSearch} />
                    </InputGroup>
                </div>

                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>SNo</th>
                            <th>Driver ID</th>
                            <th>Trip ID</th>
                            <th>Base Fare</th>
                            <th>Total Fare</th>
                            <th>Status</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentEarnings.length > 0 ? currentEarnings.map((entry, index) => (
                            <tr key={entry.earning_id}>
                                <td>{index + 1}</td>
                                <td>
                                    <a href='#' role="button" className='driver-id-link' onClick={() => navigate('/dms/drivers/details/view', { state: { driver: entry } })}>
                                        {entry.driver_id}
                                    </a>
                                </td>
                                <td>
                                <a   href="#" role="button" className='trip-id-link' onClick={() => navigate('/dms/trip/details', { state: { trip: entry} })}>
                                    {entry.trip_id}
                                </a>
                            </td>
                                <td>₹{entry.base_fare.toFixed(2)}</td>
                                <td>₹{entry.total_earnings.toFixed(2)}</td>
                                <td>{entry.status}</td>
                                <td>{entry.created_at}</td>
                                <td>{entry.updated_at}</td>
                                <td><FaEye className="icon-blue" title="View Details" onClick={() => navigate('/dms/drivers-earning/view', { state: { driver: entry } })}
                                /></td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="17" className="text-center">No earnings data found.</td>
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
