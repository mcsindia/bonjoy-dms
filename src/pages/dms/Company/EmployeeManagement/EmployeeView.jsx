import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';
import { Row, Col, Card, Image, Table, Alert, Button } from 'react-bootstrap';
import profile_img from '../../../../assets/images/profile.png';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import { getToken, getModuleId } from '../../../../utils/authhelper';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

export const EmployeeView = () => {
  const location = useLocation();
  const { id: paramId } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const employeeId = paramId || employeeFromState?.id;
    const userData = JSON.parse(localStorage.getItem("userData"));
  const token = getToken();
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

    useEffect(() => {
    const fetchEmployee = async () => {
      if (!employeeId) {
        setError('No employee ID provided.');
        return;
      }

      setLoading(true);
      try {
        const moduleId = getModuleId("employee"); 
        const res = await axios.get(`${API_BASE_URL}/getEmployeeById/${employeeId}`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { module_id: moduleId } // include module_id in query
        });

        if (res.data.success) {
          setEmployee(res.data.data);
          setError('');
        } else {
          setError(res.data.message || 'Failed to fetch employee details.');
        }
      } catch (err) {
        console.error('Error fetching employee:', err.response || err.message);
        setError('Error fetching employee.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [employeeId, token]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center mt-5">
          <h3>Loading profile...</h3>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="text-center mt-5">
          <Alert variant="danger">{error}</Alert>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="dms-container">
        <Row className="mb-4">
          <Col md={12}>
            <Card className="p-3">
              <Row className="align-items-center justify-content-between">
                <Col md="auto">
                  <Image
                    src={
                      employee.profileImage
                        ? `${IMAGE_BASE_URL}${employee.profileImage}`
                        : profile_img
                    }
                    roundedCircle
                    width="100"
                    height="100"
                  />
                </Col>

                <Col>
                  <h4 className="mb-0">{employee.fullName}</h4>
                </Col>

                <Col xs="auto">
                  {permissions.includes("edit") && (
                    <Button
                      className='edit-button'
                      onClick={() =>
                        navigate(`/dms/employee/edit`, { state: { employee } })
                      }
                    >
                      <FaEdit /> Edit
                    </Button>
                  )}
                </Col>
              </Row>
              <hr />
              <Row>
                <Col md={4}>
                  <p className="mb-1"><strong>Phone:</strong> {employee.mobile}</p>
                  <p className="mb-1"><strong>Gender:</strong> {employee.gender}</p>
                  <p className="mb-1">
                    <strong>Status:</strong>{' '}
                    <span className={`badge ${employee.status === 'Active' ? 'bg-success' :
                      employee.status === 'Inactive' ? 'bg-danger' :
                        employee.status === 'Pending' ? 'bg-warning' :
                          'bg-secondary'
                      }`}>
                      {employee.status}
                    </span>
                  </p>
                </Col>
                <Col md={4}>
                  <p className="mb-1"><strong>Email:</strong> {employee.email}</p>
                  <p className="mb-1"><strong>Date of Birth:</strong> {employee.date_of_birth}</p>
                  <p className='mb-1'><strong>Remark:</strong> {employee.remark || 'N/A'}</p>
                </Col>
                <Col md={4}>
                  <p className='mb-1'><strong>UserType:</strong> {employee.userType || 'N/A'}</p>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={6}>
            <Card className="p-3">
              <h5><strong> Contract Details </strong></h5>
              <hr />
              <p><strong>Start Date:</strong> {employee.contractStartDate}</p>
              <p><strong>End Date:</strong> {employee.contractLastDate}</p>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="p-3">
              <h5><strong>Job Info</strong></h5>
              <hr />
              <Row>
                <Col md={6}>
                  <p><strong>Department:</strong> {employee.Department?.departmentName || 'NA'}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Designation:</strong> {employee.Designation?.designation || 'NA'}</p>
                </Col>
              </Row>
              <p><strong>Role:</strong> {employee.Role?.roleName || 'NA'}</p>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={12}>
            <Card className="p-3">
              <h5><strong>Additional Details</strong></h5>
              <hr />
              <Row>
                <Col md={4}>
                  <p><strong>Salary:</strong> ₹{employee.salary}</p>
                  <p><strong>Created At:</strong> {new Date(employee.createdAt).toLocaleString()}</p>
                </Col>
                <Col md={4}>
                  <p><strong>Updated At:</strong> {new Date(employee.updatedAt).toLocaleString()}</p>
                </Col>
                <Col md={4}>
                  <p><strong>Hire Date:</strong> {employee.hireDate}</p>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <Card className="p-3">
              <h5 className="mb-3"><strong>Permissions</strong></h5>
              <Table bordered responsive>
                <thead>
                  <tr>
                    <th>Module</th>
                    <th>Permissions</th>
                  </tr>
                </thead>
                <tbody>
                  {employee.employeeRole && employee.employeeRole.length > 0 ? (
                    employee.employeeRole.map((role, index) => (
                      <tr key={index}>
                        <td>{role.moduleName}</td>
                        <td>
                          {role.permission.split(',').map((perm, i) => (
                            <span key={i} className="badge bg-primary me-1">
                              {perm}
                            </span>
                          ))}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">No permissions assigned</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </div>
    </AdminLayout>
  );
};
