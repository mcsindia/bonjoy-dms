import React, { useState } from "react";
import { Form, Button, Container, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ForgetPassword = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleReset = async (e) => {
        e.preventDefault();

        const payload = { email };

        const token = JSON.parse(localStorage.getItem("userData"))?.token;
        try {
            const response = await fetch(`${API_BASE_URL}/forgotPassword`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,  // Add Bearer token to the headers
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Reset password link sent to:", email);
                alert("Reset password link sent to your email.");
                navigate("/reset-password");
            } else {
                console.error("Reset failed:", data);
                alert(data.message || "Failed to send reset link.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong. Please try again later.");
        }
    };

    return (
        <div className="dms-auth-wrapper">
            <Container className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#f7f7f7" }}>
                <Card className="p-4 shadow-sm" style={{ width: "350px", borderRadius: "10px" }}>
                    <Card.Body>
                        <h4 className="text-center mb-4">Forgot Password</h4>
                        <p className="text-center text-muted">
                            Enter your email to reset your password.
                        </p>
                        <Form onSubmit={handleReset}>
                            <Form.Group className='dms-form-group'>
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Button type="submit" className="w-100 mb-2">
                                Reset
                            </Button>
                            <Button
                                type="cancel"
                                className="w-100"
                                onClick={() => navigate("/dms")}
                            >
                                Back
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};
