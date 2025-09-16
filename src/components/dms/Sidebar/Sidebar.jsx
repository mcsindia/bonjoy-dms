import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  FaUsers,
  FaCubes,
  FaCaretDown,
  FaCaretRight,
  FaDesktop,
  FaAppStore,
} from "react-icons/fa";
import { moduleComponentMap } from "../../../utils/ModuleComponentMap";
import logo from '../../../assets/images/logo-img.png'

export const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const sidebarRef = useRef();
  const [openMenu, setOpenMenu] = useState(null);
  const [openSubMenu, setOpenSubMenu] = useState(null);

  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  const employeeRoles = Array.isArray(userData?.employeeRole)
    ? userData.employeeRole
    : [];

  const hierarchicalRoles = [];
  const standaloneModules = [];

  // Build roles hierarchy
  employeeRoles.forEach((role) => {
    if (role.parentMenu && role.parentMenu !== "--") {
      const filteredChildMenus = [];
      const directModules = [];

      role.childMenus?.forEach((child) => {
        const validModules = (child.modules || []).filter(
          (mod) =>
            moduleComponentMap[mod.moduleUrl?.toLowerCase()] &&
            !moduleComponentMap[mod.moduleUrl?.toLowerCase()].hidden
        );

        if (child.childMenu === "--") {
          directModules.push(...validModules);
        } else if (validModules.length > 0) {
          filteredChildMenus.push({ ...child, modules: validModules });
        }
      });

      if (filteredChildMenus.length > 0 || directModules.length > 0) {
        hierarchicalRoles.push({
          ...role,
          childMenus: filteredChildMenus,
          directModules,
        });
      }
    } else {
      // Standalone modules
      role.childMenus?.forEach((child) => {
        const validModules = (child.modules || []).filter(
          (mod) =>
            moduleComponentMap[mod.moduleUrl?.toLowerCase()] &&
            !moduleComponentMap[mod.moduleUrl?.toLowerCase()].hidden
        );
        standaloneModules.push(...validModules);
      });
    }
  });

  const handleMenuToggle = (menuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
    setOpenSubMenu(null);
  };

  const handleSubMenuToggle = (subMenuName) => {
    setOpenSubMenu(openSubMenu === subMenuName ? null : subMenuName);
  };

  // Auto open menu on route change
  useEffect(() => {
    const path = location.pathname.toLowerCase();

    for (let mod of standaloneModules) {
      if (path.includes(mod.moduleUrl?.toLowerCase())) {
        setOpenMenu(null);
        setOpenSubMenu(null);
        return;
      }
    }

    for (let role of hierarchicalRoles) {
      for (let child of role.childMenus) {
        for (let mod of child.modules) {
          if (path.includes(mod.moduleUrl?.toLowerCase())) {
            setOpenMenu(role.parentMenu);
            if (child.childMenu !== "--") setOpenSubMenu(child.childMenu);
            return;
          }
        }
      }
      for (let mod of role.directModules || []) {
        if (path.includes(mod.moduleUrl?.toLowerCase())) {
          setOpenMenu(role.parentMenu);
          return;
        }
      }
    }
  }, [location.pathname]);

  const parentIcons = {
    Admin: <FaCubes className="me-2" />,
    Company: <FaUsers className="me-2" />,
    Website: <FaDesktop className="me-2" />,
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
          .filter(
            (mod) =>
              mod.permission?.toLowerCase().includes("view") &&
              moduleComponentMap[mod.moduleUrl?.toLowerCase()]?.view
          )
          .map((mod) => {
            const key = mod.moduleUrl.toLowerCase();
            const isActive = location.pathname.includes(key);
            const Icon = moduleComponentMap[key]?.icon || FaCaretRight;

            return (
              <li key={key} className="dms-nav-item">
                <a
                  href={`/dms/${key}`}
                  className={`dms-nav-link text-white ${isActive ? "active" : ""}`}
                >
                  <div className="d-flex align-items-center">
                    <Icon />
                    {isOpen && <span className="ms-2">{mod.moduleName}</span>}
                  </div>
                </a>
              </li>
            );
          })}

        {/* Hierarchical Roles */}
        {hierarchicalRoles.map((role, idx) => (
          <li
            key={idx}
            className="dms-nav-item"
            onMouseLeave={() => isOpen || setOpenSubMenu(null)}
          >
            <div
              className={`dms-nav-link text-white ${
                openMenu === role.parentMenu ? "active" : ""
              }`}
              onClick={() => handleMenuToggle(role.parentMenu)}
            >
              <div className="d-flex align-items-center">
                {parentIcons[role.parentMenu] || <FaCaretRight className="me-2" />}
                {isOpen && <span className="ms-2">{role.parentMenu}</span>}
              </div>
              {isOpen && (
                <FaCaretDown
                  className={`ms-auto ${openMenu === role.parentMenu ? "rotate" : ""}`}
                />
              )}
            </div>

            {(isOpen || openMenu === role.parentMenu) && (
              <ul className={`submenu ${openMenu === role.parentMenu ? "show" : ""}`}>
                {role.childMenus.map((child, i) => (
                  <li key={i} className="dms-nav-item">
                    {child.childMenu !== "--" && (
                      <div
                        className={`dms-nav-link text-white ${
                          openSubMenu === child.childMenu ? "active" : ""
                        }`}
                        onClick={() => handleSubMenuToggle(child.childMenu)}
                      >
                        <FaCaretRight className="me-2" />
                        <span>{child.childMenu}</span>
                      </div>
                    )}

                    {(openSubMenu === child.childMenu || child.childMenu === "--") && (
                      <ul>
                        {child.modules.map((mod) => {
                          const key = mod.moduleUrl.toLowerCase();
                          const Icon = moduleComponentMap[key]?.icon || FaCaretRight;
                          const isActive = location.pathname.includes(key);

                          return (
                            <li key={key} className="dms-nav-item ps-3">
                              <a
                                href={`/dms/${key}`}
                                className={`dms-nav-link text-white ps-4 ${
                                  isActive ? "active" : ""
                                }`}
                              >
                                <div className="d-flex align-items-center">
                                  <Icon />
                                  <span className="ms-2">{mod.moduleName}</span>
                                </div>
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                ))}

                {/* Direct modules */}
                {role.directModules?.map((mod) => {
                  const moduleKey = mod.moduleUrl?.toLowerCase();
                  const map = moduleComponentMap[moduleKey];
                  if (!map || map.hidden) return null;
                  const isActive = location.pathname.includes(moduleKey);
                  const Icon = map?.icon || <FaCaretRight />;
                  return (
                    <li key={moduleKey} className="dms-nav-item">
                      <a
                        href={`/dms/${moduleKey}`}
                        className={`dms-nav-link text-white ${isActive ? "active" : ""}`}
                      >
                        {Icon}
                        <span className="ms-2">{mod.moduleName?.trim() || "Untitled"}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
