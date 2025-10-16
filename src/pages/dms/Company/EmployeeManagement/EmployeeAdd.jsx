import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';
import { Tabs, Tab, Form, Button, Row, Col, Table } from 'react-bootstrap';
import profile_img from '../../../../assets/images/profile.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getModuleId } from '../../../../utils/authhelper';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const EmployeeAdd = () => {
  const [formData, setFormData] = useState({});
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [tabKey, setTabKey] = useState('profile');
  const [roles, setRoles] = useState([]);
  const [allModules, setAllModules] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const MODULE_ID = getModuleId('employee');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (name === 'department') {
      fetchDesignationsByDepartmentId(value);
      setFormData((prev) => ({ ...prev, designation: '' }));
    }

    if (name === 'role') {
      fetchPermissionsByRoleId(value);
    }
  };

  const [selectedPermissions, setSelectedPermissions] = useState({});
  const [dynamicPermissions, setDynamicPermissions] = useState([]);

  const handleSelectAll = () => {
    const updatedPermissions = {};

    const all = [...dynamicPermissions, ...allModules];
    all.forEach((module) => {
      const moduleName = module.moduleName;
      updatedPermissions[moduleName] = {
        view: true,
        add: true,
        edit: true,
        delete: true
      };
    });

    setSelectedPermissions(updatedPermissions);
  };

  const handleClearAll = () => {
    setSelectedPermissions({});
  };

  const fetchDesignationsByDepartmentId = async (departmentId) => {
    try {
      const token = JSON.parse(localStorage.getItem("userData"))?.token;
      const res = await axios.get(`${API_BASE_URL}/getDesignationsByDepartmentId/${departmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { module_id: MODULE_ID }
      });
      setDesignations(res.data.data || []);
    } catch (error) {
      console.error('Failed to fetch designations by department', error);
    }
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("userData"))?.token;
        const res = await axios.get(`${API_BASE_URL}/getAllDepartments`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { module_id: MODULE_ID }
        });
        setDepartments(res.data.data?.data || []);
      } catch (error) {
        console.error('Failed to fetch departments', error);
      }
    };
    fetchDepartments();
  }, []);

  const fetchRoles = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("userData"))?.token;
      const response = await axios.get(`${API_BASE_URL}/getAllRoles`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { module_id: MODULE_ID }
      });
      setRoles(response.data.data.rows || []);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchPermissionsByRoleId = async (roleId) => {
    try {

      const token = JSON.parse(localStorage.getItem("userData"))?.token;
      const res = await axios.get(`${API_BASE_URL}/getAllModuleByRole?roleId=${roleId}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { roleId: roleId, module_id: MODULE_ID }
      });

      const roleData = res.data?.data?.[0];
      const modules = roleData?.Modules || [];

      setDynamicPermissions(modules);

      const formattedPermissions = {};

      modules.forEach((module) => {
        const moduleName = module.moduleName;
        formattedPermissions[moduleName] = { view: false, add: false, edit: false, delete: false };

        module.permissions.forEach((permObj) => {
          const perms = permObj.permission_name.split(',').map(p => p.trim().toLowerCase());

          perms.forEach(cap => {
            if (formattedPermissions[moduleName].hasOwnProperty(cap)) {
              formattedPermissions[moduleName][cap] = true;
            }
          });
        });
      });

      setSelectedPermissions(formattedPermissions);
    } catch (err) {
      console.error("Failed to fetch permissions by role:", err);
    }
  };

  useEffect(() => {
    const fetchAllModules = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("userData"))?.token;
        const res = await axios.get(`${API_BASE_URL}/getAllModules`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { page: 1, limit: 1000, module_id: MODULE_ID }
        });
        const allFetchedModules = (res.data?.data?.result || []).filter(mod => mod?.moduleName && mod.is_active);
        const filteredModules = allFetchedModules.filter(module =>
          !dynamicPermissions.some(perm => perm.moduleName === module.moduleName)
        );
        setAllModules(filteredModules);
      } catch (error) {
        console.error("Failed to fetch all modules:", error);
      }
    };
    fetchAllModules();
  }, [dynamicPermissions]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = JSON.parse(localStorage.getItem("userData"))?.token;
    const form = new FormData();

    // Basic employee fields
    form.append('fullName', formData.fullName || '');
    form.append('userProfile', formData.userProfile);
    form.append('dob', formData.dob || '');
    form.append('hireDate', formData.hireDate || '');
    form.append('contractStartDate', formData.contractStartDate || '');
    form.append('contractLastDate', formData.contractLastDate || '');
    form.append('email', formData.email || '');
    form.append('mobile', formData.mobile || '');
    form.append('gender', formData.gender || '');
    form.append('salary', formData.salary || '');
    form.append('password', formData.password || '');
    form.append('departmentId', formData.department || '');
    form.append('designationId', formData.designation || '');
    form.append('status', formData.status || 'Active');
    form.append('role', formData.role || '');

    // Dynamic permissions
    const modulesArray = [];
    const permissionsArray = [];

    for (const [moduleName, perms] of Object.entries(selectedPermissions)) {
      const moduleObj = [...dynamicPermissions, ...allModules].find(m => m.moduleName === moduleName);
      if (!moduleObj) continue;

      const selected = Object.entries(perms)
        .filter(([_, isSelected]) => isSelected)
        .map(([permName]) => permName)
        .join(',');

      if (selected) {
        modulesArray.push(moduleObj.id);
        permissionsArray.push(selected);
      }
    }

    modulesArray.forEach((moduleId, index) => {
      form.append(`module[${index}]`, moduleId);
      form.append(`permission[${index}]`, permissionsArray[index]);
    });
    form.append('module_id', MODULE_ID);

    try {
      const res = await axios.post(`${API_BASE_URL}/createEmployee`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data?.success) {
        setSuccessMessage("Employee added successfully!");
        setTimeout(() => navigate("/dms/employee"), 2000);
      } else {
        alert(res.data?.message || "Failed to create employee");
      }
    } catch (err) {
      console.error("Request failed:", err);
      const errorMsg = err.response?.data?.message;
      alert(errorMsg || "Something went wrong!");
    }
  };

  const handleNext = () => {
    const requiredFields = [
      'fullName', 'email', 'mobile', 'dob', 'hireDate', 'salary',
      'contractStartDate', 'contractLastDate', 'password', 'gender', 'userProfile',
      'department', 'designation'
    ];

    const fieldLabels = {
      fullName: "Full Name",
      email: "Email",
      mobile: "Mobile Number",
      dob: "Date of Birth",
      hireDate: "Hire Date",
      salary: "Salary",
      contractStartDate: "Contract Start Date",
      contractLastDate: "Contract End Date",
      password: "Password",
      gender: "Gender",
      userProfile: "Profile Image",
      department: "Department",
      designation: "Designation"
    };

    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      const readableFields = missingFields.map(field => fieldLabels[field] || field);
      alert(`Please fill the following fields: ${readableFields.join(', ')}`);
      return;
    }

    setStep(2);
    setTabKey("permission");
  };

  return (
    <AdminLayout>
      <div className='dms-container'>
        <Row className="justify-content-center">
          <Col lg={8} md={10} sm={12}>
            <div className="dms-form-container p-3">
              <Tabs activeKey={tabKey} onSelect={(k) => setTabKey(k)} id="employee-tabs" className="mb-3">
                <Tab eventKey="profile" title="Profile">
                  <Form>
                    <Form.Group className="dms-form-group" controlId="formProfilePhoto">
                      <div className="d-flex flex-column flex-md-row align-items-center gap-3">
                        <img
                          src={formData.profilePhoto || profile_img}
                          alt="Profile"
                          className='profile-img'
                        />
                        <Form.Control
                          type="file"
                          name="userProfile"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = () => {
                                setFormData((prev) => ({
                                  ...prev,
                                  profilePhoto: reader.result,
                                  userProfile: file,
                                }));
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </div>
                    </Form.Group>
                    <Row>
                      <Col md={12}><Form.Group className="dms-form-group" controlId="fullname"><Form.Label>Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="fullName"
                          placeholder="Enter your name"
                          onChange={handleChange}
                        />
                      </Form.Group></Col>
                    </Row>
                    <Row>
                      <Col md={6}><Form.Group className="dms-form-group" controlId="formEmail"><Form.Label>Email</Form.Label><Form.Control
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        onChange={handleChange}
                      />
                      </Form.Group></Col>
                      <Col md={6}><Form.Group className="dms-form-group" controlId="formPhone"><Form.Label>Phone</Form.Label><Form.Control
                        type="text"
                        name="mobile"
                        placeholder="Enter phone number"
                        onChange={handleChange}
                      />
                      </Form.Group></Col>
                    </Row>
                    <Row>
                      <Col md={6}><Form.Group className="dms-form-group" controlId="formGender">
                        <Form.Label>Gender</Form.Label>
                        <Form.Select name="gender" onChange={handleChange} >
                          <option value="Select an Option">Select an option</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </Form.Select>
                      </Form.Group>
                      </Col>
                      <Col md={6}><Form.Group className="dms-form-group" controlId="formDob"><Form.Label>Date of Birth</Form.Label><Form.Control type="date" name="dob" onChange={handleChange} required /></Form.Group></Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="dms-form-group" controlId="formHireDate">
                          <Form.Label>Hire Date</Form.Label>
                          <Form.Control
                            type="date"
                            name="hireDate"
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="dms-form-group" controlId="formSalary">
                          <Form.Label>Salary</Form.Label>
                          <Form.Control
                            type="text"
                            name="salary"
                            placeholder="Enter salary"
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}><Form.Group className="dms-form-group" controlId="formStartDate"><Form.Label>Contract Start Date</Form.Label><Form.Control type="date" name="contractStartDate" onChange={handleChange} /></Form.Group></Col>
                      <Col md={6}><Form.Group className="dms-form-group" controlId="formEndDate"><Form.Label>Contract End Date</Form.Label><Form.Control type="date" name="contractLastDate" onChange={handleChange} /></Form.Group></Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="dms-form-group" controlId="formDepartment">
                          <Form.Label>Department</Form.Label>
                          <Form.Select
                            name="department"
                            value={formData.department || ''}
                            onChange={handleChange}
                          >
                            <option value="">Select an option</option>
                            {departments.map((dept) => (
                              <option key={dept.id} value={dept.id}>
                                {dept.departmentName}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="dms-form-group" controlId="formDesignation">
                          <Form.Label>Designation</Form.Label>
                          <Form.Select
                            name="designation"
                            value={formData.designation || ''}
                            onChange={handleChange}
                          >
                            <option value="">Select an option</option>
                            {designations.map((des) => (
                              <option key={des.id} value={des.id}>
                                {des.designation}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Form.Group className='dms-form-group'>
                      <Form.Label>Status</Form.Label>
                      <Form.Select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData(prev => ({
                            ...prev,
                            status: e.target.value
                          }))
                        }
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="dms-form-group" controlId="formPassword">
                      <Form.Label>Password</Form.Label>
                      <div style={{ position: "relative" }}>
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          name="password"
                          onChange={handleChange}
                          placeholder="Enter password"
                        />
                        <span
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            position: "absolute",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                            color: "#6c757d",
                          }}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                      </div>
                    </Form.Group>

                    <div className="d-flex justify-content-between mt-3">
                      <Button variant="secondary" onClick={() => navigate("/dms/employee")}>Cancel</Button>
                      <Button variant="primary" onClick={handleNext}>Next</Button>
                    </div>

                  </Form>
                </Tab>
                <Tab eventKey="permission" title="Permission">
                  <Row>
                    <Col md={12}><Form.Group className="dms-form-group" controlId="formRole"><Form.Label>Role</Form.Label>
                      <Form.Select
                        name="role"
                        value={formData.role || ''}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select an option</option>
                        {roles.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.roleName || role.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group></Col>
                  </Row>
                  <div className="text-center my-3">
                    <Button variant="primary" className="me-2" onClick={handleSelectAll}>Select All</Button>
                    <Button variant="secondary" onClick={handleClearAll}>Clear All</Button>
                  </div>
                  <h5 className="mt-3">Select Permissions</h5>
                  <Table bordered responsive>
                    <thead>
                      <tr>
                        <th>Module</th>
                        <th>Permissions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dynamicPermissions.map((module) => {
                        const moduleName = module.moduleName;
                        const permissions = ["view", "add", "edit", "delete"];

                        const togglePermission = (perm) => {
                          setSelectedPermissions((prev) => ({
                            ...prev,
                            [moduleName]: {
                              ...prev[moduleName],
                              [perm]: !prev[moduleName]?.[perm],
                            },
                          }));
                        };

                        return (
                          <tr key={moduleName}>
                            <td>
                              <Form.Check
                                inline
                                type="checkbox"
                                label={moduleName}
                                checked={["view", "add", "edit", "delete"].some(
                                  (perm) => selectedPermissions[moduleName]?.[perm]
                                )}

                              />
                            </td>
                            <td>
                              {permissions.map((perm) => (
                                <Form.Check
                                  inline
                                  key={`${moduleName}-${perm}`}
                                  label={perm.charAt(0).toUpperCase() + perm.slice(1)}
                                  type="checkbox"
                                  checked={selectedPermissions[moduleName]?.[perm] || false}
                                  onChange={() => togglePermission(perm)}
                                />
                              ))}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>

                  <h5 className="mt-5">Select Extra Permissions</h5>
                  <Table bordered responsive>
                    <thead>
                      <tr>
                        <th>Module</th>
                        <th>Permissions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allModules.map((module) => {
                        const moduleName = module.moduleName;
                        const permissions = ["view", "add", "edit", "delete"];

                        const toggleExtraPermission = (perm) => {
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
                            <td>
                              <Form.Check
                                inline
                                type="checkbox"
                                label={moduleName}
                                checked={permissions.some(
                                  (perm) => selectedPermissions[moduleName]?.[perm]
                                )}
                              />
                            </td>
                            <td>
                              {permissions.map((perm) => (
                                <Form.Check
                                  inline
                                  key={`${moduleName}-extra-${perm}`}
                                  label={perm.charAt(0).toUpperCase() + perm.slice(1)}
                                  type="checkbox"
                                  checked={selectedPermissions[moduleName]?.[perm] || false}
                                  onChange={() => toggleExtraPermission(perm)}
                                />
                              ))}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                  <div className="d-flex justify-content-between mt-3">
                    <Button variant="secondary" onClick={() => navigate("/dms/employee")}>Cancel</Button>
                    <Button variant="success" onClick={handleSubmit}>Submit</Button>
                  </div>
                </Tab>
              </Tabs>
            </div>
          </Col>
        </Row>
      </div>
    </AdminLayout>
  );
};  