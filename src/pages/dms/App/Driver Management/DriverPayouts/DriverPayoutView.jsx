import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, Table } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import defaultProfileImg from '../../../../../assets/images/profile.png';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';

export const DriverPayoutView = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const payout = location.state?.payout;

  if (!payout) {
    return (
      <AdminLayout>
        <div className="text-center mt-5">
          <h3>Payout not found</h3>
          <Button onClick={() => navigate('/dms/drivers/payouts')}>Go Back</Button>
        </div>
      </AdminLayout>
    );
  }

  const {
    payout_id,
    driver_id,
    name = 'N/A',
    profile_img = defaultProfileImg,
    total_amount = 0.00,
    payout_method = 'N/A',
    transaction_id = 'N/A',
    payout_status = 'Processing',
    processed_by = 'N/A',
    processed_at = null,
    created_at = null,
  } = payout;

  const formatDateTime = (datetime) => {
    return datetime ? new Date(datetime).toLocaleString() : 'N/A';
  };

  return (
    <AdminLayout>
      <div className="driver-payout-view container mt-4">
        {/* Profile Card */}
        <Card className="mb-4">
          <Card.Body className="d-flex justify-content-between align-items-center m-4 card-body-custom">
            <div className="d-flex align-items-center gap-3">
              <img
                src={profile_img}
                alt={`${name}'s Profile`}
                className="rounded-circle border profile-img"
              />
              <div>
                <p><strong>Driver ID:</strong> {driver_id}</p>
                <p><strong>Driver Name:</strong> {name}</p>
              </div>
            </div>
            <Button variant="secondary" onClick={() => navigate(-1)}>
              <FaArrowLeft /> Back
            </Button>
          </Card.Body>
        </Card>

        {/* Payout Details */}
        <section className="mt-4">
          <h4>Payout Information</h4>
          <Table striped bordered hover>
            <tbody>
              <tr>
                <th>Payout ID</th>
                <td>{payout_id}</td>
                <th>Total Amount</th>
                <td><strong>₹{total_amount.toFixed(2)}</strong></td>
              </tr>
              <tr>
                <th>Payout Method</th>
                <td>{payout_method}</td>
                <th>Transaction ID</th>
                <td>{transaction_id}</td>
              </tr>
              <tr>
                <th>Payout Status</th>
                <td>{payout_status}</td>
                <th>Processed By (Admin ID)</th>
                <td>{processed_by}</td>
              </tr>
              <tr>
                <th>Processed At</th>
                <td>{formatDateTime(processed_at)}</td>
                <th>Created At</th>
                <td>{formatDateTime(created_at)}</td>
              </tr>
            </tbody>
          </Table>
        </section>
      </div>
    </AdminLayout>
  );
};
