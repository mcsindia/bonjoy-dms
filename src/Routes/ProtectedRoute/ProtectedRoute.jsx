import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = JSON.parse(localStorage.getItem("userData"))?.token;
  return token ? children : <Navigate to="/dms" replace />;
};

export default ProtectedRoute;
