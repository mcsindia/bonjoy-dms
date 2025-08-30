import React, { useState } from 'react';
import { Button, Form, Container } from 'react-bootstrap';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';
import { useNavigate } from 'react-router-dom';

export const RidersAdd = () => {
    const [rider, setRider] = useState({
        riderName: '',
        user_id: '',
        rider_mobile: '',
        preferred_payment_method: '',
        wallet: '',
        status: 'Active'
    });

    const navigate = useNavigate();

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setRider({ ...rider, [name]: value });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Rider added:', rider);
        navigate('/dms/riders'); // Redirect to Riders List after adding
    };

    return (
        <AdminLayout>
            <Container className='dms-container'>
                <h4>Add New Rider</h4>
                <div className='dms-form-container'>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="dms-form-group" controlId="riderName">
                            <Form.Label>Rider Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="riderName"
                                value={rider.riderName}
                                onChange={handleChange}
                                placeholder="Enter rider name"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="dms-form-group" controlId="user_id">
                            <Form.Label>User ID</Form.Label>
                            <Form.Control
                                type="text"
                                name="user_id"
                                value={rider.user_id}
                                onChange={handleChange}
                                placeholder="Enter user ID"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="dms-form-group" controlId="rider_mobile">
                            <Form.Label>Mobile Number</Form.Label>
                            <Form.Control
                                type="text"
                                name="rider_mobile"
                                value={rider.rider_mobile}
                                onChange={handleChange}
                                placeholder="Enter mobile number"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="dms-form-group" controlId="preferred_payment_method">
                            <Form.Label>Preferred Payment Method</Form.Label>
                            <Form.Select
                                name="preferred_payment_method"
                                value={rider.preferred_payment_method}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Payment Method</option>
                                <option value="Card">Card</option>
                                <option value="Cash">Cash</option>
                                <option value="Bank Transfer">Bank Transfer</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="dms-form-group" controlId="wallet">
                            <Form.Label>Wallet Balance (₹)</Form.Label>
                            <Form.Control
                                type="text"
                                name="wallet"
                                value={rider.wallet}
                                onChange={handleChange}
                                placeholder="Enter wallet balance"
                                required
                            />
                        </Form.Group>

                        <div className="save-and-cancel-btn">
                        <Button type="submit" className='me-2'>Add Rider</Button>
                        <Button type='cancel' onClick={() => navigate('/dms/riders')}>Cancel</Button>
                   </div>
                    </Form>
                </div>
            </Container>
        </AdminLayout>
    );
};
