import React, { useState, useEffect } from 'react';
import { Button, Form, Container } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';

export const RidersEdit = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Initial rider data from location state
    const [rider, setRider] = useState(location.state?.rider || {
        user_id: '',
        name: '',
        phone_number: '',
        preferred_payment_method: '',
        loyalty_points: ''
    });

    useEffect(() => {
        if (!location.state?.rider) {
            navigate('/dms/riders'); // Redirect if no rider data is passed
        }
    }, [location.state, navigate]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setRider({ ...rider, [name]: value });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // Update logic (API call or state update)
        navigate('/dms/riders'); // Redirect to Riders List after editing
    };

    return (
        <AdminLayout>
            <Container className='dms-container'>
                <h4>Edit Rider</h4>
                <div className='dms-form-container'>
                    <Form onSubmit={handleSubmit}>
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

                        <Form.Group className="dms-form-group" controlId="first_name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="first_name"
                                value={rider.riderName}
                                onChange={handleChange}
                                placeholder="Enter name"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="dms-form-group" controlId="phone_number">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                                type="text"
                                name="phone_number"
                                value={rider.rider_mobile}
                                onChange={handleChange}
                                placeholder="Enter phone number"
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

                        <Form.Group className="dms-form-group" controlId="loyalty_points">
                            <Form.Label>Loyalty Points</Form.Label>
                            <Form.Control
                                type="number"
                                name="loyalty_points"
                                value={rider.wallet}
                                onChange={handleChange}
                                placeholder="Enter loyalty points"
                                required
                            />
                        </Form.Group>
                        <div className='save-and-cancel-btn'>
                            <Button type="submit" className="me-2">
                                Update Rider
                            </Button>
                            <Button
                                type='cancel'
                                onClick={() => navigate('/dms/riders')}
                            >
                                Cancel
                            </Button>
                        </div>
                    </Form>
                </div>
            </Container>
        </AdminLayout>
    );
};
