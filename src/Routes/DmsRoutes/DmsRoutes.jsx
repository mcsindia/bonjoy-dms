import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { generateDynamicRoutes, getDefaultEmployeePath } from "../../utils/GenerateDynamicRoutes";
import { moduleComponentMap } from "../../utils/ModuleComponentMap"; 
import { DriverApprovalView } from "../../pages/dms/App/Driver Management/DriverApproval/DriverApprovalView";
import {DriverLogs} from '../../pages/dms/App/Driver Management/DriverLogs/DriverLogs'
import {NotificationPage} from '../../pages/dms/NotificationPage/NotificationPage'
import SessionWatcher from "../SessionWatcher/SessionWatcher";

const DmsRoutes = () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const employeeRole = Array.isArray(userData?.employeeRole) ? userData.employeeRole : [];
  const isAdmin = userData?.userType === "Admin";/* 
  console.log("employeeRole in DmsRoutes:", employeeRole); */

  const defaultPath = isAdmin
    ? "/dms/dashboard"
    : getDefaultEmployeePath(employeeRole) || "/unauthorized";

  // For Admin, generate routes from all moduleComponentMap
  const adminRoutes = [];
  if (isAdmin) {
    Object.entries(moduleComponentMap).forEach(([moduleKey, perms]) => {
      Object.entries(perms).forEach(([perm, Component]) => {
        const path = perm === "view"
          ? `/dms/${moduleKey}`
          : `/dms/${moduleKey}/${perm}`;
        adminRoutes.push(<Route key={path} path={path} element={<Component />} />);

        if (perm === "view" && perms.viewDetails) {
          adminRoutes.push(
            <Route
              key={`${moduleKey}-view-details`}
              path={`/dms/${moduleKey}/view/:id`}
              element={<perms.viewDetails />}
            />
          );
        }
      });
    });
  }

  return (
    <>
    <SessionWatcher/>
    <Routes>
      <Route path="/dms" element={<Navigate to={defaultPath} />} />
      {isAdmin ? adminRoutes : generateDynamicRoutes(employeeRole)}
      <Route
        path="/dms/driver-approval/view/:id"
        element={<DriverApprovalView />}
      />
       <Route path="/dms/drivers/login-logs" element={<DriverLogs/>} />
      <Route path="/dms/notifications" element={<NotificationPage/>} />
      <Route
        path="*"
        element={
          <div className="text-center mt-5">
            <h2>Page Not Found</h2>
            <p>Either the page does not exist, or you don't have permission to access it.</p>
          </div>
        }
      />
    </Routes>
    </>
  );
};

export default DmsRoutes;
