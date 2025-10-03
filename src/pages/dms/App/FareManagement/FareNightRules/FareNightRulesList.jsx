import React, { useState } from "react";
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

export const FareNightRulesList = () => {
  const navigate = useNavigate();

  // 🔹 Dummy regions
  const dummyRegions = [
    { region_id: "1", city: "Mumbai", state: "Maharashtra" },
    { region_id: "2", city: "Delhi", state: "Delhi" },
    { region_id: "3", city: "Bengaluru", state: "Karnataka" },
  ];

  // 🔹 Dummy night rules
  const dummyNightRules = [
    {
      night_rule_id: "201",
      region_id: "1",
      night_start_time: "22:00",
      night_end_time: "05:00",
      effective_from: "2025-09-01T00:00:00Z",
      created_at: "2025-09-01T12:00:00Z",
    },
    {
      night_rule_id: "202",
      region_id: "2",
      night_start_time: "23:00",
      night_end_time: "06:00",
      effective_from: "2025-09-02T00:00:00Z",
      created_at: "2025-09-02T12:00:00Z",
    },
    {
      night_rule_id: "203",
      region_id: "3",
      night_start_time: "21:30",
      night_end_time: "04:30",
      effective_from: "2025-09-05T00:00:00Z",
      created_at: "2025-09-05T12:00:00Z",
    },
  ];

  const [nightRules, setNightRules] = useState(dummyNightRules);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);
  const [searchText, setSearchText] = useState("");

  const permissions = ["add", "edit", "delete"];

  const handleDelete = (rule) => {
    setSelectedRule(rule);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setNightRules(
      nightRules.filter((r) => r.night_rule_id !== selectedRule.night_rule_id)
    );
    setShowDeleteModal(false);
    setSelectedRule(null);
  };

  // 🔹 Helper: get region name from region_id
  const getRegionName = (region_id) => {
    const region = dummyRegions.find((r) => r.region_id === region_id);
    return region ? `${region.city} (${region.state})` : region_id;
  };

  // 🔹 Filter & Search
  const filteredRules = nightRules.filter((rule) => {
    const regionName = getRegionName(rule.region_id).toLowerCase();
    return regionName.includes(searchText.toLowerCase());
  });

  // Pagination
  const totalPages = Math.ceil(filteredRules.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRules = filteredRules.slice(indexOfFirstItem, indexOfLastItem);

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

      {/* Filter & Search */}
      <div className="filter-search-container d-flex align-items-center mb-3">
        <InputGroup className="dms-custom-width">
          <Form.Control
            placeholder="Search by Region"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setCurrentPage(1);
            }}
          />
        </InputGroup>
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
            {currentRules.length > 0 ? (
              currentRules.map((rule, index) => (
                <tr key={rule.night_rule_id}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{getRegionName(rule.region_id)}</td>
                  <td>{rule.night_start_time}</td>
                  <td>{rule.night_end_time}</td>
                  <td>{new Date(rule.effective_from).toLocaleString()}</td>
                  <td>{new Date(rule.created_at).toLocaleString()}</td>
                  <td>
                    {(!permissions.includes("edit") &&
                    !permissions.includes("delete")) ? (
                      <span>-</span>
                    ) : (
                      <>
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
                      </>
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
        <div className="pagination-container d-flex align-items-center">
          <Pagination className="mb-0 me-2">
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
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Night Rule</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the night rule <br />
          <strong>ID: {selectedRule?.night_rule_id}</strong> <br />
          for Region <strong>{getRegionName(selectedRule?.region_id)}</strong>?
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
