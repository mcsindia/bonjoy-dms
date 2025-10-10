import React, { useState, useEffect } from "react";
import {
  Table,
  Form,
  InputGroup,
  Pagination,
  Button,
  Modal,
} from "react-bootstrap";
import { FaEye, FaEdit, FaPen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";

const dummyComplaints = [
  {
    complaint_id: "C001",
    ride_id: "R001",
    complainant_id: "U001",
    complainant_name: "John Doe",
    against_user_id: "U002",
    against_user_name: "Jane Smith",
    category: "driver_behavior",
    description: "Driver was rude during the trip.",
    status: "Pending",
    remark: "-",
    created_at: "2025-10-07T09:45:00Z",
    resolved_at: null,
    pickup_location: "MG Road, Bangalore",
    drop_location: "HSR Layout, Bangalore",
    trip_date: "2025-10-07",
    trip_time: "09:00 AM",
    fare: "450",
    distance: "12 km",
  },
  {
    complaint_id: "C002",
    ride_id: "R002",
    complainant_id: "U003",
    complainant_name: "Robert Johnson",
    against_user_id: "U004",
    against_user_name: "Alice Williams",
    category: "fare_issue",
    description: "Fare was charged incorrectly.",
    status: "Resolved",
    remark: "Refund issued",
    created_at: "2025-10-05T14:20:00Z",
    resolved_at: "2025-10-06T10:00:00Z",
    pickup_location: "Koramangala, Bangalore",
    drop_location: "Indiranagar, Bangalore",
    trip_date: "2025-10-05",
    trip_time: "02:00 PM",
    fare: "300",
    distance: "8 km",
  },
  {
    complaint_id: "C003",
    ride_id: "R003",
    complainant_id: "U005",
    complainant_name: "Emma Brown",
    against_user_id: "U006",
    against_user_name: "Michael Lee",
    category: "delay",
    description: "Driver arrived 30 minutes late.",
    status: "Escalated",
    remark: "Forwarded to management",
    created_at: "2025-10-08T11:30:00Z",
    resolved_at: null,
    pickup_location: "Whitefield, Bangalore",
    drop_location: "Electronic City, Bangalore",
    trip_date: "2025-10-08",
    trip_time: "11:00 AM",
    fare: "600",
    distance: "18 km",
  },
];

export const ComplaintLogs = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal States
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [remark, setRemark] = useState("");

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setComplaints(dummyComplaints);
      setLoading(false);
    }, 500);
  }, []);

  const filteredComplaints = complaints.filter((c) =>
    c.complainant_name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);
  const displayedComplaints = filteredComplaints.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) setCurrentPage(pageNumber);
  };

  // 🔹 Handle status edit button click
  const handleStatusEdit = (complaint) => {
    setSelectedComplaint(complaint);
    setNewStatus(complaint.status);
    setRemark(complaint.remark || "");
    setShowStatusModal(true);
  };

  // 🔹 Save updated status & remark
  const handleStatusSubmit = () => {
    if (!selectedComplaint) return;

    const updated = complaints.map((c) =>
      c.complaint_id === selectedComplaint.complaint_id
        ? {
          ...c,
          status: newStatus,
          remark: remark || "-",
          resolved_at:
            newStatus.toLowerCase() === "resolved"
              ? new Date().toISOString()
              : c.resolved_at,
        }
        : c
    );

    setComplaints(updated);
    setShowStatusModal(false);
    setSelectedComplaint(null);
    setRemark("");
  };

  return (
    <AdminLayout>
      <div className="dms-pages-header sticky-header">
        <h3>Complaint Logs</h3>
      </div>

      {/* Search Filter */}
      <div className="filter-search-container mb-3">
        <InputGroup className="dms-custom-width">
          <Form.Control
            placeholder="Search by complainant name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </InputGroup>
      </div>

      {/* Table */}
      <div className="dms-table-container">
        {loading ? (
          <div className="text-center py-5 fs-4">Loading...</div>
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
                  <th>Remark</th>
                  <th>Ride ID</th>
                  <th>Created At</th>
                  <th>Resolved At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {displayedComplaints.length > 0 ? (
                  displayedComplaints.map((c, idx) => (
                    <tr key={c.complaint_id}>
                      <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                      <td>
                        {c.complainant_name} <br />
                        <small className="text-muted">({c.complainant_id})</small>
                      </td>
                      <td>
                        {c.against_user_name} <br />
                        <small className="text-muted">({c.against_user_id})</small>
                      </td>
                      <td>{c.category.replace("_", " ")}</td>
                      <td>{c.description}</td>
                      <td>
                        <span>
                          {c.status}
                        </span>
                        <FaEdit
                          title="Edit Status"
                          className="icon icon-green ms-2"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleStatusEdit(c)}
                        />
                      </td>
                      <td>{c.remark || "-"}</td>
                      <td>{c.ride_id || "-"}</td>
                      <td>{new Date(c.created_at).toLocaleString()}</td>
                      <td>
                        {c.resolved_at
                          ? new Date(c.resolved_at).toLocaleString()
                          : "-"}
                      </td>
                      <td>
                        <FaEye
                          title="View"
                          className="icon icon-blue me-2"
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
                    <td colSpan="11" className="text-center">
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
                className="pagination-option w-auto"
              >
                <option value="5">Show 5</option>
                <option value="10">Show 10</option>
                <option value="20">Show 20</option>
              </Form.Select>
            </div>
          </>
        )}
      </div>

      {/* 🔹 Modal for Status Update */}
      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Change Complaint Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Select Status</Form.Label>
              <Form.Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Resolved">Resolved</option>
                <option value="Escalated">Escalated</option>
                <option value="Rejected">Rejected</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Remark</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Enter your remark..."
              />
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
