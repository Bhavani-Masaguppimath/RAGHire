import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { StudentDashboard } from './pages/dashboard/StudentDashboard';
import { MyProfile } from './pages/profile/MyProfile';
import { ResumeAnalysis } from './pages/profile/ResumeAnalysis';
import { TargetJobRole } from './pages/profile/TargetJobRole';
import { AptitudePractice } from './pages/aptitude/AptitudePractice';
import { AptitudeTestInterface } from './pages/aptitude/AptitudeTestInterface';
import { CodingProblems } from './pages/coding/CodingProblems';
import { CodingWorkspace } from './pages/coding/CodingWorkspace';
import { TechnicalInterview } from './pages/interview/TechnicalInterview';
import { HRCommunication } from './pages/interview/HRCommunication';
import { ProjectDefense } from './pages/project_defense/ProjectDefense';
import { EvidenceTracking } from './pages/evidence/EvidenceTracking';
import { PersonalizedLearningPlan } from './pages/learning/PersonalizedLearningPlan';
import { PerformanceReports } from './pages/reports/PerformanceReports';
import { SessionHistory } from './pages/reports/SessionHistory';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { QuestionBankManagement } from './pages/admin/QuestionBankManagement';
import { LearningResourceManager } from './pages/admin/LearningResourceManager';
import { Settings } from './pages/Settings';

// Role-aware Dashboard Router
const DashboardRouter: React.FC = () => {
  const { user, isAdmin } = useAuth();
  if (isAdmin || user?.role === 'admin') {
    return <AdminDashboard defaultTab="overview" />;
  }
  return <StudentDashboard />;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Application Routes */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard routes intelligently based on role */}
            <Route path="/dashboard" element={<DashboardRouter />} />

            {/* Candidate-specific preparation routes */}
            <Route path="/profile" element={<MyProfile />} />
            <Route path="/resume" element={<ResumeAnalysis />} />
            <Route path="/target-role" element={<TargetJobRole />} />
            <Route path="/aptitude" element={<AptitudePractice />} />
            <Route path="/aptitude/test" element={<AptitudeTestInterface />} />
            <Route path="/coding" element={<CodingProblems />} />
            <Route path="/coding/:problemId" element={<CodingWorkspace />} />
            <Route path="/interview/technical" element={<TechnicalInterview />} />
            <Route path="/interview/hr" element={<HRCommunication />} />
            <Route path="/project-defense" element={<ProjectDefense />} />
            <Route path="/evidence" element={<EvidenceTracking />} />
            <Route path="/learning-plan" element={<PersonalizedLearningPlan />} />
            <Route path="/reports" element={<PerformanceReports />} />
            <Route path="/history" element={<SessionHistory />} />
            <Route path="/settings" element={<Settings />} />

            {/* Placement Director / Administrator Protected Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard defaultTab="overview" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/candidates"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard defaultTab="candidates" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard defaultTab="analytics" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/drives"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard defaultTab="drives" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/evidence"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard defaultTab="evidence" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/questions"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <QuestionBankManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/resources"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <LearningResourceManager />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
