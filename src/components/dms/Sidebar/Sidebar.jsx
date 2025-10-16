import React, { useEffect, useRef, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { FaUsers, FaCubes, FaCaretDown, FaCaretRight, FaDesktop, FaAppStore } from "react-icons/fa";
import { moduleComponentMap } from "../../../utils/ModuleComponentMap";
import logo from '../../../assets/images/logo-img.png';

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

  const isPathMatch = (path, moduleUrl) => {
    const cleanedPath = path.toLowerCase().replace(/^\/dms\//, "").split("/")[0];
    const cleanedModule = moduleUrl.toLowerCase();
    return cleanedPath === cleanedModule;
  };

  // Auto open menu on route change
  useEffect(() => {
    const path = location.pathname.toLowerCase();
    let matchedParent = null;
    let matchedSub = null;

    // Check standalone modules
    for (let mod of standaloneModules) {
      if (isPathMatch(path, mod.moduleUrl)) {
        matchedParent = null;
        matchedSub = null;
        break;
      }
    }

    // Check hierarchical modules
    if (!matchedParent) {
      for (let role of hierarchicalRoles) {
        let found = false;

        // Check child menus first
        for (let child of role.childMenus) {
          for (let mod of child.modules) {
            if (isPathMatch(path, mod.moduleUrl)) {
              matchedParent = role.parentMenu;
              if (child.childMenu !== "--") matchedSub = child.childMenu;
              found = true;
              break;
            }
          }
          if (found) break;
        }

        // Check direct modules
        if (!found && role.directModules) {
          for (let mod of role.directModules) {
            if (isPathMatch(path, mod.moduleUrl)) {
              matchedParent = role.parentMenu;
              found = true;
              break;
            }
          }
        }

        if (found) break;
      }
    }

    setOpenMenu(matchedParent);
    setOpenSubMenu(matchedSub);
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
      {/* Logo */}
      <div className="p-3 d-flex align-items-center sidebar-title">
        <Link
          to="/dms/dashboard"
          className="d-flex align-items-center text-white text-decoration-none"
        >
          <img src={logo} alt="Bonjoy Logo" height="30" />
          {isOpen && <h4 className="mb-0 ms-2">Bonjoy</h4>}
        </Link>
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
            const isActive = isPathMatch(location.pathname, key);
            const Icon = moduleComponentMap[key]?.icon || FaCaretRight;

            return (
              <li key={key} className="dms-nav-item">
                <Link
                  to={`/dms/${key}`}
                  className={`dms-nav-link text-white ${isActive ? "active" : ""}`}
                >
                  <div className="d-flex align-items-center">
                    <Icon />
                    {isOpen && <span className="ms-3">{mod.moduleName}</span>}
                  </div>
                </Link>
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
              className={`dms-nav-link text-white ${openMenu === role.parentMenu ? "active" : ""
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
                        className={`dms-nav-link text-white ${openSubMenu === child.childMenu ? "active" : ""
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
                          const isActive = isPathMatch(location.pathname, key);

                          return (
                            <li key={key} className="dms-nav-item">
                              <Link
                                to={`/dms/${key}`}
                                className={`dms-nav-link text-white ${isActive ? "active" : ""}`}
                              >
                                <div className="d-flex align-items-center">
                                  <Icon />
                                  <span className="ms-2">{mod.moduleName}</span>
                                </div>
                              </Link>
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
                  const isActive = isPathMatch(location.pathname, moduleKey);
                  const Icon = map?.icon || <FaCaretRight />;

                  return (
                    <li key={moduleKey} className="dms-nav-item">
                      <Link
                        to={`/dms/${moduleKey}`}
                        className={`dms-nav-link text-white ${isActive ? "active" : ""}`}
                      >
                        {Icon}
                        <span className="ms-2">{mod.moduleName?.trim() || "Untitled"}</span>
                      </Link>
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
