// App.js (final fixed version)
import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import ExpenseTrackerPage from './pages/ExpenseTrackerPage';
import FoodWaterPage from './pages/FoodWaterPage';
import EEToolsPage from './pages/EEToolsPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Footer from './components/Footer';
import './App.css';
import { ExpenseProvider } from './context/ExpenseContext';
import { FoodWaterProvider } from './context/FoodWaterContext';
import ChatBotPage from './pages/ChatBotPage';

const isAuthenticated = () => localStorage.getItem('authToken') !== null;

function App() {
  const location = useLocation();
  const noLayoutPaths = ['/', '/login', '/signup'];
  const showSidebar = isAuthenticated() && !noLayoutPaths.includes(location.pathname);
  const showFooter = isAuthenticated() && !noLayoutPaths.includes(location.pathname);

  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    image: null,
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  return (
    <ExpenseProvider>
      <FoodWaterProvider>
        <div className="app-root">
          {showSidebar && (
            <>
              {/* ✅ Hamburger button */}
              <button
                className="hamburger"
                onClick={toggleSidebar}
                aria-label="Toggle Sidebar"
              >
                ☰
              </button>

              {/* ✅ Sidebar with props */}
              <Sidebar
                profile={profile}
                updateProfile={setProfile}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
              />
            </>
          )}

          {/* Main content */}
          <main className="main-content">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              {isAuthenticated() ? (
                <>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/expense-tracker" element={<ExpenseTrackerPage />} />
                  <Route path="/food-water" element={<FoodWaterPage />} />
                  <Route path="/ee-tools" element={<EEToolsPage />} />
                  <Route path="/chatbot" element={<ChatBotPage />} /> 
                </>
              ) : (
                <Route path="*" element={<Navigate to="/" />} />
              )}
            </Routes>
          </main>

          {showFooter && <Footer />}
        </div>
      </FoodWaterProvider>
    </ExpenseProvider>
  );
}

export default App;
