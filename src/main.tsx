import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import './index.css'
import App from './App.tsx'
import { StartupErrorsProvider } from '@/hooks/useStartupErrors'
import { AuthProvider } from '@/hooks/useAuth'
import { ProductivityStoreProvider } from '@/hooks/useProductivityStore'
import { ThemeProvider } from '@/hooks/useTheme'
import { PreferencesProvider } from '@/hooks/usePreferences'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <PreferencesProvider>
        <StartupErrorsProvider>
          <AuthProvider>
            <ProductivityStoreProvider>
              <App />
            </ProductivityStoreProvider>
          </AuthProvider>
        </StartupErrorsProvider>
      </PreferencesProvider>
    </ThemeProvider>
  </StrictMode>,
)
