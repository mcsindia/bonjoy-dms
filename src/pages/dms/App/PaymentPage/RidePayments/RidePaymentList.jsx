import React, { useState } from "react";
import { Table, Button, InputGroup, Form, Pagination, Dropdown, DropdownButton } from "react-bootstrap";
import { FaTrash, FaEdit, FaFileExcel, FaFilePdf, FaFileExport, FaPlus } from "react-icons/fa";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";
import { useNavigate } from "react-router-dom";

export const RidePaymentList = () => {
  const navigate = useNavigate();
  const payments = [
    {
      payment_id: "PAY001",
      trip_id: "TRIP001",
      amount: "₹25.00",
      payment_method: "Credit Card",
      payment_status: "Completed",
    },
    {
      payment_id: "PAY002",
      trip_id: "TRIP002",
      amount: "₹15.00",
      payment_method: "Cash",
      payment_status: "Failed",
    },
  ];

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const userData = JSON.parse(localStorage.getItem("userData"));
    let permissions = [];

    if (Array.isArray(userData?.employeeRole)) {
        for (const role of userData.employeeRole) {
            for (const child of role.childMenus || []) {
                for (const mod of child.modules || []) {
                    if (mod.moduleUrl?.toLowerCase() === "trippayment") {
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
            alert(fallbackMessage || `You don't have permission to ${permissionType} this setting.`);
        }
    };

  const handleSearch = (e) => setSearch(e.target.value);

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.payment_id.toLowerCase().includes(search.toLowerCase()) ||
      payment.trip_id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter ? payment.payment_status === filter : true;
    return matchesSearch && matchesFilter;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPayments = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <AdminLayout>
      <div className="dms-pages-header sticky-header">
        <h3>Trip Payments List</h3>
        <div className="export-import-container">
          {/* Export Dropdown */}
          <DropdownButton variant="primary" title={<><FaFileExport /> Export</>} className="me-2">
            <Dropdown.Item>
              <FaFileExcel className="icon-green" /> Export to Excel
            </Dropdown.Item>
            <Dropdown.Item>
              <FaFilePdf className="icon-red" /> Export to PDF
            </Dropdown.Item>
          </DropdownButton>

          {/* Import Dropdown */}
          <DropdownButton variant="primary" title={<><FaFileExport /> Import</>} className="me-2">
            <Dropdown.Item>
              <FaFileExcel className="icon-green" /> Import from Excel
            </Dropdown.Item>
            <Dropdown.Item>
              <FaFilePdf className="icon-red" /> Import from PDF
            </Dropdown.Item>
          </DropdownButton>

          {/* Add Payment Button */}
          <Button variant="primary" onClick={() => handlePermissionCheck("add", () => navigate("/dms/trippayment/add"))}>
            <FaPlus /> Add Payment
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="filter-search-container">
        <DropdownButton variant="primary" title="Filter status" id="filter-dropdown">
          <Dropdown.Item onClick={() => setFilter("")}>All</Dropdown.Item>
          <Dropdown.Item onClick={() => setFilter("Completed")}>Completed</Dropdown.Item>
          <Dropdown.Item onClick={() => setFilter("Failed")}>Failed</Dropdown.Item>
          <Dropdown.Item className="text-custom-danger" onClick={() => setFilter("")}>Cancel</Dropdown.Item>
        </DropdownButton>

        <InputGroup className="dms-custom-width">
          <Form.Control
            placeholder="Search payments..."
            value={search}
            onChange={handleSearch}
          />
        </InputGroup>
      </div>

      {/* Table */}
      <div className="dms-table-container">
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Trip ID</th>
              <th>Amount</th>
              <th>Payment Method</th>
              <th>Payment Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentPayments.length > 0 ? (
              currentPayments.map((payment) => (
                <tr key={payment.payment_id}>
                  <td>{payment.payment_id}</td>
                  <td>
                    <a   href="#" role="button" className='trip-id-link' onClick={() => navigate('/trip/details', { state: { trip: payment } })}>
                      {payment.trip_id}
                    </a>
                  </td>
                  <td>{payment.amount}</td>
                  <td>{payment.payment_method}</td>
                  <td>{payment.payment_status}</td>
                  <td>
                    <FaEdit
                      title="Edit"
                      className="icon icon-green"
                      onClick={() => handlePermissionCheck("view", () => navigate("/dms/trippayment/edit", { state: { payment } }))}
                    />
                    <FaTrash
                      title="Delete"
                      className="icon icon-red"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No payments found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
      <Pagination className="justify-content-center">
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
    </AdminLayout>
  );
};
