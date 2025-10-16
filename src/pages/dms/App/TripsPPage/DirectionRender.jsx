import React, { useState, useEffect } from "react";
import { DirectionsRenderer } from "@react-google-maps/api";

export const DirectionRender = ({ origin, destination }) => {
  const [directions, setDirections] = useState(null);

  useEffect(() => {
    if (!origin || !destination) return;

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") setDirections(result);
        else console.error("Directions request failed:", status);
      }
    );
  }, [origin, destination]); // recalc only if pickup/drop changes

  return directions ? <DirectionsRenderer directions={directions} /> : null;
};
