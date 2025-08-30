import React, { useState, useEffect } from "react";
import { Form, Button, Container, Card, Modal } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const OTP = () => {
    const [mobile, setMobile] = useState("");
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [apiError, setApiError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const userType = location.state?.userType || "admin";

    const [otp, setOtp] = useState(["", "", "", ""]);
    const [otpSent, setOtpSent] = useState(false);

    useEffect(() => {
        setOtpSent(false);
    }, []);

   const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/\D/, ""); // Only digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
    }
};

    const handleBackspace = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    const handlePaste = (e) => {
        const pasted = e.clipboardData.getData("Text").slice(0, 4).split("");
        const newOtp = [...otp];

        pasted.forEach((digit, i) => {
            if (i < 4) newOtp[i] = digit;
        });

        setOtp(newOtp);

        const nextInput = document.getElementById(`otp-${pasted.length - 1}`);
        if (nextInput) nextInput.focus();
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();

        const payload = {
            mobile,
            otpType: "reset_password",
            userType,
        };

        try {
            const response = await fetch(`${API_BASE_URL}/sendOtp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                setShowOtpModal(true);
                setOtpSent(true); // mark OTP sent
            } else {
                setApiError(data.message || "Failed to send OTP.");
            }
        } catch (err) {
            console.error(err);
            setApiError("Something went wrong. Please try again later.");
        }
    };

    const handleResendOtp = async () => {
        if (!otpSent) return; 

        const payload = {
            mobile,
            otpType: "reset_password",
            userType,
        };

        try {
            const response = await fetch(`${API_BASE_URL}/sendOtp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                setApiError(data.message || "Failed to resend OTP.");
            }
        } catch (err) {
            console.error(err);
            setApiError("Something went wrong while resending OTP.");
        }
    };

    const handleVerifyOtp = async () => {
        const fullOtp = otp.join(""); // e.g. "5052"

        if (fullOtp.length < 4) {
            setApiError("Please enter all 4 digits of the OTP.");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/verifyOtp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ mobile, otp: fullOtp }),
            });

            const data = await response.json();

            if (response.ok) {
                navigate("/new-password", { state: { mobile, userType } });
            } else {
                setApiError(data.message || "OTP verification failed.");
            }
        } catch (err) {
            console.error(err);
            setApiError("Something went wrong while verifying OTP.");
        }
    };

    return (
        <div className="dms-auth-wrapper">
            <Container className="d-flex justify-content-center align-items-center vh-100">
                <Card className="p-4 shadow-sm" style={{ width: "350px", borderRadius: "10px" }}>
                    <Card.Body>
                        <h4 className="text-center mb-3">Forget Password</h4>
                        <p className="text-muted text-center mb-4">Enter your mobile number</p>
                        <Form onSubmit={handleSendOtp}>
                            <Form.Group>
                                <Form.Label>Mobile Number</Form.Label>
                                <Form.Control
                                    type="tel"
                                    placeholder="Enter mobile"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            {apiError && <div className="text-danger mt-2">{apiError}</div>}

                            <Button type="submit" className="w-100 mt-3">
                                Send OTP
                            </Button>
                            <Button
                                variant="secondary"
                                className="w-100 mt-2"
                                onClick={() => navigate("/dms")}
                            >
                                Cancel
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>

            {/* OTP Modal */}
            <Modal show={showOtpModal} onHide={() => setShowOtpModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>OTP Sent</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="text-center">
                        We’ve sent an OTP to <strong>{mobile}</strong>
                    </p>

                    <Form>
                        <div className="d-flex justify-content-center gap-2">
                            {otp.map((digit, index) => (
                                <Form.Control
                                    key={index}
                                    id={`otp-${index}`}
                                    type="text"
                                    maxLength="1"
                                    className="text-center"
                                    style={{ width: "45px", fontSize: "1.25rem" }}
                                    value={otp[index]}
                                    onChange={(e) => handleOtpChange(e, index)}
                                    onKeyDown={(e) => handleBackspace(e, index)}
                                    onPaste={(e) => handlePaste(e)}
                                />
                            ))}
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-between">
                    <Button variant="link" className="p-0 text-decoration-none text-dark" onClick={handleResendOtp}>
                        Resend OTP
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleVerifyOtp}
                    >
                        Verify
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};
