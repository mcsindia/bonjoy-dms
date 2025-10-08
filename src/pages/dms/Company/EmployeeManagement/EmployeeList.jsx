import React, { useEffect, useState } from 'react';
import { Button, Table, InputGroup, Form, Pagination, Dropdown, DropdownButton, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash, FaEye, FaFileExport, FaPlus, FaFileExcel, FaFilePdf } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';
import axios from 'axios';
import { getModuleId, getToken } from '../../../../utils/authhelper';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const EmployeeList = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeCount, setActiveCount] = useState(0);
  const [inactiveCount, setInactiveCount] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [departments, setDepartments] = useState([]);
  const [filteredDesignations, setFilteredDesignations] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [remark, setRemark] = useState('');
  const [statusToggleEmployee, setStatusToggleEmployee] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const userData = JSON.parse(localStorage.getItem("userData"));

  let permissions = [];

  if (Array.isArray(userData?.employeeRole)) {
    for (const role of userData.employeeRole) {
      for (const child of role.childMenus || []) {
        for (const mod of child.modules || []) {
          if (mod.moduleUrl?.toLowerCase() === "employee") {
            permissions = mod.permission
              ?.toLowerCase()
              .split(',')
              .map(p => p.trim()) || [];
          }
        }
      }
    }
  }

  const fetchEmployees = async (page = 1) => {
    setLoading(true);
    const token = JSON.parse(localStorage.getItem("userData"))?.token;
    if (!token) return;

    try {
      const response = await axios.get(`${API_BASE_URL}/getAllEmployees`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page,
          limit: itemsPerPage,
          keywords: search.trim() || undefined,
          status: selectedStatus || undefined,
          designationId: filter || undefined,
          department: selectedDepartment || undefined,
          module_id: getModuleId("employee")
        }
      });

      const data = response.data?.data;
      if (data) {
        setEmployees(data.employees || []);
        setTotalPages(data.totalPages || 1);
        setTotalItems(data.totalItems || 0);

        const active = data.employees.filter(emp => emp.status?.toLowerCase() === 'active').length;
        const inactive = data.employees.filter(emp => emp.status?.toLowerCase() === 'inactive').length;
        setActiveCount(active);
        setInactiveCount(inactive);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      setEmployees([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("userData"))?.token;
      if (!token) return;

      const response = await axios.get(`${API_BASE_URL}/getAllDepartments`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 100, module_id: getModuleId("department") }
      });

      const data = response.data?.data?.data || [];
      setDepartments(data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchDesignationsByDepartment = async (departmentId) => {
    try {
      const token = JSON.parse(localStorage.getItem("userData"))?.token;
      if (!token) return;

      const response = await axios.get(`${API_BASE_URL}/getDesignationsByDepartmentId/${departmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { module_id: getModuleId("designation") }
      });

      const designationsArray = response.data?.data || [];
      setFilteredDesignations(designationsArray);
    } catch (error) {
      console.error("Error fetching designations by department:", error);
      setFilteredDesignations([]);
    }
  };

  const confirmStatusToggle = async () => {
    if (!statusToggleEmployee) return;

    const token = JSON.parse(localStorage.getItem("userData"))?.token;
    const employee = statusToggleEmployee;
    const isActive = newStatus === 'Active' ? '1' : '0';

    const formPayload = new FormData();
    formPayload.append('fullName', employee.fullName || '');
    formPayload.append('mobile', employee.mobile || '');
    formPayload.append('email', employee.email || '');
    formPayload.append('departmentId', employee.Department?.id || '');
    formPayload.append('designationId', employee.Designation?.id || '');
    formPayload.append('role', employee.roleId || '');
    formPayload.append('dob', employee.date_of_birth || '');
    formPayload.append('gender', employee.gender || '');
    formPayload.append('contractStartDate', employee.contractStartDate || '');
    formPayload.append('contractLastDate', employee.contractLastDate || '');
    formPayload.append('isActive', isActive);
    formPayload.append('status', newStatus);
    formPayload.append('salary', employee.salary || '');
    formPayload.append('userType', employee.userType || 'Employee');
    formPayload.append('hireDate', employee.hireDate || '');
    formPayload.append('remark', remark);
    formPayload.append("module_id", getModuleId("employee"));

    if (Array.isArray(employee.employeeRole)) {
      employee.employeeRole.forEach((mod, index) => {
        const permissions = mod.permission?.split(',') || [];
        formPayload.append(`module[${index}]`, mod.moduleId);
        formPayload.append(`permission[${index}]`, permissions.join(','));
      });
    }

    try {
      await axios.put(
        `${API_BASE_URL}/updateEmployee/${employee.id}`,
        formPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setShowRemarkModal(false);
      setStatusToggleEmployee(null);
      setRemark('');
      await fetchEmployees(currentPage);
    } catch (error) {
      console.error("Error updating status:", error.response?.data || error.message);
      alert("Failed to update employee status.");
    }
  };

  const handleDepartmentSelect = (dept) => {
    setSelectedDepartment(dept.departmentName);
    setFilter('');
    fetchDesignationsByDepartment(dept.id);
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchEmployees(currentPage);
  }, [search, selectedStatus, selectedDepartment, filter, currentPage, itemsPerPage]);

  const filteredEmployees = employees.sort((a, b) => a.id - b.id);

  const handleSearch = (e) => {
    setCurrentPage(1);
    setSearch(e.target.value);
  };

  const currentEmployees = filteredEmployees.filter((emp) => {
    const matchesStatus = selectedStatus ? emp.status?.toLowerCase() === selectedStatus.toLowerCase() : true;
    const matchesDepartment = selectedDepartment ? emp.Department?.departmentName === selectedDepartment : true;
    const matchesDesignation = filter ? emp.Designation?.id === filter : true;

    return matchesStatus && matchesDepartment && matchesDesignation;
  });

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = (employee) => {
    setEmployeeToDelete(employee.userId);
    setShowDeleteModal(true);
  };
  const confirmDelete = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("userData"))?.token;

      if (!token) throw new Error("Token not found in localStorage");

      await axios.delete(`${API_BASE_URL}/deleteEmployee/${employeeToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { module_id: getModuleId("employee") }
      });

      // Close modal
      setShowDeleteModal(false);
      setEmployeeToDelete(null);

      // Refetch current page after deletion
      fetchEmployees(currentPage);

    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Failed to delete employee. Please try again.");
      setShowDeleteModal(false);
      setEmployeeToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setEmployeeToDelete(null);
  };

  const handleView = (employee) => {
    navigate(`/dms/employee/view/${employee.id}`);
  };

  return (
    <AdminLayout>
      <div className="employee-container p-3">
        <div className="dms-pages-header sticky-header">
          <div className="live-count">
            <h3 className="mb-0">All Employees</h3>
            <div className="live-count-container">
              <Button className='green-button me-2'>
                👤 Active: {activeCount}
              </Button>
              <Button className='yellow-button'>
                ❌ Inactive: {inactiveCount}
              </Button>
            </div>
          </div>
          <div className="export-import-container">
            <DropdownButton variant="primary" title={<><FaFileExport /> Export</>} className="me-2">
              <Dropdown.Item> <FaFileExcel className="icon-green" /> Export to Excel</Dropdown.Item>
              <Dropdown.Item> <FaFilePdf className="icon-red" /> Export to CSV</Dropdown.Item>
            </DropdownButton>
            {permissions.includes("add") && (
              <Button variant="primary" onClick={() => navigate('/dms/employee/add')}>
                <FaPlus /> Add Employee
              </Button>
            )}
          </div>
        </div>

        <div className="filter-search-container">
          <div className='filter-container'>
            <DropdownButton variant="primary" title="Filter by Department" className="me-2">
              <Dropdown.Item onClick={() => { setSelectedDepartment(''); setFilter(''); setFilteredDesignations([]); }}>
                All
              </Dropdown.Item>
              {departments.map((dept) => (
                <Dropdown.Item key={dept.id} onClick={() => handleDepartmentSelect(dept)}>
                  {dept.departmentName}
                </Dropdown.Item>
              ))}
            </DropdownButton>

            <DropdownButton variant="primary" title="Filter by Designation" className="me-2">
              <Dropdown.Item onClick={() => setFilter('')}>All</Dropdown.Item>
              {filteredDesignations.map((desig) => (
                <Dropdown.Item key={desig.id} onClick={() => setFilter(desig.id)}>
                  {desig.designation}
                </Dropdown.Item>
              ))}
            </DropdownButton>

            <DropdownButton variant="primary" title={`Filter by Status`} className="me-2">
              <Dropdown.Item onClick={() => setSelectedStatus('')}>All</Dropdown.Item>
              <Dropdown.Item onClick={() => setSelectedStatus('Active')}>Active</Dropdown.Item>
              <Dropdown.Item onClick={() => setSelectedStatus('Inactive')}>Inactive</Dropdown.Item>
            </DropdownButton>

            <Button
              onClick={() => {
                setSelectedDepartment('');
                setFilter('');
                setSelectedStatus('');
                setSearch('');
                setFilteredDesignations([]);
                setCurrentPage(1);
              }}
            >
              Clear Filters
            </Button>
          </div>
          <InputGroup className="dms-custom-width">
            <Form.Control
              placeholder="Search employees by name & email-id..."
              value={search}
              onChange={handleSearch}
            />
          </InputGroup>
        </div>

        <div className="dms-table-container">
          {loading ? (
            <div className="text-center py-5 fs-4">Loading...</div>
          ) : (
            <>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Name</th>
                    <th>Mobile</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Designation</th>
                    <th>Created At</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentEmployees.length > 0 ? (
                    currentEmployees.map((employee, index) => (
                      <tr key={employee.id}>
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>{employee.fullName || 'N/A'}</td>
                        <td>{employee.mobile || 'N/A'}</td>
                        <td>{employee.Role?.roleName || 'N/A'}</td>
                        <td>{employee.Department?.departmentName || 'N/A'}</td>
                        <td>{employee.Designation?.designation || 'N/A'}</td>
                        <td>{new Date(employee.createdAt).toLocaleString()}</td>
                        <td>
                          {permissions.includes("edit") ? (
                            <Form.Check
                              type="switch"
                              id={`status-switch-${employee.id}`}
                              label={employee.status?.toLowerCase() === "active" ? "Active" : "Inactive"}
                              checked={employee.status?.toLowerCase() === "active"}
                              onChange={() => {
                                const updatedStatus =
                                  employee.status?.toLowerCase() === "active" ? "Inactive" : "Active";
                                setStatusToggleEmployee(employee);
                                setNewStatus(updatedStatus);
                                setRemark("");
                                setShowRemarkModal(true);
                              }}
                            />
                          ) : (
                            employee.status?.toLowerCase() === "active" ? "Active" : "Inactive"
                          )}
                        </td>
                        <td>
                          {permissions.includes("view") ||
                            permissions.includes("edit") ||
                            permissions.includes("delete") ? (
                            <>
                              {permissions.includes("view") && (
                                <FaEye
                                  title="View"
                                  className="icon-blue me-2"
                                  onClick={() => handleView(employee)}
                                />
                              )}
                              {permissions.includes("edit") && (
                                <FaEdit
                                  title="Edit"
                                  className="icon-green me-2"
                                  onClick={() =>
                                    navigate("/dms/employee/edit", { state: { employee } })
                                  }
                                />
                              )}
                              {permissions.includes("delete") &&
                                employee.Role?.roleName?.toLowerCase() !== "admin" && (
                                  <FaTrash
                                    title="Delete"
                                    className="icon-red"
                                    onClick={() => handleDelete(employee)}
                                  />
                                )}
                            </>
                          ) : (
                            '—'
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center">No employees found.</td>
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
        </div>

        <Modal show={showDeleteModal} onHide={cancelDelete}>
          <Modal.Body>Are you sure you want to delete this employee?</Modal.Body>
          <Modal.Footer>
            <Button type='cancel' onClick={cancelDelete}>Cancel</Button>
            <Button type='submit' onClick={confirmDelete}>Confirm</Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showRemarkModal} onHide={() => setShowRemarkModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Change Employee Status</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Remark</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Enter a remark for status change...."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowRemarkModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={confirmStatusToggle}
              disabled={!remark.trim()}
            >
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </AdminLayout>
  );
};
