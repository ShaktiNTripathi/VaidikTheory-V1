import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import {
  AboutPage,
  ContactPage,
  DashboardPage,
  EReportPage,
  HomePage,
  LoginPage,
  ReportResultPage,
} from '@/pages';
import { SiteLayout } from '@/shared/components/layout/SiteLayout';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="report" element={<EReportPage />} />
          <Route path="report/result" element={<ReportResultPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
