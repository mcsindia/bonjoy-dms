import React, { useEffect, useState } from "react";
import { Table, Modal, Button, Tabs, Tab } from "react-bootstrap";
import { FaDownload, FaEye, FaEdit, FaHistory } from "react-icons/fa";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const DriverAllDocuments = ({ driverId }) => {
  const [driverDocs, setDriverDocs] = useState([]);
  const [vehicleDocs, setVehicleDocs] = useState([]);
  const [bankDocs, setBankDocs] = useState([]);
  const [showResubmitModal, setShowResubmitModal] = useState(false);
  const [resubmitReason, setResubmitReason] = useState("");
  const [selectedResubmitDoc, setSelectedResubmitDoc] = useState(null);
  const [showActions, setShowActions] = useState(null);

  // Extract permissions from userData
  const userData = JSON.parse(localStorage.getItem("userData"));
  let permissions = [];

  if (Array.isArray(userData?.employeeRole)) {
    for (const role of userData.employeeRole) {
      for (const child of role.childMenus || []) {
        for (const mod of child.modules || []) {
          if (mod.moduleUrl?.toLowerCase() === "driveralldocuments") {
            permissions = mod.permission
              ?.toLowerCase()
              .split(",")
              .map((p) => p.trim()) || [];
          }
        }
      }
    }
  }

  useEffect(() => {
    if (!driverId) return;

    axios
      .get(`${API_BASE_URL}/getDriverAllDocument/${driverId}`)
      .then((res) => {
        const data = res.data?.data;
        if (data) {
          setDriverDocs(data.Document || []);
          setVehicleDocs(data.VehicleDocument || []);

          const combinedBankDocs = (data.BankDocumentDetail || []).map((doc) => {
            const bankDetail = (data.BankDetail || []).find(
              (b) => b.driverId === doc.driverId
            );
            return {
              ...doc,
              account_number: bankDetail?.accountNo || "N/A",
              ifsc_code: bankDetail?.ifscCode || "N/A",
            };
          });
          setBankDocs(combinedBankDocs);
        }
      })
      .catch((err) => console.error("Error fetching documents:", err));
  }, [driverId]);

  const handleAction = (actionType, docName, doc) => {
    // Implement logic: open viewer, download file, etc.
  };

  const handleViewVersions = (doc, type) => {
  };

  const handleRemarkAction = (doc, docName, type) => {
    setSelectedResubmitDoc({ ...doc, type });
    setShowResubmitModal(true);
  };

  const handleActionMenuToggle = (docId) => {
    setShowActions((prev) => (prev === docId ? null : docId));
  };

  const handleResubmit = async () => {
    if (!selectedResubmitDoc?.id) return alert("Document ID is missing.");

    const formData = new FormData();
    formData.append("rejection_reason", resubmitReason);
    formData.append("status", selectedResubmitDoc.remarkStatus?.toLowerCase());

    try {
      let endpoint = "";

      if (selectedResubmitDoc.type === "bank") {
        endpoint = `${API_BASE_URL}/updateDriverBankDocument/${selectedResubmitDoc.id}`;
      } else if (selectedResubmitDoc.type === "vehicle") {
        endpoint = `${API_BASE_URL}/updateDriverVehicleDocument/${selectedResubmitDoc.id}`;
      } else {
        endpoint = `${API_BASE_URL}/updateDriverDocument/${selectedResubmitDoc.id}`;
      }

      const response = await axios.put(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        alert("Document updated successfully.");
        setShowResubmitModal(false);
        setResubmitReason("");
        setSelectedResubmitDoc(null);

        // Refresh list
        const res = await axios.get(`${API_BASE_URL}/getDriverAllDocument/${driverId}`);
        const data = res.data?.data;
        if (data) {
          setDriverDocs(data.Document || []);
          setVehicleDocs(data.VehicleDocument || []);
        }
      } else {
        alert("Update failed.");
      }
    } catch (error) {
      console.error("Error during update:", error);
      alert("An error occurred while updating the document.");
    }
  };

  // ✅ Actions visible based on permissions
  const getActionsByStatus = (status, docName, doc, type = "driver") => {
    const actions = [];

    if (permissions.includes("view")) {
      actions.push(
        <li key="view" onClick={() => handleAction("View", docName, doc)}>
          <FaEye className="dms-menu-icon" /> View
        </li>,
        <li key="download" onClick={() => handleAction("Download", docName, doc)}>
          <FaDownload className="dms-menu-icon" /> Download
        </li>,
        <li key="versions" onClick={() => handleViewVersions(doc, type)}>
          <FaHistory className="dms-menu-icon" /> View Versions
        </li>
      );
    }

    if (
      permissions.includes("edit") &&
      (status?.toLowerCase() === "pending" || status?.toLowerCase() === "rejected")
    ) {
      actions.push(
        <li key="remark" onClick={() => handleRemarkAction(doc, docName, type)}>
          <FaEdit className="dms-menu-icon" /> Remark
        </li>
      );
    }

    return actions;
  };

  return (
    <>
      <Tabs defaultActiveKey="driverDocuments" id="documents-tabs" className="mb-3">
        {/* Driver Documents */}
        <Tab eventKey="driverDocuments" title="Driver Documents">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Document Name</th>
                <th>Status</th>
                <th>Uploaded At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {driverDocs.map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.file_label || "NA"}</td>
                  <td>{doc.status || "NA"}</td>
                  <td>{doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : "NA"}</td>
                  <td>
                    <span onClick={() => handleActionMenuToggle(doc.id)}>⋮</span>
                    {showActions === doc.id && (
                      <ul>{getActionsByStatus(doc.verificationStatus, doc.file_label, doc, "driver")}</ul>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>

        {/* Vehicle Documents */}
        <Tab eventKey="vehicleDocuments" title="Vehicle Documents">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Document Name</th>
                <th>Status</th>
                <th>Expiry</th>
                <th>Uploaded At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicleDocs.map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.file_label || "NA"}</td>
                  <td>{doc.status || "NA"}</td>
                  <td>{doc.expiryDate ? new Date(doc.expiryDate).toLocaleDateString() : "NA"}</td>
                  <td>{doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : "NA"}</td>
                  <td>
                    <span onClick={() => handleActionMenuToggle(doc.id)}>⋮</span>
                    {showActions === doc.id && (
                      <ul>{getActionsByStatus(doc.verificationStatus, doc.file_label, doc, "vehicle")}</ul>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>

        {/* Bank Documents */}
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
                bankDocs.map((doc) => (
                  <tr key={doc.id}>
                    <td>{doc.file_label || "NA"}</td>
                    <td>{doc.account_number || "NA"}</td>
                    <td>{doc.ifsc_code || "NA"}</td>
                    <td>{doc.status || "NA"}</td>
                    <td>{doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : "NA"}</td>
                    <td>
                      <span onClick={() => handleActionMenuToggle(doc.id)}>⋮</span>
                      {showActions === doc.id && (
                        <ul>{getActionsByStatus(doc.verificationStatus, doc.file_label, doc, "bank")}</ul>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No bank documents found.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Tab>
      </Tabs>

      {/* Remark Modal */}
      <Modal show={showResubmitModal} onHide={() => setShowResubmitModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Document Remark</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Document:</strong> {selectedResubmitDoc?.file_label || "NA"}
          </p>
          <div className="mb-3">
            <label>Status</label>
            <select
              className="form-select"
              value={selectedResubmitDoc?.remarkStatus || ""}
              onChange={(e) =>
                setSelectedResubmitDoc((prev) => ({ ...prev, remarkStatus: e.target.value }))
              }
            >
              <option value="">Select Status</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="mb-3">
            <label>Remark</label>
            <textarea
              className="form-control"
              rows="3"
              value={resubmitReason}
              onChange={(e) => setResubmitReason(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowResubmitModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleResubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
