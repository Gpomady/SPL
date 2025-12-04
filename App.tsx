import React, { useState, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { Dashboard } from './components/Dashboard';
import { api, authApi, User } from '@lib/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const refreshResponse = await authApi.refreshToken();
        if (refreshResponse.success && refreshResponse.data) {
          api.setAccessToken(refreshResponse.data.accessToken);
          
          const profileResponse = await authApi.getProfile();
          if (profileResponse.success && profileResponse.data) {
            setUser(profileResponse.data);
            setIsAuthenticated(true);
          }
        }
      } catch {
        api.clearTokens();
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
    } finally {
      api.clearTokens();
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-3 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      {isAuthenticated ? (
        <Dashboard onLogout={handleLogout} user={user} />
      ) : (
        <LoginScreen onLogin={handleLogin} />
      )}
    </>
  );
}

export default App;
