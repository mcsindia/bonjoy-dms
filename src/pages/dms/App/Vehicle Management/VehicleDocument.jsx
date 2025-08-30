import React, { useState, useRef, useEffect } from "react";
import { Table, Pagination, DropdownButton, Dropdown, InputGroup, Form, Modal, Button } from "react-bootstrap";
import { AdminLayout } from "../../../../layouts/dms/AdminLayout/AdminLayout";
import { FaDownload, FaEye, FaTrash, FaEdit, FaFolderOpen, FaHistory } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const VehicleDocument = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showActions, setShowActions] = useState(null);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const actionMenuRefs = useRef({});
  const location = useLocation();
  const vehicleId = location.state?.vehicle?.id;
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!vehicleId) {
        setError("Vehicle ID is missing");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/getAllVehicleDocDetails`);
        // Assuming response.data.data.data contains documents array
        setDocuments(response.data?.data?.data || []);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to fetch documents");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [vehicleId, itemsPerPage]);

  const handleActionMenuToggle = (id) => {
    setShowActions(id === showActions ? null : id);
  };

  const handleAction = (action, docName) => {
    alert(`${action} clicked for ${docName}`);
  };

  const handleViewVersions = (doc) => {
    setSelectedDocument(doc);
    setShowVersionModal(true);
  };

  const getActionsByStatus = (status, docName, doc) => {
    const actions = [
      <li key="view" onClick={() => handleAction("View", docName)}><FaEye className="dms-menu-icon" /> View</li>,
      <li key="download" onClick={() => handleAction("Download", docName)}><FaDownload className="dms-menu-icon" /> Download</li>
    ];

    if (status === "Pending") {
      actions.push(
        <li key="approve" onClick={() => handleAction("Approve", docName)}><FaEdit className="dms-menu-icon" /> Approve</li>,
        <li key="reject" onClick={() => handleAction("Reject", docName)}><FaTrash className="dms-menu-icon" /> Reject</li>
      );
    } else if (status === "Approved") {
      actions.push(
        <li key="revoke" onClick={() => handleAction("Revoke", docName)}><FaFolderOpen className="dms-menu-icon" /> Revoke</li>
      );
    }

    actions.push(
      <li key="history" onClick={() => handleViewVersions(doc)}><FaHistory className="dms-menu-icon" /> View Versions</li>
    );

    return actions;
  };

  const filteredDocuments = documents
    .filter((doc) => doc.vehicleId === vehicleId) // Filter to current vehicle
    .filter((doc) => {
      const docType = doc.docType || "";
      const documentName = doc.documentName || "";
      const status = doc.status || "";

      return (
        (docType.toLowerCase().includes(search.toLowerCase()) ||
          documentName.toLowerCase().includes(search.toLowerCase())) &&
        (filterStatus ? status === filterStatus : true)
      );
    });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDocuments = filteredDocuments.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);

  const handleSearch = (event) => setSearch(event.target.value);
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handleFilterStatus = (status) => setFilterStatus(status);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showActions !== null) {
        const ref = actionMenuRefs.current[showActions];
        if (ref && !ref.contains(event.target)) {
          setShowActions(null);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showActions]);

  return (
    <AdminLayout>
      <div className="dms-pages-header sticky-header">
        <h3>Vehicle Documents</h3>
      </div>

      <div className="filter-search-container">
        <DropdownButton title={`Filter by status`} onSelect={handleFilterStatus}>
          <Dropdown.Item eventKey="">All</Dropdown.Item>
          <Dropdown.Item eventKey="Approved">Approved</Dropdown.Item>
          <Dropdown.Item eventKey="Pending">Pending</Dropdown.Item>
          <Dropdown.Item eventKey="Rejected">Rejected</Dropdown.Item>
        </DropdownButton>

        <InputGroup className="dms-custom-width">
          <Form.Control
            placeholder="Search by doc name..."
            value={search}
            onChange={handleSearch}
          />
        </InputGroup>
      </div>

      <div className="dms-table-container">
        {loading ? (
          <div className="text-center mt-5">
            <h4>Loading vehicle documents...</h4>
          </div>
        ) : (
          <>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Doc Type</th>
                  <th>Doc Name</th>
                  <th>Version</th>
                  <th>Vehicle Number</th>
                  <th>Created At</th>
                  <th>Status</th>
                  <th>Uploaded At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {error ? (
                  <tr><td colSpan="8" className=" text-center">{error}</td></tr>
                ) : currentDocuments.length > 0 ? (
                  currentDocuments.map((doc) => (
                    <tr key={doc.id}>
                      <td>{doc.DocType}</td>
                      <td>{doc.DocName}</td>
                      <td>{doc.version}</td>
                      <td>{doc.VehicleDocument?.vehicleNumber || "—"}</td>
                      <td>{new Date(doc.createdAt).toLocaleDateString()}</td>
                      <td>{doc.status}</td>
                      <td>{new Date(doc.uploadetAt).toLocaleDateString()}</td>
                      <td
                        className="action"
                        ref={(el) => { actionMenuRefs.current[doc.id] = el; }}
                      >
                        <span className="dms-span-action" onClick={() => handleActionMenuToggle(doc.id)}>⋮</span>
                        {showActions === doc.id && (
                          <div className="dms-show-actions-menu">
                            <ul>{getActionsByStatus(doc.status, doc.DocName, doc)}</ul>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="8" className="text-center">No documents found.</td></tr>
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
          </>
        )}
      </div>

      {/* Version History Modal */}
      <Modal show={showVersionModal} onHide={() => setShowVersionModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Version History</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Version</th>
                <th>Uploaded At</th>
                <th>Status</th>
                <th>Verified By</th>
                <th>Rejection Reason</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {selectedDocument?.versions?.map((ver, index) => (
                <tr key={index}>
                  <td>{ver.version}</td>
                  <td>{new Date(ver.uploadedAt).toLocaleString()}</td>
                  <td>{ver.status}</td>
                  <td>{ver.verifiedBy || "—"}</td>
                  <td>{ver.rejectionReason || "—"}</td>
                  <td><FaEye className="icon-blue" title="View Version" /></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowVersionModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};
