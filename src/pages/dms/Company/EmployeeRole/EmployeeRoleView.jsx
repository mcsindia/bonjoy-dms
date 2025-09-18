import React, { useEffect, useState } from 'react';
import { Button, Card, Alert, Table } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const EmployeeRoleView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { role } = location.state || {};
  const roleId = role?.id;
  const [roleData, setRoleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userData = JSON.parse(localStorage.getItem("userData"));
  const token = userData?.token;

  // 🔹 Constant module_id for backend validation
  const MODULE_ID = "role"; // can be string or numeric depending on backend

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
    const fetchRoleById = async () => {
      if (!roleId) {
        setError('No role ID provided.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/getRoleById/${roleId}?module_id=${MODULE_ID}`, {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        const data = await res.json();

        if (data.success) {
          setRoleData(data.data);
        } else {
          setError(data.message || 'Failed to fetch role details.');
        }
      } catch (err) {
        console.error('Error fetching role:', err);
        setError('Something went wrong while fetching role.');
      } finally {
        setLoading(false);
      }
    };

    fetchRoleById();
  }, [roleId, token]);

  const stripHtmlTags = (html) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const formatDate = (isoDate) => {
    return new Date(isoDate).toLocaleString();
  };

  return (
    <AdminLayout>
      <div className="dms-container">
        <div className="d-flex justify-content-between mb-2">
          <h4>Role Details</h4>
          {permissions.includes("edit") && (
            <Button
              className="edit-button"
              onClick={() =>
                  navigate('/dms/role/edit', { state: { role } }
                )
              }
            >
              <FaEdit /> Edit
            </Button>
          )}
        </div>

        {loading ? (
          <div className="text-center mt-5">
            <h3>Loading role details...</h3>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : roleData ? (
          <Card>
            <Card.Body>
              <div className="mb-2"><strong>Role Name:</strong> {roleData.roleName}</div>
              <div className="mb-2"><strong>Description:</strong> {stripHtmlTags(roleData.responsibility)}</div>
              <div className="mb-2"><strong>Status:</strong> {roleData.is_active ? 'Active' : 'Inactive'}</div>
              <div className="mb-2"><strong>Created At:</strong> {formatDate(roleData.createdAt)}</div>
              <div className="mb-3"><strong>Updated At:</strong> {formatDate(roleData.updatedAt)}</div>

              <h5 className="mt-4">Associated Modules</h5>
              {roleData.Modules?.length > 0 ? (
                <Table striped bordered hover responsive className="mt-2">
                  <thead>
                    <tr>
                      <th>S.no</th>
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
        ) : (
          <div className="text-center p-3">No role data available.</div>
        )}
      </div>
    </AdminLayout>
  );
};
