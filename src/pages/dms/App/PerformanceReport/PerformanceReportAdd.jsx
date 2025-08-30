import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';

export const PerformanceReportAdd = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        user_id: '',
        user_type: 'Driver',
        total_trips: '',
        completed_trips: '',
        canceled_trips: '',
        response_time: '',
        average_rating: '',
        total_reviews: '',
        late_pickups: '',
        earnings_generated: '',
        distance_traveled: '',
        loyalty_status: 'Bronze',
        report_date: '',
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
        console.log('Performance Report Added:', formData);
        navigate('/dms/performance-reports');
    };

    return (
        <AdminLayout>
            <div className='dms-container'>
                <h4>Add Performance Report</h4>
                <div className='dms-form-container'>
                    {error && <Alert variant='danger' onClose={() => setError('')} dismissible>{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className='dms-form-group'>
                            <Form.Label>User ID</Form.Label>
                            <Form.Control type='text' name='user_id' placeholder='Enter User ID' value={formData.user_id} onChange={handleChange} required />
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
                            <Form.Control type='number' name='total_trips' placeholder='Enter Total Trips' value={formData.total_trips} onChange={handleChange} required />
                        </Form.Group>

                        <Form.Group className='dms-form-group'>
                            <Form.Label>Completed Trips</Form.Label>
                            <Form.Control type='number' name='completed_trips' placeholder='Enter Completed Trips' value={formData.completed_trips} onChange={handleChange} required />
                        </Form.Group>

                        <Form.Group className='dms-form-group'>
                            <Form.Label>Canceled Trips</Form.Label>
                            <Form.Control type='number' name='canceled_trips' placeholder='Enter Canceled Trips' value={formData.canceled_trips} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group className='dms-form-group'>
                            <Form.Label>Response Time</Form.Label>
                            <Form.Control type='text' name='response_time' placeholder='Enter Response Time' value={formData.response_time} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group className='dms-form-group'>
                            <Form.Label>Average Rating</Form.Label>
                            <Form.Control type='number' step='0.1' name='average_rating' placeholder='Enter Average Rating' value={formData.average_rating} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group className='dms-form-group'>
                            <Form.Label>Total Reviews</Form.Label>
                            <Form.Control type='number' name='total_reviews' placeholder='Enter Total Reviews' value={formData.total_reviews} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group className='dms-form-group'>
                            <Form.Label>Late Pickups</Form.Label>
                            <Form.Control type='number' name='late_pickups' placeholder='Enter Late Pickups' value={formData.late_pickups} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group className='dms-form-group'>
                            <Form.Label>Earnings Generated</Form.Label>
                            <Form.Control type='number' name='earnings_generated' placeholder='Enter Earnings' value={formData.earnings_generated} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group className='dms-form-group'>
                            <Form.Label>Distance Traveled</Form.Label>
                            <Form.Control type='number' name='distance_traveled' placeholder='Enter Distance Traveled' value={formData.distance_traveled} onChange={handleChange} />
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
                            <Button type='submit' className='me-2'>Save Report</Button>
                            <Button type='cancel' onClick={() => navigate('/dms/performance-report')}>Cancel</Button>
                        </div>
                    </Form>
                </div>
            </div>
        </AdminLayout>
    );
};
