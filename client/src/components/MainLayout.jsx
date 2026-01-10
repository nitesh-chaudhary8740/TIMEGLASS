// src/layouts/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer'; // Let's add a placeholder for this

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans antialiased text-titanDark">
      {/* Persistent Navbar */}
      <Navbar />

      {/* Dynamic Content */}
      <main className="grow">
        {/* This is where the specific page (Home, Details, etc.) will render */}
        <Outlet />
      </main>

      {/* Persistent Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;