import { Navigate } from "react-router-dom";
import { getAdminToken } from "../utils/adminAuth";

const AdminRoutes = ({ children }) => {
  const token = getAdminToken();

  return token ? children : <Navigate to="/theboss/login" replace />;
};

export default AdminRoutes;
