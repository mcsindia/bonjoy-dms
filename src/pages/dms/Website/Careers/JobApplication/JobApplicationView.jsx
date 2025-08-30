import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";
import { FaArrowLeft } from "react-icons/fa";

export const JobApplicationView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const application = location.state?.application;

  if (!application) {
    return (
      <AdminLayout>
        <Container className="text-center my-5">
          <h4>Application not found</h4>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </Container>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Container className="my-4">
        <div className="dms-pages-header mb-4">
          <h3>Job Application Details</h3>
          <Button className="back-button" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Back
          </Button>
        </div>

        <Card>
          <Card.Body>
            <Row>
              <Col md={6}>
                <p><strong>Full Name:</strong> {application.fullName}</p>
                <p><strong>Email:</strong> {application.email}</p>
                <p><strong>Phone:</strong> {application.phone}</p>
                <p><strong>Gender:</strong> {application.gender}</p>
                <p><strong>Status:</strong> {application.status}</p>
              </Col>
              <Col md={6}>
                <p><strong>Expected Salary:</strong> {application.expectedSalary}</p>
                <p><strong>Available Date:</strong> {application.availableDate}</p>
                <p><strong>Preferred Location:</strong> {application.preferredLocation}</p>
                <p><strong>Created At:</strong> {application.createdAt}</p>
              </Col>
            </Row>
            <hr />
            <Row>
              <Col md={6}>
                <h5>Education</h5>
                <p><strong>Qualification:</strong> {application.qualification}</p>
                <p><strong>Passing Year:</strong> {application.passingYear}</p>
                <p><strong>Percentage:</strong> {application.percentage}</p>
              </Col>
              <Col md={6}>
                <h5>Experience & Skills</h5>
                <p><strong>Experience:</strong> {application.experience}</p>
                <p><strong>Skills:</strong> {application.skills}</p>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </AdminLayout>
  );
};
