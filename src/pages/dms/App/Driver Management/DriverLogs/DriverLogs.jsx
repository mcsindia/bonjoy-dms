import React, { useEffect, useState } from 'react';
import {
  Table,
  Spinner,
} from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const DriverLogs = () => {
  const location = useLocation();
  const driverId = location.state?.driver?.userId;
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDriverLogs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getDriverLoginLogById/${driverId}`);
      const logData = response.data?.data || [];
      setLogs(logData);
    } catch (error) {
      console.error('Failed to fetch driver logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (driverId) {
      fetchDriverLogs();
    } else {
      setLoading(false);
    }
  }, [driverId]);

  return (
    <AdminLayout>
      <div className="driver-list-container p-3">
        <div className="dms-pages-header sticky-header">
          <h3>Driver Login Logs</h3>
        </div>

        {loading ? (
          <div className="text-center my-4">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Phone</th>
                <th>Login Time</th>
                <th>Logout Time</th>
                <th>IP Address</th>
                <th>Device Info</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {logs.length > 0 ? (
                logs.map((log, index) => (
                  <tr key={log.id || index}>
                    <td>{index + 1}</td>
                    <td>{log.mobile || 'N/A'}</td>
                    <td>{log.loginTime ? new Date(log.loginTime).toLocaleString() : 'N/A'}</td>
                    <td>{log.logoutTime ? new Date(log.logoutTime).toLocaleString() : 'N/A'}</td>
                    <td>{log.ipAddress || 'N/A'}</td>
                    <td>{log.deviceInfo || 'N/A'}</td>
                    <td>{log.location || 'N/A'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">No logs found for this driver.</td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </div>
    </AdminLayout>
  );
};
