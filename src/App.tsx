import type { ReactElement } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { AppLayout } from '@/layout/AppLayout'
import { AuthLayout } from '@/layout/AuthLayout'
import { AnalyticsPage } from '@/pages/Analytics'
import { AuthEntryPage } from '@/pages/AuthEntry'
import { DashboardPage } from '@/pages/Dashboard'
import { HabitTrackerPage } from '@/pages/HabitTracker'
import { LoginPage } from '@/pages/Login'
import { ProfilePage } from '@/pages/Profile'
import { ResetPasswordPage } from '@/pages/ResetPassword'
import { SettingsPage } from '@/pages/Settings'
import { SignUpPage } from '@/pages/SignUp'
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
          <Route path="/auth" element={<AuthEntryPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
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
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
