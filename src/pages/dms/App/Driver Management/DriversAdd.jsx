import React, { useEffect, useState } from 'react';
import { Button, Form, Container } from 'react-bootstrap';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const DriversAdd = () => {
    const [imageFile, setImageFile] = useState(null);
    const [userList, setUserList] = useState([]);
    const [vehicleList, setVehicleList] = useState([]);
    const [driver, setDriver] = useState({
        driverId: '',
        fullName: '',
        age: '',
        city: '',
        pinCode: '',
        permanentAddress: '',
        temporaryAddress: '',
        WorkingCity: '',
        vehicleId: '',
        userProfile: '',
        accountStatus: 'Pending',
        rideStatus: 'Offline',
        ratings: '',
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/getAllDrivers`);

                if (!res.ok) {
                    throw new Error('Failed to fetch drivers');
                }

                const result = await res.json();

                const drivers = result?.data;

                if (Array.isArray(drivers)) {
                    setUserList(drivers); // Set the drivers state if it's an array
                } else {
                    console.error('Drivers list is not an array:', drivers);
                }
            } catch (err) {
                console.error('Failed to fetch drivers:', err);
            }
        };

        const fetchVehicles = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/getAllVehicles`);
                if (!res.ok) {
                    throw new Error('Failed to fetch vehicles');
                }

                const result = await res.json();
                const vehicles = result?.data?.data; // Nested data.data

                if (Array.isArray(vehicles)) {
                    setVehicleList(vehicles);
                } else {
                    console.error('Vehicles list is not an array:', vehicles);
                }
            } catch (err) {
                console.error('Failed to fetch vehicles:', err);
            }
        };

        fetchDrivers();
        fetchVehicles();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDriver({ ...driver, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('driverId', driver.driverId);
        formData.append('vehicleId', driver.vehicleId);
        formData.append('fullName', driver.fullName);
        formData.append('age', driver.age);
        formData.append('city', driver.city);
        formData.append('pinCode', driver.pinCode);
        formData.append('permanentAddress', driver.permanentAddress);
        formData.append('temporaryAddress', driver.temporaryAddress);
        formData.append('WorkingCity', driver.WorkingCity);
        formData.append('accountStatus', driver.accountStatus);
        formData.append('rideStatus', driver.rideStatus);
        formData.append('userProfile', imageFile);
        formData.append('created_at', new Date().toISOString());
        formData.append('ratings', driver.ratings);

        try {
            const response = await fetch(`${API_BASE_URL}/createDriverProfile`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Driver created successfully:', data);
                navigate('/dms/drivers');
            } else {
                console.error('Error creating driver:', data.message || data);
                alert('Failed to add driver: ' + (data.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Network error:', error);
            alert('Network error occurred while adding driver.');
        }
    };

    return (
        <AdminLayout>
            <Container className='dms-container'>
                <h4>Add New Driver</h4>
                <div className='dms-form-container'>
                    <Form onSubmit={handleSubmit}>
                        {/* Driver ID Dropdown */}
                        <Form.Group className="dms-form-group" controlId="driverId">
                            <Form.Label>Select Driver</Form.Label>
                            <Form.Select
                                name="driverId"
                                value={driver.driverId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select a Driver</option>
                                {userList.map((driver) => (
                                    <option key={driver.id} value={driver.id}>
                                        Driver {driver.id}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        {/* Vehicle ID */}
                        <Form.Group className="dms-form-group" controlId="vehicleId">
                            <Form.Label>Select Vehicle</Form.Label>
                            <Form.Select
                                name="vehicleId"
                                value={driver.vehicleId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select a Vehicle</option>
                                {vehicleList.map((vehicle) => (
                                    <option key={vehicle.id} value={vehicle.id}>
                                        {vehicle.registrationNumber || `Vehicle #${vehicle.id}`}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        {/* Profile Picture Upload */}
                        <Form.Group className="dms-form-group" controlId="userProfile">
                            <Form.Label>Upload Profile Picture</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImageFile(e.target.files[0])}
                                required
                            />
                        </Form.Group>

                        {/* Rest of the fields */}
                        <Form.Group className="dms-form-group" controlId="fullName">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="fullName"
                                value={driver.fullName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="dms-form-group" controlId="age">
                            <Form.Label>Age</Form.Label>
                            <Form.Control
                                type="number"
                                name="age"
                                value={driver.age}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="dms-form-group" controlId="city">
                            <Form.Label>City</Form.Label>
                            <Form.Control
                                type="text"
                                name="city"
                                value={driver.city}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="dms-form-group" controlId="pinCode">
                            <Form.Label>Pin Code</Form.Label>
                            <Form.Control
                                type="text"
                                name="pinCode"
                                value={driver.pinCode}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="dms-form-group" controlId="permanentAddress">
                            <Form.Label>Permanent Address</Form.Label>
                            <Form.Control
                                type="text"
                                name="permanentAddress"
                                value={driver.permanentAddress}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="dms-form-group" controlId="temporaryAddress">
                            <Form.Label>Temporary Address</Form.Label>
                            <Form.Control
                                type="text"
                                name="temporaryAddress"
                                value={driver.temporaryAddress}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="dms-form-group" controlId="WorkingCity">
                            <Form.Label>Working City</Form.Label>
                            <Form.Control
                                type="text"
                                name="WorkingCity"
                                value={driver.WorkingCity}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="dms-form-group" controlId="ratings">
                            <Form.Label>Rating (1 to 5)</Form.Label>
                            <Form.Control
                                type="text"
                                name="ratings"
                              
                                value={driver.ratings}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <div className='save-and-cancel-btn'>
                            <Button type="submit">Save Changes</Button>
                            <Button className="ms-3" type="cancel" onClick={() => navigate('/dms/drivers')}>
                                Cancel
                            </Button>
                        </div>
                    </Form>
                </div>
            </Container>
        </AdminLayout>
    );
};
