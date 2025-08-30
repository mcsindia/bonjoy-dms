import React, { useState, useEffect } from 'react';
import { Button, Form, Container } from 'react-bootstrap';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';
import { useNavigate, useLocation } from 'react-router-dom';

export const CurrencyEdit = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Initial currency data from location state
    const [currency, setCurrency] = useState(location.state?.currency || {
        name: '',
        symbol: '',
        status: ''
    });

    useEffect(() => {
        if (!location.state?.currency) {
            navigate('/dms/currencies'); // Redirect if no currency data is passed
        }
    }, [location.state, navigate]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrency({ ...currency, [name]: value });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Currency updated:', currency);
        // Update logic (API call or state update)
        navigate('/dms/settings'); // Redirect to Currencies List after editing
    };

    return (
        <AdminLayout>
            <Container className='dms-container'>
                <h3>Edit Currency</h3>
                <div className='dms-form-container'>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className='dms-form-group' controlId="name">
                            <Form.Label>Currency Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={currency.name}
                                onChange={handleChange}
                                placeholder="Enter currency name"
                                required
                            />
                        </Form.Group>

                        <Form.Group className='dms-form-group' controlId="symbol">
                            <Form.Label>Currency Symbol</Form.Label>
                            <Form.Control
                                type="text"
                                name="symbol"
                                value={currency.symbol}
                                onChange={handleChange}
                                placeholder="Enter currency symbol"
                                required
                            />
                        </Form.Group>

                        <Form.Group className='dms-form-group' controlId="status">
                            <Form.Label>Status</Form.Label>
                            <Form.Select
                                name="status"
                                value={currency.status}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </Form.Select>
                        </Form.Group>

                        <div className='save-and-cancel-btn'>
                            <Button type="submit">
                                Save changes
                            </Button>
                            <Button
                                type='cancel'
                                className="ms-3"
                                onClick={() => navigate('/dms/settings')}
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
