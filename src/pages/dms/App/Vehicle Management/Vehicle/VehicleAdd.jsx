import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const VehicleAdd = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        driverId: '',
        type: '',
        category: '',
        brandId: '',
        modelId: '',
        fuelType: '',
        registrationNumber: '',
        registrationDate: ''
    });

    const [drivers, setDrivers] = useState([]);
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch driver list
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get all drivers
                const driverRes = await axios.get(`${API_BASE_URL}/getAllDriverProfiles`);
                if (Array.isArray(driverRes.data.data.data)) {
                    setDrivers(driverRes.data.data.data);
                } else {
                    setError('No drivers found.');
                }

                // Get all brands
                const brandRes = await axios.get(`${API_BASE_URL}/getAllBrands`);
                if (Array.isArray(brandRes.data.data.data)) {
                    setBrands(brandRes.data.data.data);
                } else {
                    setError('No brands found.');
                }

                // Get all models
                const modelRes = await axios.get(`${API_BASE_URL}/getAllModels`);
                if (Array.isArray(modelRes.data.data.models)) {
                    setModels(modelRes.data.data.models);
                } else {
                    setError('No models found.');
                }

            } catch (err) {
                setError('Failed to fetch data.');
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        const preparedData = {
            ...formData,
            driverId: parseInt(formData.driverId),
            brandId: parseInt(formData.brandId),
            modelId: parseInt(formData.modelId),
        };

        try {
            const response = await axios.post(`${API_BASE_URL}/createVehicle`, preparedData);
            setSuccessMessage('Vehicle added successfully!');
            setFormData({
                driverId: '',
                type: '',
                category: '',
                brandId: '',
                modelId: '',
                fuelType: '',
                registrationNumber: '',
                registrationDate: '',
                status: ''
            });

            // Redirect to /vehicle/master after successful vehicle addition
            navigate("/dms/vehicle/master");

        } catch (err) {
            setError('Failed to add vehicle.');
        }
    };

    return (
        <AdminLayout>
            <div className="dms-container">
                <h4>Add New Vehicle</h4>
                <div className="dms-form-container">
                    <Form onSubmit={handleSubmit}>
                        {error && <div className="alert alert-danger">{error}</div>}
                        {successMessage && <div className="alert alert-success">{successMessage}</div>}

                        {/* Driver ID */}
                        <Form.Group className="dms-form-group" controlId="driverId">
                            <Form.Label>Driver</Form.Label>
                            <Form.Control
                                as="select"
                                name="driverId"
                                value={formData.driverId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Driver</option>
                                {drivers.map((driver) => (
                                    <option key={driver.id} value={driver.id}>
                                        {driver.fullName}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        {/* Vehicle Type */}
                        <Form.Group className="dms-form-group" controlId="type">
                            <Form.Label>Vehicle Type</Form.Label>
                            <Form.Control
                                type="text"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                placeholder="Enter Vehicle Type"
                                required
                            />
                        </Form.Group>

                        {/* Category */}
                        <Form.Group className="dms-form-group" controlId="category">
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                placeholder="Enter Category"
                                required
                            />
                        </Form.Group>

                        {/* Brand */}
                        <Form.Group className="dms-form-group" controlId="brandId">
                            <Form.Label>Brand</Form.Label>
                            <Form.Control
                                as="select"
                                name="brandId"
                                value={formData.brandId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Brand</option>
                                {brands.map((brand) => (
                                    <option key={brand.id} value={brand.id}>
                                        {brand.brandName}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        {/* Model */}
                        <Form.Group className="dms-form-group" controlId="modelId">
                            <Form.Label>Model</Form.Label>
                            <Form.Control
                                as="select"
                                name="modelId"
                                value={formData.modelId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Model</option>
                                {models.map((model) => (
                                    <option key={model.id} value={model.id}>
                                        {model.modelName}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        {/* Fuel Type */}
                        <Form.Group className="dms-form-group" controlId="fuelType">
                            <Form.Label>Fuel Type</Form.Label>
                            <Form.Control
                                type="text"
                                name="fuelType"
                                value={formData.fuelType}
                                onChange={handleChange}
                                placeholder="Enter Fuel Type"
                                required
                            />
                        </Form.Group>

                        {/* Registration Number */}
                        <Form.Group className="dms-form-group" controlId="registrationNumber">
                            <Form.Label>Registration Number</Form.Label>
                            <Form.Control
                                type="text"
                                name="registrationNumber"
                                value={formData.registrationNumber}
                                onChange={handleChange}
                                placeholder="Enter Registration Number"
                                required
                            />
                        </Form.Group>

                        {/* Registration Date */}
                        <Form.Group className="dms-form-group" controlId="registrationDate">
                            <Form.Label>Registration Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="registrationDate"
                                value={formData.registrationDate}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        {/* Submit Button */}
                        <Button type="submit">Save Changes</Button>
                        <Button type="cancel" className="ms-2" onClick={() => navigate("/dms/vehicle/master")}>
                            Cancel
                        </Button>
                    </Form>
                </div>
            </div>
        </AdminLayout>
    );
};
