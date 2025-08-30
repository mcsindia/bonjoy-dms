import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card } from "react-bootstrap";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";

export const RidePaymentDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const payment = location.state?.payment;

  if (!payment) {
    return (
      <AdminLayout>
        <div className="text-center">
          <h3>Payment not found</h3>
          <Button onClick={() => navigate("/trip-payment")}>Go Back</Button>
        </div>
      </AdminLayout>
    );
  }

  const { payment_id, trip_id, amount, payment_method, payment_status } = payment;

  return (
    <AdminLayout>
      <div className="payment-details-container container mt-4">

        <h3>Payment Details</h3>

        <Card className="p-4 mb-4 shadow-sm">
        <div className="row mt-4">
          <div className="col-md-6">
            <h5>Payment Information</h5>
            <p><strong>Payment ID:</strong> {payment_id}</p>
            <p><strong>Trip ID:</strong> 
                    <a role="button" className='trip-id-link' onClick={() => navigate('/trip/details', { state: { trip: payment } })}>
                      {trip_id}
                    </a>
                  </p>
            <p><strong>Amount:</strong> {amount}</p>
          </div>

          <div className="col-md-6">
            <h5>Additional Information</h5>
            <p><strong>Payment Method:</strong> {payment_method}</p>
            <p><strong>Payment Status:</strong> {payment_status}</p>
          </div>
        </div>
        </Card>

        <Button
          type="cancel"
          onClick={() => navigate(-1)}
          className="mb-3 float-start"
        >
          Back
        </Button>
      </div>
    </AdminLayout>
  );
};