import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';
import { Form, Button, Row, Col, Container, Tabs, Tab, Table, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import profile_img from '../../../../assets/images/profile.png';
import axios from 'axios';
import { getModuleId } from '../../../../utils/authhelper';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const EmployeeEdit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const employee = location.state?.employee || {};

  // Core States
  const [formData, setFormData] = useState({
    ...employee,
    department: employee?.Department?.id || "",
    designation: employee?.Designation?.id || "",
    role: employee?.Role?.id || employee?.roleId || "",
    userProfile: employee?.profileImage || "",
    dob: employee?.date_of_birth || "",
    email: employee?.email || "",
  });
  const [status, setStatus] = useState(employee.status || "Active");

  // Dropdown data
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [roles, setRoles] = useState([]);
  const [roleModules, setRoleModules] = useState([]);
  const [allModules, setAllModules] = useState([]);

  // Permissions
  const [selectedPermissions, setSelectedPermissions] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Token & Module ID
  const MODULE_ID = getModuleId("employee");
  const token = JSON.parse(localStorage.getItem("userData"))?.token;

  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: { Authorization: `Bearer ${token}` },
  });

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await axiosInstance.get("/getAllRoles", {
          params: { module_id: MODULE_ID },
        });
        setRoles(res.data.data.rows || []);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [deptRes, desigRes] = await Promise.all([
          axiosInstance.get("/getAllDepartments", { params: { module_id: MODULE_ID } }),
          axiosInstance.get("/getAllDesignations", { params: { module_id: MODULE_ID } }),
        ]);
        setDepartments(deptRes.data?.data?.data || []);
        setDesignations(desigRes.data?.data?.data || []);
      } catch (error) {
        console.error("Error fetching departments or designations:", error);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (formData.department) {
      const fetchDesignations = async () => {
        try {
          const res = await axiosInstance.get(
            `/getDesignationsByDepartmentId/${formData.department}`,
            { params: { module_id: MODULE_ID } }
          );
          setDesignations(res.data?.data || []);
        } catch (error) {
          console.error("Failed to fetch designations by department:", error);
        }
      };
      fetchDesignations();
    }
  }, [formData.department]);


  useEffect(() => {
    if (Array.isArray(employee?.employeeRole) && employee.employeeRole.length > 0) {
      const dynamicPerms = employee.employeeRole.map((r) => {
        const permsArray = r.permission?.split(",") || [];
        return {
          id: r.moduleId,
          moduleName: r.moduleName,
          permissions: permsArray,
        };
      });

      const selectedPerms = {};
      dynamicPerms.forEach((mod) => {
        selectedPerms[mod.moduleName] = {
          view: mod.permissions.includes("view"),
          add: mod.permissions.includes("add"),
          edit: mod.permissions.includes("edit"),
          delete: mod.permissions.includes("delete"),
        };
      });

      setRoleModules(dynamicPerms);
      setSelectedPermissions(selectedPerms);
    }
  }, []);

  useEffect(() => {
    const fetchAllModules = async () => {
      try {
        const res = await axiosInstance.get(`${API_BASE_URL}/getAllModules`, {
          params: { module_id: MODULE_ID, page: 1, limit: 1000 },
        });

        const fetchedModules = (res.data?.data?.result || []).filter(
          (mod) => mod.is_active
        );
        setAllModules(fetchedModules);
      } catch (error) {
        console.error("Failed to fetch all modules:", error);
      }
    };
    fetchAllModules();
  }, [roleModules]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedValue = type === "checkbox" ? checked : value;
    setFormData((prevData) => ({ ...prevData, [name]: updatedValue }));
  };

  const handleSelectAll = () => {
    const allPermissions = {};
    allModules.forEach((module) => {
      const moduleName = module.moduleName;
      allPermissions[moduleName] = { view: true, add: true, edit: true, delete: true };
    });
    setSelectedPermissions(allPermissions);
  };

  const handleClearAll = () => setSelectedPermissions({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formPayload = new FormData();
      const selectedRole = roles.find(
        (r) => r.id.toString() === formData.role?.toString()
      );

      // Add permissions
      const moduleKeys = Object.keys(selectedPermissions);
      let index = 0;
      moduleKeys.forEach((moduleName) => {
        const modulePermissions = selectedPermissions[moduleName];
        const enabledPermissions = Object.entries(modulePermissions)
          .filter(([_, isEnabled]) => isEnabled)
          .map(([perm]) => perm);

        if (enabledPermissions.length === 0) return;
        const moduleId =
          roleModules.find((m) => m.moduleName === moduleName)?.id ||
          allModules.find((m) => m.moduleName === moduleName)?.id;

        if (moduleId) {
          formPayload.append(`module[${index}]`, moduleId);
          formPayload.append(`permission[${index}]`, enabledPermissions.join(","));
          index++;
        }
      });

      // Common payload fields
      formPayload.append("employeeId", employee.id);
      formPayload.append("userType", selectedRole?.roleName === "Admin" ? 1 : 0);
      formPayload.append("module_id", MODULE_ID);

      // Additional info
      formPayload.append("fullName", formData.fullName);
      formPayload.append("mobile", formData.mobile);
      formPayload.append("email", formData.email);
      formPayload.append("gender", formData.gender || "");
      formPayload.append("dob", formData.dob || "");
      formPayload.append("contractStartDate", formData.contractStartDate || "");
      formPayload.append("contractLastDate", formData.contractLastDate || "");
      formPayload.append("departmentId", formData.department);
      formPayload.append("designationId", formData.designation);
      formPayload.append("role", formData.role);
      formPayload.append("isActive", formData.isActive ? "1" : "0");
      formPayload.append("status", status);

      if (typeof formData.userProfile !== "string") {
        formPayload.append("userProfile", formData.userProfile);
      }

      // Conditional update ID
      const updateId = employee.userType === "Admin" ? employee.userId : employee.id;

      await axiosInstance.put(`/updateEmployee/${updateId}`, formPayload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMessage("Employee updated successfully!");
      navigate("/dms/employee", { state: { reload: true } });
    } catch (error) {
      console.error("Update failed:", error.response?.data?.message || error.message);
      alert("Failed to update employee.");
    }
  };

  return (
    <AdminLayout>
      <Container className="dms-container">
        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={8}>
            {step === 1 && (
              <Form>
                <h4 className="text-left mb-4">Edit Employee Profile</h4>

                {successMessage && (
                  <Alert variant="success" className="text-center mb-4">
                    {successMessage}
                  </Alert>
                )}

                <div className="dms-form-container p-4 shadow-sm rounded bg-white">
                  <Tabs activeKey="profile" id="employee-tabs" className="mb-3">
                    <Tab eventKey="profile" title="Profile">
                      {/* Profile Photo */}
                      <Form.Group controlId="formProfilePhoto" className="text-center mb-4">
                        <div className="d-flex flex-column align-items-center gap-3">
                          <img
                            src={
                              typeof formData.userProfile === "string" &&
                              formData.userProfile.startsWith("/uploads")
                                ? `${import.meta.env.VITE_IMAGE_BASE_URL}${formData.userProfile}`
                                : formData.userProfile || profile_img
                            }
                            alt="Profile"
                            className="rounded-circle shadow-sm"
                            style={{ width: "120px", height: "120px", objectFit: "cover" }}
                          />
                          <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = () =>
                                  setFormData({ ...formData, userProfile: reader.result });
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </div>
                      </Form.Group>

                      {/* Basic Info */}
                      <Form.Group className="mb-3" controlId="formFullName">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                          name="fullName"
                          type="text"
                          placeholder="Enter name"
                          value={formData.fullName || ""}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formMobile">
                        <Form.Label>Mobile</Form.Label>
                        <Form.Control
                          name="mobile"
                          type="text"
                          placeholder="Enter phone number"
                          value={formData.mobile || ""}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          name="email"
                          type="email"
                          placeholder="Enter email address"
                          value={formData.email || ""}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3" controlId="formGender">
                            <Form.Label>Gender</Form.Label>
                            <Form.Select
                              name="gender"
                              value={formData.gender || "Male"}
                              onChange={handleChange}
                            >
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3" controlId="formDob">
                            <Form.Label>Date of Birth</Form.Label>
                            <Form.Control
                              type="date"
                              name="dob"
                              value={formData.dob || ""}
                              onChange={handleChange}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      {/* Contract Dates */}
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3" controlId="formContractStart">
                            <Form.Label>Contract Start</Form.Label>
                            <Form.Control
                              type="date"
                              name="contractStartDate"
                              value={formData.contractStartDate || ""}
                              onChange={handleChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3" controlId="formContractEnd">
                            <Form.Label>Contract End</Form.Label>
                            <Form.Control
                              type="date"
                              name="contractLastDate"
                              value={formData.contractLastDate || ""}
                              onChange={handleChange}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      {/* Department & Designation */}
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3" controlId="formDepartment">
                            <Form.Label>Department</Form.Label>
                            <Form.Select
                              name="department"
                              value={formData.department || ""}
                              onChange={handleChange}
                            >
                              <option value="">Select Department</option>
                              {departments.map((dept) => (
                                <option key={dept.id} value={dept.id}>
                                  {dept.departmentName}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3" controlId="formDesignation">
                            <Form.Label>Designation</Form.Label>
                            <Form.Select
                              name="designation"
                              value={formData.designation || ""}
                              onChange={handleChange}
                            >
                              <option value="">Select Designation</option>
                              {designations.map((d) => (
                                <option key={d.id} value={d.id}>
                                  {d.designation}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>

                      {/* Status */}
                      <Form.Group className="mb-3" controlId="formStatus">
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </Form.Select>
                      </Form.Group>
                    </Tab>
                  </Tabs>
                </div>

                <div className="d-flex justify-content-center mt-4">
                  <Button
                    variant="secondary"
                    className="me-2"
                    onClick={() => navigate("/dms/employee")}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => setStep(2)}>Next</Button>
                </div>
              </Form>
            )}

            {/* =================== STEP 2: Permissions =================== */}
            {step === 2 && (
              <Form onSubmit={handleSubmit}>
                <h4 className="text-left mb-4">Edit Employee Permissions</h4>

                <div className="dms-form-container p-4 shadow-sm rounded bg-white">
                  <Tabs activeKey="permission" id="employee-tabs" className="mb-3">
                    <Tab eventKey="permission" title="Permission">
                      {/* Role Selection */}
                      <Form.Group className="mb-4" controlId="formRole">
                        <Form.Label>Role</Form.Label>
                        <Form.Select
                          name="role"
                          value={formData.role?.toString() || ""}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Role</option>
                          {roles.map((role) => (
                            <option key={role.id} value={role.id.toString()}>
                              {role.roleName}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>

                      {/* Permission Table */}
                      <div className="text-center mb-4">
                        <Button
                          variant="primary"
                          className="me-2"
                          onClick={handleSelectAll}
                        >
                          Select All
                        </Button>
                        <Button variant="secondary" onClick={handleClearAll}>
                          Clear All
                        </Button>
                      </div>

                      <h5 className="mt-4 mb-3">Module Permissions</h5>
                      <Table bordered responsive hover>
                        <thead className="table-light">
                          <tr>
                            <th>Module</th>
                            <th>Permissions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allModules.map((module) => {
                            const moduleName = module.moduleName;
                            const permissions = ["view", "add", "edit", "delete"];
                            const togglePerm = (perm) => {
                              setSelectedPermissions((prev) => ({
                                ...prev,
                                [moduleName]: {
                                  ...prev[moduleName],
                                  [perm]: !prev[moduleName]?.[perm],
                                },
                              }));
                            };
                            return (
                              <tr key={module.id}>
                                <td>{moduleName}</td>
                                <td>
                                  {permissions.map((perm) => (
                                    <Form.Check
                                      inline
                                      key={`${moduleName}-${perm}`}
                                      label={perm.charAt(0).toUpperCase() + perm.slice(1)}
                                      type="checkbox"
                                      checked={selectedPermissions[moduleName]?.[perm] || false}
                                      onChange={() => togglePerm(perm)}
                                    />
                                  ))}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </Tab>
                  </Tabs>
                </div>

                <div className="d-flex justify-content-center mt-4">
                  <Button
                    variant="secondary"
                    className="me-2"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button type="submit" variant="success">
                    Update Employee
                  </Button>
                </div>
              </Form>
            )}
          </Col>
        </Row>
      </Container>
    </AdminLayout>
  );
};