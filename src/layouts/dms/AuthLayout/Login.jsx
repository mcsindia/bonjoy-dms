import React, { useState } from "react";
import { Form, Button, Container, Card, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const Login = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [userType, setUserType] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [savePassword, setSavePassword] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus to next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

      if (email.length !== 10) {
    alert("Enter a valid mobile number.");
    return;
  }

    const payload = {
      email,
      password,
      ip_address: "123.879.879.346",
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/login`, payload);
      const data = response.data;

      if (data.user) {
        setShowOTPModal(true);
      } else {
        alert("Login failed: No user found in response");
      }
    } catch (error) {
      console.error("Login error:", error.response);
      alert(error.response?.data?.message || "Login failed.");
    }
  };

  const handleVerifyOTP = async () => {
    const fullOtp = otp.join("");
    if (fullOtp.length < 4) {
      alert("Please enter the complete OTP.");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/verifyOtp`, {
        mobile: email,
        otp: fullOtp,
        ip_address: "123.879.879.346"
      });

      const user = response?.data?.user;
      if (user && user.token) {
        localStorage.setItem("userData", JSON.stringify(user));

        const userType = user?.userType;
        const employeeRole = Array.isArray(user?.employeeRole)
          ? user.employeeRole
          : [user.employeeRole];

        if (userType === "Admin") {
          navigate("/dms/dashboard");
        } else {
          const allModules = employeeRole.flatMap(role =>
            role?.childMenus?.flatMap(child => child.modules || []) || []
          );

          const hasDashboardAccess = allModules.some(mod =>
            mod?.moduleUrl?.toLowerCase() === "dashboard" &&
            mod?.permission?.toLowerCase().split(",").map(p => p.trim()).includes("view")
          );

          if (hasDashboardAccess) {
            navigate("/dms/dashboard");
          } else {
            const firstAccessible = allModules.find(mod =>
              mod?.moduleUrl &&
              mod?.permission?.toLowerCase().split(",").map(p => p.trim()).includes("view")
            );
            if (firstAccessible) {
              navigate(`/dms/${firstAccessible.moduleUrl.toLowerCase()}`);
            } else {
              navigate("/unauthorized");
            }
          }
        }

        setShowOTPModal(false);
      } else {
        alert("Invalid response. User not found.");
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
      alert(error.response?.data?.message || "Failed to verify OTP.");
    }
  };

  return (
    <div className="dms-auth-wrapper">
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Card className="p-4 shadow-sm" style={{ width: "350px", borderRadius: "10px" }}>
          <Card.Body>
            <h3 className="text-center mb-2">Bonjoy</h3>
            <p className="text-center text-muted mb-4">Sign in to access your account</p>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="dms-form-group">
                <Form.Label>User Type</Form.Label>
                <Form.Select value={userType} onChange={(e) => setUserType(e.target.value)}>
                  <option value="Admin">Admin</option>
                  <option value="Employee">Employee</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="dms-form-group">
                <Form.Label> Mobile</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your mobile number"
                  value={email}
                  onChange={(e) => {
                    // Remove non-digit characters
                    const value = e.target.value.replace(/\D/g, "");
                    // Limit to 10 digits
                    if (value.length <= 10) setEmail(value);
                  }}
                  required
                  maxLength={10}
                />
              </Form.Group>

              <Form.Group className="dms-form-group">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <Form.Check
                  type="checkbox"
                  label="Save Password"
                  checked={savePassword}
                  onChange={(e) => setSavePassword(e.target.checked)}
                />
                <Button
                  variant="link"
                  className="p-0 text-decoration-none text-primary"
                  onClick={() => navigate("/otp")}
                >
                  Forgot Password?
                </Button>
              </div>

              <Button type="submit" className="w-100">
                Log In
              </Button>

              <div className="text-center mt-3">
                <span>Don't have an account? </span>
                <Button
                  variant="link"
                  className="p-0 text-decoration-none text-primary mb-1"
                  onClick={() => navigate("/register")}
                >
                  Sign up
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>

      <Modal show={showOTPModal} centered>
        <Modal.Header>
          <Modal.Title className="text-center">Enter OTP</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>OTP</Form.Label>
            <div className="d-flex justify-content-left mb-3">
              {otp.map((digit, index) => (
                <Form.Control
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  className="text-center mx-1"
                  style={{ width: "40px" }}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                />
              ))}
            </div>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between align-items-center">
          <Button
            variant="link"
            className="p-0 text-decoration-none text-dark"
            onClick={async () => {
              try {
                const response = await axios.post(`${API_BASE_URL}/sendOtp`, {
                  mobile: email,
                  otpType: "login",
                  userType: userType.toLowerCase() // convert "Admin" to "admin"
                });
                if (
                  response?.data?.message?.toLowerCase().includes("otp") ||
                  response?.data?.user?.message?.toLowerCase().includes("otp")
                ) {
                  alert("OTP sent successfully.");
                } else {
                  alert("Failed to resend OTP.");
                }
              } catch (error) {
                console.error("Resend OTP error:", error);
                alert(error.response?.data?.message || "Error while resending OTP.");
              }
            }}
          >
            Resend OTP
          </Button>
          <div>
            <Button variant="secondary" onClick={() => setShowOTPModal(false)} className="me-2">
              Cancel
            </Button>
            <Button variant="primary" onClick={handleVerifyOTP}>
              Verify
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};