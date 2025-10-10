import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';

export const PerformanceReportEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { report } = location.state || {};

    const [formData, setFormData] = useState({
        user_id: report?.user_id || '',
        user_type: report?.user_type || 'Driver',
        total_trips: report?.total_trips || '',
        completed_trips: report?.completed_trips || '',
        canceled_trips: report?.canceled_trips || '',
        response_time: report?.response_time || '',
        average_rating: report?.average_rating || '',
        total_reviews: report?.total_reviews || '',
        late_pickups: report?.late_pickups || '',
        earnings_generated: report?.earnings_generated || '',
        distance_traveled: report?.distance_traveled || '',
        loyalty_status: report?.loyalty_status || 'Bronze',
        report_date: report?.report_date || '',
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.user_id || !formData.total_trips || !formData.completed_trips || !formData.report_date) {
            setError('All required fields must be filled.');
            return;
        }
        navigate('/dms/performance-report');
    };

    return (
        <AdminLayout>
            <div className='dms-container'>
                <h4>Edit Performance Report</h4>
                <div className='dms-form-container'>
                    {error && <Alert variant='danger' onClose={() => setError('')} dismissible>{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className='dms-form-group'>
                            <Form.Label>User ID</Form.Label>
                            <Form.Control type='text' name='user_id' value={formData.user_id} onChange={handleChange} required disabled />
                        </Form.Group>

                        <Form.Group className='dms-form-group'>
                            <Form.Label>User Type</Form.Label>
                            <Form.Select name='user_type' value={formData.user_type} onChange={handleChange} required>
                                <option value='Driver'>Driver</option>
                                <option value='Rider'>Rider</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className='dms-form-group'>
                            <Form.Label>Total Trips</Form.Label>
                            <Form.Control type='number' name='total_trips' value={formData.total_trips} onChange={handleChange} required />
                        </Form.Group>

                        <Form.Group className='dms-form-group'>
                            <Form.Label>Completed Trips</Form.Label>
                            <Form.Control type='number' name='completed_trips' value={formData.completed_trips} onChange={handleChange} required />
                        </Form.Group>

                        <Form.Group className='dms-form-group'>
                            <Form.Label>Canceled Trips</Form.Label>
                            <Form.Control type='number' name='canceled_trips' value={formData.canceled_trips} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group className='dms-form-group'>
                            <Form.Label>Response Time</Form.Label>
                            <Form.Control type='text' name='response_time' value={formData.response_time} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group className='dms-form-group'>
                            <Form.Label>Average Rating</Form.Label>
                            <Form.Control type='number' step='0.1' name='average_rating' value={formData.average_rating} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group className='dms-form-group'>
                            <Form.Label>Total Reviews</Form.Label>
                            <Form.Control type='number' name='total_reviews' value={formData.total_reviews} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group className='dms-form-group'>
                            <Form.Label>Late Pickups</Form.Label>
                            <Form.Control type='number' name='late_pickups' value={formData.late_pickups} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group className='dms-form-group'>
                            <Form.Label>Earnings Generated</Form.Label>
                            <Form.Control type='number' name='earnings_generated' value={formData.earnings_generated} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group className='dms-form-group'>
                            <Form.Label>Distance Traveled</Form.Label>
                            <Form.Control type='number' name='distance_traveled' value={formData.distance_traveled} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group className='dms-form-group'>
                            <Form.Label>Loyalty Status</Form.Label>
                            <Form.Select name='loyalty_status' value={formData.loyalty_status} onChange={handleChange} required>
                                <option value='Bronze'>Bronze</option>
                                <option value='Silver'>Silver</option>
                                <option value='Gold'>Gold</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className='dms-form-group'>
                            <Form.Label>Report Date</Form.Label>
                            <Form.Control type='date' name='report_date' value={formData.report_date} onChange={handleChange} required />
                        </Form.Group>

                        <div className='save-and-cancel-btn'>
                            <Button type='submit' className='me-2'>Save Changes</Button>
                            <Button type='cancel' onClick={() => navigate('/dms/performance-report')}>Cancel</Button>
                        </div>
                    </Form>
                </div>
            </div>
        </AdminLayout>
    );
};
