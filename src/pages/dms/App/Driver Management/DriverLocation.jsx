import React from "react";
import { useLocation } from "react-router-dom";
import { AdminLayout } from "../../../../layouts/dms/AdminLayout/AdminLayout";

const DriverLocation = () => {
  const location = useLocation();
  const { latitude, longitude } = location.state || {};

  return (
    <AdminLayout>
      <div className="map-container">
        {latitude && longitude ? (
          <iframe
            title="Driver Location"
            className="map-iframe"
            src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${latitude},${longitude}`}
            allowFullScreen
          ></iframe>
        ) : (
          <p>Loading driver location...</p>
        )}
      </div>
    </AdminLayout>
  );
};

export default DriverLocation;