import React, { useState } from 'react';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
import { FaEdit, FaSave } from 'react-icons/fa';

export const NotificationSetting = () => {
  const [settings, setSettings] = useState({
    rideRequestAlerts: true,
    rideConfirmation: true,
    driverArrivalAlert: true,
    tripStartNotification: true,
    tripCompletionNotification: true,
    fareReceipt: true,
    paymentConfirmation: true,
    refundStatus: false,
    fareAdjustments: false,
    discountsOffers: true,
    referralRewards: false,
    loyaltyProgramUpdates: false,
    emergencyAlerts: true,
    sosAlerts: true,
    accountSecurityAlerts: true,
    rideMismatchAlerts: true,
    appUpdates: true,
    serviceAvailability: true,
    rideCancellationAlerts: true,
    feedbackRatings: true,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    newsletterSubscription: true,
    orderUpdates: true,
    promotionalOffers: false,
    doNotDisturb: false
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setSettings({
      ...settings,
      [name]: checked
    });
  };

  const toggleEditMode = () => {
    setIsEditing((prev) => !prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Notification Settings:', settings);
  };

  return (
    <AdminLayout>
      <Container className="mt-4">
        <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Notification Settings</h5>
            <Button onClick={toggleEditMode} variant={isEditing ? "success" : "secondary"}>
              {isEditing ? <><FaSave className="me-2" /> Save</> : <><FaEdit className="me-2" /> Edit</>}
            </Button>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <h6 >Ride Notifications</h6>
              <Row>
                <Col md={6}><Form.Check type="checkbox" name="rideRequestAlerts" checked={settings.rideRequestAlerts} onChange={handleChange} label="Ride Request Alerts" /></Col>
                <Col md={6}><Form.Check type="checkbox" name="rideConfirmation" checked={settings.rideConfirmation} onChange={handleChange} label="Ride Confirmation" /></Col>
                <Col md={6}><Form.Check type="checkbox" name="driverArrivalAlert" checked={settings.driverArrivalAlert} onChange={handleChange} label="Driver Arrival Alert" /></Col>
                <Col md={6}><Form.Check type="checkbox" name="tripStartNotification" checked={settings.tripStartNotification} onChange={handleChange} label="Trip Start Notification" /></Col>
                <Col md={6}><Form.Check type="checkbox" name="tripCompletionNotification" checked={settings.tripCompletionNotification} onChange={handleChange} label="Trip Completion Notification" /></Col>
              </Row>
              
              <h6 className='mt-4'>Payment Notifications</h6>
              <Row>
                <Col md={6}><Form.Check type="checkbox" name="fareReceipt" checked={settings.fareReceipt} onChange={handleChange} label="Fare Receipt" /></Col>
                <Col md={6}><Form.Check type="checkbox" name="paymentConfirmation" checked={settings.paymentConfirmation} onChange={handleChange} label="Payment Confirmation" /></Col>
                <Col md={6}><Form.Check type="checkbox" name="refundStatus" checked={settings.refundStatus} onChange={handleChange} label="Refund Status" /></Col>
                <Col md={6}><Form.Check type="checkbox" name="fareAdjustments" checked={settings.fareAdjustments} onChange={handleChange} label="Fare Adjustments" /></Col>
              </Row>
              
              <h6 className='mt-4'>Promotions & Offers</h6>
              <Row>
                <Col md={6}><Form.Check type="checkbox" name="discountsOffers" checked={settings.discountsOffers} onChange={handleChange} label="Discounts & Offers" /></Col>
                <Col md={6}><Form.Check type="checkbox" name="referralRewards" checked={settings.referralRewards} onChange={handleChange} label="Referral Rewards" /></Col>
                <Col md={6}><Form.Check type="checkbox" name="loyaltyProgramUpdates" checked={settings.loyaltyProgramUpdates} onChange={handleChange} label="Loyalty Program Updates" /></Col>
              </Row>
              
              <h6 className='mt-4'>Security & Emergency Alerts</h6>
              <Row>
                <Col md={6}><Form.Check type="checkbox" name="emergencyAlerts" checked={settings.emergencyAlerts} onChange={handleChange} label="Emergency Alerts" /></Col>
                <Col md={6}><Form.Check type="checkbox" name="sosAlerts" checked={settings.sosAlerts} onChange={handleChange} label="SOS Alerts" /></Col>
                <Col md={6}><Form.Check type="checkbox" name="accountSecurityAlerts" checked={settings.accountSecurityAlerts} onChange={handleChange} label="Account Security Alerts" /></Col>
                <Col md={6}><Form.Check type="checkbox" name="rideMismatchAlerts" checked={settings.rideMismatchAlerts} onChange={handleChange} label="Ride Mismatch Alerts" /></Col>
              </Row>
              
              <h6 className='mt-4'>General Notifications</h6>
              <Row>
                <Col md={6}><Form.Check type="checkbox" name="appUpdates" checked={settings.appUpdates} onChange={handleChange} label="App Updates" /></Col>
                <Col md={6}><Form.Check type="checkbox" name="serviceAvailability" checked={settings.serviceAvailability} onChange={handleChange} label="Service Availability" /></Col>
                <Col md={6}><Form.Check type="checkbox" name="rideCancellationAlerts" checked={settings.rideCancellationAlerts} onChange={handleChange} label="Ride Cancellation Alerts" /></Col>
                <Col md={6}><Form.Check type="checkbox" name="feedbackRatings" checked={settings.feedbackRatings} onChange={handleChange} label="Feedback & Ratings" /></Col>
              </Row>
              
              <h6 className='mt-4'>Communication Preferences</h6>
              <Row>
                <Col md={6}><Form.Check type="checkbox" name="emailNotifications" checked={settings.emailNotifications} onChange={handleChange} label="Enable Email Notifications" /></Col>
                <Col md={6}><Form.Check type="checkbox" name="smsNotifications" checked={settings.smsNotifications} onChange={handleChange} label="Enable SMS Notifications" /></Col>
                <Col md={6}><Form.Check type="checkbox" name="pushNotifications" checked={settings.pushNotifications} onChange={handleChange} label="Enable Push Notifications" /></Col>
                <Col md={6}><Form.Check type="checkbox" name="newsletterSubscription" checked={settings.newsletterSubscription} onChange={handleChange} label="Subscribe to Newsletter" /></Col>
                <Col md={6}><Form.Check type="checkbox" name="promotionalOffers" checked={settings.promotionalOffers} onChange={handleChange} label="Receive Promotional Offers" /></Col>
                <Col md={6}><Form.Check type="checkbox" name="doNotDisturb" checked={settings.doNotDisturb} onChange={handleChange} label="Enable Do Not Disturb Mode" /></Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </AdminLayout>
  );
};
