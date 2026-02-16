import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Home from './components/Public/Home';
import Privacy from './components/Public/Privacy';
import Terms from './components/Public/Terms';
import ContactPage from './components/Public/ContactPage';
import Login from './components/Admin/Login';
import PersonalInfo from './components/Admin/PersonalInfo';
import ProjectList from './components/Admin/ProjectList';
import ProjectForm from './components/Admin/ProjectForm';
import Skills from './components/Admin/Skills';
import Messages from './components/Admin/Messages';
import CareerHistory from './components/Admin/CareerHistory';
import Services from './components/Admin/Services';
import DashboardHome from './components/Admin/DashboardHome';
import Settings from './components/Admin/Settings';
import ProtectedRoute from './components/Admin/ProtectedRoute';
import AdminLayout from './components/Admin/AdminLayout';
import NotFound from './components/Public/NotFound';
import ErrorBoundary from './components/UI/ErrorBoundary';
import { LanguageProvider } from './services/LanguageContext';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<Login />} />

            {/* Admin Routes with Layout */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Outlet />
                  </AdminLayout>
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardHome />} />
              <Route path="personal" element={<PersonalInfo />} />
              <Route path="projects">
                <Route index element={<ProjectList />} />
                <Route path="new" element={<ProjectForm />} />
                <Route path="edit/:id" element={<ProjectForm />} />
              </Route>
              <Route path="skills" element={<Skills />} />
              <Route path="experience" element={<CareerHistory />} />
              <Route path="services" element={<Services />} />
              <Route path="messages" element={<Messages />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </LanguageProvider>
    </ErrorBoundary>
  );
};


export default App;