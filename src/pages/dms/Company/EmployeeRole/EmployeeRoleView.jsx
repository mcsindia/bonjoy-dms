import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';
import { Card, Table, Button, Spinner, Alert } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';
import axios from 'axios';
import { getToken, getModuleId } from '../../../../utils/authhelper';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const EmployeeRoleView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const roleFromState = location.state?.role;
  const roleId = params.id || roleFromState?.id;

  const [roleData, setRoleData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const userData = JSON.parse(localStorage.getItem("userData"));
  const token = getToken();

  // Permissions for "role" module
  let permissions = [];
  if (Array.isArray(userData?.employeeRole)) {
    for (const role of userData.employeeRole) {
      for (const child of role.childMenus || []) {
        for (const mod of child.modules || []) {
          if (mod.moduleUrl?.toLowerCase() === "role") {
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
      alert(fallbackMessage || `You don't have permission to ${permissionType} this role.`);
    }
  };

  useEffect(() => {
    const fetchRole = async () => {
      if (!roleId) {
        setError('No role ID provided.');
        return;
      }

      setLoading(true);
      try {
        const moduleId = getModuleId("role"); // numeric or string depending on backend
        console.log("Fetching role:", roleId, "module_id:", moduleId, "token:", token);

        const res = await axios.get(`${API_BASE_URL}/getRoleById/${roleId}`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { module_id: moduleId }
        });

        if (res.data.success) {
          setRoleData(res.data.data);
          setError('');
        } else {
          setError(res.data.message || 'Failed to fetch role details.');
        }
      } catch (err) {
        console.error('Error fetching role:', err.response || err.message);
        setError('Error fetching role.');
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [roleId, token]);

  const stripHtmlTags = (html) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const formatDate = (isoDate) => new Date(isoDate).toLocaleString();

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
          <Button onClick={() => navigate('/dms/role')}>Go Back</Button>
        </div>
      </AdminLayout>
    );
  }

  if (!roleData) {
    return (
      <AdminLayout>
        <div className="dms-container">
          <h4>No role data available</h4>
          <Button onClick={() => navigate('/dms/role')}>Go Back</Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="dms-container">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Role Details</h4>
          {permissions.includes("edit") && (
            <Button
              className="edit-button"
              onClick={() => navigate('/dms/role/edit', { state: { role: roleData } })}
            >
              <FaEdit /> Edit
            </Button>
          )}
        </div>

        <Card className="mb-3">
          <Card.Body>
            <div className="mb-2"><strong>Role Name:</strong> {roleData.roleName}</div>
            <div className="mb-2"><strong>Description:</strong> {stripHtmlTags(roleData.responsibility)}</div>
            <div className="mb-2"><strong>Status:</strong> {roleData.is_active ? 'Active' : 'Inactive'}</div>
            <div className="mb-2"><strong>Created At:</strong> {formatDate(roleData.createdAt)}</div>
            <div className="mb-2"><strong>Updated At:</strong> {formatDate(roleData.updatedAt)}</div>

            <h5 className="mt-4">Associated Modules</h5>
            {roleData.Modules?.length > 0 ? (
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Module Name</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {roleData.Modules.map((mod, index) => (
                    <tr key={mod.id}>
                      <td>{index + 1}</td>
                      <td>{mod.moduleName}</td>
                      <td>{mod.is_active ? 'Active' : 'Inactive'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <div>No modules associated with this role.</div>
            )}
          </Card.Body>
        </Card>
      </div>
    </AdminLayout>
  );
};
