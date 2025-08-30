import React, { useState, useEffect } from 'react';
import { Button, Form, Container } from 'react-bootstrap';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';
import { useNavigate, useLocation } from 'react-router-dom';

export const CountryEdit = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Initial country data from location state
    const [country, setCountry] = useState(location.state?.country || {
        name: '',
        code: '',
        status: ''
    });

    useEffect(() => {
        if (!location.state?.country) {
            navigate('/dms/countries'); // Redirect if no country data is passed
        }
    }, [location.state, navigate]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCountry({ ...country, [name]: value });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Country updated:', country);
        // Update logic (API call or state update)
        navigate('/dms/settings'); // Redirect to Countries List after editing
    };

    return (
        <AdminLayout>
            <Container className='dms-container'>
                <h3>Edit Country</h3>

                <div className='dms-form-container'>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className='dms-form-group' controlId="name">
                            <Form.Label>Country Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={country.name}
                                onChange={handleChange}
                                placeholder="Enter country name"
                                required
                            />
                        </Form.Group>

                        <Form.Group className='dms-form-group' controlId="code">
                            <Form.Label>Country Code</Form.Label>
                            <Form.Control
                                type="text"
                                name="code"
                                value={country.code}
                                onChange={handleChange}
                                placeholder="Enter country code"
                                required
                            />
                        </Form.Group>

                        <Form.Group className='dms-form-group' controlId="status">
                            <Form.Label>Status</Form.Label>
                            <Form.Select
                                name="status"
                                value={country.status}
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
