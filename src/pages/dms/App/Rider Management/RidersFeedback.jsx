import React, { useState } from "react";
import { Table, Form, InputGroup, Dropdown, DropdownButton, Pagination } from "react-bootstrap";
import { FaStar} from "react-icons/fa";
import { AdminLayout } from "../../../../layouts/dms/AdminLayout/AdminLayout";
import { useNavigate } from "react-router-dom";

export const RidersFeedback = () => {
  const initialFeedbackData = [
    { id: 1, riderName: "John Doe", driverId: "DRV001", tripId: "TRIP001", rating: 4, remark: "Great ride!" },
    { id: 2, riderName: "Jane Smith", driverId: "DRV002", tripId: "TRIP002", rating: 5, remark: "Excellent service!" },
    { id: 3, riderName: "Alex Brown", driverId: "DRV003", tripId: "TRIP003", rating: 3, remark: "Could be better." },
    { id: 4, riderName: "Emily White", driverId: "DRV004", tripId: "TRIP004", rating: 2, remark: "Not satisfied." },
  ];
  const navigate = useNavigate();
  const [feedbacks] = useState(initialFeedbackData);
  const [search, setSearch] = useState("");
  const [filterRating, setFilterRating] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Handle Search
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // Handle Filter by Rating
  const handleFilterRating = (rating) => {
    setFilterRating(rating);
  };

  // Filtered data based on search and filter
  const filteredFeedbacks = feedbacks.filter(
    (feedback) =>
      (feedback.riderName.toLowerCase().includes(search.toLowerCase()) ||
        feedback.driverId.toLowerCase().includes(search.toLowerCase()) ||
        feedback.tripId.toLowerCase().includes(search.toLowerCase())) &&
      (filterRating ? feedback.rating === filterRating : true)
  );

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFeedbacks.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Render stars for rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} style={{ color: "gold" }} />
        ) : (
          <FaStar key={i} style={{ color: "silver" }} />
        )
      );
    }
    return stars;
  };

  return (
    <AdminLayout>
      <div className="dms-pages-header sticky-header">
        <h3>Rider Feedback</h3>
      </div>

      {/* Search and Filter */}
      <div className="filter-search-container">
        {/* Filter by Rating */}
        <DropdownButton variant="primary" title={`Filter Rating: ${filterRating || ""}`} id="filter-rating-dropdown">
          <Dropdown.Item onClick={() => handleFilterRating("")}>All</Dropdown.Item>
          {[1, 2, 3, 4, 5].map((rating) => (
            <Dropdown.Item key={rating} onClick={() => handleFilterRating(rating)}>
              {renderStars(rating)} ({rating})
            </Dropdown.Item>
          ))}
        </DropdownButton>

        {/* Search Bar */}
        <InputGroup className="dms-custom-width">
          <Form.Control placeholder="Search feedback..." value={search} onChange={handleSearch} />
        </InputGroup>
      </div>

      {/* Feedback Table */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Feedback ID</th>
            <th>Rider Name</th>
            <th>Driver ID</th>
            <th>Trip ID</th>
            <th>Ratings</th>
            <th>Remark</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((feedback) => (
              <tr key={feedback.id}>
                <td>{feedback.id}</td>
                <td>{feedback.riderName}</td>
                <td>
                    <a  href="#" role="button" className='trip-id-link' onClick={() => navigate('/dms/drivers/details/view', { state: { trip: feedback } })}>
                      {feedback.driverId}
                    </a>
                  </td>
                <td>
                    <a  href="#" role="button" className='trip-id-link' onClick={() => navigate('/dms/trip/details', { state: { trip: feedback } })}>
                      {feedback.tripId}
                    </a>
                  </td>
                <td>{renderStars(feedback.rating)}</td>
                <td>{feedback.remark}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No feedback found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Pagination */}
      <Pagination className="justify-content-center">
        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
        {[...Array(totalPages)].map((_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
      </Pagination>
    </AdminLayout>
  );
};
