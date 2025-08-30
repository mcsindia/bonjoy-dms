import React, { useState } from "react";
import { Form, Button, Container, Card } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const NewPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const token = location.state?.token;
    console.log("Token from location state:", token);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        if (!token) {
            alert("Invalid or missing token.");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                `${API_BASE_URL}/resetPassword`,
                {
                    token,
                    newPassword,
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
            console.log("Extracted token from URL:", token);

            if (response.data.success) {
                alert("Password reset successful. Please log in with your new password.");
                navigate("/dms");
            } else {
                alert(response.data.message || "Password reset failed.");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred while resetting the password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dms-auth-wrapper">
            <Container className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#f7f7f7" }}>
                <Card className="p-4 shadow-sm" style={{ width: "350px", borderRadius: "10px" }}>
                    <Card.Body>
                        <h4 className="text-center mb-4">Create New Password</h4>
                        <p className="text-center text-muted">
                            Enter a new password to reset your account.
                        </p>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="dms-form-group mb-3">
                                <Form.Label>New Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="dms-form-group mb-3">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Button type="submit" className="w-100 mb-2" disabled={loading}>
                                {loading ? "Submitting..." : "Submit"}
                            </Button>

                            <Button variant="secondary" className="w-100" onClick={() => navigate("/dms")}>
                                Back
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};
