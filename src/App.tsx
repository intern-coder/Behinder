import { useState } from 'react';
import { LoginView } from './components/LoginView';
import { DashboardView } from './components/DashboardView';
import { LanguageProvider } from './LanguageContext';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen font-sans">
        {isAuthenticated ? (
          <DashboardView onLogout={handleLogout} />
        ) : (
          <LoginView onLogin={handleLogin} />
        )}
      </div>
    </LanguageProvider>
  );
}
