import React, { useState } from "react";
import { Form, Button, Container, Card, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ForgetPassword = () => {
    const [mobile, setMobile] = useState(""); // using mobile instead of email
    const [showModal, setShowModal] = useState(false);
    const [otp, setOtp] = useState(null);
    const navigate = useNavigate();

    const handleReset = async (e) => {
        e.preventDefault();

        const payload = { mobile };

        try {
            const response = await fetch(`${API_BASE_URL}/forgotPassword`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                console.log("OTP sent successfully:", data.otp);
                setOtp(data.otp); // show OTP in modal
                setShowModal(true);
            } else {
                console.error("Reset failed:", data);
                alert(data.message || "Failed to send OTP.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong. Please try again later.");
        }
    };

    const handleConfirmOtp = () => {
        setShowModal(false);
        navigate("/dms/new-password", { state: { mobile, otp } });
    };

    return (
        <div className="dms-auth-wrapper">
            <Container className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#f7f7f7" }}>
                <Card className="p-4 shadow-sm" style={{ width: "350px", borderRadius: "10px" }}>
                    <Card.Body>
                        <h4 className="text-center mb-4">Forgot Password</h4>
                        <p className="text-center text-muted">
                            Enter your registered mobile number.
                        </p>
                        <Form onSubmit={handleReset}>
                            <Form.Group className='dms-form-group'>
                                <Form.Label>Mobile</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your mobile"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Button type="submit" className="w-100 mb-2">
                                Send OTP
                            </Button>
                            <Button
                                variant="secondary"
                                className="w-100"
                                onClick={() => navigate("/dms")}
                            >
                                Back
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>

            {/* OTP Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>OTP Sent</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>OTP has been sent successfully.</p>
                    <h5 className="text-center">{otp}</h5>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleConfirmOtp}>
                        Continue
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};
