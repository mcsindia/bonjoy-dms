import React, { useState, useEffect, useRef } from "react";
import {
  Table, Form, InputGroup, Dropdown, DropdownButton,
  Pagination, Button, Modal
} from "react-bootstrap";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";
import {
  FaEye, FaTrash, FaEdit, FaFolderOpen, FaUser, FaFile
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const VehicleMaster = () => {
  const [vehicleData, setVehicleData] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [showActions, setShowActions] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const navigate = useNavigate();
  const actionMenuRef = useRef(null);

  const userData = JSON.parse(localStorage.getItem("userData"));
  const isAdmin = userData?.userType === "Admin";

  let permissions = [];

  if (isAdmin) {
    permissions = ["view", "add", "edit", "delete"];
  } else if (Array.isArray(userData?.employeeRole)) {
    for (const role of userData.employeeRole) {
      for (const child of role.childMenus || []) {
        for (const mod of child.modules || []) {
          if (mod.moduleUrl?.toLowerCase() === "vehicle") {
            permissions = mod.permission
              ?.toLowerCase()
              .split(",")
              .map((p) => p.trim()) || [];
          }
        }
      }
    }
  }

  // Fetch vehicle data
  const fetchData = async (page = 1, searchTerm = "", filter = "") => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, itemsPerPage };
      if (filter) params.category = filter;
      if (searchTerm) params.category = searchTerm;

      let url = `${API_BASE_URL}/getAllVehicles`;
      if (searchTerm) url = `/api/v1/searchVehicleDocuments`;
      else if (filter) url = `/api/v1/filterVehicleDocuments`;

      const response = await axios.get(url, { params });
      const vehicles = Array.isArray(response.data.data.data)
        ? response.data.data.data
        : response.data.data || [];

      setVehicleData(vehicles);
      setTotalPages(response.data.data.totalPages || 1);
    } catch (err) {
      setError("Error fetching vehicle data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage, search, filterType, itemsPerPage);
  }, [currentPage, search, filterType, itemsPerPage]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterType = (type) => {
    setFilterType(type);
    setCurrentPage(1);
  };

  // Delete handler
  const handleDelete = async () => {
    if (vehicleToDelete) {
      try {
        await axios.delete(`/api/v1/deleteVehicle/${vehicleToDelete}`);

        const updatedResponse = await axios.get("/api/v1/getAllVehicles", {
          params: { page: currentPage, itemsPerPage },
        });

        const updatedVehicles = updatedResponse.data.data?.data || [];
        const newTotalPages = updatedResponse.data.data?.totalPages || 1;

        if (updatedVehicles.length === 0 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          setVehicleData(updatedVehicles);
          setTotalPages(newTotalPages);
        }

        setShowDeleteModal(false);
      } catch (error) {
        console.error("Error deleting vehicle:", error);
        alert("Failed to delete vehicle. Please try again.");
      }
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target)) {
        setShowActions(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <AdminLayout>
      <div className="dms-pages-header sticky-header">
        <h3>Vehicle Master</h3>
        {/* Add Button if permission allows */}
        {permissions.includes("add") && (
          <Button variant="primary" onClick={() => navigate("/dms/vehicle/master/add")}>
            <FaPlus /> Add Vehicle
          </Button>
        )}
      </div>

      {/* Search & Filter */}
      <div className="filter-search-container">
        <DropdownButton variant="primary" title={`Filter: ${filterType || "All"}`} id="filter-type-dropdown">
          <Dropdown.Item onClick={() => handleFilterType("")}>All</Dropdown.Item>
          {["SUV", "Sedan", "Hatchback"].map((type) => (
            <Dropdown.Item key={type} onClick={() => handleFilterType(type)}>
              {type}
            </Dropdown.Item>
          ))}
          <Dropdown.Item className="text-custom-danger" onClick={() => handleFilterType("")}>
            Cancel
          </Dropdown.Item>
        </DropdownButton>

        <InputGroup className="dms-custom-width">
          <Form.Control placeholder="Search vehicles..." value={search} onChange={handleSearch} />
        </InputGroup>
      </div>

      {error && <div className="text-danger text-center">{error}</div>}

      {loading ? (
        <div className="text-center py-5 fs-4">Loading...</div>
      ) : (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Type</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Model</th>
                <th>Fuel Type</th>
                <th>Registration Number</th>
                <th>Registration Date & Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicleData.length > 0 ? (
                vehicleData.map((vehicle, index) => (
                  <tr key={vehicle.id}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{vehicle.type}</td>
                    <td>{vehicle.category}</td>
                    <td>{vehicle.brandId}</td>
                    <td>{vehicle.modelId}</td>
                    <td>{vehicle.fuelType}</td>
                    <td>{vehicle.registrationNumber}</td>
                    <td>{new Date(vehicle.registrationDate).toLocaleString()}</td>
                    <td className="action">
                      <span
                        className="dms-span-action"
                        onClick={() => setShowActions(vehicle.id === showActions ? null : vehicle.id)}
                      >
                        ⋮
                      </span>
                      {showActions === vehicle.id && (
                        <div ref={actionMenuRef} className="dms-show-actions-menu">
                          <ul>
                            {permissions.includes("view") && (
                              <li onClick={() => navigate(`/dms/vehicle/view/${vehicle.id}`, { state: { vehicle } })}>
                                <FaEye className="dms-menu-icon" /> View
                              </li>
                            )}
                            {permissions.includes("edit") && (
                              <li onClick={() => navigate("/dms/vehicle/details/edit", { state: { vehicle } })}>
                                <FaEdit className="dms-menu-icon" /> Edit
                              </li>
                            )}
                            {permissions.includes("view") && (
                              <>
                                <li onClick={() => navigate("/dms/vehicle/document", { state: { vehicle } })}>
                                  <FaFolderOpen className="dms-menu-icon" /> Vehicle Documents
                                </li>
                                <li onClick={() => navigate("/dms/vehicle/document/renewal", { state: { vehicle } })}>
                                  <FaFile className="dms-menu-icon" /> Documents Renewal
                                </li>
                                <li onClick={() => navigate("/dms/drivers/details/view", { state: { driverId: vehicle.driverId?.id } })}>
                                  <FaUser className="dms-menu-icon" /> Driver
                                </li>
                              </>
                            )}
                            {permissions.includes("delete") && (
                              <li
                                className="icon-red"
                                onClick={() => {
                                  setVehicleToDelete(vehicle.id);
                                  setShowDeleteModal(true);
                                }}
                              >
                                <FaTrash className="dms-menu-icon" /> Delete
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center">
                    No vehicles found.
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
              <option value="30">Show 30</option>
              <option value="50">Show 50</option>
            </Form.Select>
          </div>
        </>
      )}

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this vehicle?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};
