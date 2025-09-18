import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const token = userData?.token;
  const expiryTime = userData?.expiryTime;

  if (!token) {
    return <Navigate to="/dms" replace />;
  }

  if (expiryTime && Date.now() > expiryTime) {
    localStorage.removeItem("userData");
    return <Navigate to="/dms" replace />;
  }

  return children;
};

export default ProtectedRoute;
