import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Table, Pagination, Form, Button, Modal, Tab, Tabs, Row, Col } from 'react-bootstrap';
import { FaDownload, FaEye, FaStar, FaEdit, FaBell, FaHistory } from 'react-icons/fa';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';
import profile_img from '../../../../assets/images/profile.png';
import { useLocation } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

export const DriversDetailsView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const driverId = location.state?.driver?.userId;
  const [driverDetails, setDriverDetails] = useState(null);
  const [bankDetails, setBankDetails] = useState(null);
  const [driverDocs, setDriverDocs] = useState([]);
  const [vehicleDocs, setVehicleDocs] = useState([]);
  const [vehicleInfo, setVehicleInfo] = useState(null);
  const [bankDocs, setBankDocs] = useState([]);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [contactDetails, setContactDetails] = useState([]);
  const itemsPerPage = 5;

  const userData = JSON.parse(localStorage.getItem("userData"));
  let permissions = [];

  if (Array.isArray(userData?.employeeRole)) {
    for (const role of userData.employeeRole) {
      for (const child of role.childMenus || []) {
        for (const mod of child.modules || []) {
          if (mod.moduleUrl?.toLowerCase() === "driver") {
            permissions = mod.permission
              ?.toLowerCase()
              .split(',')
              .map(p => p.trim()) || [];
          }
        }
      }
    }
  }

  const handlePermissionCheck = (permissionType, action, fallbackMessage = null) => {
    if (permissions.includes(permissionType)) {
      action(); // allowed, run the actual function
    } else {
      alert(fallbackMessage || `You don't have permission to ${permissionType} this employee.`);
    }
  };

  useEffect(() => {
    if (driverId) {
      axios.get(`${API_BASE_URL}/getDriverAllDocument/${driverId}`)
        .then(res => {
          if (res.data?.data) {
            const {
              DriverProfile,
              BankDetail,
              BankDocumentDetail,
              Document,
              VehicleDetail,
              VehicleDocument,
            } = res.data.data;

            setDriverDetails(DriverProfile?.[0] || null);
            setBankDetails(BankDetail || []);
            // Merge BankDetail with BankDocumentDetail using driverId
            const combinedBankDocs = (BankDocumentDetail || []).map((doc) => {
              const matchingDetail = (BankDetail || []).find(
                (detail) => detail.driverId === doc.driverId
              );
              return {
                ...doc,
                account_number: matchingDetail?.accountNo || 'N/A',
                ifsc_code: matchingDetail?.ifscCode || 'N/A',
              };
            });

            setBankDocs(combinedBankDocs);
            setDriverDocs(Document || []);
            setVehicleDocs(VehicleDocument || []);
            setVehicleInfo(VehicleDetail?.[0] || null);
          }
        })
        .catch(err => console.error("Failed to fetch driver all document data:", err));
    }
  }, [driverId]);

  // Function to trigger the download
  const handleDownload = async (fileUrl) => {
    try {
      const response = await fetch(fileUrl, { mode: 'cors' });
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileUrl.split('/').pop();
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download file. Please check if the server allows it.");
    }
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

  const sendReminder = (doc, type) => {
    console.log(`Sending reminder for ${type} document:, doc`);
  };

  const handleViewVersions = async (doc, type) => {
    if (!doc?.id || !driverId) {
      alert("Missing document or driver ID.");
      return;
    }

    let documentType = "";
    if (type === "driver") documentType = "Driver Document";
    else if (type === "vehicle") documentType = "Driver Vehicle Document";
    else if (type === "bank") documentType = "Driver Bank Document";

    try {
      const response = await axios.get(
        `${API_BASE_URL}/getDocumentLog/?driverId=${driverId}&documentType=${documentType}&documentId=${doc.id}`
      );

      if (Array.isArray(response.data) && response.data.length > 0) {
        setSelectedDocument({
          ...doc,
          versions: response.data
        });
        setShowVersionModal(true);
      } else {
        alert("No version history found for this document.");
      }
    } catch (error) {
      console.error("Error fetching version history:", error);
      alert("Failed to fetch version history.");
    }
  };

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("userData"))?.token;
        const response = await axios.get(`${API_BASE_URL}/getAllUserContacts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data?.success) {
          const filteredContacts = response.data.data.filter(
            (contact) => contact.userId === driverId
          );
          setContactDetails(filteredContacts);
        }
      } catch (error) {
        console.error("Failed to fetch contacts:", error);
      }
    };

    if (driverId) {
      fetchContacts();
    }
  }, [driverId]);

  return (
    <AdminLayout>
      <div className="driver-details-container">
        <Card className="mb-4">
          <Card.Body className="d-flex justify-content-between align-items-center m-4 card-body-custom">
            {/* Left Side - Driver Profile */}
            <div className="d-flex align-items-center me-3">
              <a
                href={
                  driverDetails?.profileImage
                    ? `${IMAGE_BASE_URL}${driverDetails.profileImage}`
                    : profile_img
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={
                    driverDetails?.profileImage
                      ? `${IMAGE_BASE_URL}${driverDetails.profileImage}`
                      : profile_img
                  }
                  alt={`${driverDetails?.fullName}'s Profile`}
                  className="rounded-circle border profile-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = profile_img;
                  }}
                />
              </a>
              <div>
                <h2>{driverDetails?.fullName || 'NA'}</h2>
                <p>
                  <strong>Phone: </strong> {driverDetails?.mobile || 'NA'}
                </p>
                <p>
                  <strong>Status: </strong>
                  <span className={`badge ${driverDetails?.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                    {driverDetails?.status || 'NA'}
                  </span>
                </p>
                <p>
                  <strong>Rating: </strong>
                  <span className="ms-2">
                    {renderStars(driverDetails?.ratings || 0)}
                  </span>
                </p>
              </div>
            </div>

            {/* Right Side - Driver Type */}
            <div className="d-flex flex-column align-items-end">
              <Form.Group className='mb-5' style={{ minWidth: "200px" }}>
                <Form.Label><strong>Driver Type</strong></Form.Label>
                <Form.Select
                  value={driverDetails?.driverType || ""}
                  onChange={(e) =>
                    setDriverDetails(prev => ({
                      ...prev,
                      driverType: e.target.value
                    }))
                  }
                >
                  <option value="">Select Type</option>
                  <option value="emergency">Emergency</option>
                  <option value="commission">Commission</option>
                </Form.Select>
              </Form.Group>
            </div>
          </Card.Body>
        </Card>

        <section className='mb-4'>
          <Tabs defaultActiveKey="driverDetails" id="driver-profile-tabs" className="mb-3">
            <Tab eventKey="driverDetails" title="Profile / KYC Info">
              <Card className="p-4 rounded-4">
                <div className="save-edit-btn">
                  <Card.Title className="mb-4">KYC & Profile Details</Card.Title>
                  <Button
                    className='edit-button'
                    onClick={() => handlePermissionCheck("edit", () =>
                      navigate("/dms/driver/edit", {
                        state: {
                          driver: driverDetails
                        }
                      })
                    )}
                  >
                    <FaEdit className="me-2" />
                    Edit
                  </Button>
                </div>
                <hr />

                <Row className="mb-3">
                  <Col md={4}>
                    <strong>Email: </strong> {driverDetails?.email || 'NA'}
                  </Col>
                  <Col md={4}>
                    <strong>Date of Birth: </strong>
                    {driverDetails?.date_of_birth
                      ? new Date(driverDetails.date_of_birth).toLocaleDateString()
                      : 'NA'}
                  </Col>
                  <Col md={4}>
                    <strong>Age: </strong>
                    {(() => {
                      const dob = driverDetails?.date_of_birth;
                      if (!dob) return 'NA';
                      const birthDate = new Date(dob);
                      const today = new Date();
                      let age = today.getFullYear() - birthDate.getFullYear();
                      const m = today.getMonth() - birthDate.getMonth();
                      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                        age--;
                      }
                      return age;
                    })()}
                  </Col>

                </Row>

                <Row className="mb-3">
                  <Col md={4}>
                    <strong>City: </strong>
                    {driverDetails?.city || 'NA'}
                  </Col>
                  <Col md={4}>
                    <strong>Working City: </strong>
                    {driverDetails?.WorkingCity || 'NA'}
                  </Col>
                  <Col md={4}>
                    <strong>Pin Code: </strong>
                    {driverDetails?.pinCode || 'NA'}
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <strong>Temporary Address: </strong>
                    {driverDetails?.temporaryAddress || 'NA'}
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <strong>Permanent Address: </strong>
                    {driverDetails?.permanentAddress || 'NA'}
                  </Col>
                </Row>
              </Card>
            </Tab>

            <Tab eventKey="vehicle" title="Vehicle Details">
              <Card className="p-4 rounded-4">
                <div className='save-edit-btn'>
                  <Card.Title className="mb-4"> Vehicle Details</Card.Title>
                </div>
                <hr />
                {vehicleInfo ? (
                  <>
                    <Row>
                      <Col md={4}><p><strong>Vehicle Number:</strong> {vehicleInfo.vehicleNumber || "N/A"}</p></Col>
                      <Col md={4}><p><strong>Fuel Type:</strong> {vehicleInfo.fuelType || "N/A"}</p></Col>
                      <Col md={4}><p><strong>Owned:</strong> {vehicleInfo.owned || "N/A"}</p></Col>
                    </Row>
                    <Row>
                      <Col md={4}><p><strong>Type:</strong> {vehicleInfo.type || "N/A"}</p></Col>
                      <Col md={4}><p><strong>Registration No.:</strong> {vehicleInfo.registrationNumber || "N/A"}</p></Col>
                      <Col md={4}>
                        <p><strong>Registration Date:</strong> {vehicleInfo.registrationDate ? new Date(vehicleInfo.registrationDate).toLocaleDateString() : "N/A"}</p>
                      </Col>
                    </Row>
                  </>
                ) : (
                  <p>No vehicle info available.</p>
                )}
              </Card>
            </Tab>
          </Tabs>
        </section>

        <Tabs defaultActiveKey="driverDocuments" id="documents-tabs" className="mb-3">
          {/* Driver Documents Tab */}
          <Tab eventKey="driverDocuments" title="Driver Documents">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Document Name</th>
                  <th>Doc Type</th>
                  <th>Status</th>
                  <th>Uploaded At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {driverDocs.map(doc => (
                  <tr key={doc.id}>
                    <td>{doc.file_label || 'NA'}</td>
                    <td>{doc.doc_type || 'NA'}</td>
                    <td>{doc.status || 'NA'}</td>
                    <td>{doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : 'NA'}</td>
                    <td>
                      <FaEye
                        className="icon icon-blue"
                        onClick={() => handlePermissionCheck("view", () => window.open(`${IMAGE_BASE_URL}${doc.file_url}`, '_blank'))}
                      />
                      <FaDownload
                        className="icon icon-black"
                        onClick={() => handlePermissionCheck("view", () => handleDownload(`${IMAGE_BASE_URL}${doc.file_url}`))}
                      />
                      <FaHistory
                        className="icon icon-gray "
                        title="Version History"
                        onClick={() => handlePermissionCheck("view", () => handleViewVersions(doc, "driver"))}
                      />
                      <FaBell
                        className="icon icon-orange "
                        title="Send Reminder"
                        onClick={() => handlePermissionCheck("add", () => sendReminder(doc, "driver"))}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Tab>
          {/* Vehicle Documents Tab */}
          <Tab eventKey="vehicleDocuments" title="Vehicle Documents">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Doc Type</th>
                  <th>Document Name</th>
                  <th>Status</th>
                  <th>Expiry</th>
                  <th>Uploaded At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vehicleDocs.map(doc => (
                  <tr key={doc.id}>
                    <td>{doc.doc_type || 'NA'}</td>
                    <td>{doc.file_label || 'NA'}</td>
                    <td>{doc.status || 'NA'}</td>
                    <td>{doc.expiryDate ? new Date(doc.expiryDate).toLocaleDateString() : 'NA'}</td>
                    <td>{doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : 'NA'}</td>
                    <td>
                      <FaEye
                        className="icon icon-blue"
                        onClick={() => handlePermissionCheck("view", () => window.open(`${IMAGE_BASE_URL}${doc.file_url}`, '_blank'))}
                      />
                      <FaDownload
                        className="icon icon-black"
                        onClick={() => handlePermissionCheck("view", () => handleDownload(`${IMAGE_BASE_URL}${doc.file_url}`))}
                      />
                      <FaHistory
                        className="icon icon-gray "
                        title="Version History"
                        onClick={() => handlePermissionCheck("view", () => handleViewVersions(doc, "vehicle"))}
                      />
                      <FaBell
                        className="icon icon-orange "
                        title="Send Reminder"
                        onClick={() => handlePermissionCheck("add", () => sendReminder(doc, "vehicle"))}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Tab>
          <Tab eventKey="bankDocuments" title="Bank Documents">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>File Label</th>
                  <th>Account Number</th>
                  <th>IFSC Code</th>
                  <th>Status</th>
                  <th>Uploaded At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bankDocs.length > 0 ? (
                  bankDocs.map((doc, idx) => (
                    <tr key={doc.id || idx}>
                      <td>{doc.file_label || 'N/A'}</td>
                      <td>{doc.account_number || 'N/A'}</td>
                      <td>{doc.ifsc_code || 'N/A'}</td>
                      <td>{doc.status?.trim() || 'N/A'}</td>
                      <td>{doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : 'N/A'}</td>
                      <td>
                        <FaEye
                          className="icon icon-blue"
                          onClick={() => handlePermissionCheck("view", () => window.open(`${IMAGE_BASE_URL}${doc.file_url}`, '_blank'))}
                        />
                        <FaDownload
                          className="icon icon-black"
                          onClick={() => handlePermissionCheck("view", () => handleDownload(`${IMAGE_BASE_URL}${doc.file_url}`))}
                        />
                        <FaHistory
                          className="icon icon-gray "
                          title="Version History"
                          onClick={() => handlePermissionCheck("view", () => handleViewVersions(doc, "bank"))}
                        />
                        <FaBell
                          className="icon icon-orange"
                          title="Send Reminder"
                          onClick={() => handlePermissionCheck("add", () => sendReminder(doc, "bank"))}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="6">No bank documents found.</td></tr>
                )}
              </tbody>
            </Table>
          </Tab>
        </Tabs>

        <hr className="table-hr" />

        {/* Contact Details */}
        <section className="mt-4">
          <h4 className='mb-3'>Contact Details</h4>
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
              {contactDetails.length > 0 ? contactDetails.map((contact, index) => (
                <tr key={contact.id}>
                  <td>{index + 1}</td>
                  <td>{contact.relationship || 'NA'}</td>
                  <td>{contact.contactName || 'NA'}</td>
                  <td>{contact.contactNumber || 'NA'}</td>
                  <td>{new Date(contact.createdAt).toLocaleString() || 'NA'}</td>
                  <td>{new Date(contact.updatedAt).toLocaleString() || 'NA'}</td>
                </tr>
              )) : (
                <tr><td colSpan="6">No contact details available.</td></tr>
              )}
            </tbody>
          </Table>
        </section>
        <hr className="table-hr" />
      </div>

      <Modal show={showVersionModal} onHide={() => setShowVersionModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Version History</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Version</th>
                  <th>Uploaded At</th>
                  <th>Status</th>
                  <th>Rejection Reason</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {selectedDocument?.versions?.map((ver, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{ver.createdAt ? new Date(ver.createdAt).toLocaleString() : "N/A"}</td>
                    <td>{ver.data?.status || "N/A"}</td>
                    <td>{ver.data?.rejection_reason || "—"}</td>
                    <td>
                      <FaEye
                        className="icon-blue"
                        title="View"
                        onClick={() => handleImageView({ docFile: ver.data?.file_url })}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowVersionModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
}; 