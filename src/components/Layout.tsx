import React, { useState } from 'react';
import { Bell, Upload, LogOut, User, Menu, X, Search, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { User as UserType } from '../types';
import { getUserNotifications } from '../data/mockData';
import SearchBar, { SearchFilters } from './SearchBar';
import NotificationPanel from './NotificationPanel';
import AvatarImage from './AvatarImage';
import { useTheme } from '../contexts/ThemeContext';

interface LayoutProps {
  user: UserType;
  children: React.ReactNode;
  onSearch: (query: string, filters: SearchFilters) => void;
  onUploadClick: () => void;
  onLogout: () => void;
}

export default function Layout({ user, children, onSearch, onUploadClick, onLogout }: LayoutProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(() => getUserNotifications(user.role));

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  return (
    <div className="min-h-screen relative z-10">
      {/* Header */}
      <motion.header 
        className="glass-panel border-0 border-b border-white/10 sticky top-0 z-40"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Title */}
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center space-x-3">
                <motion.div 
                  className="w-10 h-10 rounded-2xl overflow-hidden"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <img 
                    src="/fsm-icon.png" 
                    alt="Edarat FMS" 
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                {/* App Title */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <h1 className="text-lg font-semibold text-secondary-dark dark:text-slate-200">Edarat DMS</h1>
                </motion.div>
              </div>
            </motion.div>

            {/* Desktop Search */}
            <motion.div 
              className="hidden md:block flex-1 max-w-2xl mx-8"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <SearchBar onSearch={onSearch} documents={[]} />
            </motion.div>

            {/* Right Side Actions */}
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* Mobile Search Toggle */}
              <motion.button 
                className="md:hidden glass-button-icon"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Search className="w-5 h-5" />
              </motion.button>

              {/* Theme Toggle */}
              <motion.button
                onClick={toggleTheme}
                className="glass-button-icon"
                title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isDark ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </motion.button>

              {/* Notifications */}
              <motion.button
                onClick={() => setShowNotifications(true)}
                className="relative glass-button-icon"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <motion.span 
                    className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-neon"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </motion.span>
                )}
              </motion.button>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                    <motion.button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2 p-2 rounded-2xl glass-panel hover:bg-white/20 transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                     <motion.div whileHover={{ scale: 1.1 }}>
                       <AvatarImage
                         src={user.avatar}
                         alt={user.name}
                         className="w-8 h-8 rounded-full object-cover ring-2 ring-white/20"
                         fallbackClassName="w-8 h-8 rounded-full flex items-center justify-center ring-2 ring-white/20"
                         size={32}
                         role={user.role}
                       />
                     </motion.div>
                      <Menu className="w-4 h-4 text-black/50 dark:textwhite/70" />
                    </motion.button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-2xl shadow-lg z-[70] p-2"
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{user.email}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">{user.role} • {user.department}</p>
                        </div>
                        
                        <button
                          onClick={() => {
                            onLogout();
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center space-x-2 px-4 py-3 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/20 transition-colors rounded-2xl"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Mobile Search Bar */}
          <motion.div 
            className="md:hidden pb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <SearchBar onSearch={onSearch} documents={[]} />
          </motion.div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Notification Panel */}

      <NotificationPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
      />

      {/* Mobile Menu Overlay */}
    </div>
  );
}