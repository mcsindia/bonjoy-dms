import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, Row, Col, Table, Modal } from 'react-bootstrap';
import axios from 'axios';
import { FaArrowLeft, FaEye, FaEdit, FaDownload, FaHistory, } from "react-icons/fa";
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

export const DriverApprovalView = () => {
    const { state } = useLocation();
    const driverId = state?.driver?.userId;
    const navigate = useNavigate();
    const actionMenuRefs = useRef([]);
    const [driverDetails, setDriverDetails] = useState({});
    const [currentDocuments, setCurrentDocuments] = useState([]);
    const [currentVehicleDocuments, setCurrentVehicleDocuments] = useState([]);
    const [bankDocuments, setBankDocuments] = useState([]);
    const [driverVehicle, setDriverVehicle] = useState({});
    const [loading, setLoading] = useState(true);
    const [showVersionModal, setShowVersionModal] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [showResubmitModal, setShowResubmitModal] = useState(false);
    const [resubmitReason, setResubmitReason] = useState("");
    const [selectedResubmitDoc, setSelectedResubmitDoc] = useState(null);
    const [showActions, setShowActions] = useState(false);
    const driverActionMenuRefs = useRef({});
    const [showDriverActions, setShowDriverActions] = useState(null);
    const vehicleActionMenuRefs = useRef({});
    const [showVehicleActions, setShowVehicleActions] = useState(null);
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

    const handleAction = async (action, docName, doc = null, type = 'driver', driverId = null, vehicleId = null) => {
        if (!doc?.id) return alert("Document ID is missing");

        if (action === "Resubmit") {
            setSelectedResubmitDoc(doc);
            setShowResubmitModal(true);
        } else if (action === "View") {
            handleImageView(doc);
        } else if (action === "Download") {
            if (doc && doc.docFile) {
                handleImageDownload(doc.docFile, docName);
            } else {
                alert('Document file is missing or not available for download.');
            }
        } else if (action === "Approve" || action === "Reject") {
            if ((type === "driver" && !driverId) || (type === "vehicle" && !vehicleId)) {
                return alert(`${type.charAt(0).toUpperCase() + type.slice(1)} ID is missing.`);
            }

            try {
                const updatedStatus = action === "Approve" ? "Approved" : "Rejected";

                if (type === "driver" && driverId) {
                    const response = await axios.put(
                        `${API_BASE_URL}/updateDriverProfile/${driverId}`,
                        {
                            accountStatus: updatedStatus,
                            reason: action === "Resubmit" ? "accountstatus - resubmission" : ""
                        }
                    );
                    if (response.status === 200) {
                        alert(`Driver profile ${updatedStatus.toLowerCase()} successfully.`);
                        fetchData();
                    } else {
                        alert("Failed to update driver profile. Please try again.");
                    }
                } else if (type === "vehicle" && vehicleId) {
                    const response = await axios.put(
                        `${API_BASE_URL}/updateVehicle/${vehicleId}`,
                        {
                            status: updatedStatus
                        }
                    );
                    if (response.status === 200) {
                        alert(`Vehicle status updated to ${updatedStatus.toLowerCase()}.`);
                        fetchData();
                    } else {
                        alert("Failed to update vehicle status. Please try again.");
                    }
                } else if (type === "document") {
                    const response = await axios.put(
                        `${API_BASE_URL}/updateDocumentFile/${doc.id}`,
                        {
                            verificationStatus: updatedStatus
                        }
                    );
                    if (response.status === 200) {
                        alert(`Document ${updatedStatus.toLowerCase()} successfully.`);
                        fetchData();
                    } else {
                        alert("Failed to update document status. Please try again.");
                    }
                }
            } catch (error) {
                console.error(`${action} error:`, error);
                alert(`Failed to ${action.toLowerCase()} the ${type}.`);
            }
        } else {
            alert(`${action} clicked for ${docName}`);
        }
    };

   const handleRemarkAction = (doc, docName, type) => {
    console.log("Remark on Document ID:", doc.id, "| Type:", type);
    setSelectedResubmitDoc({ ...doc, type });
    setShowResubmitModal(true);
};

    const getActionsByStatus = (status, docName, doc, type = 'driver') => {
        const actions = [
            <li key="view" onClick={() => handlePermissionCheck("view", () => handleAction("View", docName, doc))}>
                <FaEye className="dms-menu-icon" /> View
            </li>,
            <li key="download" onClick={() => handlePermissionCheck("view", () => handleAction("Download", docName, doc))}>
                <FaDownload className="dms-menu-icon" /> Download
            </li>,
            <li key="versions" onClick={() => handlePermissionCheck("view", () => handleViewVersions(doc, type))}>
                <FaHistory className="dms-menu-icon" /> View Versions
            </li>,
            <li key="remark" onClick={() => handlePermissionCheck("edit", () => handleRemarkAction(doc, docName, type))}>
                <FaEdit className="dms-menu-icon" /> Remark
            </li>
        ];

        return actions;
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

    const fetchData = async () => {
        if (!driverId) return;
        try {
            const res = await axios.get(`${API_BASE_URL}/getDriverAllDocument/${driverId}`);
            const data = res.data.data;

            setDriverDetails(data.DriverProfile[0] || {});
            setDriverVehicle(data.VehicleDetail?.[0] || {});

            const formattedBankDocs = (data.BankDocumentDetail || []).map((doc) => {
                // fallback to the first BankDetail if matching fails
                const matchingBankDetail =
                    (data.BankDetail || []).find(
                        (detail) =>
                            detail.accountNo === doc.account_number ||
                            detail.docType?.toLowerCase() === doc.file_label?.toLowerCase()
                    ) || data.BankDetail?.[0]; // fallback if nothing matches

                return {
                    id: doc.id,
                    fileLabel: doc.file_label,
                    docFile: doc.file_url,
                    details: {
                        accountNo: doc.account_number || matchingBankDetail?.accountNo || "N/A",
                        ifscCode: doc.ifsc_code || matchingBankDetail?.ifscCode || "N/A",
                        bankName: matchingBankDetail?.bankName || "N/A",
                        branchName: matchingBankDetail?.branchName || "N/A",
                        verificationStatus: doc.status?.trim() || matchingBankDetail?.verificationStatus || "N/A",
                        uploadetAt: doc.createdAt,
                        docType: doc.file_label,
                    },
                };
            });

            const formattedDriverDocs = (data.Document || []).map((doc) => ({
                id: doc.id,
                fileLabel: doc.file_label || doc.doc_type,
                docFile: doc.file_url,
                verificationStatus: doc.status,
                uploadetAt: doc.createdAt,
                details: {
                    docType: doc.doc_type,
                    version: null,
                    expiryDate: null,
                },
            }));

            const formattedVehicleDocs = (data.VehicleDocument || []).map((doc) => ({
                id: doc.id,
                fileLabel: doc.file_label || doc.doc_type,
                docFile: doc.file_url,
                verificationStatus: doc.status,
                uploadetAt: doc.createdAt,
                details: {
                    DocType: doc.doc_type,
                    version: null,
                    expiryDate: doc.expiry_date || null,
                },
            }));

            setCurrentDocuments(formattedDriverDocs);
            setCurrentVehicleDocuments(formattedVehicleDocs);
            setBankDocuments(formattedBankDocs);
        } catch (error) {
            console.error("Error fetching driver details:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [driverId]);

    if (loading) {
        return <AdminLayout><div className="p-4">Loading driver details...</div></AdminLayout>;
    }

    const handleResubmit = async () => {
        if (!selectedResubmitDoc?.id) return alert("Document ID is missing.");

        const formData = new FormData();
        formData.append("rejection_reason", resubmitReason);
        formData.append("status", selectedResubmitDoc.remarkStatus.toLowerCase());

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
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (response.status === 200) {
                alert("Document updated successfully.");
                setShowResubmitModal(false);
                setResubmitReason("");
                setSelectedResubmitDoc(null);
                fetchData();
            } else {
                alert("Update failed.");
            }
        } catch (error) {
            console.error("Error during update:", error);
            alert("An error occurred while updating the document.");
        }
    };

    const handleDriverActionMenuToggle = (id) => {
        setShowVehicleActions(null);
        setShowDriverActions(id === showDriverActions ? null : id);
    };

    const handleVehicleActionMenuToggle = (id) => {
        setShowDriverActions(null);
        setShowVehicleActions(id === showVehicleActions ? null : id);
    };

    const handleImageView = (doc) => {
        if (doc && doc.docFile) {
            const fullUrl = `${IMAGE_BASE_URL}${doc.docFile.startsWith("/") ? "" : "/"}${doc.docFile}`;
            window.open(fullUrl, '_blank');
        } else {
            alert('Document file is missing or not available.');
        }
    };

    const handleImageDownload = async (docFile, fileName) => {
        try {
            const response = await fetch(`${IMAGE_BASE_URL}${docFile.startsWith("/") ? "" : "/"}${docFile}`);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `${fileName}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading image:", error);
            alert("Failed to download the image.");
        }
    };

    const handleApproveProfile = async () => {
        const allDriverDocsApproved = currentDocuments.every(
            doc => doc.verificationStatus?.trim().toLowerCase() === "approved"
        );

        const allVehicleDocsApproved = currentVehicleDocuments.every(
            doc => doc.verificationStatus?.trim().toLowerCase() === "approved"
        );

        const allBankDocsApproved = bankDocuments.every(
            doc => doc.details?.verificationStatus?.trim().toLowerCase() === "approved"
        );

        if (!allDriverDocsApproved || !allVehicleDocsApproved || !allBankDocsApproved) {
            alert("All driver, vehicle, and bank documents must be approved before activating the profile.");
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/createDriverProfile`, {
                driverId: driverId,
                status: "Active"
            });

            if (response.data?.success) {
                alert("Driver profile approved and activated successfully.");
                navigate("/dms/driver");
            } else {
                alert(response.data?.message || "Approval failed. Please try again.");
            }
        } catch (error) {
            console.error("Approval error:", error);
            alert("An error occurred while approving the driver profile.");
        }
    };

    return (
        <AdminLayout>
            <div className="approval-card-header d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">Registered Driver Details</h4>
                <div className="d-flex ms-2">
                    <Button className="back-button me-2" onClick={() => navigate(-1)}>
                        <FaArrowLeft /> Back
                    </Button>
                    <Button className="btn-success" onClick={handleApproveProfile}>
                        Approve
                    </Button>
                </div>
            </div>

            <Card className="p-3 mb-4">
                <div className="approval-card-header d-flex align-items-center justify-content-between">
                    <a
                        href={`${IMAGE_BASE_URL}${driverDetails.profileImage?.startsWith("/") ? "" : "/"}${driverDetails.profileImage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img
                            src={`${IMAGE_BASE_URL}${driverDetails.profileImage?.startsWith("/") ? "" : "/"}${driverDetails.profileImage}`}
                            alt="Driver Profile"
                            className="rounded-circle"
                            width="80"
                            height="80"
                            style={{ cursor: 'pointer' }}
                        />
                    </a>
                    <div className="d-flex align-items-center justify-content-between gap-2">
                        <Button
                            className="btn-sm"
                            onClick={() => handleImageDownload(driverDetails.profileImage, driverDetails.fullName)}
                        >
                            <FaDownload className="me-1" />
                            Download
                        </Button>
                    </div>
                </div>
                <hr />
                <Row>
                    <Col md={4}><p><strong>Full Name:</strong> {driverDetails.fullName}</p></Col>
                    <Col md={4}><p><strong>DOB:</strong> {driverDetails.date_of_birth ? new Date(driverDetails.date_of_birth).toLocaleDateString() : "N/A"}</p></Col>
                    <Col md={4}><p><strong>Age:</strong> {
                        driverDetails.date_of_birth
                            ? Math.floor((new Date() - new Date(driverDetails.date_of_birth)) / (365.25 * 24 * 60 * 60 * 1000))
                            : "N/A"
                    }</p></Col>
                </Row>
                <Row>
                    <Col md={4}><p><strong>City:</strong> {driverDetails.city || "N/A"}</p></Col>
                    <Col md={4}><p><strong>State:</strong> {driverDetails.State || "N/A"}</p></Col>
                    <Col md={4}><p><strong>Pincode:</strong> {driverDetails.pinCode || "N/A"}</p></Col>
                </Row>
                <Col md={6}><p><strong>Permanent Address:</strong> {driverDetails.permanentAddress || "N/A"}</p></Col>
                <Col md={6}><p><strong>Temporary Address:</strong> {driverDetails.temporaryAddress || "N/A"}</p></Col>
            </Card>

            <h5 className='mb-3'>Driver Documents</h5>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Doc Type</th>
                        <th>Document Name</th>
                        <th>Status</th>
                        <th>Uploaded At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentDocuments && currentDocuments.length > 0 ? (
                        currentDocuments.map((doc) => (
                            <tr key={doc.id}>
                                <td>{doc.details ? doc.details.docType : 'N/A'}</td>
                                <td>{doc.fileLabel}</td>
                                <td>{doc.verificationStatus}</td>
                                <td>{doc.uploadetAt ? new Date(doc.uploadetAt).toLocaleString() : 'N/A'}</td>
                                <td
                                    className="action"
                                    ref={(el) => {
                                        driverActionMenuRefs.current[doc.id] = el;
                                    }}
                                >
                                    <span className="dms-span-action" onClick={() => handleDriverActionMenuToggle(doc.id)}>⋮</span>
                                    {showDriverActions === doc.id && (
                                        <div className="dms-show-actions-menu">
                                            <ul>{getActionsByStatus(doc.verificationStatus, doc.fileLabel, doc, 'driver')}</ul>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7">No documents available.</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* Vehicle Details */}
            <Card className="p-4 mt-5 mb-5">
                <div className="approval-card-header">
                    <h5>Vehicle Information</h5>
                </div>
                <hr />
                <Row>
                    <Col md={4}><p><strong>Vehicle Number:</strong> {driverVehicle.vehicleNumber || "N/A"}</p></Col>
                    <Col md={4}><p><strong>Fuel Type:</strong> {driverVehicle.fuelType || "N/A"}</p></Col>
                    <Col md={4}><p><strong>Owned:</strong> {driverVehicle.owned || "N/A"}</p></Col>
                </Row>
                <Row>
                    <Col md={4}><p><strong>Type:</strong> {driverVehicle.type || "N/A"}</p></Col>
                    <Col md={4}><p><strong>Registration No.:</strong> {driverVehicle.registrationNumber || "N/A"}</p></Col>
                    <Col md={4}>
                        <p><strong>Registration Date:</strong> {driverVehicle.registrationDate ? new Date(driverVehicle.registrationDate).toLocaleDateString() : "N/A"}</p>
                    </Col>
                </Row>
            </Card>

            <h5 className='mb-3'>Vehicle Documents</h5>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Doc Type</th>
                        <th>Document Name</th>
                        <th>Status</th>
                        <th>Expiry Date</th>
                        <th>Uploaded At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentVehicleDocuments.length > 0 ? currentVehicleDocuments.map((doc) => (
                        <tr key={doc.id}>
                            <td>{doc.details ? doc.details.DocType : 'N/A'}</td>
                            <td>{doc.fileLabel}</td>
                            <td>{doc.verificationStatus}</td>
                            <td>{doc.details?.expiryDate ? new Date(doc.details.expiryDate).toLocaleDateString() : 'N/A'}</td>
                            <td>{doc.uploadetAt ? new Date(doc.uploadetAt).toLocaleString() : 'N/A'}</td>
                            <td
                                className="action"
                                ref={(el) => {
                                    vehicleActionMenuRefs.current[doc.id] = el;
                                }} >
                                <span className="dms-span-action" onClick={() => handleVehicleActionMenuToggle(doc.id)}>⋮</span>
                                {showVehicleActions === doc.id && (
                                    <div className="dms-show-actions-menu">
                                        <ul>{getActionsByStatus(doc.verificationStatus, doc.documentName, doc, 'vehicle')}</ul>
                                    </div>
                                )}
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="7" className="text-center">No documents found.</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <hr className='table-hr' />

            {/* Bank Details */}
            <h5 className='mb-3'>Bank Documents</h5>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Doc Type</th>
                        <th>Account Number</th>
                        <th>Bank Name</th>
                        <th>Branch</th>
                        <th>IFSC Code</th>
                        <th>Status</th>
                        <th>Uploaded At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {bankDocuments.map((doc) => (
                        <tr key={doc.id}>
                            <td>{doc.fileLabel || "N/A"}</td>
                            <td>{doc.details?.accountNo || "N/A"}</td>
                            <td>{doc.details?.bankName || "N/A"}</td>
                            <td>{doc.details?.branchName || "N/A"}</td>
                            <td>{doc.details?.ifscCode || "N/A"}</td>
                            <td>{doc.details?.verificationStatus?.trim()}</td>
                            <td>{new Date(doc.details?.uploadetAt).toLocaleString()}</td>
                            <td
                                className="action"
                                ref={(el) => {
                                    actionMenuRefs.current[doc.id] = el;
                                }}  >
                                <span
                                    className="dms-span-action"
                                    onClick={() => setShowActions(showActions === doc.id ? null : doc.id)}
                                > ⋮
                                </span>
                                {showActions === doc.id && (
                                    <div className="dms-show-actions-menu">
                                        <ul>{getActionsByStatus(doc.details?.verificationStatus, doc.fileLabel || doc.details?.docType, doc, 'bank')}</ul>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Version History Modal */}
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

            {/* Resubmit Modal */}
            <Modal show={showResubmitModal} onHide={() => setShowResubmitModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Document Remark</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><strong>Document:</strong> {selectedResubmitDoc?.fileLabel || "NA"}</p>

                    <div className="mb-3">
                        <label className="form-label"><strong>Status</strong></label>
                        <select
                            className="form-select"
                            value={selectedResubmitDoc?.remarkStatus || ''}
                            onChange={(e) =>
                                setSelectedResubmitDoc(prev => ({
                                    ...prev,
                                    remarkStatus: e.target.value
                                }))
                            }
                        >
                            <option value="">Select Status</option>
                            <option value="approved">approved</option>
                            <option value="rejected">rejected</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label"><strong>Remark</strong></label>
                        <textarea
                            className="form-control"
                            rows="4"
                            placeholder="Enter your remark..."
                            value={resubmitReason}
                            onChange={(e) => setResubmitReason(e.target.value)}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowResubmitModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleResubmit}
                        disabled={!selectedResubmitDoc?.remarkStatus || !resubmitReason.trim()}
                    >
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </AdminLayout>
    );
};