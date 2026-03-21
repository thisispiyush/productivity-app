import type { ReactElement } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { AppLayout } from '@/layout/AppLayout'
import { AuthLayout } from '@/layout/AuthLayout'
import { AnalyticsPage } from '@/pages/Analytics'
import { AuthCallbackPage } from '@/pages/AuthCallback'
import { AuthPage } from '@/pages/Auth'
import { DashboardPage } from '@/pages/Dashboard'
import { HabitTrackerPage } from '@/pages/HabitTracker'
import { ResetPasswordPage } from '@/pages/ResetPassword'
import { TaskManagerPage } from '@/pages/TaskManager'
import { UpdatePasswordPage } from '@/pages/UpdatePassword'
import { useAuth } from '@/hooks/useAuth'

function ProtectedRoute({ children }: { children: ReactElement }) {
  const { user, initializing } = useAuth()
  if (initializing) return null
  if (!user) return <Navigate to="/auth" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/update-password" element={<UpdatePasswordPage />} />
        </Route>
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<DashboardPage />} />
          <Route path="/habits" element={<HabitTrackerPage />} />
          <Route path="/tasks" element={<TaskManagerPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
