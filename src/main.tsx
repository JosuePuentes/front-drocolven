import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { AuthAdminProvider } from './context/AuthAdminContext.tsx'

createRoot(document.getElementById('root')!).render(
    <AuthProvider>
      <AuthAdminProvider>
        <App />
      </AuthAdminProvider>
    </AuthProvider>
)
