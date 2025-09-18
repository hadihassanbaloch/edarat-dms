import React from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  userId: string;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4">
      <div className="fixed inset-0 bg-black/20" onClick={onClose} />
      <div className="glass-panel p-6 rounded-lg w-96 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Notifications</h2>
          <button 
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            ×
          </button>
        </div>
        {notifications.length === 0 ? (
          <p className="text-sm text-slate-600 dark:text-slate-400">No new notifications.</p>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {notifications.length} notification(s)
              </span>
              <button 
                onClick={onMarkAllAsRead}
                className="text-xs text-primary-500 dark:text-primary-200 hover:underline"
              >
                Mark all as read
              </button>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                    notification.read 
                      ? 'bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600' 
                      : 'bg-white dark:bg-slate-800 border-primary-200 dark:border-primary-600'
                  }`}
                  onClick={() => onMarkAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className={`text-sm font-medium truncate ${
                          notification.read 
                            ? 'text-slate-600 dark:text-slate-400' 
                            : 'text-slate-800 dark:text-slate-200'
                        }`}>
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-gray-500 rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <p className={`text-xs mt-1 ${
                        notification.read 
                          ? 'text-slate-500 dark:text-slate-500' 
                          : 'text-slate-600 dark:text-slate-400'
                      }`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                        {notification.timestamp.toLocaleDateString()} {notification.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
