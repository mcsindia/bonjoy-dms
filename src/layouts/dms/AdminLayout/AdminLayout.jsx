import React, { useState, useEffect, useRef } from "react";
import { Sidebar } from "../../../components/dms/Sidebar/Sidebar";
import { DMSHeader } from "../../../components/dms/Header/Header";
import { Footer } from "../../../components/dms/Footer/Footer";

export const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);  // Default to open sidebar
  const sidebarRef = useRef(null); // Ref for sidebar

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  // Handle outside click to close sidebar on small screens
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) && 
        window.innerWidth <= 768  // Close only on small screens
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="dms-app-container">
      <div ref={sidebarRef}>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>

      <div className={`dms-main-content ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        <DMSHeader toggleSidebar={toggleSidebar} />

        {/* Dynamic Page Content */}
        <div className="dms-page-content">{children}</div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};
