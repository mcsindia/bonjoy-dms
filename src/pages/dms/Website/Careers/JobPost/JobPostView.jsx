import React from 'react';
import { Card, Row, Col, Button, Badge } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';
import { FaArrowLeft, FaEdit } from 'react-icons/fa';

export const JobPostView = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const career = state?.career;

  if (!career) {
    return (
      <AdminLayout>
        <div className="p-4 text-center">
          <h5>No career data found.</h5>
          <Button variant="primary" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Go Back
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>Career Details</h3>
          <Button className='edit-button' onClick={() => navigate('/dms/job-post/edit', {state: {career}})}>
            <FaEdit /> Edit
          </Button>
        </div>

        <Card>
          <Card.Body>
            <Row className="mb-3">
              <Col md={6}>
                <strong>Job Title:</strong>
                <p>{career.title}</p>
              </Col>
              <Col md={6}>
                <strong>Department:</strong>
                <p>{career.department}</p>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <strong>Location:</strong>
                <p>{career.location}</p>
              </Col>
              <Col md={6}>
                <strong>Status:</strong>{' '}
                {career.status === 'Open' ? (
                  <Badge bg="success">{career.status}</Badge>
                ) : (
                  <Badge bg="danger">{career.status}</Badge>
                )}
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <strong>Positions Available:</strong>
                <p>{career.positions}</p>
              </Col>
              <Col md={6}>
                <strong>Created At:</strong>
                <p>{career.createdAt}</p>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <strong>Job Type:</strong>
                <p>{career.jobType}</p>
              </Col>
              <Col md={6}>
                <strong>Experience Required:</strong>
                <p>{career.experience}</p>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <strong>Skills:</strong>
                <p>{career.skills?.join(', ')}</p>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <strong>Job Description:</strong>
                <p>{career.description}</p>
              </Col>
            </Row>

            <Row>
              <Col>
                <strong>Responsibilities:</strong>
                <ul>
                  {career.responsibilities?.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>
    </AdminLayout>
  );
};
