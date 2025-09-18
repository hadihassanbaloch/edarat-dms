import React, { useState } from 'react';
import { Mail, Lock, Users } from 'lucide-react';
import { User } from '../types';
import { ThemeProvider } from '../contexts/ThemeContext';
import { mockUsers } from '../data/mockData';

interface UserLoginProps {
  onLogin: (user: User) => void;
}

export default function UserLogin({ onLogin }: UserLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFormLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading(true);
    
    // Find user by email
    const user = mockUsers.find(u => u.email === email);
    if (user) {
      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 800));
      onLogin(user);
    } else {
      alert('Invalid credentials. Please try again.');
    }
    
    setIsLoading(false);
  };

  const handleQuickLogin = (user: User) => {
    onLogin(user);
  };

  const handleMicrosoftTeamsLogin = async () => {
    setIsLoading(true);
    
    // TODO: For production implementation, replace this with actual Microsoft Teams OAuth integration
    // 1. Register your app in Azure AD (https://portal.azure.com)
    // 2. Install @azure/msal-browser: npm install @azure/msal-browser
    // 3. Configure MSAL instance with your client ID and tenant ID
    // 4. Use loginPopup() or loginRedirect() method
    // 5. Handle the response and extract user information
    // 
    // Example production code:
    // try {
    //   const loginResponse = await msalInstance.loginPopup({
    //     scopes: ["User.Read", "profile", "openid"],
    //   });
    //   const userProfile = await getUserProfile(loginResponse.accessToken);
    //   onLogin(userProfile);
    // } catch (error) {
    //   console.error('Teams login failed:', error);
    // }
    
    // Simulate Microsoft Teams authentication for demo
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For demo purposes, log in as admin user when connecting with Teams
    const teamsUser = mockUsers.find(u => u.role === 'admin');
    if (teamsUser) {
      onLogin(teamsUser);
    }
    
    setIsLoading(false);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-secondary-light dark:bg-secondary-dark flex items-center justify-center p-4 relative">
        <div className="w-full max-w-sm space-y-8">
          {/* Logo */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <img 
                src="/fsm-icon.png" 
                alt="Edarat DMS" 
                className="w-16 h-16 object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <span className="text-primary-500 text-2xl font-bold hidden">E</span>
            </div>
            <h1 className="text-2xl font-medium text-secondary-dark dark:text-white">Edarat DMS</h1>
            <p className="text-sm text-secondary-dark/70 dark:text-secondary-light/70 mt-1">Document Management System</p>
          </div>

          {/* Login Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <form onSubmit={handleFormLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-eteal-500 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-eteal-500 focus:border-transparent"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-800 disabled:bg-gray-400 text-white font-medium rounded-md text-sm transition-colors duration-200 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">or</span>
              </div>
            </div>

            {/* Microsoft Teams Login Button */}
            <button
              onClick={handleMicrosoftTeamsLogin}
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-[#6264A7] hover:bg-[#5558A0] disabled:bg-[#9CA3AF] text-white font-medium rounded-md text-sm transition-colors duration-200 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-sm"
            >
              {/* Microsoft Teams Icon */}
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.12 2.75H9.38C8.617 2.75 8 3.367 8 4.13v6.24h14.12c.763 0 1.38-.617 1.38-1.38V4.13c0-.763-.617-1.38-1.38-1.38zm0 9.87H8v6.24c0 .763.617 1.38 1.38 1.38h12.74c.763 0 1.38-.617 1.38-1.38v-6.24zm-20.37 0h6.5c.689 0 1.25-.561 1.25-1.25V4.88c0-.689-.561-1.25-1.25-1.25h-6.5C1.06 3.63.5 4.191.5 4.88v6.49c0 .689.561 1.25 1.25 1.25z"/>
              </svg>
              <span>{isLoading ? 'Connecting...' : 'Connect with Microsoft Teams'}</span>
            </button>
          </div>

          {/* Demo Accounts - Minimal 3 buttons in a row */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 text-center">
              Demo Accounts
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  const u = mockUsers.find(u => u.role === 'admin');
                  if (u) handleQuickLogin(u);
                }}
                className="w-full py-2 text-center rounded-md border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-800 dark:text-gray-200"
              >
                Admin
              </button>
              <button
                onClick={() => {
                  const u = mockUsers.find(u => u.role === 'manager');
                  if (u) handleQuickLogin(u);
                }}
                className="w-full py-2 text-center rounded-md border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-800 dark:text-gray-200"
              >
                Manager
              </button>
              <button
                onClick={() => {
                  const u = mockUsers.find(u => u.role === 'employee');
                  if (u) handleQuickLogin(u);
                }}
                className="w-full py-2 text-center rounded-md border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-800 dark:text-gray-200"
              >
                Employee
              </button>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="text-center text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <div>© 2025 Edarat Group. All rights reserved.</div>
            <div>Edarat DMS Version 1.0</div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}