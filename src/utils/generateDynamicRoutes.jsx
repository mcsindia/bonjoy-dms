import React from "react";
import { Route } from "react-router-dom";
import { moduleComponentMap } from "./ModuleComponentMap";

export const generateDynamicRoutes = (rolesInput) => {
  const roles = Array.isArray(rolesInput) ? rolesInput : [];
  const routes = [];

  roles.forEach((role) => {
    role.childMenus?.forEach((child) => {
      child.modules?.forEach((mod) => {
        const moduleUrl = mod.moduleUrl?.toLowerCase();
        const perms = mod.permission?.toLowerCase().split(',').map(p => p.trim()) || [];
        const componentMap = moduleComponentMap[moduleUrl];

        if (!componentMap) return;

        perms.forEach((perm) => {
          const Component = componentMap[perm];
          if (!Component) return;

          if (perm === "view") {
            routes.push(<Route key={moduleUrl} path={`/dms/${moduleUrl}`} element={<Component />} />);
            if (componentMap.viewDetails) {
              const ViewDetailsComponent = componentMap.viewDetails;
              routes.push(
                <Route
                  key={`${moduleUrl}/view/:id`}
                  path={`/dms/${moduleUrl}/view/:id`}
                  element={<ViewDetailsComponent />}
                />
              );
            }
          }

          if (perm === "add" || perm === "edit") {
            routes.push(
              <Route
                key={`${moduleUrl}/${perm}`}
                path={`/dms/${moduleUrl}/${perm}`}
                element={<Component />}
              />
            );
          }
        });
      });
    });
  });

  return routes;
};

export const getDefaultEmployeePath = (employeeRoles) => {
  for (let role of employeeRoles) {
    for (let child of role.childMenus || []) {
      for (let mod of child.modules || []) {
        const perms = mod.permission?.toLowerCase().split(',').map(p => p.trim());
        if (perms?.includes("view")) {
          return `/dms/${mod.moduleUrl.toLowerCase()}`;
        }
      }
    }
  }
  return null;
};
