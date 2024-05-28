/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "./UserContext";
import { ProtectedRouteProps } from "../types/interfaces";

/**
 * A component that wraps protected routes in a React application to ensure that only
 * users with permitted roles can access certain routes. If a user does not have the necessary
 * role or is not logged in, they are automatically redirected to the login page.
 * 
 * @param {ProtectedRouteProps} props - The properties object for the component.
 * @param {JSX.Element} props.children - The React elements to render if the user is authorized.
 * @param {UserRole[]} props.allowedRoles - A list of roles that are permitted to access the child component.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user } = useUser();
  const location = useLocation();

  const hasPermission = user && user.roles.some(role => allowedRoles.includes(role));

  if (!user || !hasPermission) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}
export default ProtectedRoute;
