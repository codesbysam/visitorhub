import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut, User as UserIcon } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import VisitorManagement from './pages/VisitorManagement';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';

// Helper to redirect visitors from dashboard
const DashboardWrapper = () => {
  const { isVisitor } = useAuth();
  if (isVisitor) {
    return <Navigate to="/visitors" replace />;
  }
  return <Dashboard />;
};

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="loading-screen">Loading...</div>;
  if (!token) return <Navigate to="/login" state={{ from: location }} replace />;

  return children;
};

// Main Layout with Sidebar and Header
const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <Users size={28} color="#3b82f6" />
          <span>VisitorHub</span>
        </div>
        
        <nav className="nav-links">
          {user?.role !== 'visitor' && (
            <NavLink 
              to="/" 
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>
          )}
          <NavLink 
            to="/visitors" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            <Users size={20} />
            <span>Visitors</span>
          </NavLink>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="main-layout">
        {/* Top Header */}
        <header className="app-header glass-panel">
          <div className="header-title">
            <h2>Visitor Registration System</h2>
          </div>
          <div className="header-user-info">
            <div className="user-profile">
              <UserIcon size={18} />
              <span className="user-name">{user?.name}</span>
              <span className={`role-badge ${user?.role}`}>{user?.role?.toUpperCase()}</span>
            </div>
            <button className="btn-logout" onClick={logout} title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <MainLayout>
                  {/* Redirect visitors directly to /visitors */}
                  <DashboardWrapper />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/visitors" 
            element={
              <ProtectedRoute>
                <MainLayout><VisitorManagement /></MainLayout>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;