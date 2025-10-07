import React, { useState, useEffect } from "react";
import { Button, Table, Form, Pagination, Modal, DropdownButton, Dropdown } from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getModuleId, getToken } from "../../../../../utils/authhelper";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
});

export const FareSlabList = () => {
  const navigate = useNavigate();
  const [fareSlabs, setFareSlabs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [filterStatus, setFilterStatus] = useState(""); // Active/Inactive
  const [filterDate, setFilterDate] = useState(""); // Created / Effective Date

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSlab, setSelectedSlab] = useState(null);

  // Permissions
  const userData = JSON.parse(localStorage.getItem("userData"));
  let permissions = [];
  if (Array.isArray(userData?.employeeRole)) {
    for (const role of userData.employeeRole) {
      for (const child of role.childMenus || []) {
        for (const mod of child.modules || []) {
          if (mod.moduleUrl?.toLowerCase() === "fareslab") {
            permissions = mod.permission?.toLowerCase().split(",").map(p => p.trim()) || [];
          }
        }
      }
    }
  }

  const fetchFareSlabs = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: itemsPerPage,
        module_id: getModuleId("fareslab"),
      };
      if (filterStatus) params.status = filterStatus;
      if (filterDate) params.date = filterDate;

      const response = await axios.get(`${API_BASE_URL}/getAllFareSlab`, {
        headers: getAuthHeaders(),
        params,
      });

      const data = response.data?.data?.models || [];
      setFareSlabs(data);
      setTotalItems(response.data?.data?.totalItems || data.length);
      setTotalPages(response.data?.data?.totalPages || 1);
      setCurrentPage(response.data?.data?.currentPage || 1);
    } catch (err) {
      console.error("Error fetching fare slabs:", err);
      setFareSlabs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFareSlabs(currentPage);
  }, [currentPage, itemsPerPage, filterStatus, filterDate]);

  const handleDelete = (slab) => {
    setSelectedSlab(slab);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedSlab) return;
    try {
      setLoading(true);
      const response = await axios.delete(`${API_BASE_URL}/deleteFareSlab/${selectedSlab.id}`, {
        headers: getAuthHeaders(),
        params: { module_id: getModuleId("fareslab") },
      });

      if (response.data?.success) {
        alert(response.data.message || "Fare slab deleted successfully!");
        fetchFareSlabs(currentPage);
      } else {
        alert(response.data?.message || "Failed to delete fare slab.");
      }
    } catch (err) {
      console.error("Error deleting fare slab:", err);
      alert(err.response?.data?.message || "Failed to delete fare slab.");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setSelectedSlab(null);
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) setCurrentPage(pageNumber);
  };

  return (
    <AdminLayout>
      <div className="dms-pages-header sticky-header">
        <div className="live-count">
          <h3>Fare Slab List</h3>
        </div>
        {permissions.includes("add") && (
          <Button variant="primary" onClick={() => navigate("/dms/fareslab/add")}>
            <FaPlus /> Add Fare Slab
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="filter-container">
        <p className="btn btn-primary">Filter by createdAt Date -</p>
        <Form.Group>
          <Form.Control
            type="date"
            value={filterDate}
            onChange={(e) => { setFilterDate(e.target.value); setCurrentPage(1); }}
          />
        </Form.Group>
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
                  <th>Start KM</th>
                  <th>End KM</th>
                  <th>Rate Type</th>
                  <th>Rate</th>
                  <th>Fare Base</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {fareSlabs.length > 0 ? fareSlabs.map((slab, idx) => (
                  <tr key={slab.id}>
                    <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                    <td>{slab.start_km}</td>
                    <td>{slab.end_km === null ? "∞" : slab.end_km}</td>
                    <td>{slab.rate_type}</td>
                    <td>{slab.rate}</td>
                    <td>{slab.FareSetting?.base_fare || "-"}</td>
                    <td>{new Date(slab.createdAt).toLocaleDateString()}</td>
                    <td>{new Date(slab.updatedAt).toLocaleDateString()}</td>
                    <td>
                      {permissions.includes("edit") && (
                        <FaEdit className="icon icon-green me-2" onClick={() => navigate("/dms/fareslab/edit", { state: { slab } })} />
                      )}
                      {permissions.includes("delete") && (
                        <FaTrash className="icon icon-red" onClick={() => handleDelete(slab)} />
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="9" className="text-center">No fare slabs found.</td>
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
                {[...Array(totalPages)].map((_, i) => (
                  <Pagination.Item
                    key={i + 1}
                    active={i + 1 === currentPage}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
              </Pagination>

              <Form.Select
                value={itemsPerPage}
                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="pagination-option w-auto"
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

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this fare slab?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};
