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

    const mobile = location.state?.mobile;
    const otp = location.state?.otp;

    console.log("Mobile:", mobile, "OTP:", otp);

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("New Password:", newPassword);
        console.log("Confirm Password:", confirmPassword);
        console.log("State from location:", location.state); // Check if mobile and otp are coming
        console.log("Mobile:", mobile);
        console.log("OTP:", otp);

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        if (!mobile || !otp) {
            alert("Missing mobile or OTP. Please restart the reset process.");
            return;
        }

        const payload = {
            newPassword,
            confirmPassword,
            otp: String(otp),
            mobile: String(mobile)
        };

        console.log("Payload to send:", payload); // Debug payload

        setLoading(true);

        try {
            const response = await axios.post(`${API_BASE_URL}/resetPassword`, payload, {
                headers: { "Content-Type": "application/json" }
            });

            console.log("API response:", response.data); // Debug API response

            if (response.data.success) {
                alert("Password reset successful. Please log in with your new password.");
                navigate("/dms");
            } else {
                alert(response.data.message || "Password reset failed.");
            }
        } catch (error) {
            console.error("Reset API error:", error.response?.data || error.message);
            alert(error.response?.data?.message || "An error occurred while resetting the password.");
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
