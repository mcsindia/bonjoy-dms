import React, { useState } from 'react';
import { Card, Table, Pagination, Tab, Tabs, Form} from 'react-bootstrap';
import { FaDownload, FaEye,} from 'react-icons/fa'; 
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';
import profile_img from '../../../../assets/images/profile.png';

export const RegisteredDriversView = () => {

    const [driverDocsPage, setDriverDocsPage] = useState(1);
    const [vehicleDocsPage, setVehicleDocsPage] = useState(1);
    const [isApproved, setIsApproved] = useState(false);
    const itemsPerPage = 3; // Items per page for pagination
    const walletAmt = 100;
  
    // Example data  
    const driverDetails = {
      Driver_ID: "D001",
      user_Id: 1,
      Name: "John Doe",
      Photo: profile_img, // Driver photo
      Phone: "123456789",
      Email: "john.doe@example.com",
      License: "DL123456",
      License_Expiry: "2025-12-31 7:00 AM",
      Status: "Active",
      preferred_payment_method: 'Cash',
      average_rating: 4.5,
      Driver_Documents: [
        { id: 'DOC101', name: 'Driver License', status: 'verified', link: '/path/to/driver-license.pdf', expiry: '2025-12-31, 4:55 PM' },
        { id: 'DOC102', name: 'Medical Certificate', status: 'Not verified', link: '/path/to/medical-certificate.pdf', expiry: '2024-06-30, 2:00 AM' },
      ],
    };
  
    const vehicleDetails = {
      Vehicle_ID: "V001",
      Type: "SUV",
      Brand: "Toyota",
      Model: "Highlander",
      Registration_Number: "ABC-1234",
      Registration_Date: "2023-05-20, 8:00 AM",
      Status: "In Use",
      Vehicle_Documents: [
        { id: 'DOC001', name: 'Vehicle Registration', status: 'verified', link: '/path/to/vehicle-registration.pdf', expiry: '2025-05-20 8:00 PM' },
        { id: 'DOC002', name: 'Insurance', status: 'verified', link: '/path/to/insurance.pdf', expiry: '2024-12-31 4:45 PM' },
      ],
    };
   const [driverDocs, setDriverDocs] = useState(driverDetails.Driver_Documents);
    const [vehicleDocs, setVehicleDocs] = useState(vehicleDetails.Vehicle_Documents);
  
    // Function to toggle verification status
    const toggleStatus = (id, type) => {
      if (type === "driver") {
        setDriverDocs((prevDocs) =>
          prevDocs.map((doc) =>
            doc.id === id ? { ...doc, status: doc.status === "verified" ? "Not verified" : "verified" } : doc
          )
        );
      } else if (type === "vehicle") {
        setVehicleDocs((prevDocs) =>
          prevDocs.map((doc) =>
            doc.id === id ? { ...doc, status: doc.status === "verified" ? "Not verified" : "verified" } : doc
          )
        );
      }
    };
  
    const paginate = (data, currentPage) => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      return data.slice(startIndex, startIndex + itemsPerPage);
    };
  
    const driverDocsPages = Math.ceil(driverDetails.Driver_Documents.length / itemsPerPage);
    const vehicleDocsPages = Math.ceil(vehicleDetails.Vehicle_Documents.length / itemsPerPage);
  
    return (
      <AdminLayout>
        <div className="driver-details-container">
          <Card className="mb-4">
            <Card.Body className="d-flex justify-content-between align-items-center m-4 card-body-custom">
              <div className="d-flex align-items-center me-3">
                <img
                  src={profile_img}
                  alt={`${driverDetails.Name}'s Profile`}
                  className="rounded-circle me-4 profile-img"
                />
                <div>
                  <h2>{driverDetails.Name}</h2>
                  <p>
                    <strong>User ID:</strong> {driverDetails.user_Id}{" "}
                  </p>
                  <p>
                  <Form.Check
                      type="switch"
                      id="approve-driver"
                      label={isApproved ? "Approved" : "Not Approved"}
                      checked={isApproved}
                      onChange={() => setIsApproved(!isApproved)}
                    />
                  </p>
                </div>
              </div>
  
              {/* Wallet Section */}
              <div className="text-left ms-3">
                <h3>Wallet</h3>
                <p>
                  <strong>Wallet Amount:</strong> ₹{walletAmt}
                </p>
                <p>
                  <strong>Preferred Payment:</strong> {driverDetails.preferred_payment_method}
                </p>
              </div>
            </Card.Body>
          </Card>

        {/* Driver Information */}
        <h4>Driver Information</h4>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>License</th>
              <th>License Expiry</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{driverDetails.Name}</td>
              <td>{driverDetails.Phone}</td>
              <td>{driverDetails.Email}</td>
              <td>{driverDetails.License}</td>
              <td>{driverDetails.License_Expiry}</td>
              <td>{driverDetails.Status}</td>
            </tr>
          </tbody>
        </Table>

        <hr className="table-hr" />

        {/* Vehicle Information */}
        <h4>Vehicle Information</h4>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Vehicle ID</th>
              <th>Type</th>
              <th>Brand</th>
              <th>Model</th>
              <th>Registration Number</th>
              <th>Registration Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{vehicleDetails.Vehicle_ID}</td>
              <td>{vehicleDetails.Type}</td>
              <td>{vehicleDetails.Brand}</td>
              <td>{vehicleDetails.Model}</td>
              <td>{vehicleDetails.Registration_Number}</td>
              <td>{vehicleDetails.Registration_Date}</td>
              <td>{vehicleDetails.Status}</td>
            </tr>
          </tbody>
        </Table>

        <hr className="table-hr" />

        <Tabs defaultActiveKey="driverDocuments" id="documents-tabs" className="mb-3">
      {/* Driver Documents Tab */}
      <Tab eventKey="driverDocuments" title="Driver Documents">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Document ID</th>
              <th>Name</th>
              <th>Status</th>
              <th>Expiry</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          {paginate(driverDetails.Driver_Documents, driverDocsPage).map((doc) => (
              <tr key={doc.id}>
                <td>{doc.id}</td>
                <td>{doc.name}</td>
                <td>
                  <Form.Check
                    type="switch"
                    id={`toggle-driver-${doc.id}`}
                    label={doc.status}
                    checked={doc.status === "verified"}
                    onChange={() => toggleStatus(doc.id, "driver")}
                  />
                </td>
                <td>{doc.expiry}</td>
                <td>
                  <a href={doc.link} target="_blank" rel="noopener noreferrer">
                    <FaEye className="icon icon-blue" />
                  </a>
                  <a href={doc.link} target="_blank" rel="noopener noreferrer">
                    <FaDownload className="icon icon-black" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Pagination className="justify-content-center">
      <Pagination.Prev
        onClick={() => setDriverDocsPage(driverDocsPage - 1)}
        disabled={driverDocsPage === 1}
      />
      {[...Array(driverDocsPages)].map((_, idx) => (
        <Pagination.Item
          key={idx + 1}
          active={idx + 1 === driverDocsPage}
          onClick={() => setDriverDocsPage(idx + 1)}
        >
          {idx + 1}
        </Pagination.Item>
      ))}
      <Pagination.Next
        onClick={() => setDriverDocsPage(driverDocsPage + 1)}
        disabled={driverDocsPage === driverDocsPages}
      />
    </Pagination>
      </Tab>

      {/* Vehicle Documents Tab */}
      <Tab eventKey="vehicleDocuments" title="Vehicle Documents">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Document ID</th>
              <th>Name</th>
              <th>Status</th>
              <th>Expiry</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          {paginate(vehicleDetails.Vehicle_Documents, vehicleDocsPage).map((doc) => (
              <tr key={doc.id}>
                <td>{doc.id}</td>
                <td>{doc.name}</td>
                <td>
                  <Form.Check
                    type="switch"
                    id={`toggle-vehicle-${doc.id}`}
                    label={doc.status}
                    checked={doc.status === "verified"}
                    onChange={() => toggleStatus(doc.id, "vehicle")}
                  />
                </td>
                <td>{doc.expiry}</td>
                <td>
                  <a href={doc.link} target="_blank" rel="noopener noreferrer">
                    <FaEye className="icon icon-blue" />
                  </a>
                  <a href={doc.link} target="_blank" rel="noopener noreferrer">
                    <FaDownload className="icon icon-black" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Pagination className="justify-content-center">
      <Pagination.Prev
        onClick={() => setVehicleDocsPage(vehicleDocsPage - 1)}
        disabled={vehicleDocsPage === 1}
      />
      {[...Array(vehicleDocsPages)].map((_, idx) => (
        <Pagination.Item
          key={idx + 1}
          active={idx + 1 === vehicleDocsPage}
          onClick={() => setVehicleDocsPage(idx + 1)}
        >
          {idx + 1}
        </Pagination.Item>
      ))}
      <Pagination.Next
        onClick={() => setVehicleDocsPage(vehicleDocsPage + 1)}
        disabled={vehicleDocsPage === vehicleDocsPages}
      />
    </Pagination>
      </Tab>
    </Tabs>
      </div>
    </AdminLayout>
  );
};
