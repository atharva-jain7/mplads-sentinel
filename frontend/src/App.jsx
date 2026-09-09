import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProjectListPage from './pages/ProjectListPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import InvestigationPage from './pages/InvestigationPage';
import ReportPage from './pages/ReportPage';
import DataImportPage from './pages/DataImportPage';
import LandingPage from './pages/LandingPage';
import RankingsPage from './pages/RankingsPage';
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
          {children}
        </main>
      </div>
    </div>
  );
}


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedLayout>
              <DashboardPage />
            </ProtectedLayout>
          }
        />

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

        <Route
          path="/investigation/:projectId"
          element={
            <ProtectedLayout>
              <InvestigationPage />
            </ProtectedLayout>
          }
        />

        <Route
          path="/reports/:reportId"
          element={
            <ProtectedLayout>
              <ReportPage />
            </ProtectedLayout>
          }
        />

        <Route
          path="/import"
          element={
            <ProtectedLayout>
              <DataImportPage />
            </ProtectedLayout>
          }
        />

        <Route
          path="/rankings"
          element={
            <ProtectedLayout>
              <RankingsPage />
            </ProtectedLayout>
          }
        />

        <Route path="/" element={<LandingPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}