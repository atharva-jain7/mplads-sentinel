import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProjectListPage from './pages/ProjectListPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import InvestigationDeskPage from './pages/InvestigationDeskPage';
import ReportPage from './pages/ReportPage';
import DataImportPage from './pages/DataImportPage';
import LandingPage from './pages/LandingPage';
import ErrorBoundary from './components/ErrorBoundary';
import { authService } from './services/auth';

function ProtectedLayout({ children }) {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* 1. Core Pillar: Executive Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedLayout>
              <DashboardPage />
            </ProtectedLayout>
          }
        />

        {/* 2. Core Pillar: Project Risk Priority */}
        <Route
          path="/projects"
          element={
            <ProtectedLayout>
              <ProjectListPage />
            </ProtectedLayout>
          }
        />
        <Route
          path="/projects/:projectId"
          element={
            <ProtectedLayout>
              <ProjectDetailPage />
            </ProtectedLayout>
          }
        />

        {/* 3. Core Pillar: Investigation Desk */}
        <Route
          path="/investigation-desk"
          element={
            <ProtectedLayout>
              <InvestigationDeskPage />
            </ProtectedLayout>
          }
        />

        {/* 4. Statutory Dossiers & Review Reports */}
        <Route
          path="/reports/:reportId"
          element={
            <ProtectedLayout>
              <ReportPage />
            </ProtectedLayout>
          }
        />
        <Route path="/reports" element={<Navigate to="/projects" replace />} />

        {/* 5. Data & Model Status */}
        <Route
          path="/data"
          element={
            <ProtectedLayout>
              <DataImportPage />
            </ProtectedLayout>
          }
        />
        <Route path="/import" element={<Navigate to="/data" replace />} />

        {/* Clean Redirects for Consolidated Features */}
        {/* GIS & Analytics now live directly inside Dashboard */}
        <Route path="/gis" element={<Navigate to="/dashboard" replace />} />
        <Route path="/analytics" element={<Navigate to="/dashboard" replace />} />

        {/* Priority Cases & Rankings consolidated into Project Risk Priority */}
        <Route path="/priority-cases" element={<Navigate to="/projects" replace />} />
        <Route path="/rankings" element={<Navigate to="/projects" replace />} />

        {/* Investigation links route to the dedicated Investigation Desk */}
        <Route path="/investigations" element={<Navigate to="/investigation-desk" replace />} />
        <Route
          path="/investigation/:projectId"
          element={
            <ProtectedLayout>
              <InvestigationDeskPage />
            </ProtectedLayout>
          }
        />
        <Route
          path="/investigations/:projectId"
          element={
            <ProtectedLayout>
              <InvestigationDeskPage />
            </ProtectedLayout>
          }
        />

        <Route path="/" element={<LandingPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </ErrorBoundary>
);
}