import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';
import { Button, Card } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';

export const ContactUsView = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // If data passed from ContactUs list via navigate
  const contact = location.state?.contact;

  // Fallback if no data is passed (you can replace this with a fetch from API)
  const fallback = {
    id: 0,
    name: 'Not Available',
    email: 'N/A',
    phone: 'N/A',
    subject: 'N/A',
    message: 'No message available.',
    date: 'N/A',
  };

  const details = contact || fallback;

  return (
    <AdminLayout>
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Contact Us Details</h3>
          <Button className='back-button' onClick={() => navigate(-1)}><FaArrowLeft/> Back</Button>
        </div>

        <Card className="p-4">
          <p><strong>Name:</strong> {details.name}</p>
          <p><strong>Email:</strong> {details.email}</p>
          <p><strong>Phone:</strong> {details.phone}</p>
          <p><strong>Message:</strong><br />{details.message}</p>
          <p><strong>Date:</strong> {details.date}</p>
        </Card>
      </div>
    </AdminLayout>
  );
};
