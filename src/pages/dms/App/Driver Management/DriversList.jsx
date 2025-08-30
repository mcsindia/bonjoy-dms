import React, { useState, useEffect, useRef } from "react";
import { AdminLayout } from "../../../../layouts/dms/AdminLayout/AdminLayout";
import { Button, Table, InputGroup, Form, Pagination, Dropdown, DropdownButton, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash, FaEye, FaStar, FaFileExport, FaPlus, FaFileExcel, FaFilePdf, FaCar, FaFolderOpen, FaBell, FaFile, FaHistory, FaSignInAlt } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const DriversList = () => {
  const [driverData, setDriverData] = useState([]);
  const [search, setSearch] = useState("");
  const [filterRating, setFilterRating] = useState(null);
  const [filterDriverStatus, setFilterDriverStatus] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterRideStatus, setFilterRideStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState(null);
  const [showActions, setShowActions] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const navigate = useNavigate();
  const actionMenuRef = useRef(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchDrivers = async (
    searchValue = search,
    city = filterCity,
    status = filterDriverStatus,
    rideStatus = filterRideStatus,
    page = currentPage,
    limit = itemsPerPage,
    rating = filterRating
  ) => {
    setLoading(true);

    try {
      let baseUrl = `${API_BASE_URL}/`;
      const queryParams = new URLSearchParams({
        page,
        limit: itemsPerPage,
      });

      const isSearching = !!searchValue;
      const isFilteringByStatus = status !== 'All';
      const isFilteringByCity = !!city;
      const isFilteringByRideStatus = rideStatus !== '';

      if (isSearching) {
        const isNumeric = /^\d+$/.test(searchValue);
        if (isNumeric) {
          baseUrl += `getDriverProfileById/${searchValue}`;
        }
        else {
          baseUrl += "filterDriverProfiles";
          queryParams.set("search", searchValue);
        }
      }
      else if (isFilteringByStatus || isFilteringByCity || isFilteringByRideStatus) {
        baseUrl += "filterDriverProfiles";
        if (isFilteringByStatus) queryParams.set("status", status);
        if (isFilteringByCity) queryParams.set("city", city);
        if (isFilteringByRideStatus) queryParams.set("rideStatus", rideStatus);
      } else {
        baseUrl += "getAllDriverProfiles";
      }

      const finalUrl = `${baseUrl}?${queryParams.toString()}`;

      const res = await axios.get(finalUrl);

      let fetchedDrivers = [];
      let total = 0;

      if (Array.isArray(res.data?.data)) {
        fetchedDrivers = res.data.data;
        total = res.data?.totalRecords || fetchedDrivers.length;
      } else if (res.data?.data) {
        fetchedDrivers = [res.data.data];
        total = 1;
      }

      // Filter by rating range if applicable
      if (rating !== null) {
        fetchedDrivers = fetchedDrivers.filter(driver => {
          const driverRating = parseFloat(driver.ratings || 0);
          return driverRating >= rating && driverRating < rating + 1;
        });
        total = fetchedDrivers.length;
      }

      // Sort drivers by ID in ascending order
      const sortedDrivers = fetchedDrivers.sort((a, b) => {
        const idA = parseInt(a.id, 10);
        const idB = parseInt(b.id, 10);
        return idA - idB;
      });
      setDriverData(sortedDrivers);
      setTotalRecords(total);
      setTotalPages(Math.ceil(total / itemsPerPage));

    } catch (err) {
      console.error("Error fetching drivers:", err);
      setDriverData([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers(search, filterCity, filterDriverStatus, filterRideStatus, currentPage, itemsPerPage, filterRating);
  }, [search, filterDriverStatus, filterCity, filterRideStatus, currentPage, itemsPerPage, filterRating]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearch(query);
    fetchDrivers(query, filterCity, filterDriverStatus, filterRideStatus, 1, itemsPerPage); // Trigger search on change
  };

  const handleFilterCity = (city) => {
    setFilterCity(city);
    fetchDrivers(search, city, filterDriverStatus, 1, itemsPerPage);
  };

  const handleFilterStatus = (status) => {
    setFilterDriverStatus(status);
    fetchDrivers(search, filterCity, status, currentPage, itemsPerPage);
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleFilterRideStatus = (status) => {
    setFilterRideStatus(status);
    fetchDrivers(search, filterCity, filterDriverStatus, status, 1, itemsPerPage);  // Pass ride status to fetchDrivers
  };

  const handleDelete = (driver) => {
    setDriverToDelete(driver);
    setShowDeleteModal(true);
  };

  const handleFilterRating = (rating) => {
    setFilterRating(rating);
    fetchDrivers(search, filterCity, filterDriverStatus, filterRideStatus, 1, itemsPerPage, rating); // pass rating as argument
  };

  const confirmDelete = async () => {
    if (!driverToDelete) return;
    try {
      const res = await axios.delete(`${API_BASE_URL}/deleteDriverProfile/${driverToDelete.id}`);
      if (res.status === 200) {
        // After deletion, fetch updated data from the server
        const newPage = (driverData.length === 1 && currentPage > 1) ? currentPage - 1 : currentPage;
        setCurrentPage(newPage); // trigger useEffect
        await fetchDrivers(search, filterCity, filterDriverStatus, filterRideStatus, newPage, itemsPerPage, filterRating);
      }
    } catch (error) {
      console.error("Error deleting driver:", error);
    } finally {
      setShowDeleteModal(false);
      setDriverToDelete(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target)) {
        setShowActions(null); // Close menu if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <AdminLayout>
      <div className="dms-pages-header sticky-header">
        <div className="live-count">
          <h3>Driver List</h3>
          <div className="live-count-container">
            <Button className='green-button'>🚗 Drivers: {totalRecords}</Button>
          </div>
        </div>
        <div className="export-import-container">
          <DropdownButton variant="primary" title={<><FaFileExport /> Export</>} className="me-2">
            <Dropdown.Item> <FaFileExcel className="icon-green" /> Export to Excel</Dropdown.Item>
            <Dropdown.Item> <FaFilePdf className="icon-red" /> Export to PDF</Dropdown.Item>
          </DropdownButton>
          <DropdownButton variant="primary" title={<><FaFileExport /> Import</>} className="me-2">
            <Dropdown.Item> <FaFileExcel className="icon-green" /> Import from Excel</Dropdown.Item>
            <Dropdown.Item> <FaFilePdf className="icon-red" /> Import from PDF</Dropdown.Item>
          </DropdownButton>
          <Button variant="primary" onClick={() => navigate('/dms/drivers/add')}>
            <FaPlus /> Add Driver
          </Button>
        </div>
      </div>

      <div className="filter-search-container">
        <div className="filter-container">
          <DropdownButton title={`Filter: ${filterRating !== null ? filterRating : "All"}`} id="filter-rating-dropdown">
            <Dropdown.Item onClick={() => handleFilterRating(null)}>All Ratings</Dropdown.Item>
            {[1, 2, 3, 4, 5].map((rating) => (
              <Dropdown.Item key={rating} onClick={() => handleFilterRating(rating)}>
                {rating} Stars
              </Dropdown.Item>
            ))}
          </DropdownButton>

          <DropdownButton title={`Driver Status: ${filterDriverStatus || "All"}`} className="me-2">
            <Dropdown.Item onClick={() => handleFilterStatus("")}>All</Dropdown.Item>
            <Dropdown.Item onClick={() => handleFilterStatus("Active")}>Active</Dropdown.Item>
            <Dropdown.Item onClick={() => handleFilterStatus("Inactive")}>Inactive</Dropdown.Item>
          </DropdownButton>

          <DropdownButton title={`City: ${filterCity || "All"}`} className="me-2">
            <Dropdown.Item onClick={() => handleFilterCity("")}>All</Dropdown.Item>
            <Dropdown.Item onClick={() => handleFilterCity("Delhi")}>Delhi</Dropdown.Item>
            <Dropdown.Item onClick={() => handleFilterCity("Rajasthan")}>Rajasthan</Dropdown.Item>
            <Dropdown.Item onClick={() => handleFilterCity("Jaipur")}>Jaipur</Dropdown.Item>
          </DropdownButton>

          <DropdownButton title={`Ride Status: ${filterRideStatus || "All"}`} className="me-2">
            <Dropdown.Item onClick={() => handleFilterRideStatus("")}>All</Dropdown.Item>
            <Dropdown.Item onClick={() => handleFilterRideStatus("Available")}>Available</Dropdown.Item>
            <Dropdown.Item onClick={() => handleFilterRideStatus("Offline")}>Offline</Dropdown.Item>
            <Dropdown.Item onClick={() => handleFilterRideStatus("Suspended")}>Suspended</Dropdown.Item>
          </DropdownButton>
        </div>

        <InputGroup className="dms-custom-width">
          <Form.Control
            placeholder="Search drivers by name..."
            value={search}
            onChange={handleSearchChange}
          />
        </InputGroup>
      </div>

      {loading ? (
        <div className="text-center py-5 fs-4">Loading...</div>
      ) : (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>S.no</th>
                <th>Full Name</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Account Status</th>
                <th>Ride Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {driverData.length > 0 ? (
                driverData.map((driver, index) => (
                  <tr key={driver.id}>
                    <td>{index + 1}</td>
                    <td>{driver.fullName || 'NA'}</td>
                    <td>
                      <div className='d-flex'>
                        <FaStar className='icon star-icon' />
                        {driver.ratings || 'NA'}
                      </div>
                    </td>
                    <td>{driver.status || 'NA'}</td>
                    <td>{driver.accountStatus}</td>
                    <td>{driver.rideStatus || 'NA'}</td>
                    <td>{driver.createdAt ? new Date(driver.createdAt).toLocaleDateString() : 'NA'}</td>
                    <td className="action">
                      <span
                        className="dms-span-action"
                        onClick={() =>
                          setShowActions(driver.id === showActions ? null : driver.id)
                        }
                      >
                        ⋮
                      </span>
                      {showActions === driver.id && (
                        <div ref={actionMenuRef} className="dms-show-actions-menu">
                          <ul>
                            <li onClick={() => navigate("/dms/drivers/details/view", { state: { driver } })}>
                              <FaEye className="dms-menu-icon" /> View
                            </li>
                            <li onClick={() => navigate("/dms/drivers/edit", { state: { driver } })}><FaEdit className="dms-menu-icon" /> Edit</li>
                             <li onClick={() => navigate("/dms/vehicle/details/view", { state: { driver } })}><FaCar className="dms-menu-icon" /> Vehicle</li>
                            <li onClick={() => navigate("/dms/driver/ride-history/list", { state: { driver } })}><FaHistory className="dms-menu-icon" /> Ride History</li>
                            <li onClick={() => alert(`Reminder sent to ${driver.Name} to complete their profile.`)}><FaBell className="dms-menu-icon icon-orange" /> Profile Reminder</li>
                            <li className="icon-red" onClick={() => handleDelete(driver)}><FaTrash className="dms-menu-icon" /> Delete</li>
                          </ul>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    No drivers found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

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

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong> (Driver ID: {driverToDelete?.id}) </strong> ?
        </Modal.Body>
        <Modal.Footer>
          <Button type="cancel" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button type="submit" onClick={confirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};
