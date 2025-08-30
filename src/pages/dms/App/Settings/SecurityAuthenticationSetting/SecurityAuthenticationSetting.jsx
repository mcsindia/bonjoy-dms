import React, { useState } from 'react';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
import { FaEdit, FaSave } from 'react-icons/fa';

export const SecurityAuthenticationSetting = () => {
  const [settings, setSettings] = useState({
    twoFactorAuth: false,
    passwordPolicy: 'medium',
    sessionTimeout: 30,
    loginAttemptLimits: 5,
    accountLockoutDuration: 15,
    multiDeviceLogin: false,
    securityQuestions: false,
    passwordExpiryDuration: 90
  });

  const [isEditing, setIsEditing] = useState(false);

  const toggleEditMode = () => {
    setIsEditing((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Security & Authentication Settings:', settings);
    setIsEditing(false);
  };

  return (
    <AdminLayout>
      <Container className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>Security & Authentication Settings</h3>
          <Button onClick={toggleEditMode} variant={isEditing ? "success" : "secondary"}>
            {isEditing ? <><FaSave className="me-2" /> Save</> : <><FaEdit className="me-2" /> Edit</>}
          </Button>
        </div>
        
        <Form onSubmit={handleSubmit}>
          <Card>
            <Card.Header as="h5">Authentication Settings</Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Form.Group controlId="twoFactorAuth">
                    <Form.Check
                      type="checkbox"
                      name="twoFactorAuth"
                      checked={settings.twoFactorAuth}
                      onChange={handleChange}
                      label="Enable Two-Factor Authentication"
                      disabled={!isEditing}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="passwordPolicy">
                    <Form.Label>Password Policy</Form.Label>
                    <Form.Select
                      name="passwordPolicy"
                      value={settings.passwordPolicy}
                      onChange={handleChange}
                      disabled={!isEditing}
                    >
                      <option value="low">Low (Min 6 characters)</option>
                      <option value="medium">Medium (8+ chars, 1 number, 1 special char)</option>
                      <option value="high">High (12+ chars, uppercase, lowercase, number, special char)</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col md={6}>
                  <Form.Group controlId="sessionTimeout">
                    <Form.Label>Session Timeout (minutes)</Form.Label>
                    <Form.Control
                      type="number"
                      name="sessionTimeout"
                      value={settings.sessionTimeout}
                      onChange={handleChange}
                      placeholder="Enter session timeout"
                      min="1"
                      disabled={!isEditing}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="loginAttemptLimits">
                    <Form.Label>Login Attempt Limits</Form.Label>
                    <Form.Control
                      type="number"
                      name="loginAttemptLimits"
                      value={settings.loginAttemptLimits}
                      onChange={handleChange}
                      placeholder="Enter failed login attempt limit"
                      min="1"
                      disabled={!isEditing}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="mt-4">
            <Card.Header as="h5">Account Security Settings</Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Form.Group controlId="accountLockoutDuration">
                    <Form.Label>Account Lockout Duration (minutes)</Form.Label>
                    <Form.Control
                      type="number"
                      name="accountLockoutDuration"
                      value={settings.accountLockoutDuration}
                      onChange={handleChange}
                      placeholder="Enter lockout duration"
                      min="1"
                      disabled={!isEditing}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="multiDeviceLogin">
                    <Form.Check
                      type="checkbox"
                      name="multiDeviceLogin"
                      checked={settings.multiDeviceLogin}
                      onChange={handleChange}
                      label="Allow Multi-Device Login"
                      disabled={!isEditing}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col md={6}>
                  <Form.Group controlId="securityQuestions">
                    <Form.Check
                      type="checkbox"
                      name="securityQuestions"
                      checked={settings.securityQuestions}
                      onChange={handleChange}
                      label="Enable Security Questions for Account Recovery"
                      disabled={!isEditing}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="passwordExpiryDuration">
                    <Form.Label>Password Expiry Duration (days)</Form.Label>
                    <Form.Control
                      type="number"
                      name="passwordExpiryDuration"
                      value={settings.passwordExpiryDuration}
                      onChange={handleChange}
                      placeholder="Enter password expiry duration"
                      min="1"
                      disabled={!isEditing}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
         </Form>
      </Container>
    </AdminLayout>
  );
};