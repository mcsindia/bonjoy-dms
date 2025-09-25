import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SessionWatcher = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (userData?.expiryTime && Date.now() > userData.expiryTime) {
        localStorage.removeItem("userData");
        alert("Your session has expired. Please login again."); 
        navigate("/dms", { replace: true });
      }
    }, 1000 * 5); 
    console.log("watching...")

    return () => clearInterval(interval);
  }, [navigate]);

  return null;
};

export default SessionWatcher;
