import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Row, Col, Card, Button, Alert } from "react-bootstrap";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";
import { FaArrowLeft } from "react-icons/fa";

export const CompalintLogsView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const complaint = location.state?.complaint;

  if (!complaint) {
    return (
      <AdminLayout>
        <div className="text-center mt-5">
          <Alert variant="warning">No complaint data available.</Alert>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const handleUserClick = (id, name, profileImage, category, isComplainant = true) => {
    const isRider = category?.toLowerCase().includes("rider");
    const targetPath = isComplainant
      ? isRider
        ? `/dms/rider/view/${id}`
        : `/dms/driver/view/${id}`
      : isRider
        ? `/dms/driver/view/${id}`
        : `/dms/rider/view/${id}`;

    navigate(targetPath, {
      state: {
        [isRider ? "rider" : "driver"]: {
          id,
          userId: id,
          fullName: name,
          profileImage: profileImage || null,
        },
      },
    });
  };

  return (
    <AdminLayout>
      <div className="dms-container">
        {/* Header */}
        <div className="dms-pages-header sticky-header d-flex justify-content-between align-items-center mb-4">
          <h3>Complaint Details</h3>
          <Button className="back-button" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Back to List
          </Button>
        </div>

        {/* Complainant & Against User Info */}
        <Row className="mb-4">
          <Col md={12}>
            <Card className="p-3">
              <h5><strong>Complainant & Against User Information</strong></h5>
              <hr />
              <Row>
                <Col md={6}>
                  <p>
                    <strong>Complainant Name:</strong>{" "}
                    <span
                      className="rider-id-link"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        handleUserClick(
                          complaint.complainant_id,
                          complaint.complainant_name,
                          complaint.complainant_profile_image,
                          complaint.category,
                          true
                        )
                      }
                    >
                      {complaint.complainant_name}
                    </span>
                  </p>
                  <p><strong>Complainant ID:</strong> {complaint.complainant_id}</p>
                  <p><strong>Ride ID:</strong> {complaint.ride_id || "-"}</p>
                </Col>
                <Col md={6}>
                  <p>
                    <strong>Against User Name:</strong>{" "}
                    <span
                      className="rider-id-link"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        handleUserClick(
                          complaint.against_user_id,
                          complaint.against_user_name,
                          complaint.against_user_profile_image,
                          complaint.category,
                          false
                        )
                      }
                    >
                      {complaint.against_user_name}
                    </span>
                  </p>
                  <p><strong>Against User ID:</strong> {complaint.against_user_id}</p>
                  <p><strong>Category:</strong> {complaint.category.replace("_", " ")}</p>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        {/* Complaint Details */}
        <Row className="mb-4">
          <Col md={12}>
            <Card className="p-3">
              <h5><strong>Complaint Details</strong></h5>
              <hr />
              <p><strong>Description:</strong> {complaint.description}</p>
              <p><strong>Status:</strong> <span>{complaint.status}</span></p>
              <p><strong>Created At:</strong> {new Date(complaint.created_at).toLocaleString()}</p>
              <p>
                <strong>Resolved At:</strong>{" "}
                {complaint.resolved_at
                  ? new Date(complaint.resolved_at).toLocaleString()
                  : "-"}
              </p>
            </Card>
          </Col>
        </Row>
      </div>
    </AdminLayout>
  );
};
