import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';
import { AuthLayout } from '../layouts/AuthLayout';
import { MainLayout } from '../layouts/MainLayout';

import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import DashboardPage from '../pages/DashboardPage';
import SubjectPage from '../pages/SubjectPage';
import AssessmentPage from '../pages/AssessmentPage';
import StudyPlanPage from '../pages/StudyPlanPage';
import CompanySelectionPage from '../pages/CompanySelectionPage';
import ProgressPage from '../pages/ProgressPage';
import NotFoundPage from '../pages/NotFoundPage';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>

      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/company" element={<CompanySelectionPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        
        <Route path="/subject/:id" element={<SubjectPage />} />
        <Route path="/subject/:id/assessment" element={<AssessmentPage />} />
        <Route path="/subject/:id/topic/:topicId/assessment" element={<AssessmentPage />} />
        <Route path="/subject/:id/plan" element={<StudyPlanPage />} />
      </Route>
      
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
