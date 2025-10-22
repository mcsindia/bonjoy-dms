import React, { useState, useEffect } from "react";
import {
  Table,
  Form,
  InputGroup,
  Pagination,
  Button,
  Modal,
  Spinner, DropdownButton, Dropdown
} from "react-bootstrap";
import { FaEye, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";
import axios from "axios";
import { getModuleId, getToken } from "../../../../../utils/authhelper";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
});

export const ComplaintLogs = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters and pagination
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal States
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [remark, setRemark] = useState("");

  // 🔹 Fetch API Data
  const fetchComplaints = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: itemsPerPage,
        module_id: getModuleId("complaintlogs"),
      };

      if (status) params.status = status;
      if (date) params.date = date;

      const response = await axios.get(`${API_BASE_URL}/getAllComplaintLog`, {
        headers: getAuthHeaders(),
        params,
      });

      const apiData = response.data?.data?.models || [];
      const totalPageCount = response.data?.data?.totalPages || 1;

      // Transform to frontend-friendly format
      const formatted = apiData.map((item) => ({
        complaint_id: item.id,
        ride_id: item.rideId || "-",
        complainant_id: item.complaintByUser?.id,
        complainant_name: item.complaintByUser?.fullName || "-",
        against_user_id: item.complaintToUser?.id,
        against_user_name: item.complaintToUser?.fullName || "-",
        category: item.category,
        description: item.description,
        status: item.status,
        remark: item.remark || "-",
        created_at: item.createdAt,
        resolved_at: item.resolvedAt,
      }));

      setComplaints(formatted);
      setTotalPages(totalPageCount);
      setCurrentPage(response.data?.data?.currentPage || 1);
    } catch (err) {
      console.error("Error fetching complaints:", err);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints(currentPage);
  }, [currentPage, status, date, itemsPerPage]);

  // 🔹 Handle pagination
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) setCurrentPage(pageNumber);
  };

  // 🔹 Status edit
  const handleStatusEdit = (complaint) => {
    setSelectedComplaint(complaint);
    setNewStatus(complaint.status);
    setRemark(complaint.remark || "");
    setShowStatusModal(true);
  };

  const handleStatusSubmit = async () => {
    if (!selectedComplaint) return;

    try {
      const payload = {
        complaintByuserId: selectedComplaint.complainant_id,
        complaintTouserId: selectedComplaint.against_user_id,
        category: selectedComplaint.category,
        description: selectedComplaint.description,
        status: newStatus,
        remark: remark.trim(),
        resolvedAt:
          newStatus.toLowerCase() === "pending"
            ? null
            : new Date().toISOString().split("T")[0],
        module_id: getModuleId("complaintlogs"),
      };

      const response = await axios.put(
        `${API_BASE_URL}/updateComplaintLog/${selectedComplaint.complaint_id}`,
        payload,
        { headers: getAuthHeaders() }
      );

      if (response.data?.success) {
        // Update locally
        const updated = complaints.map((c) =>
          c.complaint_id === selectedComplaint.complaint_id
            ? {
              ...c,
              status: newStatus,
              remark: remark || "-",
              resolved_at:
                newStatus.toLowerCase() === "pending"
                  ? null
                  : new Date().toISOString(),
            }
            : c
        );
        setComplaints(updated);
        alert("Complaint status updated successfully!");
      } else {
        alert(response.data?.message || "Failed to update complaint status");
      }
    } catch (err) {
      console.error("Error updating complaint status:", err);
      alert("Error updating complaint status");
    } finally {
      setShowStatusModal(false);
      setSelectedComplaint(null);
      setRemark("");
    }
  };

  return (
    <AdminLayout>
      <div className="dms-pages-header sticky-header">
        <h3>Complaint Logs</h3>
      </div>

      {/* Filters */}
      <div className="filter-search-container">
        <div className="filter-container">
          {/* Filter by Status */}
          <DropdownButton
            title={`Filter by Status: ${status === ""
              ? "All"
              : status === "pending"
                ? "Pending"
                : status === "resolved"
                  ? "Resolved"
                  : status === "escalated"
                    ? "Escalated"
                    : "Rejected"
              }`}
          >
            <Dropdown.Item onClick={() => { setStatus(""); setCurrentPage(1); }}>
              All
            </Dropdown.Item>
            <Dropdown.Item onClick={() => { setStatus("pending"); setCurrentPage(1); }}>
              Pending
            </Dropdown.Item>
            <Dropdown.Item onClick={() => { setStatus("resolved"); setCurrentPage(1); }}>
              Resolved
            </Dropdown.Item>
            <Dropdown.Item onClick={() => { setStatus("escalated"); setCurrentPage(1); }}>
              Escalated
            </Dropdown.Item>
            <Dropdown.Item onClick={() => { setStatus("rejected"); setCurrentPage(1); }}>
              Rejected
            </Dropdown.Item>
          </DropdownButton>
          <p className="btn btn-primary mb-0">Filter by Date -</p>
          <Form.Group>
            <Form.Control
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setCurrentPage(1);
              }}
            />
          </Form.Group>
        </div>
      </div>

      {/* Table */}
      <div className="dms-table-container">
        {loading ? (
          <div className="text-center py-5 fs-4">
            <Spinner animation="border" size="sm" /> Loading...
          </div>
        ) : (
          <>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Complainant</th>
                  <th>Against User</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Resolved At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.length > 0 ? (
                  complaints
                    .filter((c) =>
                      c.complainant_name?.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((c, idx) => (
                      <tr key={c.complaint_id}>
                        <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>

                        {/* Complainant (plain text) */}
                        <td>
                          {c.complainant_name || "-"}
                          <br />
                          <small className="text-muted">({c.complainant_id})</small>
                        </td>

                        {/* Against User (plain text) */}
                        <td>
                          {c.against_user_name || "-"}
                          <br />
                          <small className="text-muted">({c.against_user_id})</small>
                        </td>

                        <td>{c.category?.replace("_", " ")}</td>
                        <td>{c.description}</td>
                        <td>
                          {c.status}
                          <FaEdit
                            title="Edit Status"
                            className="icon icon-green ms-2"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleStatusEdit(c)}
                          />
                        </td>
                        <td>{new Date(c.created_at).toLocaleString()}</td>
                        <td>
                          {c.resolved_at ? new Date(c.resolved_at).toLocaleString() : "-"}
                        </td>
                        <td>
                          <FaEye
                            title="View Details"
                            className="icon icon-blue"
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              navigate(`/dms/complaintlogs/view/${c.complaint_id}`, {
                                state: { complaint: c },
                              })
                            }
                          />
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center">
                      No complaints found.
                    </td>
                  </tr>
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

      {/* Modal */}
      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Change Complaint Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
                <option value="escalated">Escalated</option>
                <option value="rejected">Rejected</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleStatusSubmit}
            disabled={!newStatus || !remark.trim()}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};
