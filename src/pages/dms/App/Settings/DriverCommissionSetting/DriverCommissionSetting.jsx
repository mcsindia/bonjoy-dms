import React, { useState } from 'react';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
import { FaEdit, FaSave } from 'react-icons/fa';

export const DriverCommissionSetting = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [commissionSettings, setCommissionSettings] = useState({
    commissionPercentage: '',
    minimumPayout: '',
    payoutFrequency: 'weekly'
  });

  const handleChange = (e) => {
    setCommissionSettings({ ...commissionSettings, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false); // Save and switch back to view mode
  };

  const toggleEditMode = () => {
    setIsEditing((prev) => !prev);
  };

  return (
    <AdminLayout>
      <div className='dms-xcontainer'>
        <Container className="mt-4">
          <Card>
            <Card.Header as="h5" className="d-flex justify-content-between align-items-center">
              Driver Commission Settings
              <Button onClick={toggleEditMode} variant={isEditing ? "success" : "secondary"}>
                {isEditing ? <><FaSave className="me-2" /> Save</> : <><FaEdit className="me-2" /> Edit</>}
              </Button>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="commissionPercentage">
                      <Form.Label>Commission Percentage</Form.Label>
                      <Form.Control
                        type="number"
                        name="commissionPercentage"
                        value={commissionSettings.commissionPercentage}
                        onChange={handleChange}
                        placeholder="Enter commission percentage"
                        step="0.1"
                        disabled={!isEditing}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="minimumPayout">
                      <Form.Label>Minimum Payout Amount</Form.Label>
                      <Form.Control
                        type="number"
                        name="minimumPayout"
                        value={commissionSettings.minimumPayout}
                        onChange={handleChange}
                        placeholder="Enter minimum payout amount"
                        disabled={!isEditing}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col md={6}>
                    <Form.Group controlId="payoutFrequency">
                      <Form.Label>Payout Frequency</Form.Label>
                      <Form.Select
                        name="payoutFrequency"
                        value={commissionSettings.payoutFrequency}
                        onChange={handleChange}
                        disabled={!isEditing}
                      >
                        <option value="weekly">Weekly</option>
                        <option value="bi-weekly">Bi-Weekly</option>
                        <option value="monthly">Monthly</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </AdminLayout>
  );
};
