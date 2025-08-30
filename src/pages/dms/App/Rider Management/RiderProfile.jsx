import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Table, Button, Pagination, Modal } from 'react-bootstrap';
import { FaStar, FaEye } from 'react-icons/fa';
import rider_profile_img from '../../../../assets/images/profile.png';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

export const RiderProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const rider = location.state?.rider || {};
  console.log(rider)

  const rideHistoryData = [
    { tripId: 'TRIP001', driverId: 'DRV001', date: '2023-12-18', time: '5:45 PM', pickup: 'Main Street', drop: 'Park Avenue', fare: 15, paymentMode: 'Cash' },
    { tripId: 'TRIP002', driverId: 'DRV002', date: '2023-12-17', time: '3:55 AM', pickup: '5th Avenue', drop: 'Central Park', fare: 20, paymentMode: 'Card' },
    { tripId: 'TRIP003', driverId: 'DRV003', date: '2023-12-16', time: '6:35 PM', pickup: 'Market Square', drop: 'Beach Road', fare: 25, paymentMode: 'Wallet' },
  ];

  const feedbackToDriverData = [
    { tripId: 'TRIP001', driverId: 'DRV001', date: '2023-12-18', time: '5:45 PM', rating: 5, remark: 'Excellent Service', cleanliness: 4, politeness: 3, drivingSkills: 4, navigationEfficiency: 5, vehicleCondition: 4, },
    { tripId: 'TRIP002', driverId: 'DRV002', date: '2023-12-17', time: '7:35 AM', rating: 4, remark: 'Good Ride', cleanliness: 3, politeness: 4, drivingSkills: 4, navigationEfficiency: 5, vehicleCondition: 4, },
    { tripId: 'TRIP003', driverId: 'DRV003', date: '2023-12-16', time: '2:00 PM', rating: 5, remark: 'Great Experience', cleanliness: 3, politeness: 4, drivingSkills: 4, navigationEfficiency: 5, vehicleCondition: 4, },
  ];

  const feedbackByDriverData = [
    { tripId: 'TRIP001', driverId: 'DRV001', date: '2023-12-18', time: '6:05 PM', rating: 5, remark: 'Great Rider', punctuality: 4, politeness: 3, cleanliness: 5, communication: 4, respectForVehicle: 4, riderBehaviour: 4, timeliness: 5, },
    { tripId: 'TRIP002', driverId: 'DRV002', date: '2023-12-17', time: '2:45 PM', rating: 4, remark: 'Polite and Courteous', punctuality: 4, politeness: 4, cleanliness: 5, communication: 4, respectForVehicle: 4, riderBehaviour: 4, timeliness: 5, },
    { tripId: 'TRIP003', driverId: 'DRV003', date: '2023-12-16', time: '8:45 AM', rating: 5, remark: 'Pleasure to Ride with', punctuality: 4, politeness: 5, cleanliness: 5, communication: 4, respectForVehicle: 5, riderBehaviour: 4, timeliness: 5, },
  ];

  const complaintsForDriverData = [
    { tripId: 'TRIP001', driverId: 'DRV001', date: '2023-12-18', time: '5:45 PM', complaintType: 'Behavior', remark: 'Unprofessional conduct' },
    { tripId: 'TRIP002', driverId: 'DRV002', date: '2023-12-17', time: '9:45 AM', complaintType: 'Overcharging', remark: 'Excess fare' },
    { tripId: 'TRIP003', driverId: 'DRV003', date: '2023-12-16', time: '5:45 PM', complaintType: 'Poor Service', remark: 'Slow driving' },
  ];

  const complaintsByDriverData = [
    { tripId: 'TRIP001', driverId: 'DRV001', date: '2023-12-18', time: '8:45 PM', complaintType: 'Payment', remark: 'Payment Issue' },
    { tripId: 'TRIP002', driverId: 'DRV002', date: '2023-12-17', time: '5:50 PM', complaintType: 'Luggage', remark: 'Damaged item' },
    { tripId: 'TRIP003', driverId: 'DRV003', date: '2023-12-16', time: '4:45 PM', complaintType: 'Speed', remark: 'Speeding violation' },
  ];

  const walletAmt = 100;
  const [riderProfile, setRiderProfile] = useState(null);
  const [rideHistoryPage, setRideHistoryPage] = useState(1);
  const [feedbackToDriverPage, setFeedbackToDriverPage] = useState(1);
  const [feedbackByDriverPage, setFeedbackByDriverPage] = useState(1);
  const [complaintsForDriverPage, setComplaintsForDriverPage] = useState(1);
  const [complaintsByDriverPage, setComplaintsByDriverPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showModal1, setShowModal1] = useState(false);
  const [selectedFeedback1, setSelectedFeedback1] = useState(null);
  const [riderContacts, setRiderContacts] = useState([]);
  const itemsPerPage = 3;/* 
  const [isActive, setIsActive] = useState(rider?.status === 'active'); // or rider.status === true */
  const [showActivationModal, setShowActivationModal] = useState(false);
  const displayRider = riderProfile || rider;

  const paginate = (data, currentPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const {
    rider_id,
    user_id,
    preferred_payment_method = '',
    riderName = '',
    email = '',
    profile_img = rider_profile_img,
  } = rider;

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

  const handleViewFeedback = (feedback) => {
    setSelectedFeedback(feedback);
    setShowModal(true);
  };

  const handleViewFeedback1 = (feedback) => {
    setSelectedFeedback1(feedback);
    setShowModal1(true);
  };

  /*   const handleStatusToggle = () => {
      if (!isActive) {
        // If rider is inactive and toggle is turned on
        setShowActivationModal(true);
        // Simulate request send (e.g., call an API here)
        // Example: sendActivationRequest(rider.id);
      }
      setIsActive(!isActive);
    }; */

  useEffect(() => {
    const riderId = rider?.id;
    if (!riderId) return;

    const fetchRiderProfile = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/getRiderProfileById/${riderId}`);
        if (response.data.success && Array.isArray(response.data.data)) {
          setRiderProfile(response.data.data[0]);
        }
      } catch (error) {
        console.error("Error fetching rider profile:", error);
      }
    };

    const token = JSON.parse(localStorage.getItem("userData"))?.token;
     const fetchRiderContacts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getAllUserContacts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success && Array.isArray(response.data.data)) {
        const filteredContacts = response.data.data.filter(
          (contact) => contact.userId === riderId && contact.userType === "Rider"
        );
        setRiderContacts(filteredContacts);
      }
    } catch (error) {
      console.error("Error fetching rider contacts:", error);
    }
  };

  fetchRiderProfile();
  fetchRiderContacts();
  }, [rider?.id]);

  return (
    <AdminLayout>
      <div className="rider-profile-page container">
        <Card className="mb-4">
          <Card.Body className="d-flex justify-content-between align-items-center m-4 card-body-custom">
            <div className="d-flex align-items-center">
              <img
                src={
                  displayRider?.profileImage
                    ? `${IMAGE_BASE_URL}${displayRider.profileImage}`
                    : rider_profile_img
                }
                alt={`${riderName}'s Profile`}
                className="rounded-circle me-4 profile-img"
              />
              <div>
                <h2>{displayRider?.fullName || displayRider?.riderName}</h2>
                <p>
                  <strong>User ID: </strong>
                  <a
                    role="button"
                    className='user-id-link'
                    onClick={() => navigate('/user/profile', { state: { user: rider } })}
                  >
                    {displayRider?.User?.id || displayRider?.userId || user_id}
                  </a>
                </p>
                <p><strong>Mobile:</strong> {displayRider?.User?.mobile}</p>
              </div>
            </div>

            {/* Wallet Section */}
            <div className="text-left">
              <h5>Wallet</h5>
              <p><strong>Wallet:</strong> ₹{displayRider?.wallet || walletAmt}</p>
              <p><strong>Preferred Payment:</strong> {displayRider?.preferredPaymentMethod || preferred_payment_method || 'N/A'}</p>
              <p>
                <strong>Status:</strong>{' '}
                <span className={`badge ${displayRider?.status === 'Active' ? 'bg-success' : 'bg-danger'}`}>
                  {displayRider?.status === 'Active' ? 'Active' : 'Inactive'}
                </span>
              </p>
            </div>
          </Card.Body>
        </Card>

        {/* Contact Details */}
        <section className="mt-4">
          <h4>Contact Details</h4>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>S No</th>
                <th>Contact Type</th>
                <th>Contact Name</th>
                <th>Contact Number</th>
                <th>Created At</th>
                <th>Updated At</th>
              </tr>
            </thead>
            <tbody>
              {riderContacts.length > 0 ? (
                riderContacts.map((contact, index) => (
                  <tr key={contact.id}>
                    <td>{index + 1}</td>
                    <td className="text-capitalize">{contact.relationship || 'N/A'}</td>
                    <td>{contact.contactName || 'N/A'}</td>
                    <td>{contact.contactNumber || 'N/A'}</td>
                    <td>{new Date(contact.createdAt).toLocaleDateString()} <br /> {new Date(contact.createdAt).toLocaleTimeString()}</td>
                    <td>{new Date(contact.updatedAt).toLocaleDateString()} <br /> {new Date(contact.updatedAt).toLocaleTimeString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center">No contact details found.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </section>
        <hr className="table-hr" />
        {/* 
        <section className="mt-4">
          <div className="dms-pages-header">
            <h4>Ride History</h4>
            <Button variant="primary" onClick={() => navigate('/ride-history/list')}>View All</Button>
          </div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Trip ID</th>
                <th>Driver ID</th>
                <th>Date & Time</th>
                <th>Pickup</th>
                <th>Drop</th>
                <th>Fare</th>
                <th>Payment Mode</th>
              </tr>
            </thead>
            <tbody>
              {paginate(rideHistoryData, rideHistoryPage).map((ride, index) => (
                <tr key={index}>
                  <td>
                    <a href="#" role="button" className='trip-id-link' onClick={() => navigate('/trip/details', { state: { trip: ride } })}>
                      {ride.tripId}
                    </a>
                  </td>
                  <td>
                    <a href={`/drivers/details/view`} className="driver-id-link">
                      {ride.driverId}
                    </a>
                  </td>
                  <td>{ride.date} <br /> {ride.time}</td>
                  <td>{ride.pickup}</td>
                  <td>{ride.drop}</td>
                  <td>₹{ride.fare}</td>
                  <td>{ride.paymentMode}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination className="justify-content-center">
            <Pagination.Prev
              onClick={() => setRideHistoryPage(rideHistoryPage - 1)}
              disabled={rideHistoryPage === 1}
            />
            {[...Array(Math.ceil(rideHistoryData.length / itemsPerPage))].map((_, idx) => (
              <Pagination.Item
                key={idx + 1}
                active={idx + 1 === rideHistoryPage}
                onClick={() => setRideHistoryPage(idx + 1)}
              >
                {idx + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => setRideHistoryPage(rideHistoryPage + 1)}
              disabled={rideHistoryPage === Math.ceil(rideHistoryData.length / itemsPerPage)}
            />
          </Pagination>
        </section>
        <hr className="table-hr" />

        <section className="mt-4">
          <div className="dms-pages-header">
            <h4>Feedback To Driver</h4>
            <Button variant="primary" onClick={() => navigate('/feedback-to-driver/list')}>View All</Button>
          </div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Trip ID</th>
                <th>Driver ID</th>
                <th>Date & Time</th>
                <th>Rating</th>
                <th>Remark</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginate(feedbackToDriverData, feedbackToDriverPage).map((feedback, index) => (
                <tr key={index}>
                  <td>
                    <a href="#" role="button" className='trip-id-link' onClick={() => navigate('/trip/details', { state: { trip: feedback } })}>
                      {feedback.tripId}
                    </a>
                  </td>
                  <td>
                    <a href={`/drivers/details/view`} className="driver-id-link">
                      {feedback.driverId}
                    </a>
                  </td>
                  <td>{feedback.date} <br /> {feedback.time}</td>
                  <td>{renderStars(feedback.rating)}</td>
                  <td>{feedback.remark}</td>
                  <td>
                    <FaEye
                      className="icon icon-blue"
                      title="View"
                      onClick={() => handleViewFeedback(feedback)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination className="justify-content-center">
            <Pagination.Prev
              onClick={() => setFeedbackToDriverPage(feedbackToDriverPage - 1)}
              disabled={feedbackToDriverPage === 1}
            />
            {[...Array(Math.ceil(feedbackToDriverData.length / itemsPerPage))].map((_, idx) => (
              <Pagination.Item
                key={idx + 1}
                active={idx + 1 === feedbackToDriverPage}
                onClick={() => setFeedbackToDriverPage(idx + 1)}
              >
                {idx + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => setFeedbackToDriverPage(feedbackToDriverPage + 1)}
              disabled={feedbackToDriverPage === Math.ceil(feedbackToDriverData.length / itemsPerPage)}
            />
          </Pagination>
          <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Feedback Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedFeedback && (
                <div>
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
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button type='cancel' onClick={() => setShowModal(false)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </section>
        <hr className="table-hr" />

        <section className="mt-4">
          <div className="dms-pages-header">
            <h4>Feedback By Driver</h4>
            <Button variant="primary" onClick={() => navigate('/feedback-by-driver/list')}>View All</Button>
          </div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Trip ID</th>
                <th>Driver ID</th>
                <th>Date & Time</th>
                <th>Rating</th>
                <th>Remark</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginate(feedbackByDriverData, feedbackByDriverPage).map((feedback, index) => (
                <tr key={index}>
                  <td>
                    <a href="#" role="button" className='trip-id-link' onClick={() => navigate('/trip/details', { state: { trip: feedback } })}>
                      {feedback.tripId}
                    </a>
                  </td>
                  <td>
                    <a href={`/drivers/details/view`} className="driver-id-link">
                      {feedback.driverId}
                    </a>
                  </td>
                  <td>{feedback.date} <br /> {feedback.time}</td>
                  <td>{renderStars(feedback.rating)}</td>
                  <td>{feedback.remark}</td>
                  <td>
                    <FaEye
                      className="icon icon-blue"
                      title="View"
                      onClick={() => handleViewFeedback1(feedback)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination className="justify-content-center">
            <Pagination.Prev
              onClick={() => setFeedbackByDriverPage(feedbackByDriverPage - 1)}
              disabled={feedbackByDriverPage === 1}
            />
            {[...Array(Math.ceil(feedbackByDriverData.length / itemsPerPage))].map((_, idx) => (
              <Pagination.Item
                key={idx + 1}
                active={idx + 1 === feedbackByDriverPage}
                onClick={() => setFeedbackByDriverPage(idx + 1)}
              >
                {idx + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => setFeedbackByDriverPage(feedbackByDriverPage + 1)}
              disabled={feedbackByDriverPage === Math.ceil(feedbackByDriverData.length / itemsPerPage)}
            />
          </Pagination>
          <Modal show={showModal1} onHide={() => setShowModal1(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Feedback Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedFeedback1 && (
                <div>
                  <div className="d-flex justify-content-between">
                    <h6>Punctuality</h6>
                    <div>{renderStars(selectedFeedback1.punctuality)}</div>
                  </div>
                  <div className="d-flex justify-content-between">
                    <h6>Politeness</h6>
                    <div>{renderStars(selectedFeedback1.politeness)}</div>
                  </div>
                  <div className="d-flex justify-content-between">
                    <h6>Cleanliness</h6>
                    <div>{renderStars(selectedFeedback1.cleanliness)}</div>
                  </div>
                  <div className="d-flex justify-content-between">
                    <h6>Communication</h6>
                    <div>{renderStars(selectedFeedback1.communication)}</div>
                  </div>
                  <div className="d-flex justify-content-between">
                    <h6>Respect for Vehicle</h6>
                    <div>{renderStars(selectedFeedback1.respectForVehicle)}</div>
                  </div>
                  <div className="d-flex justify-content-between">
                    <h6>Rider Behavior</h6>
                    <div>{renderStars(selectedFeedback1.riderBehaviour)}</div>
                  </div>
                  <div className="d-flex justify-content-between">
                    <h6>Timeliness</h6>
                    <div>{renderStars(selectedFeedback1.timeliness)}</div>
                  </div>
                  <div className="d-flex justify-content-between">
                    <h6>Overall Experience</h6>
                    <div>{renderStars(selectedFeedback1.rating)}</div>
                  </div>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button type='cancel' onClick={() => setShowModal1(false)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </section>
        <hr className="table-hr" />

        <section className="mt-4">
          <div className="dms-pages-header">
            <h4>Complaint For Driver</h4>
            <Button variant="primary" onClick={() => navigate('/complaint-for-driver/list')}>View All</Button>
          </div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Trip ID</th>
                <th>Driver ID</th>
                <th>Date & Time</th>
                <th>Complaint Type</th>
                <th>Remark</th>
              </tr>
            </thead>
            <tbody>
              {paginate(complaintsForDriverData, complaintsForDriverPage).map((complaint, index) => (
                <tr key={index}>
                  <td>
                    <a href="#" role="button" className='trip-id-link' onClick={() => navigate('/trip/details', { state: { trip: complaint } })}>
                      {complaint.tripId}
                    </a>
                  </td>
                  <td>
                    <a href={`/drivers/details/view`} className="driver-id-link">
                      {complaint.driverId}
                    </a>
                  </td>
                  <td>{complaint.date} <br /> {complaint.time}</td>
                  <td>{complaint.complaintType}</td>
                  <td>{complaint.remark}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination className="justify-content-center">
            <Pagination.Prev
              onClick={() => setComplaintsForDriverPage(complaintsForDriverPage - 1)}
              disabled={complaintsForDriverPage === 1}
            />
            {[...Array(Math.ceil(complaintsForDriverData.length / itemsPerPage))].map((_, idx) => (
              <Pagination.Item
                key={idx + 1}
                active={idx + 1 === complaintsForDriverPage}
                onClick={() => setComplaintsForDriverPage(idx + 1)}
              >
                {idx + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => setComplaintsForDriverPage(complaintsForDriverPage + 1)}
              disabled={complaintsForDriverPage === Math.ceil(complaintsForDriverData.length / itemsPerPage)}
            />
          </Pagination>
        </section>
        <hr className="table-hr" />

        <section className="mt-4">

          <div className="dms-pages-header">
            <h4>Complaint By Driver</h4>
            <Button variant="primary" onClick={() => navigate('/complaint-by-driver/list')}>View All</Button>
          </div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Trip ID</th>
                <th>Driver ID</th>
                <th>Date & Time</th>
                <th>Complaint Type</th>
                <th>Remark</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginate(complaintsByDriverData, complaintsByDriverPage).map((complaint, index) => (
                <tr key={index}>
                  <td>
                    <a href="#" role="button" className='trip-id-link' onClick={() => navigate('/trip/details', { state: { trip: complaint } })}>
                      {complaint.tripId}
                    </a>
                  </td>
                  <td>
                    <a href={`/drivers/details/view`} className="driver-id-link">
                      {complaint.driverId}
                    </a>
                  </td>
                  <td>{complaint.date} <br /> {complaint.time}</td>
                  <td>{complaint.complaintType}</td>
                  <td>{complaint.remark}</td>
                  <td>
                    <FaEye
                      className="icon icon-blue"
                      title="View"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination className="justify-content-center">
            <Pagination.Prev
              onClick={() => setComplaintsByDriverPage(complaintsByDriverPage - 1)}
              disabled={complaintsByDriverPage === 1}
            />
            {[...Array(Math.ceil(complaintsByDriverData.length / itemsPerPage))].map((_, idx) => (
              <Pagination.Item
                key={idx + 1}
                active={idx + 1 === complaintsByDriverPage}
                onClick={() => setComplaintsByDriverPage(idx + 1)}
              >
                {idx + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => setComplaintsByDriverPage(complaintsByDriverPage + 1)}
              disabled={complaintsByDriverPage === Math.ceil(complaintsByDriverData.length / itemsPerPage)}
            />
          </Pagination>
        </section> */}
        <Modal show={showActivationModal} onHide={() => setShowActivationModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Activation Request Sent</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Activation request has been sent to the rider.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => setShowActivationModal(false)}>
              OK
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </AdminLayout>
  );
};
