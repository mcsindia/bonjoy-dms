import React, { useState } from 'react';
import { Card, Table, Pagination, Tabs, Tab } from 'react-bootstrap';
import { FaDownload, FaEye } from 'react-icons/fa';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';
import frontcar_img from '../../../../../assets/images/toyotafront.jpg';
import backcar_img from '../../../../../assets/images/toyotaback.jpg';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const VehicleDetailsView = () => {
  const [activeTab, setActiveTab] = useState('vehicle');
  const [vehicleDocsPage, setVehicleDocsPage] = useState(1);
  const [driverDocsPage, setDriverDocsPage] = useState(1);
  const itemsPerPage = 2;
  const location = useLocation();
  const vehicleId = location.state?.vehicle?.id;
  const [vehicleDetails, setVehicleDetails] = useState(null);
  const [vehicleDocuments, setVehicleDocuments] = useState([]);
  const [driverDocuments, setDriverDocuments] = useState([]);
  const [driverInfo, setDriverInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      if (!vehicleId) return;
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/getVehicleById/${vehicleId}`);
        const data = response.data;
        setVehicleDetails(data);
        const driverId = data?.driverId?.id;
        if (driverId) {
          await fetchDriverDocuments(driverId);
          await fetchDriverInfo(driverId);
        }
      } catch (err) {
        console.error("Error fetching vehicle details:", err);
        setError("Failed to fetch vehicle details.");
      } finally {
        setLoading(false);
      }
    };

    const fetchVehicleDocuments = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/getAllVehicleDocDetails`);
        const allDocs = response.data.data?.data || [];
        const filteredDocs = allDocs.filter(doc => doc.vehicleId === vehicleId);
        setVehicleDocuments(filteredDocs);
      } catch (err) {
        console.error("Error fetching vehicle documents:", err);
      }
    };

    const fetchDriverDocuments = async (driverId) => {
      try {
        const response = await axios.get(`${API_BASE_URL}/getAllDriverDocuments?page=1&limit=100`);
        const allDriverDocs = response.data?.data?.data || [];
        const filteredDriverDocs = allDriverDocs.filter(doc => doc.driverId === driverId);
        setDriverDocuments(filteredDriverDocs);
      } catch (err) {
        console.error("Error fetching driver documents:", err);
      }
    };

    const fetchDriverInfo = async (driverId) => {
      try {
        const response = await axios.get(`${API_BASE_URL}/getAllDriverProfiles?page=1&limit=100`);
        const allDrivers = response.data?.data?.data || [];
        const driver = allDrivers.find((d) => d.driverId?.id === driverId);
        setDriverInfo(driver || null);
      } catch (err) {
        console.error("Error fetching driver info:", err);
      }
    };

    fetchVehicleDetails();
    fetchVehicleDocuments();
  }, [vehicleId]);

  const paginate = (data, currentPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  if (loading) return <AdminLayout><div>Loading...</div></AdminLayout>;
  if (error) return <AdminLayout><div>{error}</div></AdminLayout>;
  if (!vehicleDetails) return <AdminLayout><div>No vehicle data available.</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="vehicle-details-container">
        <h4 className='mb-3'>Vehicle Details</h4>
 
        <Card className="mb-4" style={{ boxShadow: 'none' }}>
          <Card.Body className="d-flex">
            <div style={{ flex: 1 }}>
              

              <p><strong>Vehicle ID:</strong> {vehicleDetails.id}</p>
              <p><strong>Type:</strong> {vehicleDetails.type}</p>
              <p><strong>Brand:</strong> {vehicleDetails.brandId}</p>
              <p><strong>Model:</strong> {vehicleDetails.modelId}</p>
              <p><strong>Registration Number:</strong> {vehicleDetails.registrationNumber}</p>
              <p><strong>Registration Date:</strong> {new Date(vehicleDetails.registrationDate).toLocaleString()}</p>
            </div>
            <div className="d-flex justify-content-center align-items-center">
              <img src={frontcar_img} alt="Front view" className="rounded-circle me-4 vehicle-img" />
              <img src={backcar_img} alt="Back view" className="rounded-circle me-4 vehicle-img" />
            </div>
          </Card.Body>
        </Card>

        <h4 className='mb-3'>Driver Information</h4>
        {driverInfo ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Driver ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>City</th>
                <th>Ratings</th>
                <th>Account Status</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{driverInfo.id}</td>
                <td>{driverInfo.fullName}</td>
                <td>{driverInfo.user?.mobile}</td>
                <td>{driverInfo.city}</td>
                <td>{driverInfo.ratings}</td>
                <td>{driverInfo.accountStatus}</td>
                <td>{driverInfo.status}</td>
              </tr>
            </tbody>
          </Table>
        ) : (
          <p>No driver info available.</p>
        )}
        <hr className="table-hr" />

        <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
          <Tab eventKey="vehicle" title="Vehicle Documents">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Document ID</th>
                  <th>Doc Name</th>
                  <th>Status</th>
                  <th>Expiry</th>
                  <th>Version</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginate(vehicleDocuments, vehicleDocsPage).map((doc) => (
                  <tr key={doc.id}>
                    <td>{doc.id}</td>
                    <td>{doc.DocName}</td>
                    <td>{doc.status}</td>
                    <td>{new Date(doc.expiryDate).toLocaleDateString()}</td>
                    <td>{doc.version}</td>
                    <td>
                      <FaEye className="icon icon-blue me-2" title="View" />
                      <FaDownload className="icon icon-black" title="Download" />
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
              {[...Array(Math.ceil(vehicleDocuments.length / itemsPerPage))].map((_, idx) => (
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
                disabled={vehicleDocsPage === Math.ceil(vehicleDocuments.length / itemsPerPage)}
              />
            </Pagination>
          </Tab>
          <Tab eventKey="driver" title="Driver Documents">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Document ID</th>
                  <th>Doc Name</th>
                  <th>Status</th>
                  <th>Expiry</th>
                  <th>Version</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginate(driverDocuments, driverDocsPage).map((doc) => (
                  <tr key={doc.id}>
                    <td>{doc.id}</td>
                    <td>{doc.docName}</td>
                    <td>{doc.verificationStatus}</td>
                    <td>{new Date(doc.expiryDate).toLocaleDateString()}</td>
                    <td>{doc.version}</td>
                    <td>
                      <FaEye className="icon icon-blue me-2" title="View" />
                      <FaDownload className="icon icon-black" title="Download" />
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
              {[...Array(Math.ceil(driverDocuments.length / itemsPerPage))].map((_, idx) => (
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
                disabled={driverDocsPage === Math.ceil(driverDocuments.length / itemsPerPage)}
              />
            </Pagination>
          </Tab>
        </Tabs>
      </div>
    </AdminLayout>
  );
};
