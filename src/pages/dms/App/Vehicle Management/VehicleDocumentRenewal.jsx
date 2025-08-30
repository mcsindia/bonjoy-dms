import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Table, Form, Pagination, Button } from 'react-bootstrap';
import axios from 'axios';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const VehicleDocumentRenewal = () => {
  const location = useLocation();
  const vehicle = location.state?.vehicle;
  const [renewals, setRenewals] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showAlert, setShowAlert] = useState(false);
  const [isKycComplete, setIsKycComplete] = useState(false);

  useEffect(() => {
    const fetchVehicleDocuments = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/getAllVehicleDocDetails`);
        const allDocs = response.data?.data?.data || [];
        const filtered = allDocs.filter((doc) => doc.vehicleId === vehicle?.id);

        // Map to renewal structure (you can modify this according to real data)
        const mapped = filtered.map((doc, index) => ({
          renewalId: doc.id,
          documentId: doc.DocName,
          renewalDate: new Date(doc.expiryDate).toLocaleString(),
          renewalStatus: doc.status,
          renewedBy: doc.VehicleDocument?.Driver?.User?.fullName || 'NA',
          createdAt: new Date(doc.createdAt).toLocaleString(),
        }));

        setRenewals(mapped);
      } catch (err) {
        console.error('Failed to fetch vehicle documents', err);
      } finally {
        setLoading(false);
      }
    };

    if (vehicle?.id) fetchVehicleDocuments();
  }, [vehicle?.id, itemsPerPage]);

  const handleSendKYC = () => setShowAlert(true);
  const handleKycToggle = () => setIsKycComplete(!isKycComplete);

  const filteredData = renewals.filter(
    (r) =>
      (r.documentId.toLowerCase().includes(search.toLowerCase()) ||
        r.renewedBy.toLowerCase().includes(search.toLowerCase())) &&
      (selectedFilter ? r.renewalStatus.toLowerCase() === selectedFilter.toLowerCase() : true)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <AdminLayout>
      <div className="dms-pages-header sticky-header">
        <h3>Vehicle Document Renewals </h3>
      </div>

      {/* Search and Filter */}
      <div className="filter-search-container">
        <div className="kyc-container">
          <Button onClick={handleKycToggle} className="d-flex align-items-center yellow-button">
            Complete KYC
            <Form.Check
              type="switch"
              id="kyc-toggle"
              checked={isKycComplete}
              onChange={handleKycToggle}
              className="ms-2"
            />
          </Button>

          <Button className="green-button" onClick={handleSendKYC}>
            Send KYC
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="dms-table-container">
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Renewal ID</th>
              <th>Document Name</th>
              <th>Renewal Date</th>
              <th>Status</th>
              <th>Renewed By</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="text-center">Loading...</td></tr>
            ) : currentItems.length > 0 ? (
              currentItems.map((r) => (
                <tr key={r.renewalId}>
                  <td>{r.renewalId}</td>
                  <td>{r.documentId}</td>
                  <td>{r.renewalDate}</td>
                  <td>{r.renewalStatus}</td>
                  <td>{r.renewedBy}</td>
                  <td>{r.createdAt}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" className="text-center">No renewals found.</td></tr>
            )}
          </tbody>
        </Table>

        {/* Pagination */}
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
      </div>
    </AdminLayout>
  );
};
