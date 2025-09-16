import React, { useState, useEffect } from "react";
import { Button, Table, Form, InputGroup, Pagination, Modal } from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const RideFareSetting = () => {
  const navigate = useNavigate();
  const [fareSettings, setFareSettings] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFare, setSelectedFare] = useState(null);

  // 🔹 new states for filtering by date
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const userData = JSON.parse(localStorage.getItem("userData"));
  const token = userData?.token;

  // Fetch fare settings
  const fetchFareSettings = async (page = 1, searchValue = "", start = "", end = "") => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/getAllFareSetting`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page,
          limit: itemsPerPage,
          search: searchValue || undefined,
          fromDate: start || undefined,
          toDate: end || undefined,
        },
      });

      const apiData = response.data?.data?.models || [];
      const activeData = apiData.filter((f) => f.isActive);
      const totalPages = response.data?.data?.totalPages || 1;

      setFareSettings(activeData);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching fare settings:", error);
      setFareSettings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFareSettings(currentPage, search, startDate, endDate);
  }, [currentPage, itemsPerPage, startDate, endDate]);

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearch(searchValue);
    setCurrentPage(1);
    fetchFareSettings(1, searchValue, startDate, endDate);
  };

  const handleDelete = (fare) => {
    setSelectedFare(fare);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/deleteFareSetting/${selectedFare.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Fare setting deleted successfully!");
      fetchFareSettings(currentPage, search, startDate, endDate);
    } catch (error) {
      console.error("Failed to delete fare setting:", error);
      alert("Failed to delete fare setting. Please try again.");
    } finally {
      setShowDeleteModal(false);
      setSelectedFare(null);
    }
  };

  return (
    <AdminLayout>
      <div className="dms-pages-header sticky-header">
        <h3>Ride Fare Setting</h3>
        <Button
          variant="primary"
          onClick={() => navigate("/dms/faresettings/add")}
        >
          <FaPlus /> Add Fare Setting
        </Button>
      </div>

      {/* 🔹 Filters */}
      <div className="filter-search-container">
         <div className='filter-container'>
        <p className='btn btn-primary'>Filter by Date -</p>
        <Form.Group>
          <Form.Control type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }} />
        </Form.Group>
        <Form.Group>
          <Form.Control type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }} />
        </Form.Group>
        </div>
        <InputGroup className="dms-custom-width">
          <Form.Control
            placeholder="Search fare settings..."
            value={search}
            onChange={handleSearch}
          />
        </InputGroup>
      </div>

      <div className="dms-table-container">
        {loading ? (
          <div className="text-center py-5 fs-4">Loading...</div>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Base Fare</th>
                <th>Per Km Fare</th>
                <th>Night Fare /km</th>
                <th>Night Time</th>
                <th>Waiting Charge</th>
                <th>Emergency Bonus</th>
                <th>First Ride Bonus</th>
                <th>Effective From</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {fareSettings.length > 0 ? (
                fareSettings.map((fare, index) => (
                  <tr key={fare.id}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{fare.base_fare}</td>
                    <td>{fare.per_km_fare}</td>
                    <td>{fare.per_km_fare_night}</td>
                    <td>{fare.night_start_time} - {fare.night_end_time}</td>
                    <td>{fare.waiting_charge_per_min}</td>
                    <td>{fare.emergency_bonus}</td>
                    <td>{fare.first_ride_bonus}</td>
                    <td>{new Date(fare.effective_from).toLocaleDateString()}</td>
                    <td>{new Date(fare.createdAt).toLocaleString()}</td>
                    <td>{new Date(fare.updatedAt).toLocaleString()}</td>
                    <td>
                      <FaEdit
                        className="icon icon-green"
                        title="Edit"
                        onClick={() => navigate("/dms/faresettings/edit", { state: { fare } })}
                      />
                      <FaTrash
                        className="icon icon-red"
                        title="Delete"
                        onClick={() => handleDelete(fare)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12" className="text-center">
                    No fare settings found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}

        {/* Pagination */}
        <div className="pagination-container">
          <Pagination className="mb-0">
            <Pagination.Prev
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            />
            {[...Array(totalPages)].map((_, i) => (
              <Pagination.Item
                key={i + 1}
                active={i + 1 === currentPage}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => setCurrentPage(currentPage + 1)}
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
          Are you sure you want to delete <strong>{selectedFare?.baseFare}</strong> fare setting?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};
