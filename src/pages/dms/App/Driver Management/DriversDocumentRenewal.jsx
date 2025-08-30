import React, { useState, useEffect } from 'react';
import { Table, Button, Alert, Pagination, Form } from 'react-bootstrap';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const DriversDocumentRenewal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const driverId = location.state?.driver?.driverId;
  const [renewals, setRenewals] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showAlert, setShowAlert] = useState(false);
  const [isKycComplete, setIsKycComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetching renewals from API
  useEffect(() => {
    if (!driverId) return;

    const fetchRenewals = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/getAllDriverDocuments?page=1&limit=5&driverId=${driverId}`);
        const result = await response.json();

        if (result.success && result.data?.data) {
          setRenewals(result.data.data);
        } else {
          console.error("Failed to fetch documents");
        }
      } catch (error) {
        console.error("Error fetching driver documents:", error);
      }
      setLoading(false);
    };

    if (driverId) {
      fetchRenewals();
    }
  }, [driverId, itemsPerPage]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = renewals.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(renewals.length / itemsPerPage);
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleSendKYC = () => setShowAlert(true);
  const handleKycToggle = () => setIsKycComplete(!isKycComplete);

  return (
    <AdminLayout>
      <div className="dms-pages-header sticky-header">
        <h3>Document Renewal</h3>
      </div>

      {loading ? (
        <div className="text-center py-5 fs-4">Loading...</div>
      ) : renewals.length === 0 ? (
        <div className="text-center my-5">
          <h3>No documents are available for renewal.</h3>
        </div>
      ) : (
        <>
          {showAlert && (
            <Alert variant="warning" onClose={() => setShowAlert(false)} dismissible>
              Dear Driver, kindly login to the app and complete your KYC as soon as possible regarding Bond Joy.
            </Alert>
          )}

          <div className="kyc-container mb-4">
            <Button
              onClick={handleKycToggle}
              className="d-flex align-items-center yellow-button"
            >
              Complete KYC
              <Form.Check
                type="switch"
                id="kyc-toggle"
                checked={isKycComplete}
                onChange={handleKycToggle}
                className="ms-2"
              />
            </Button>

            <Button className='green-button' onClick={handleSendKYC}>
              Send KYC
            </Button>
          </div>

          <div className="table-responsive">
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>S.no</th>
                  <th>Document ID</th>
                  <th>Document Type</th>
                  <th>Created At</th>
                  <th>Renewal Status</th>
                  <th>Renewed By</th>
                  <th>Renewal Date</th>
                  <th>Expiry Date</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((renewal, index) => (
                    <tr key={renewal.id}>
                      <td>{indexOfFirstItem + index + 1}</td>
                      <td>{renewal.docFileId || 'NA'}</td>
                      <td>{renewal.docType || 'NA'}</td>
                      <td>{new Date(renewal.uploadedAt).toLocaleString() || 'NA'}</td>
                      <td>{renewal.verificationStatus || 'NA'}</td>
                      <td>{renewal.renewedBy || 'NA'}</td>
                      <td>{renewal.submittedAt ? new Date(renewal.submittedAt).toLocaleString() : 'NA'}</td>
                      <td>{renewal.expiryDate ? new Date(renewal.expiryDate).toLocaleDateString() : 'NA'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
                      No renewals found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          <div className="pagination-container">
            <Pagination className="mb-0">
              <Pagination.Prev
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              />
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
            </Pagination>

            <Form.Select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className='pagination-option w-auto'
            >
              <option value="5">Show 5</option>
              <option value="10">Show 10</option>
              <option value="20">Show 20</option>
              <option value="30">Show 30</option>
              <option value="50">Show 50</option>
            </Form.Select>
          </div>
        </>
      )}
    </AdminLayout>
  );
};
