// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

// Layouts & Pages
import MainLayout from "./components/MainLayout";
import Home from "./components/Home";
import WatchListing from "./components/WatchListing";
import WatchDetails from "./components/WatchDetails";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import AuthPage from "./components/AuthPage";
import ProfileLayout from "./components/ProfileLayout";
import AccountInfo from "./components/profile-comp/AccountInfo";
import OrderHistory from "./components/profile-comp/OrderHistory";
import Wishlist from "./components/profile-comp/WishList";
import AddressBook from "./components/profile-comp/AddressBook";
import OrderSuccess from "./components/OrderSuccess";
import SupportTickets from "./components/profile-comp/SupportTickets";

// Slices & API
import { setCredentials } from "./app/userSlice";
import { syncWithDB } from "./app/cartSlice";
import { useGetProfileQuery } from "./app/features/api/userApiSlice";
import { useGetCartQuery } from "./app/features/api/cartApiSlice";
import ItemDetailView from "./components/ItemDetailView";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return !isAuthenticated ? children : <Navigate to="/" />;
};

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Profile Query: Runs on mount/refresh
  const { 
    data: profileData, 
    isSuccess: isProfileSuccess, 
    isLoading: isProfileLoading 
  } = useGetProfileQuery();

  // Cart Query: Only runs if authenticated
  const { data: cartData, isSuccess: isCartSuccess } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
    refetchOnMountOrArgChange: true 
  });

  // Recovery Effect: Only auto-logs in if Redux is empty AND API has data
  useEffect(() => {
    if (isProfileSuccess && profileData?.data && !user) {
      dispatch(setCredentials(profileData.data));
    }
  }, [profileData, isProfileSuccess, user, dispatch]);

  // Cart Sync Effect: Ensures Redux matches DB when logged in
  useEffect(() => {
    if (isAuthenticated && isCartSuccess && cartData) {
      const items = cartData.cart || cartData;
      dispatch(syncWithDB(items));
    }
  }, [cartData, isCartSuccess, isAuthenticated, dispatch]);

  if (isProfileLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse text-xl tracking-[0.3em] font-light text-gray-900">
          TIMEGLASS<span className="text-amber-600">.</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<WatchListing />} />
          <Route path="product/:id" element={<WatchDetails />} />
          <Route path="cart" element={<Cart />} />
          
          <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute><ProfileLayout /></ProtectedRoute>}>
            <Route index element={<AccountInfo />} />
            <Route path="orders" element={<OrderHistory />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="addresses" element={<AddressBook />} />
            <Route path="support" element={<SupportTickets />} />
          </Route>
          <Route path="/order-success/:orderId" element={<OrderSuccess />} />
          <Route path="/account/orders/:orderId/item/:productId" element={<ItemDetailView />} 
/>
        </Route>
        <Route path="/auth" element={<PublicRoute><AuthPage /></PublicRoute>} />
      </Routes>
    </Router>
  );
}

export default App;