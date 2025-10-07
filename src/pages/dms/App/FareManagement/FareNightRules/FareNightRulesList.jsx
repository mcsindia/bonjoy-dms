import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  Form,
  Pagination,
  Modal,
} from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getModuleId, getToken } from "../../../../../utils/authhelper";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const FareNightRulesList = () => {
  const navigate = useNavigate();
  const [nightRules, setNightRules] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // default 10
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const permissions = ["add", "edit", "delete"];

  const fetchNightRules = async () => {
    try {
      const token = getToken();
      const moduleId = getModuleId("farenightrules");
      const params = { module_id: moduleId, page: currentPage, limit: itemsPerPage };
      if (dateFilter) params.date = dateFilter;

      const response = await axios.get(`${API_BASE_URL}/getAllFareNightRule`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      const data = response.data?.data || {};
      setNightRules(data.models || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching fare night rules:", error);
      setNightRules([]);
      setTotalPages(1);
    }
  };

  useEffect(() => {
    fetchNightRules();
  }, [dateFilter, currentPage, itemsPerPage]);

  const handleDelete = (rule) => {
    setSelectedRule(rule);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedRule) return;
    try {
      const token = getToken();
      const moduleId = getModuleId("farenightrules");
      await axios.delete(`${API_BASE_URL}/deleteFareNightRule/${selectedRule.id}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { module_id: moduleId },
      });
      fetchNightRules();
      setShowDeleteModal(false);
      setSelectedRule(null);
    } catch (error) {
      console.error("Error deleting night rule:", error);
      alert("Failed to delete the rule. Please try again.");
    }
  };

  const getRegionName = (rule) => {
    if (!rule || !rule.FareRegionSetting) return "Unknown Region";
    const { city, state } = rule.FareRegionSetting;
    return `${city} (${state})`;
  };

  const filteredRules = nightRules.filter((rule) =>
    getRegionName(rule).toLowerCase().includes(searchText.toLowerCase())
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <AdminLayout>
      <div className="dms-pages-header sticky-header">
        <h3>Fare Night Rules</h3>
        {permissions.includes("add") && (
          <Button
            variant="primary"
            onClick={() => navigate("/dms/farenightrules/add")}
          >
            <FaPlus /> Add Night Rule
          </Button>
        )}
      </div>

      {/* Filter */}
      <div className="filter-container">
        <p className="btn btn-primary">Filter by createdAt Date -</p>
        <Form.Group>
          <Form.Control
            type="date"
            value={dateFilter}
            onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
          />
        </Form.Group>
      </div>

      {/* Table */}
      <div className="dms-table-container">
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Region</th>
              <th>Night Start</th>
              <th>Night End</th>
              <th>Effective From</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRules.length > 0 ? (
              filteredRules.map((rule, index) => (
                <tr key={rule.id}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{getRegionName(rule)}</td>
                  <td>{new Date(rule.night_start_time).toLocaleString()}</td>
                  <td>{new Date(rule.night_end_time).toLocaleString()}</td>
                  <td>{new Date(rule.effective_from).toLocaleDateString()}</td>
                  <td>{new Date(rule.createdAt).toLocaleString()}</td>
                  <td>
                    {permissions.includes("edit") && (
                      <FaEdit
                        className="icon icon-green me-2"
                        title="Edit"
                        onClick={() =>
                          navigate("/dms/farenightrules/edit", { state: { rule } })
                        }
                      />
                    )}
                    {permissions.includes("delete") && (
                      <FaTrash
                        className="icon icon-red"
                        title="Delete"
                        onClick={() => handleDelete(rule)}
                      />
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No night rules found.
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
      </div>

      {/* Delete Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Night Rule</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this night rule for
          <br />
          <strong>{getRegionName(selectedRule)}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
          >
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
