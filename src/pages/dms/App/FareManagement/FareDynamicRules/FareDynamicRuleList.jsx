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

export const FareDynamicRuleList = () => {
  const navigate = useNavigate();

  // Dummy data
  const dummyRules = [
    {
      rule_id: "R001",
      region_id: "Reg001",
      rule_type: "peak",
      multiplier: 1.2,
      start_time: "2025-09-25T08:00",
      end_time: "2025-09-25T10:00",
      created_at: "2025-09-01T12:00",
    },
    {
      rule_id: "R002",
      region_id: "Reg002",
      rule_type: "weather",
      multiplier: 1.5,
      start_time: "2025-09-25T14:00",
      end_time: "2025-09-25T16:00",
      created_at: "2025-09-02T12:00",
    },
    {
      rule_id: "R003",
      region_id: "Reg003",
      rule_type: "special_event",
      multiplier: 2.0,
      start_time: "2025-09-26T18:00",
      end_time: "2025-09-26T21:00",
      created_at: "2025-09-05T12:00",
    },
  ];

  const [rules, setRules] = useState(dummyRules);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);

  const [searchText, setSearchText] = useState("");
  const [ruleTypeFilter, setRuleTypeFilter] = useState("");

  const permissions = ["add", "edit", "delete"];

  const handleDelete = (rule) => {
    setSelectedRule(rule);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setRules(rules.filter((r) => r.rule_id !== selectedRule.rule_id));
    setShowDeleteModal(false);
    setSelectedRule(null);
  };

  // 🔹 Filter & Search
  const filteredRules = rules.filter((rule) => {
    const matchesSearch =
      rule.region_id.toLowerCase().includes(searchText.toLowerCase()) ||
      rule.rule_type.toLowerCase().includes(searchText.toLowerCase());
    const matchesRuleType = ruleTypeFilter
      ? rule.rule_type === ruleTypeFilter
      : true;
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
      <div className="filter-search-container d-flex align-items-center mb-3">
        <DropdownButton
          title={ruleTypeFilter ? `Rule: ${ruleTypeFilter}` : "Filter by Rule Type"}
          className="me-2"
        >
          <Dropdown.Item onClick={() => { setRuleTypeFilter(""); setCurrentPage(1); }}>
            All
          </Dropdown.Item>
          <Dropdown.Item onClick={() => { setRuleTypeFilter("peak"); setCurrentPage(1); }}>
            Peak
          </Dropdown.Item>
          <Dropdown.Item onClick={() => { setRuleTypeFilter("weather"); setCurrentPage(1); }}>
            Weather
          </Dropdown.Item>
          <Dropdown.Item onClick={() => { setRuleTypeFilter("special_event"); setCurrentPage(1); }}>
            Special Event
          </Dropdown.Item>
        </DropdownButton>

        <InputGroup className="dms-custom-width">
          <Form.Control
            placeholder="Search by Region ID or Rule Type"
            value={searchText}
            onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1); }}
          />
        </InputGroup>
      </div>

      {/* Table */}
      <div className="dms-table-container">
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Region ID</th>
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
                <tr key={rule.rule_id}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{rule.region_id}</td>
                  <td>{rule.rule_type}</td>
                  <td>{rule.multiplier}</td>
                  <td>{new Date(rule.start_time).toLocaleString()}</td>
                  <td>{new Date(rule.end_time).toLocaleString()}</td>
                  <td>{new Date(rule.created_at).toLocaleString()}</td>
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
            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
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
          <Modal.Title>Delete Dynamic Rule</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the rule for{" "}
          <strong>{selectedRule?.region_id}</strong> of type{" "}
          <strong>{selectedRule?.rule_type}</strong>?
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
