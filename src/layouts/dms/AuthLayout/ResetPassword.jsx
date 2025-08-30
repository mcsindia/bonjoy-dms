import React from 'react';
import { Alert, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export const ResetPassword = () => {
  const navigate = useNavigate();

  return (
    <div className='dms-auth-wrapper'>
    <Container
      className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <Alert variant="success" className="text-center" style={{ color: 'green' }}>
          A password reset link has been sent to your registered email address.
        </Alert>
        <Button type='submit' onClick={() => navigate('/dms')}>
          Go to Login
        </Button>
      </div>
    </Container>
    </div>
  );
};
