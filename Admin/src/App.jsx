import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Layouts & Protection
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./pages/ProtectedRoute";

// Pages
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import ProductEditor from "./pages/ProductEditor";
import SupportHub from "./pages/SupportHub";
import UsersList from "./pages/UsersList";
import AdminLogin from "./pages/AdminLogin";
import Orders from "./pages/Orders";
import Payments from "./pages/Payments";
import OrderDetails from "./pages/Orderdetails";
import UserDetail from "./pages/UserDetails";
import ItemManagementPage from "./pages/ItemManagementPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. Public Auth Route */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* 2. Protected Admin Routes */}
        <Route path="/"  element={<ProtectedRoute >
          <AdminLayout />

        </ProtectedRoute>}>
          {/* 3. Common Layout for all Admin Pages (Sidebar, Header, etc.) */}
            
            {/* Dashboard: The default view at "/" */}
            <Route index element={<Dashboard />} /> 
            
            {/* Inventory Management */}
            <Route path="inventory" element={<Inventory />} />
            <Route path="add-product" element={<ProductEditor />} />
            <Route path="inventory/edit/:id" element={<ProductEditor />} />
            {/* orders */}
            <Route path="orders" element={<Orders />} />
            <Route path="transactions" element={<Payments />} />

            {/* User & Customer Management */}
            <Route path="users" element={<UsersList />} />
            <Route path="user/:id" element={<UserDetail />} />

            <Route path="support" element={<SupportHub />} />

          </Route>
    

        {/* 4. Fallback (Optional) - Redirect unknown paths to dashboard or login */}
        <Route path="*" element={<ProtectedRoute />} />
        <Route path="/order/:id" element={<OrderDetails />} />
        <Route path="order/:id/item/:productId" element={<ItemManagementPage />} />
      </Routes>
    </Router>
  );
}

export default App;