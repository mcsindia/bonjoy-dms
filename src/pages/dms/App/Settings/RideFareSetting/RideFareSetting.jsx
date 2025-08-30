import React, { useState } from "react";
import { Button, Table, Form, InputGroup, Pagination, Modal } from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";
import { useNavigate } from "react-router-dom";

// Dummy data
const dummyFareSettings = [
  {
    fare_id: "F001",
    base_fare: 50,
    per_km_fare: 10,
    per_km_fare_night: 15,
    night_start_time: "22:00",
    night_end_time: "05:00",
    helmet_charge: 5,
    emergency_bonus: 20,
    first_ride_bonus: 30,
    effective_from: "2025-08-01T00:00:00Z",
    created_at: "2025-08-15T12:00:00Z",
    updated_at: "2025-08-25T12:00:00Z",
  },
  {
    fare_id: "F002",
    base_fare: 40,
    per_km_fare: 8,
    per_km_fare_night: 12,
    night_start_time: "21:00",
    night_end_time: "06:00",
    helmet_charge: 7,
    emergency_bonus: 25,
    first_ride_bonus: 50,
    effective_from: "2025-07-01T00:00:00Z",
    created_at: "2025-07-15T12:00:00Z",
    updated_at: "2025-08-20T12:00:00Z",
  },
];

export const RideFareSetting = () => {
  const navigate = useNavigate();
  const [fareSettings, setFareSettings] = useState(dummyFareSettings);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFare, setSelectedFare] = useState(null);
   const userData = JSON.parse(localStorage.getItem("userData"));
   let permissions = [];

if (Array.isArray(userData?.employeeRole)) {
  for (const role of userData.employeeRole) {
    for (const child of role.childMenus || []) {
      for (const mod of child.modules || []) {
        if (mod.moduleUrl?.toLowerCase() === "department") {
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
      action(); 
    } else {
      alert(fallbackMessage || `You don't have permission to ${permissionType} this employee.`);
    }
  };

  // Search filter
  const filteredData = fareSettings.filter(
    (fare) =>
      fare.fare_id.toLowerCase().includes(search.toLowerCase()) ||
      fare.base_fare.toString().includes(search)
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const confirmDelete = () => {
    setFareSettings(fareSettings.filter((f) => f.fare_id !== selectedFare.fare_id));
    setShowDeleteModal(false);
    setSelectedFare(null);
  };

  return (
    <AdminLayout>
      <div className="dms-pages-header sticky-header">
        <h3>Ride Fare Setting</h3>
        <Button variant="primary" onClick={() => handlePermissionCheck("add", () => navigate('/dms/faresettings/add'))}>
          <FaPlus /> Add Fare Setting
        </Button>
      </div>

      <div className="filter-search-container">
        <InputGroup className="dms-custom-width">
          <Form.Control
            placeholder="Search fare ID or base fare..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
      </div>

      <div className="dms-table-container">
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Base Fare</th>
              <th>Day Fare /km</th>
              <th>Night Fare /km</th>
              <th>Night Time</th>
              <th>Helmet Charge</th>
              <th>Emergency Bonus</th>
              <th>First Ride Bonus</th>
              <th>Effective From</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((fare, index) => (
                <tr key={fare.fare_id}>
                  <td>{indexOfFirstItem + index + 1}</td>
                  <td>{fare.base_fare}</td>
                  <td>{fare.per_km_fare}</td>
                  <td>{fare.per_km_fare_night}</td>
                  <td>
                    {fare.night_start_time} - {fare.night_end_time}
                  </td>
                  <td>{fare.helmet_charge}</td>
                  <td>{fare.emergency_bonus}</td>
                  <td>{fare.first_ride_bonus}</td>
                  <td>{new Date(fare.effective_from).toLocaleDateString()}</td>
                  <td>{new Date(fare.created_at).toLocaleString()}</td>
                  <td>{new Date(fare.updated_at).toLocaleString()}</td>
                  <td>
                    <FaEdit className="icon icon-green" title="Edit" onClick={() => handlePermissionCheck("edit", () => navigate('/dms/faresettings/edit'))} />
                       </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="13" className="text-center">
                  No fare settings found.
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
      </div>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Fare Setting</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete fare ID{" "}
          <strong>{selectedFare?.fare_id}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};
