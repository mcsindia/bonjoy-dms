import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  Form,
  Pagination,
  Modal,
  InputGroup,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getModuleId, getToken } from "../../../../../utils/authhelper";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const FareDynamicRuleList = () => {
  const navigate = useNavigate();
  const [rules, setRules] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [ruleTypeFilter, setRuleTypeFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const permissions = ["add", "edit", "delete"];

  const fetchRules = async () => {
    try {
      const params = { module_id: getModuleId("faredynamicrules") };
      if (dateFilter) params.date = dateFilter;

      const response = await axios.get(`${API_BASE_URL}/getAllFareDynamicRule`, {
        headers: { Authorization: `Bearer ${getToken()}` },
        params,
      });
      const data = response.data?.data?.models || [];
      setRules(data);
    } catch (error) {
      console.error("Error fetching fare dynamic rules:", error);
      setRules([]);
    }
  };

  useEffect(() => {
    fetchRules();
  }, [dateFilter]);

  const handleDelete = (rule) => {
    setSelectedRule(rule);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedRule) return;

    try {
      const token = getToken();
      const url = `${API_BASE_URL}/deleteFareDynamicRule/${selectedRule.id}`;

      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { module_id: getModuleId("faredynamicrules") },
      });

      // Remove from UI after success
      setRules((prev) => prev.filter((r) => r.id !== selectedRule.id));
      setShowDeleteModal(false);
      setSelectedRule(null);
    } catch (error) {
      console.error("Error deleting rule:", error);
      alert("Failed to delete the rule. Please try again.");
    }
  };

  // Safe helper to get region name
  const getRegionName = (rule) => {
    if (!rule || !rule.FareRegionSetting) return "Unknown Region";
    return `${rule.FareRegionSetting.city} (${rule.FareRegionSetting.state})`;
  };

  // Filter & Search
  const filteredRules = rules.filter((rule) => {
    const regionName = getRegionName(rule).toLowerCase();
    const matchesSearch =
      regionName.includes(searchText.toLowerCase()) ||
      rule.rule_type.toLowerCase().includes(searchText.toLowerCase());
    const matchesRuleType = ruleTypeFilter ? rule.rule_type === ruleTypeFilter : true;
    return matchesSearch && matchesRuleType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredRules.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRules = filteredRules.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <AdminLayout>
      <div className="dms-pages-header sticky-header">
        <h3>Fare Dynamic Rules</h3>
        {permissions.includes("add") && (
          <Button
            variant="primary"
            onClick={() => navigate("/dms/faredynamicrules/add")}
          >
            <FaPlus /> Add Rule
          </Button>
        )}
      </div>

      {/* Filter & Search */}
      <div className='filter-container'>
        {/* Date Filter */}
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
              <th>Rule Type</th>
              <th>Multiplier</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentRules.length > 0 ? (
              currentRules.map((rule, index) => (
                <tr key={rule.id}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{getRegionName(rule)}</td>
                  <td>{rule.rule_type}</td>
                  <td>{rule.multiplier.toFixed(2)}</td>
                  <td>{new Date(rule.start_time).toLocaleString()}</td>
                  <td>{new Date(rule.end_time).toLocaleString()}</td>
                  <td>{new Date(rule.createdAt).toLocaleString()}</td>
                  <td>
                    {(!permissions.includes("edit") && !permissions.includes("delete")) ? (
                      <span>-</span>
                    ) : (
                      <>
                        {permissions.includes("edit") && (
                          <FaEdit
                            className="icon icon-green me-2"
                            title="Edit"
                            onClick={() =>
                              navigate("/dms/faredynamicrules/edit", { state: { rule } })
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
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No dynamic rules found.
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
      </div>

      {/* Delete Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Dynamic Rule</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the rule..
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
