import { Navigate } from 'react-router-dom';
import { useGetAdminProfileQuery } from '../features/api/adminAuthApi';

const ProtectedRoute = ({children}) => {
  // RTK Query automatically sends the cookie to check if session is valid
  const { data, isLoading, } = useGetAdminProfileQuery();
  // alert(JSON.stringify(data))
  const isAuthenticinated = data?.loginState

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  // If there's an error (401/403), the user isn't logged in
  return isAuthenticinated ? children : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;