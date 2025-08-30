import React, { useState, useRef, useEffect } from "react";
import { Table, Pagination, DropdownButton, Dropdown, InputGroup, Form, Modal, Button } from "react-bootstrap"; // Added missing imports
import { FaDownload, FaEye, FaTrash, FaEdit, FaFolderOpen, FaHistory } from "react-icons/fa";
import { AdminLayout } from "../../../../layouts/dms/AdminLayout/AdminLayout";
import { useLocation } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

export const DriversDocument = () => {
  const location = useLocation();
  const driverId = location.state?.driver?.id;
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  useEffect(() => {
    if (!driverId) return;

    const fetchDocuments = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/getDriverAllDocument/${driverId}`);
        const result = await response.json();

        const allDocs = [];

        if (result?.data) {
          // Personal Documents
          (result.data.Document || []).forEach(doc => {
            allDocs.push({
              id: doc.id,
              docType: 'Personal',
              docName: doc.doc_type,
              fileLabel: doc.file_label,
              file_url: doc.file_url,
              version: doc.version,
              status: doc.status?.trim() || 'N/A',
              uploadedAt: doc.createdAt,
              rejectionReason: doc.rejection_reason || '',
              category: 'Personal',
            });
          });

          // Bank Documents
          (result.data.BankDocumentDetail || []).forEach(doc => {
            allDocs.push({
              id: doc.id,
              docType: 'Bank',
              docName: doc.file_label,
              fileLabel: doc.file_label,
              file_url: doc.file_url,
              version: doc.version,
              status: doc.status?.trim() || 'N/A',
              uploadedAt: doc.createdAt,
              rejectionReason: doc.rejection_reason || '',
              category: 'Bank',
            });
          });

          // Vehicle Documents
          (result.data.VehicleDocument || []).forEach(doc => {
            allDocs.push({
              id: doc.id,
              docType: 'Vehicle',
              docName: doc.file_label,
              fileLabel: doc.file_label,
              file_url: doc.file_url,
              version: doc.version,
              status: doc.status?.trim() || 'N/A',
              uploadedAt: doc.createdAt,
              rejectionReason: doc.rejection_reason || '',
              category: 'Vehicle',
            });
          });
        }

        setDocuments(allDocs);
      } catch (error) {
        console.error("Error fetching driver documents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [driverId]);


  const handleAction = async (action, docId) => {
    const doc = documents.find(d => d.id === docId);
    if (!doc) return alert("Document not found");

    const fileUrl = doc.file_url?.startsWith("https")
      ? doc.file_url
      : `${IMAGE_BASE_URL}${doc.file_url?.startsWith("/") ? "" : "/"}${doc.file_url}`;

    if (!fileUrl) return alert("Document URL is missing");

    if (action === "View") {
      // open in new tab
      window.open(fileUrl, "_blank");
    } else if (action === "Download") {
      try {
        const response = await fetch(fileUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `${doc.docName || "document"}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Download error:", error);
        alert("Failed to download the document.");
      }
    } else {
      alert(`${action} clicked for ${doc.docName}`);
    }
  };

  // Pagination Logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDocuments = documents.slice(startIndex, startIndex + itemsPerPage);

  const totalPages = Math.ceil(documents.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleViewVersions = async (docId) => {
    const doc = documents.find((doc) => doc.id === docId);
    if (!doc) return;

    // 1. Immediately show the modal with loading state
    setSelectedDocument({ ...doc, versions: null }); // or [] if you want
    setShowVersionModal(true);

    try {
      const response = await fetch(`${API_BASE_URL}/getDocumentVersions/${docId}`);
      const result = await response.json();

      if (result?.data) {
        setSelectedDocument((prev) => ({
          ...prev,
          versions: result.data,
        }));
      } else {
        setSelectedDocument((prev) => ({
          ...prev,
          versions: [],
        }));
      }
    } catch (err) {
      console.error("Error fetching versions:", err);
      setSelectedDocument((prev) => ({
        ...prev,
        versions: [],
      }));
    }
  };

  // Close the modal
  const handleCloseModal = () => {
    setShowVersionModal(false);
  };

  return (
    <AdminLayout>
      <div className="driver-documents-page">
        <div className="dms-pages-header sticky-header">
          <h3>Driver Documents</h3>
        </div>

        {/* Filters */}
        {/*   <div className="filter-search-container">
          <div className="filter-container">
            <DropdownButton title={`Filter by status`} onSelect={handleFilterStatus}>
              <Dropdown.Item eventKey="">All</Dropdown.Item>
              <Dropdown.Item eventKey="Verified">Verified</Dropdown.Item>
              <Dropdown.Item eventKey="Pending">Pending</Dropdown.Item>
              <Dropdown.Item eventKey="Rejected">Rejected</Dropdown.Item>
            </DropdownButton>
  
            <DropdownButton title={`Filter by category`} onSelect={handleFilterCategory}>
              <Dropdown.Item eventKey="">All</Dropdown.Item>
              <Dropdown.Item eventKey="Personal Doc">Personal Doc</Dropdown.Item>
              <Dropdown.Item eventKey="Vehicle Document">Vehicle Document</Dropdown.Item>
              <Dropdown.Item eventKey="Bank Document">Bank Document</Dropdown.Item>
            </DropdownButton> 
          </div>

          <InputGroup className="dms-custom-width">
            <Form.Control
              placeholder="Search by driver doc name..."
              value={search}
              onChange={handleSearch}
            />
          </InputGroup>
        </div>
 */}
        <div className="dms-table-container">
          {loading ? (
            <div className="text-center py-5 fs-4">Loading...</div>
          ) : (
            <>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Doc Type</th>
                    <th>Document Name</th>
                    <th>Version</th>
                    <th>Status</th>
                    <th>Expiry Date</th>
                    <th>Uploaded At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentDocuments.map((doc) => (
                    <tr key={doc.id}>
                      <td>{doc.docType}</td>
                      <td>{doc.docName}</td>
                      <td>{doc.version || 'N/A'}</td>
                      <td>{doc.status}</td>
                      <td>{doc.expiry_date || 'N/A'}</td>
                      <td>{new Date(doc.uploadedAt).toLocaleString()}</td>
                      <td>
                        <FaEye
                          className="icon-blue me-2"
                          title="View"
                          onClick={() => handleAction("View", doc.id)}
                        />
                        <FaDownload
                          className="icon icon-black me-2"
                          title="Download"
                          onClick={() => handleAction("Download", doc.id)}
                        />
                        <FaHistory
                          title="Version History"
                          onClick={() => handleViewVersions(doc.id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* Pagination Component */}
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
        <Modal show={showVersionModal} onHide={handleCloseModal} size="lg">
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
                {selectedDocument?.versions === null ? (
                  <tr>
                    <td colSpan="6" className="text-center">Loading version history...</td>
                  </tr>
                ) : selectedDocument?.versions?.length > 0 ? (
                  selectedDocument.versions.map((version, index) => (
                    <tr key={index}>
                      <td>{version.version}</td>
                      <td>{new Date(version.uploadedAt).toLocaleString()}</td>
                      <td>{version.verificationStatus}</td>
                      <td>{version.verifiedBy || "—"}</td>
                      <td>{version.rejectionReason || "—"}</td>
                      <td><FaEye className="icon-blue" /></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">No version history available.</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </AdminLayout>
  );
};