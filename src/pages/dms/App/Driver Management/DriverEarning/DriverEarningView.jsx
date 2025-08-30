import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, Table, Pagination } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import defaultProfileImg from '../../../../../assets/images/profile.png';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';

export const DriverEarningView = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const driver = location.state?.driver;

    const [transactionPage, setTransactionPage] = useState(1);
    const itemsPerPage = 5;

    const transactionData = [
        { date: '2025-03-20', tripId: 'TRIP001', amount: '₹500', status: 'Paid' },
        { date: '2025-03-19', tripId: 'TRIP002', amount: '₹450', status: 'Paid' },
        { date: '2025-03-18', tripId: 'TRIP003', amount: '₹480', status: 'Pending' },
        { date: '2025-03-17', tripId: 'TRIP004', amount: '₹520', status: 'Paid' },
        { date: '2025-03-16', tripId: 'TRIP005', amount: '₹510', status: 'Paid' },
        { date: '2025-03-15', tripId: 'TRIP006', amount: '₹470', status: 'Pending' },
    ];

    const paginate = (data, currentPage) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return data.slice(startIndex, startIndex + itemsPerPage);
    };

    const totalPages = Math.ceil(transactionData.length / itemsPerPage);

    if (!driver) {
        return (
            <AdminLayout>
                <div className="text-center mt-5">
                    <h3>Driver not found</h3>
                    <Button onClick={() => navigate('/dms/drivers/earnings')}>Go Back</Button>
                </div>
            </AdminLayout>
        );
    }

    const {
        driver_id,
        name = 'N/A',
        profile_img = defaultProfileImg,
        totalDistance = '1450 km',
        base_fare = 0.00,
        distance_fare = 0.00,
        time_fare = 0.00,
        surge_fare = 0.00,
        tips = 0.00,
        bonuses = 0.00,
        cancellation_fee = 0.00,
        deductions = 0.00,
        service_fee = 0.00,
        total_earnings = 0.00,
        earning_status = 'Pending'
    } = driver;

    return (
        <AdminLayout>
            <div className="driver-earning-view container mt-4">
                <Card className="mb-4">
                    <Card.Body className="d-flex justify-content-between align-items-center m-4 card-body-custom">
                        <div className="d-flex align-items-center gap-3">
                            <img
                                src={profile_img}
                                alt={`${name}'s Profile`}
                                className="rounded-circle border profile-img"
                            />
                            <div>
                                <p><strong>Driver ID:</strong> {driver_id}</p>
                                <p><strong>Distance cover:</strong>{totalDistance}</p>
                            </div>
                        </div>
                        <Button variant="secondary" onClick={() => navigate(-1)}>
                            <FaArrowLeft /> Back
                        </Button>
                    </Card.Body>
                </Card>

                {/* Earnings Summary */}
                <section className="mt-4">
                    <h4>Earning Summary Breakdown</h4>
                    <Table striped bordered hover>
                        <tbody>
                            <tr>
                                <th>Base Fare</th>
                                <td>₹{base_fare.toFixed(2)}</td>
                                <th>Distance Fare</th>
                                <td>₹{distance_fare.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <th>Time Fare</th>
                                <td>₹{time_fare.toFixed(2)}</td>
                                <th>Surge Fare</th>
                                <td>₹{surge_fare.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <th>Tips</th>
                                <td>₹{tips.toFixed(2)}</td>
                                <th>Bonuses</th>
                                <td>₹{bonuses.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <th>Cancellation Fee</th>
                                <td>₹{cancellation_fee.toFixed(2)}</td>
                                <th>Deductions</th>
                                <td>₹{deductions.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <th>Service Fee</th>
                                <td>₹{service_fee.toFixed(2)}</td>
                                <th>Total Earnings</th>
                                <td><strong>₹{total_earnings.toFixed(2)}</strong></td>
                            </tr>
                            <tr>
                                <th>Status</th>
                                <td colSpan={3}>{earning_status}</td>
                            </tr>
                        </tbody>
                    </Table>
                </section>

                <hr className="table-hr" />

                {/* Transaction History */}
                <section className="mt-4">
                    <div className="dms-pages-header d-flex justify-content-between align-items-center">
                        <h4>Earning Transactions</h4>
                    </div>

                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Trip ID</th>
                                <th>Amount</th>
                                <th>Payment Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginate(transactionData, transactionPage).map((txn, idx) => (
                                <tr key={idx}>
                                    <td>{txn.date}</td>
                                    <td>{txn.tripId}</td>
                                    <td>{txn.amount}</td>
                                    <td>{txn.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <Pagination className="justify-content-center">
                        <Pagination.Prev
                            onClick={() => setTransactionPage((prev) => Math.max(prev - 1, 1))}
                            disabled={transactionPage === 1}
                        />
                        {[...Array(totalPages)].map((_, idx) => (
                            <Pagination.Item
                                key={idx + 1}
                                active={idx + 1 === transactionPage}
                                onClick={() => setTransactionPage(idx + 1)}
                            >
                                {idx + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next
                            onClick={() => setTransactionPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={transactionPage === totalPages}
                        />
                    </Pagination>
                </section>
            </div>
        </AdminLayout>
    );
};
