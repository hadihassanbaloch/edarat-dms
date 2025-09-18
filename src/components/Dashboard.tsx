import React from 'react';
import { 
  FileText, 
  Users, 
  FolderOpen, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Activity,
  Download,
  Upload,
  Eye,
  Calendar,
  BarChart3
} from 'lucide-react';
import { User } from '../types';

interface DashboardProps {
  user: User;
}

export default function Dashboard({ user }: DashboardProps) {
  // Mock data for dashboard metrics
  const metrics = {
    totalDocuments: 1247,
    totalUsers: 156,
    totalDepartments: 6,
    pendingApprovals: 23,
    documentsThisMonth: 89,
    activeUsers: 134,
    storageUsed: 67, // percentage
    documentsViewed: 1856
  };

  const recentActivity = [
    {
      id: 1,
      type: 'document_uploaded',
      description: 'New policy document uploaded to HR',
      user: 'Sarah Johnson',
      time: '2 minutes ago',
      icon: Upload,
      color: 'text-primary-500 dark:text-primary-200',
      bgColor: 'bg-primary-50 dark:bg-primary-900/20'
    },
    {
      id: 2,
      type: 'document_approved',
      description: 'Safety guidelines approved',
      user: 'Mike Chen',
      time: '15 minutes ago',
      icon: CheckCircle,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20'
    },
    {
      id: 3,
      type: 'document_viewed',
      description: 'Employee handbook accessed',
      user: 'Lisa Davis',
      time: '1 hour ago',
      icon: Eye,
      color: 'text-gray-600 dark:text-gray-400',
      bgColor: 'bg-gray-100 dark:bg-gray-700/50'
    },
    {
      id: 4,
      type: 'user_registered',
      description: 'New user account created',
      user: 'System',
      time: '2 hours ago',
      icon: Users,
      color: 'text-slate-600 dark:text-slate-400',
      bgColor: 'bg-slate-100 dark:bg-slate-700/50'
    },
    {
      id: 5,
      type: 'document_downloaded',
      description: 'Compliance report downloaded',
      user: 'John Smith',
      time: '3 hours ago',
      icon: Download,
      color: 'text-gray-600 dark:text-gray-400',
      bgColor: 'bg-gray-100 dark:bg-gray-700/50'
    }
  ];

  const documentsByDepartment = [
    { name: 'Human Resources', count: 342, percentage: 27 },
    { name: 'Information Technology', count: 298, percentage: 24 },
    { name: 'Finance', count: 215, percentage: 17 },
    { name: 'Legal', count: 189, percentage: 15 },
    { name: 'Operations', count: 134, percentage: 11 },
    { name: 'Marketing', count: 69, percentage: 6 }
  ];

  const quickActions = [
    {
      title: 'Upload Document',
      description: 'Add new document to the system',
      icon: Upload,
      color: 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-500 dark:hover:text-primary-200 hover:border-primary-200 dark:hover:border-primary-700',
      action: () => console.log('Upload document')
    },
    {
      title: 'Manage Users',
      description: 'Add or edit user accounts',
      icon: Users,
      color: 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 hover:border-gray-300 dark:hover:border-gray-600',
      action: () => console.log('Manage users')
    },
    {
      title: 'View Reports',
      description: 'Generate analytics reports',
      icon: BarChart3,
      color: 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 hover:border-gray-300 dark:hover:border-gray-600',
      action: () => console.log('View reports')
    },
    {
      title: 'System Settings',
      description: 'Configure system preferences',
      icon: Activity,
      color: 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 hover:border-gray-300 dark:hover:border-gray-600',
      action: () => console.log('System settings')
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Welcome back, {user.name}</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Documents</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.totalDocuments.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 dark:text-green-400">+{metrics.documentsThisMonth} this month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary-500 dark:text-primary-200" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.activeUsers}</p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">of {metrics.totalUsers} total</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700/50 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Approvals</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.pendingApprovals}</p>
              <div className="flex items-center mt-2">
                <Clock className="w-4 h-4 text-amber-500 mr-1" />
                <span className="text-sm text-amber-600 dark:text-amber-400">Requires attention</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Storage Used</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.storageUsed}%</p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                <div 
                  className="bg-primary-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${metrics.storageUsed}%` }}
                ></div>
              </div>
            </div>
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700/50 rounded-lg flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.bgColor}`}>
                      <Icon className={`w-4 h-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white">{activity.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">by {activity.user}</span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <button className="w-full mt-4 text-sm text-primary-500 dark:text-primary-200 hover:text-primary-600 dark:hover:text-primary-300 font-medium transition-colors duration-200">
              View all activity
            </button>
          </div>
        </div>

        {/* Documents by Department */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Documents by Department</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {documentsByDepartment.map((dept, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{dept.name}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{dept.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-primary-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${dept.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.action}
                  className={`p-4 rounded-lg border border-gray-200 dark:border-gray-700 text-left transition-colors duration-200 ${action.color}`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-6 h-6" />
                    <div>
                      <h3 className="font-medium">{action.title}</h3>
                      <p className="text-xs opacity-75 mt-1">{action.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
