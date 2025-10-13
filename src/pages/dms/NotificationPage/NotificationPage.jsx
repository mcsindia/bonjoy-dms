import React, { useState } from "react";
import {
  Table, InputGroup, Form, Pagination, Dropdown, DropdownButton, Button
} from "react-bootstrap";
import { AdminLayout } from "../../../layouts/dms/AdminLayout/AdminLayout";
import { FaTrash, FaEye, FaFileExport, FaPlus, FaFileExcel, FaFilePdf } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

export const NotificationPage = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userData"));
  let permissions = [];

  if (Array.isArray(userData?.employeeRole)) {
    for (const role of userData.employeeRole) {
      for (const child of role.childMenus || []) {
        for (const mod of child.modules || []) {
          if (mod.moduleUrl?.toLowerCase() === "notification") {
            permissions = mod.permission
              ?.toLowerCase()
              .split(",")
              .map(p => p.trim()) || [];
          }
        }
      }
    }
  }

  const notifications = [
    { id: "1", user_id: "12345", type: "Rider", category: "Rider", message: "Your ride has been booked successfully.", status: "Delivered", created_at: "2025-01-02 12:00:00" },
    { id: "2", user_id: "12346", type: "Driver", category: "Driver", message: "You received feedback from a rider.", status: "Read", created_at: "2025-01-01 14:30:00" },
    { id: "3", user_id: "12347", type: "Rider", category: "Rider", message: "Your login was successful.", status: "Sent", created_at: "2025-01-02 10:00:00" },
    { id: "4", user_id: "12348", type: "Driver", category: "Driver", message: "A complaint has been raised.", status: "Sent", created_at: "2025-01-03 09:00:00" },
    { id: "5", user_id: "12349", type: "Rider", category: "Rider", message: "You have successfully registered.", status: "Delivered", created_at: "2025-01-04 11:00:00" },
  ];

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleSearch = (e) => setSearch(e.target.value);

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.type.toLowerCase().includes(search.toLowerCase()) ||
      notification.message.toLowerCase().includes(search.toLowerCase()) ||
      notification.user_id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter ? notification.status === filter : true;
    return matchesSearch && matchesFilter;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNotifications = filteredNotifications.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <AdminLayout>
      <div className="dms-pages-header sticky-header">
        <h3>Notification Table</h3>
        <div className="export-import-container">
          {permissions.includes("export") && (
            <DropdownButton variant="primary" title={<><FaFileExport /> Export</>} className="me-2">
              <Dropdown.Item> <FaFileExcel className="icon-green" /> Export to Excel</Dropdown.Item>
              <Dropdown.Item> <FaFilePdf className="icon-red" /> Export to PDF</Dropdown.Item>
            </DropdownButton>
          )}

          {permissions.includes("import") && (
            <DropdownButton variant="primary" title={<><FaFileExport /> Import</>} className="me-2">
              <Dropdown.Item> <FaFileExcel className="icon-green" /> Import from Excel</Dropdown.Item>
              <Dropdown.Item> <FaFilePdf className="icon-red" /> Import from PDF</Dropdown.Item>
            </DropdownButton>
          )}

          {permissions.includes("add") && (
            <Button variant="success" onClick={() => navigate("/dms/notificationadd")}>
              <FaPlus /> Add Notification
            </Button>
          )}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="filter-search-container">
        <DropdownButton variant="primary" title="Filter status" id="filter-dropdown">
          <Dropdown.Item onClick={() => setFilter("")}>All</Dropdown.Item>
          <Dropdown.Item onClick={() => setFilter("Sent")}>Sent</Dropdown.Item>
          <Dropdown.Item onClick={() => setFilter("Delivered")}>Delivered</Dropdown.Item>
          <Dropdown.Item onClick={() => setFilter("Read")}>Read</Dropdown.Item>
          <Dropdown.Item className="text-danger" onClick={() => setFilter("")}>Cancel</Dropdown.Item>
        </DropdownButton>

        <InputGroup className="dms-custom-width">
          <Form.Control
            placeholder="Search notifications..."
            value={search}
            onChange={handleSearch}
          />
        </InputGroup>
      </div>

      {/* Notification Table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Type</th>
            <th>Category</th>
            <th>Message</th>
            <th>Status</th>
            <th>Date & Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentNotifications.length > 0 ? (
            currentNotifications.map((notification) => (
              <tr key={notification.id}>
                <td>{notification.id}</td>
                <td>{notification.user_id}</td>
                <td>{notification.type}</td>
                <td>{notification.category}</td>
                <td>{notification.message}</td>
                <td>{notification.status}</td>
                <td>{notification.created_at}</td>
                <td>
                  {permissions.includes("view") && (
                    <FaEye
                      className="icon icon-blue me-2"
                      title="View"
                      onClick={() => navigate(`/dms/notificationview/${notification.id}`)}
                      style={{ cursor: "pointer" }}
                    />
                  )}
                  {permissions.includes("delete") && (
                    <FaTrash
                      className="icon icon-red"
                      title="Delete"
                      onClick={() => window.confirm("Are you sure you want to delete this notification?")}
                      style={{ cursor: "pointer" }}
                    />
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">
                No notifications found.
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
          className='pagination-option w-auto'
        >
          <option value="5">Show 5</option>
          <option value="10">Show 10</option>
          <option value="20">Show 20</option>
          <option value="30">Show 30</option>
          <option value="50">Show 50</option>
        </Form.Select>
      </div>
    </AdminLayout>
  );
};
