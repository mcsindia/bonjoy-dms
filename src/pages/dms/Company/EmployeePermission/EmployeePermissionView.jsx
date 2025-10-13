import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';
import { Card, Table, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';
import axios from 'axios';
import { getToken, getModuleId } from '../../../../utils/authhelper';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const EmployeePermissionView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const permissionIdFromState = location.state?.permission?.id;
  const permissionId = params.id || permissionIdFromState;
  const [permission, setPermission] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const userData = JSON.parse(localStorage.getItem("userData"));
  let permissions = [];
  
  if (Array.isArray(userData?.employeeRole)) {
    for (const role of userData.employeeRole) {
      for (const child of role.childMenus || []) {
        for (const mod of child.modules || []) {
          if (mod.moduleUrl?.toLowerCase() === "permission") {
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
    if (!permissionId) {
      setError('No permission ID provided.');
      return;
    }

    const fetchPermission = async () => {
      setLoading(true);
      try {
        const moduleId = getModuleId("permission");
        const token = getToken(); // JWT token

        const res = await axios.get(`${API_BASE_URL}/getPermissionById/${permissionId}`, {
          headers: { Authorization: `Bearer ${token}` }, // include JWT token
          params: { module_id: moduleId } // correct module ID
        });

        if (res.data.success) {
          setPermission(res.data.data);
          setError('');
        } else {
          setError(res.data.message || 'Failed to fetch permission.');
        }
      } catch (err) {
        console.error('API error while fetching permission:', err);
        setError('API error while fetching permission.');
      } finally {
        setLoading(false);
      }
    };

    fetchPermission();
  }, [permissionId]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="dms-container text-center">
          <Spinner animation="border" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="dms-container">
          <Alert variant="danger">{error}</Alert>
          <Button onClick={() => navigate('/dms/permission')}>Go Back</Button>
        </div>
      </AdminLayout>
    );
  }

  if (!permission) {
    return (
      <AdminLayout>
        <div className="dms-container">
          <h4>No permission data available</h4>
          <Button onClick={() => navigate('/dms/permission')}>Go Back</Button>
        </div>
      </AdminLayout>
    );
  }

  // Permission name lowercase for capability check
  const permName = permission.permission_name.toLowerCase();

  const stripHtmlTags = (html) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  return (
    <AdminLayout>
      <div className="dms-container">
        <div className="d-flex justify-content-between align-items-center">
          <h4>Permission Details</h4>
          {permissions.includes("edit") && (
            <Button
              className="edit-button"
              onClick={() => navigate('/dms/permission/edit', { state: { permission } })}
            >
              <FaEdit /> Edit
            </Button>
          )}
        </div>

        <div className="dms-form-container">
          <Card className="mb-3">
            <Card.Body>
              <Card.Text><strong>Module ID:</strong> {permission.moduleId}</Card.Text>
              <Card.Text><strong>Permission Name:</strong> {permission.permission_name}</Card.Text>
              <Card.Text><strong>Description:</strong> {stripHtmlTags(permission.description)}</Card.Text>
              <Card.Text><strong>Created At:</strong> {new Date(permission.createdAt).toLocaleString()}</Card.Text>
              <Card.Text><strong>Updated At:</strong> {new Date(permission.updatedAt).toLocaleString()}</Card.Text>
            </Card.Body>
          </Card>

          <h5>Capabilities</h5>
          <Table bordered>
            <thead>
              <tr>
                <th>Capability</th>
                <th>Access</th>
              </tr>
            </thead>
            <tbody>
              {['view', 'add', 'edit', 'delete'].map((cap) => (
                <tr key={cap}>
                  <td>{cap.charAt(0).toUpperCase() + cap.slice(1)}</td>
                  <td>
                    <Form.Check
                      type="checkbox"
                      label=""
                      readOnly
                      checked={permName.includes(cap)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};
