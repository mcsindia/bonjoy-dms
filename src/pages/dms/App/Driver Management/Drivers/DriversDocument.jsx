import React, { useEffect, useState } from "react";
import { Table, Form, Pagination, Button } from "react-bootstrap";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

export const DriversDocument = () => {
  const userData = JSON.parse(localStorage.getItem("userData"));

  const [expiringDocuments, setExpiringDocuments] = useState([]);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [driverFilter, setDriverFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchExpiringDocuments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/getDriverAllExpiringDocuments`, {
        params: { page: currentPage - 1, limit: itemsPerPage },
        headers: { Authorization: `Bearer ${userData?.token}` }
      });

      const drivers = response.data?.data || [];
      const allDocs = [];

      drivers.forEach(driver => {
        driver.expiringDocuments?.forEach(doc => {
          allDocs.push({
            ...doc,
            driverId: driver.driverId,
            driverName: driver.fullName,
            driverMobile: driver.mobile,
            driverEmail: driver.email,
          });
        });
      });

      const filteredDocs = allDocs.filter(doc =>
        doc.driverName.toLowerCase().includes(driverFilter.toLowerCase()) &&
        (dateFilter ? doc.expiry_date === dateFilter : true)
      );

      filteredDocs.sort((a, b) => new Date(a.expiry_date) - new Date(b.expiry_date));

      setExpiringDocuments(filteredDocs);
      setTotalPages(Math.ceil(filteredDocs.length / itemsPerPage));
    } catch (error) {
      console.error("Failed to fetch expiring documents:", error);
      setExpiringDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpiringDocuments();
  }, [currentPage, itemsPerPage, driverFilter, dateFilter]);

  // Checkbox logic
  const toggleSelectDoc = (id) => {
    setSelectedDocs(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const pageDocs = expiringDocuments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const allSelected = pageDocs.every(doc => selectedDocs.includes(doc.id));
    if (allSelected) {
      setSelectedDocs(prev => prev.filter(d => !pageDocs.map(doc => doc.id).includes(d)));
    } else {
      setSelectedDocs(prev => [...new Set([...prev, ...pageDocs.map(doc => doc.id)])]);
    }
  };

  const handleStatusUpdate = async () => {
    if (selectedDocs.length === 0) {
      alert("Please select at least one document.");
      return;
    }

    try {
      // Collect unique driver IDs from selected documents
      const driverIds = [
        ...new Set(
          expiringDocuments
            .filter(doc => selectedDocs.includes(doc.id))
            .map(doc => doc.driverId)
        )
      ];

      // Call the updateDriverStatus API
      await axios.post(`${API_BASE_URL}/updateDriverStatus`,
        { driverId: driverIds },
        { headers: { Authorization: `Bearer ${userData?.token}` } }
      );

      alert("Driver status updated successfully!");
      setSelectedDocs([]);
      fetchExpiringDocuments();
    } catch (err) {
      console.error("Error updating driver status:", err);
      alert("Failed to update driver status. Try again.");
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) setCurrentPage(pageNumber);
  };

  return (
    <AdminLayout>
      <div className="dms-pages-header sticky-header mb-2">
        <h3 className="d-flex align-items-center">Drivers Expiring Documents</h3>

        <div className="mb-2 d-flex gap-2">
          {selectedDocs.length > 0 && (
            <Button variant="danger" onClick={handleStatusUpdate}>
              Set Selected Drivers Inactive
            </Button>
          )}
        </div>
      </div>

      <div className="dms-table-container mt-3">
        {loading ? (
          <div className="text-center py-5 fs-4">Loading...</div>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>
                  <Form.Check
                    type="checkbox"
                    onChange={toggleSelectAll}
                    checked={expiringDocuments.length > 0 && expiringDocuments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                      .every(doc => selectedDocs.includes(doc.id))}
                  />
                </th>
                <th>S.No</th>
                <th>Driver</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Document Type</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th>View Document</th>
              </tr>
            </thead>
            <tbody>
              {expiringDocuments.length > 0 ? (
                expiringDocuments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((doc, idx) => (
                    <tr key={doc.id}>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={selectedDocs.includes(doc.id)}
                          onChange={() => toggleSelectDoc(doc.id)}
                        />
                      </td>
                      <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                      <td>{doc.driverName}</td>
                      <td>{doc.driverMobile}</td>
                      <td>{doc.driverEmail}</td>
                      <td>{doc.doc_type}</td>
                      <td>{doc.expiry_date}</td>
                      <td>{doc.status}</td>
                      <td>
                        <a href={`${IMAGE_BASE_URL}${doc.file_url}`} target="_blank" rel="noopener noreferrer">View</a>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center">No expiring documents found.</td>
                </tr>
              )}
            </tbody>
          </Table>
        )}

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
            className="pagination-option w-auto"
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
