import React, { useState } from 'react';
import { Table, Pagination, Form, InputGroup, Modal, Button } from 'react-bootstrap';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';
import { FaStar, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Example Data
const feedbackByDriverData = [
  { tripId: 'TRIP001', driverId: 'DRV001', riderId: 'RID001', date: '2023-12-18', time: '7:20 AM', rating: 6, remark: 'Rider was punctual and polite.', cleanliness: 4, politeness: 3, drivingSkills: 4, navigationEfficiency: 6, vehicleCondition: 4 },
  { tripId: 'TRIP002', driverId: 'DRV002', riderId: 'RID002', date: '2023-12-17', time: '11:00 AM', rating: 4, remark: 'Good experience with the rider.', cleanliness: 4, politeness: 3, drivingSkills: 4, navigationEfficiency: 6, vehicleCondition: 4 },
  { tripId: 'TRIP003', driverId: 'DRV003', riderId: 'RID003', date: '2023-12-16', time: '5:00 PM', rating: 3, remark: 'Rider caused some delays.', cleanliness: 3, politeness: 1, drivingSkills: 2, navigationEfficiency: 4, vehicleCondition: 4 },
  { tripId: 'TRIP004', driverId: 'DRV004', riderId: 'RID004', date: '2023-12-14', time: '7:20 AM', rating: 2, remark: 'Rider was not communicative.', cleanliness: 3, politeness: 1, drivingSkills: 2, navigationEfficiency: 4, vehicleCondition: 4 },
  { tripId: 'TRIP006', driverId: 'DRV006', riderId: 'RID006', date: '2023-12-12', time: '11:00 AM', rating: 1, remark: 'Very poor experience.', cleanliness: 3, politeness: 2, drivingSkills: 3, navigationEfficiency: 2, vehicleCondition: 2 },
];

// Render stars for rating
const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 6; i++) {
    stars.push(
      <FaStar key={i} style={{ color: i <= rating ? "gold" : "silver" }} />
    );
  }
  return stars;
};

export const FeedbackByRider = () => {
  const navigate = useNavigate();
  const [feedbackPage, setFeedbackPage] = useState(1);
  const [filteredFeedback, setFilteredFeedback] = useState(feedbackByDriverData);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const itemsPerPage = 16;

  const userData = JSON.parse(localStorage.getItem("userData"));
  let permissions = [];

  if (Array.isArray(userData?.employeeRole)) {
    for (const role of userData.employeeRole) {
      for (const child of role.childMenus || []) {
        for (const mod of child.modules || []) {
          if (mod.moduleUrl?.toLowerCase() === "feedbackbyrider") {
            permissions = mod.permission
              ?.toLowerCase()
              .split(',')
              .map(p => p.trim()) || [];
          }
        }
      }
    }
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    filterData(e.target.value, dateFrom, dateTo);
  };

  const handleDateChange = (e, setDate) => {
    setDate(e.target.value);
    filterData(searchQuery, e.target.name === 'dateFrom' ? e.target.value : dateFrom, e.target.name === 'dateTo' ? e.target.value : dateTo);
  };

  const filterData = (query, from, to) => {
    let filtered = feedbackByDriverData;

    if (query) {
      filtered = filtered.filter(feedback =>
        feedback.tripId.toLowerCase().includes(query.toLowerCase()) ||
        feedback.driverId.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (from) {
      filtered = filtered.filter(feedback => new Date(feedback.date) >= new Date(from));
    }

    if (to) {
      filtered = filtered.filter(feedback => new Date(feedback.date) <= new Date(to));
    }

    setFilteredFeedback(filtered);
    setFeedbackPage(1);
  };

  const paginate = (data, currentPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  const handlePageChange = (pageNumber) => setFeedbackPage(pageNumber);

  const handleViewFeedback = (feedback) => {
    setSelectedFeedback(feedback);
    setShowModal(true);
  };

  const handleDriverClick = (driverId) => navigate(`/dms/drivers/details/view`);
  const handleRiderClick = (riderId) => navigate(`/dms/rider/profile`);

  return (
    <AdminLayout>
      <div className="dms-pages-header sticky-header d-flex justify-content-between align-items-center mb-3">
        <h3>Feedback By Rider</h3>
        <div className="filter-search-container">
          <Form.Control
            type="date"
            name="dateFrom"
            className="me-2"
            value={dateFrom}
            onChange={(e) => handleDateChange(e, setDateFrom)}
          />
          <Form.Control
            type="date"
            name="dateTo"
            value={dateTo}
            onChange={(e) => handleDateChange(e, setDateTo)}
          />
          <InputGroup className="me-2">
            <Form.Control
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </InputGroup>
        </div>
      </div>

      {/* Feedback Table */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Trip ID</th>
            <th>Driver ID</th>
            <th>Rider ID</th>
            <th>Date & Time</th>
            <th>Rating</th>
            <th>Remark</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginate(filteredFeedback, feedbackPage).map((feedback, index) => (
            <tr key={index}>
              <td>
                <a
                  href="#"
                  className="trip-id-link"
                  onClick={() => navigate('/dms/trip/details', { state: { trip: feedback } })}
                >
                  {feedback.tripId}
                </a>
              </td>
              <td>
                <a
                  href="#"
                  className="driver-id-link"
                  onClick={() => handleDriverClick(feedback.driverId)}
                >
                  {feedback.driverId}
                </a>
              </td>
              <td>
                <a
                  href="#"
                  className="rider-id-link"
                  onClick={() => handleRiderClick(feedback.riderId)}
                >
                  {feedback.riderId}
                </a>
              </td>
              <td>{feedback.date} <br /> {feedback.time}</td>
              <td>{renderStars(feedback.rating)}</td>
              <td>{feedback.remark}</td>
              <td>
                {permissions.includes("view") ? (
                  <FaEye
                    className="icon icon-blue"
                    title="View"
                    onClick={() => handleViewFeedback(feedback)}
                  />
                ) : (
                  '-' // Show dash if no view permission
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
      <Pagination className="justify-content-center">
        <Pagination.Prev
          onClick={() => handlePageChange(feedbackPage - 1)}
          disabled={feedbackPage === 1}
        />
        {[...Array(Math.ceil(filteredFeedback.length / itemsPerPage))].map((_, idx) => (
          <Pagination.Item
            key={idx + 1}
            active={idx + 1 === feedbackPage}
            onClick={() => handlePageChange(idx + 1)}
          >
            {idx + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => handlePageChange(feedbackPage + 1)}
          disabled={feedbackPage === Math.ceil(filteredFeedback.length / itemsPerPage)}
        />
      </Pagination>

      {/* Feedback Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Feedback Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedFeedback && (
            <>
              <div className="d-flex justify-content-between">
                <h6>Cleanliness</h6>
                <div>{renderStars(selectedFeedback.cleanliness)}</div>
              </div>
              <div className="d-flex justify-content-between">
                <h6>Politeness</h6>
                <div>{renderStars(selectedFeedback.politeness)}</div>
              </div>
              <div className="d-flex justify-content-between">
                <h6>Driving Skills</h6>
                <div>{renderStars(selectedFeedback.drivingSkills)}</div>
              </div>
              <div className="d-flex justify-content-between">
                <h6>Navigation Efficiency</h6>
                <div>{renderStars(selectedFeedback.navigationEfficiency)}</div>
              </div>
              <div className="d-flex justify-content-between">
                <h6>Vehicle Condition</h6>
                <div>{renderStars(selectedFeedback.vehicleCondition)}</div>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};
