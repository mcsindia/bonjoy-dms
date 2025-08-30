import React, { useState } from 'react';
import { Table, Pagination, Form, InputGroup, Button } from 'react-bootstrap';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';
import { useNavigate } from 'react-router-dom';

/* Example data */
const rideHistoryData = [
    { tripId: 'TRIP001', driverId: 'DRV001', riderId: 'RID001', date: '2023-12-18', time: '5:00 PM', pickup: 'Main Street', drop: 'Park Avenue', fare: 15, paymentMode: 'Cash' },
    { tripId: 'TRIP002', driverId: 'DRV002', riderId: 'RID002', date: '2023-12-17', time: '7:30 PM', pickup: '5th Avenue', drop: 'Central Park', fare: 20, paymentMode: 'Card' },
    { tripId: 'TRIP003', driverId: 'DRV003', riderId: 'RID003', date: '2023-12-16', time: '9:30 AM', pickup: 'Market Square', drop: 'Beach Road', fare: 25, paymentMode: 'Wallet' },
    { tripId: 'TRIP004', driverId: 'DRV004', riderId: 'RID004', date: '2023-12-14', time: '11:00 AM', pickup: 'Broadway', drop: 'Ocean Drive', fare: 30, paymentMode: 'Cash' },
    { tripId: 'TRIP005', driverId: 'DRV005', riderId: 'RID005', date: '2023-12-12', time: '5:00 PM', pickup: 'King Street', drop: 'Downtown', fare: 22, paymentMode: 'Card' },
    { tripId: 'TRIP006', driverId: 'DRV006', riderId: 'RID006', date: '2023-12-10', time: '7:30 PM', pickup: 'Pine Road', drop: 'Airport', fare: 18, paymentMode: 'Wallet' },
    { tripId: 'TRIP007', driverId: 'DRV007', riderId: 'RID007', date: '2023-12-08', time: '5:00 PM', pickup: 'Main Street', drop: 'Park Avenue', fare: 15, paymentMode: 'Cash' },
    { tripId: 'TRIP008', driverId: 'DRV008', riderId: 'RID008', date: '2023-12-06', time: '9:30 AM', pickup: '5th Avenue', drop: 'Central Park', fare: 20, paymentMode: 'Card' },
    { tripId: 'TRIP009', driverId: 'DRV009', riderId: 'RID009', date: '2023-12-04', time: '5:00 PM', pickup: 'Market Square', drop: 'Beach Road', fare: 25, paymentMode: 'Wallet' },
    { tripId: 'TRIP010', driverId: 'DRV010', riderId: 'RID010', date: '2023-12-02', time: '7:30 PM', pickup: 'Broadway', drop: 'Ocean Drive', fare: 30, paymentMode: 'Cash' },
    { tripId: 'TRIP011', driverId: 'DRV011', riderId: 'RID011', date: '2023-12-01', time: '11:00 AM', pickup: 'King Street', drop: 'Downtown', fare: 22, paymentMode: 'Card' },
    { tripId: 'TRIP012', driverId: 'DRV012', riderId: 'RID012', date: '2023-11-29', time: '9:30 AM', pickup: 'Pine Road', drop: 'Airport', fare: 18, paymentMode: 'Wallet' },
    { tripId: 'TRIP013', driverId: 'DRV013', riderId: 'RID013', date: '2023-11-28', time: '5:00 PM', pickup: 'Main Street', drop: 'Park Avenue', fare: 15, paymentMode: 'Cash' },
    { tripId: 'TRIP014', driverId: 'DRV014', riderId: 'RID014', date: '2023-11-27', time: '11:00 AM', pickup: '5th Avenue', drop: 'Central Park', fare: 20, paymentMode: 'Card' },
    { tripId: 'TRIP015', driverId: 'DRV015', riderId: 'RID015', date: '2023-11-26', time: '7:30 PM', pickup: 'Market Square', drop: 'Beach Road', fare: 25, paymentMode: 'Wallet' },
];

export const RiderHistoryList = () => {
    const [rideHistoryPage, setRideHistoryPage] = useState(1);
    const [filteredRides, setFilteredRides] = useState(rideHistoryData);
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const navigate = useNavigate();
    const [rideCount, setRideCount] = useState(0);
    const totalRides = rideCount.length;
    const itemsPerPage = 15;

    // Handle search change
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        filterData(e.target.value, dateFrom, dateTo);
    };

    // Handle date change
    const handleDateChange = (e, setDate) => {
        setDate(e.target.value);
        filterData(searchQuery, e.target.name === 'dateFrom' ? e.target.value : dateFrom, e.target.name === 'dateTo' ? e.target.value : dateTo);
    };

    // Filter the data based on the search query and date range
    const filterData = (query, from, to) => {
        let filtered = rideHistoryData;

        if (query) {
            filtered = filtered.filter(ride =>
                ride.tripId.toLowerCase().includes(query.toLowerCase()) ||
                ride.driverId.toLowerCase().includes(query.toLowerCase()) ||
                ride.riderId.toLowerCase().includes(query.toLowerCase())
            );
        }

        if (from) {
            filtered = filtered.filter(ride => new Date(ride.date) >= new Date(from));
        }

        if (to) {
            filtered = filtered.filter(ride => new Date(ride.date) <= new Date(to));
        }

        setFilteredRides(filtered);
        setRideHistoryPage(1); // Reset to first page after filtering
    };

    // Paginate the filtered data
    const paginate = (data, currentPage) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return data.slice(startIndex, endIndex);
    };

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setRideHistoryPage(pageNumber);
    };

    return (
        <AdminLayout>
            <div className="dms-pages-header sticky-header">
                <div className='live-count'>
                    <h3>Riders Ride History</h3>
                    <div className="live-count-container">
                        <Button className='green-button'>
                        🧍 Riders: {totalRides} 15
                        </Button>
                    </div>
                </div>

                <div className="filter-search-container">
                    <Form.Control
                        type="date"
                        name="dateFrom"
                        className="me-2"
                        value={dateFrom}
                        onChange={(e) => handleDateChange(e, setDateFrom)}
                    />
                    <Form.Control
                        type="date"
                        name="dateTo"
                        value={dateTo}
                        onChange={(e) => handleDateChange(e, setDateTo)}
                    />
                    <InputGroup className="me-2">
                        <Form.Control
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </InputGroup>
                </div>
            </div>

            {/* Ride History Table */}
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Trip ID</th>
                        <th>Driver ID</th>
                        <th>Date & Time</th>
                        <th>Pickup</th>
                        <th>Drop</th>
                        <th>Fare</th>
                        <th>Payment Mode</th>
                    </tr>
                </thead>
                <tbody>
                    {paginate(filteredRides, rideHistoryPage).map((ride, index) => (
                        <tr key={index}>
                            <td>
                                <a href="#" role="button" className='trip-id-link' onClick={() => navigate('/dms/trip/details', { state: { trip: ride } })}>
                                    {ride.tripId}
                                </a>
                            </td>
                            <td>
                                <a href={`/dms/drivers/details/view`} className="driver-id-link">
                                    {ride.driverId}
                                </a>
                            </td>
                            <td>{ride.date} <br /> {ride.time}</td>
                            <td>{ride.pickup}</td>
                            <td>{ride.drop}</td>
                            <td>₹{ride.fare}</td>
                            <td>{ride.paymentMode}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Pagination */}
            <Pagination className="justify-content-center">
                <Pagination.Prev
                    onClick={() => handlePageChange(rideHistoryPage - 1)}
                    disabled={rideHistoryPage === 1}
                />
                {[...Array(Math.ceil(filteredRides.length / itemsPerPage))].map((_, idx) => (
                    <Pagination.Item
                        key={idx + 1}
                        active={idx + 1 === rideHistoryPage}
                        onClick={() => handlePageChange(idx + 1)}
                    >
                        {idx + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next
                    onClick={() => handlePageChange(rideHistoryPage + 1)}
                    disabled={rideHistoryPage === Math.ceil(filteredRides.length / itemsPerPage)}
                />
            </Pagination>
        </AdminLayout>
    );
};
