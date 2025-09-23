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
  const [formData, setFormData] = useState({
    ...employee,
    department: employee?.Department?.id || '',
    designation: employee?.Designation?.id || '',
    role: employee?.Role?.id || employee?.roleId || '',
    userProfile: employee?.profileImage || '',
    dob: employee?.date_of_birth || '',
  });
  const [status, setStatus] = useState(employee.status || 'Active');
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [roles, setRoles] = useState([]);
  const [roleModules, setRoleModules] = useState([]);
  const [allModules, setAllModules] = useState([]);
  const MODULE_ID = getModuleId('employee');

  const token = JSON.parse(localStorage.getItem("userData"))?.token;
  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await axiosInstance.get('/getAllRoles', {
          headers: { Authorization: `Bearer ${token}` },
          params: { module_id: MODULE_ID }
        });
        setRoles(res.data.data.rows || []);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [deptRes, desigRes] = await Promise.all([
          axiosInstance.get('/getAllDepartments', {
            params: { module_id: MODULE_ID }
          }),
          axiosInstance.get('/getAllDesignations', {
            params: { module_id: MODULE_ID }
          })
        ]);

        setDepartments(deptRes.data?.data?.data || []);
        setDesignations(desigRes.data?.data?.data || []);
      } catch (error) {
        console.error('Error fetching departments or designations:', error);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (formData.department) {
      const fetchDesignations = async () => {
        try {
          const res = axiosInstance.get(`/getDesignationsByDepartmentId/${formData.department}`, {
            params: { module_id: MODULE_ID }
          })
          setDesignations(res.data?.data || []);
        } catch (error) {
          console.error('Failed to fetch designations by department:', error);
        }
      };
      fetchDesignations();
    }
  }, [formData.department]);

  useEffect(() => {
    if (Array.isArray(employee?.employeeRole) && employee.employeeRole.length > 0) {
      const dynamicPerms = employee.employeeRole.map((r) => {
        const permsArray = r.permission?.split(',') || [];
        return {
          id: r.moduleId,
          moduleName: r.moduleName,
          permissions: permsArray,
        };
      });

      const selectedPerms = {};
      dynamicPerms.forEach((mod) => {
        selectedPerms[mod.moduleName] = {
          view: mod.permissions.includes('view'),
          add: mod.permissions.includes('add'),
          edit: mod.permissions.includes('edit'),
          delete: mod.permissions.includes('delete'),
        };
      });

      setRoleModules(dynamicPerms);
      setSelectedPermissions(selectedPerms);
    }
  }, []);

  useEffect(() => {
    const fetchAllModules = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("userData"))?.token;
        const res = await axiosInstance.get(`${API_BASE_URL}/getAllModules?page=1&limit=1000`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { module_id: MODULE_ID }
        });

        const flattenModules = (data) => {
          const modules = [];
          data.forEach((parent) => {
            parent.childMenus?.forEach((child) => {
              child.modules?.forEach((module) => {
                modules.push(module);
              });
            });
          });
          return modules;
        };

        const fetchedModules = (res.data?.data?.result || []).filter(mod => mod.is_active);
        setAllModules(fetchedModules);

      } catch (error) {
        console.error("Failed to fetch all modules:", error);
      }
    };

    fetchAllModules();
  }, [roleModules]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedValue = type === 'checkbox' ? checked : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: updatedValue,
    }));
  };

  const handleSelectAll = () => {
    const allPermissions = {};

    allModules.forEach((module) => {
      const moduleName = module.moduleName;
      allPermissions[moduleName] = {
        view: true,
        add: true,
        edit: true,
        delete: true
      };
    });

    setSelectedPermissions(allPermissions);
  };

  const handleClearAll = () => setSelectedPermissions({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formPayload = new FormData();
      const selectedRole = roles.find(r => r.id.toString() === formData.role?.toString());

      // Append module & permission data
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
          formPayload.append(`permission[${index}]`, enabledPermissions.join(','));
          index++;
        }
      });

      // If role is Admin → skip employee profile fields
      if (selectedRole?.roleName === 'Admin') {
        formPayload.append('role', formData.role); // only this is required
      } else {
        // Full employee info for other roles
        const {
          Department,
          Designation,
          employeeRole,
          createdAt,
          updatedAt,
          userProfile,
          ...cleanedData
        } = formData;

        formPayload.append('fullName', cleanedData.fullName);
        formPayload.append('mobile', cleanedData.mobile);
        formPayload.append('gender', cleanedData.gender || '');
        formPayload.append('dob', cleanedData.dob || '');
        formPayload.append('contractStartDate', cleanedData.contractStartDate || '');
        formPayload.append('contractLastDate', cleanedData.contractLastDate || '');
        formPayload.append('departmentId', cleanedData.department);
        formPayload.append('designationId', cleanedData.designation);
        formPayload.append('role', cleanedData.role);
        formPayload.append('isActive', cleanedData.isActive ? '1' : '0');
        formPayload.append('status', status);

        if (typeof formData.userProfile !== 'string') {
          formPayload.append('userProfile', formData.userProfile);
        }
      }
      formPayload.append('module_id', MODULE_ID);

      await axiosInstance.put(
        `/updateEmployee/${employee.id}`,
        formPayload,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      setSuccessMessage('Employee updated successfully!');
      navigate('/dms/employee', { state: { reload: true } });

    } catch (error) {
      console.error('Update failed:', error.response?.data?.message || error.message);
      alert('Failed to update employee.');
    }
  };

  return (
    <AdminLayout>
      <Container className="dms-container">
        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={8}>
            {step === 1 && (
              <Form>
                <h4 className="text-left">Edit Employee Profile</h4>
                <div className="dms-form-container p-3">
                  {successMessage && (
                    <Alert variant="success" className="text-center mb-4">
                      {successMessage}
                    </Alert>
                  )}
                  <Tabs activeKey="profile" id="employee-tabs" className="mb-3">
                    <Tab eventKey="profile" title="Profile">
                      {/* Profile Image Upload */}
                      <Form.Group className="dms-form-group text-center" controlId="formProfilePhoto">
                        <div className="d-flex flex-column align-items-left gap-3">
                          <img
                            src={
                              typeof formData.userProfile === 'string' && formData.userProfile.startsWith('/uploads')
                                ? `${import.meta.env.VITE_IMAGE_BASE_URL}${formData.userProfile}`
                                : formData.userProfile || profile_img
                            }
                            alt="Profile"
                            className="profile-img img-fluid rounded-circle"
                            style={{ maxWidth: '120px', height: 'auto' }}
                          />
                          <Form.Control
                            type="file"
                            accept="image/*"
                            className="w-100"
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

                      {/* Form Fields */}
                      <Form.Group className="dms-form-group" controlId="formFirstName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                          name="fullName"
                          type="text"
                          placeholder="Enter name"
                          value={formData.fullName || ''}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      <Form.Group className="dms-form-group" controlId="formPhone">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter phone number"
                          name="mobile"
                          value={formData.mobile || ''}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="dms-form-group" controlId="formGender">
                        <Form.Label>Gender</Form.Label>
                        <Form.Select
                          name="gender"
                          value={formData.gender || 'Male'}
                          onChange={handleChange}
                          required
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="dms-form-group" controlId="formDob">
                        <Form.Label>Date of Birth</Form.Label>
                        <Form.Control
                          type="date"
                          name="dob"
                          value={formData.dob || ''}
                          onChange={handleChange}
                        />
                      </Form.Group>
                      {/* Contract Dates */}
                      <Row>
                        <Col md={6}>
                          <Form.Group className="dms-form-group" controlId="formContractStart">
                            <Form.Label>Contract Start Date</Form.Label>
                            <Form.Control
                              type="date"
                              name="contractStartDate"
                              value={formData.contractStartDate || ''}
                              onChange={handleChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="dms-form-group" controlId="formContractEnd">
                            <Form.Label>Contract End Date</Form.Label>
                            <Form.Control
                              type="date"
                              name="contractLastDate"
                              value={formData.contractLastDate || ''}
                              onChange={handleChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="dms-form-group" controlId="formDepartment">
                            <Form.Label>Department</Form.Label>
                            <Form.Select
                              name="department"
                              value={formData.department || ''}
                              onChange={handleChange}
                              required
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
                              required
                            >
                              <option value="">Select an option</option>
                              {designations.map((designation) => (
                                <option key={designation.id} value={designation.id}>
                                  {designation.designation}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="dms-form-group" controlId="formStatus">
                        <Form.Label>Status</Form.Label>
                        <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                          <option value="select">Select an option</option>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </Form.Select>
                      </Form.Group>
                    </Tab>
                  </Tabs>
                </div>
                <div className="d-flex justify-content-center mt-4">
                  <Button type='cancel' className="me-2" onClick={() => navigate('/dms/employee')}>
                    Cancel
                  </Button>
                  <Button type="button" onClick={() => setStep(2)}>
                    Next
                  </Button>
                </div>
              </Form>
            )}

            {step === 2 && (
              <Form onSubmit={handleSubmit}>
                <h4 className="text-left">Edit Employee Permissions</h4>
                <div className="dms-form-container p-3">
                  <Tabs activeKey="permission" id="employee-tabs" className="mb-3">
                    <Tab eventKey="permission" title="Permission">
                      <Row>
                        <Col md={12}>
                          <Form.Group className="dms-form-group" controlId="formRole">
                            <Form.Label>Role</Form.Label>
                            <Form.Select
                              name="role"
                              value={formData.role?.toString() || ''}
                              onChange={handleChange}
                              required
                            >
                              <option value="">Select an option</option>
                              {roles.map((role) => (
                                <option key={role.id} value={role.id.toString()}>
                                  {role.roleName}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>

                      <div className="text-center my-3">
                        <Button variant="primary" className="me-2" onClick={handleSelectAll}>
                          Select All
                        </Button>
                        <Button variant="secondary" onClick={handleClearAll}>
                          Clear All
                        </Button>
                      </div>
                      <h5 className="mt-5"> Permissions</h5>
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
                    </Tab>
                  </Tabs>
                </div>

                <div className="d-flex justify-content-center mt-4">
                  <Button type='cancel' className="me-2" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button type="submit">Submit</Button>
                </div>
              </Form>
            )}
          </Col>
        </Row>
      </Container>
    </AdminLayout>
  );
};
