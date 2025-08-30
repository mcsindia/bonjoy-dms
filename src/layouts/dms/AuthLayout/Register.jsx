import React, { useState } from "react";
import { Form, Button, Container, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        mobile: "",
        email: "",
        password: "",
        mode: "Admin"
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            fullName: formData.name,
            mobile: formData.mobile,
            email: formData.email,
            password: formData.password,
            userType: formData.mode
        };

        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Registration successful:", data);
                navigate("/dms");
            } else {
                console.error("Registration failed:", data);
                alert(data.message || "Registration failed. Please try again.");
            }
        } catch (error) {
            console.error("Error during registration:", error);
            alert("An error occurred. Please try again later.");
        }
    };

    return (
        <div className="dms-auth-wrapper">
            <Container className="d-flex justify-content-center align-items-center vh-100">
                <Card className="p-4 shadow-sm" style={{ width: "400px", borderRadius: "10px" }}>
                    <Card.Body>
                        <h3 className="text-center mb-3">Register Form</h3>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="dms-form-group">
                                <Form.Label>Name:</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="dms-form-group">
                                <Form.Label>Mobile:</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    placeholder="Enter your mobile number"
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="dms-form-group">
                                <Form.Label>Email:</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email address"
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="dms-form-group">
                                <Form.Label>Password:</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create a password"
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="dms-form-group">
                                <Form.Label>Mode:</Form.Label>
                                <Form.Select
                                    name="mode"
                                    value={formData.mode}
                                    onChange={handleChange}
                                >
                                    <option value="Admin">Admin</option>
                                    <option value="Employee">Employee</option>
                                </Form.Select>
                            </Form.Group>

                            <div className="d-flex justify-content-between mt-3">
                                <Button type="submit">Submit</Button>
                                <Button type="cancel" onClick={() => navigate("/dms")}>Cancel</Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};
