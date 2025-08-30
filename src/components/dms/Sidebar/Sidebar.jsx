import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  FaUsers,
  FaCubes,
  FaMotorcycle,
  FaCaretDown, FaCaretRight,
  FaAppStore
} from "react-icons/fa";
import { moduleComponentMap } from "../../../utils/ModuleComponentMap";
import logo from '../../../assets/images/logo-img.png'

export const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const sidebarRef = useRef();
  const [openMenu, setOpenMenu] = useState(null);
  const [openSubMenu, setOpenSubMenu] = useState(null);

  const userData = JSON.parse(localStorage.getItem("userData"));
  const employeeRoles = Array.isArray(userData?.employeeRole)
    ? userData.employeeRole
    : [];

  const hierarchicalRoles = [];
  const standaloneModules = [];

  employeeRoles.forEach((role) => {
    if (role.parentMenu) {
      const filteredChildMenus = [];
      role.childMenus?.forEach((child) => {
        if (child.childMenu === "--") {
          standaloneModules.push(...child.modules);
        } else {
          filteredChildMenus.push(child);
        }
      });

      // Only keep this role if it still has valid childMenus
      if (filteredChildMenus.length > 0) {
        hierarchicalRoles.push({
          ...role,
          childMenus: filteredChildMenus,
        });
      }
    } else if (Array.isArray(role.modules)) {
      standaloneModules.push(...role.modules);
    }
  });

  const handleMenuToggle = (menuName) => {
    setOpenMenu((prev) => (prev === menuName ? null : menuName));
    setOpenSubMenu(null);
  };

  const handleSubMenuToggle = (subMenuName) => {
    setOpenSubMenu((prev) => (prev === subMenuName ? null : subMenuName));
  };

  useEffect(() => {
  const currentPath = location.pathname.toLowerCase();

  // Check standalone modules first
  for (let mod of standaloneModules) {
    const modKey = mod.moduleUrl?.toLowerCase();
    if (currentPath.includes(modKey)) {
      setOpenMenu(null);
      setOpenSubMenu(null);
      return;
    }
  }

  // Check hierarchical roles
  for (let role of hierarchicalRoles) {
    for (let child of role.childMenus) {
      for (let mod of child.modules) {
        const modKey = mod.moduleUrl?.toLowerCase();
        if (currentPath.includes(modKey)) {
          setOpenMenu(role.parentMenu);
          if (child.childMenu !== "--") {
            setOpenSubMenu(child.childMenu);
          }
          return;
        }
      }
    }
  }
}, [location.pathname]);

  const parentMenuIcons = {
    Admin: <FaCubes className="me-2" />,
    Company: <FaUsers className="me-2" />,
    App: <FaAppStore className="me-2" />
  };

  return (
    <div
      className={`dms-sidebar bg-color text-white ${isOpen ? "open" : "closed"}`}
      ref={sidebarRef}
    >
      <div className="p-3 d-flex align-items-center sidebar-title">
        <a
          href="/dms/dashboard"
          className="d-flex align-items-center text-white text-decoration-none"
        >
          <img src={logo} alt="Bonjoy Logo" height="30" />
          {isOpen && <h4 className="mb-0 ms-2">Bonjoy</h4>}
        </a>
      </div>
      <hr />

      <ul className="nav flex-column">
        {/* Standalone Modules */}
        {standaloneModules
          .filter((mod) => {
            const perms = mod.permission?.toLowerCase().split(",") || [];
            const map = moduleComponentMap[mod.moduleUrl?.toLowerCase()];
            return perms.includes("view") && map?.view;
          })
          .map((mod) => {
            const moduleKey = mod.moduleUrl?.toLowerCase();
            const isActive = location.pathname.includes(moduleKey);
            const RawIcon = moduleComponentMap[moduleKey]?.icon || FaCaretRight;

            return (
              <li key={moduleKey} className="dms-nav-item">
                <a
                  href={`/dms/${moduleKey}`}
                  className={`dms-nav-link text-white ${isActive ? "active" : ""}`}
                >
                  <div className="d-flex align-items-center">
                    <RawIcon />
                    <span className={isOpen ? "ms-2" : "d-none d-md-none d-sm-block"}>
                      {mod.moduleName?.trim() || "Untitled"}
                    </span>
                  </div>
                </a>
              </li>
            );
          })}

        {/* Hierarchical Roles */}
        {hierarchicalRoles.map((role, index) => (
          <li key={index} className="dms-nav-item">
            <div
              className={`dms-nav-link text-white ${openMenu === role.parentMenu ? "active" : ""}`}
              onClick={() => handleMenuToggle(role.parentMenu)}
            >
              <div className="d-flex align-items-center">
                {parentMenuIcons[role.parentMenu] || <FaCaretRight className="me-2" />}
                <span className={isOpen ? "" : "d-none d-md-none d-sm-block"}>
                  {role.parentMenu}
                </span>
              </div>
              <FaCaretDown
                className={`ms-auto ${openMenu === role.parentMenu ? "rotate" : ""}`}
                style={{ transition: "transform 0.3s", display: isOpen ? "inline-block" : "none" }}
              />
            </div>

            {openMenu === role.parentMenu &&
              role.childMenus.map((child, childIndex) => (
                <ul className="submenu show ps-3" key={childIndex}>
                  {child.childMenu !== "--" && (
                    <li className="dms-nav-item" onClick={() => handleSubMenuToggle(child.childMenu)}>
                      <div className={`dms-nav-link text-white ${openSubMenu === child.childMenu ? "active" : ""}`}>
                        <FaCaretRight className="me-2" />
                        <span>{child.childMenu}</span>
                      </div>
                    </li>
                  )}

                  {(openSubMenu === child.childMenu || child.childMenu === "--") &&
                    child.modules
                      .filter((mod) => {
                        const perms = mod.permission?.toLowerCase().split(",") || [];
                        const map = moduleComponentMap[mod.moduleUrl?.toLowerCase()];
                        return perms.includes("view") && map?.view;
                      })
                      .map((mod) => {
                        const moduleKey = mod.moduleUrl?.toLowerCase();
                        const map = moduleComponentMap[moduleKey];
                        const isActive = location.pathname.includes(moduleKey);
                        const Icon = map?.icon || <FaCaretRight />;
                        return (
                          <li key={moduleKey} className="dms-nav-item ps-3">
                            <a
                              href={`/dms/${moduleKey}`}
                              className={`dms-nav-link text-white ps-4 ${isActive ? "active" : ""}`}
                            >
                              <div className="d-flex align-items-center">
                                {Icon}
                                <span className="ms-2">
                                  {mod.moduleName?.trim() || "Untitled"}
                                </span>
                              </div>
                            </a>
                          </li>
                        );
                      })}
                </ul>
              ))}
          </li>
        ))}
      </ul>
    </div>
  );
};

