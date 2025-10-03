import React from 'react';
import { Eye, Download, Upload, CheckCircle, XCircle, Clock } from 'lucide-react';
import { AuditLog } from '../types';
import { formatDate, formatDateTime } from '../utils/dateUtils';

interface AuditTrailProps {
  auditLogs: AuditLog[];
}

export default function AuditTrail({ auditLogs }: AuditTrailProps) {
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'view':
        return <Eye className="w-4 h-4 text-slate-500 dark:text-slate-400" />;
      case 'download':
        return <Download className="w-4 h-4 text-slate-500 dark:text-slate-400" />;
      case 'upload':
        return <Upload className="w-4 h-4 text-slate-500 dark:text-slate-400" />;
      case 'approve':
        return <CheckCircle className="w-4 h-4 text-slate-500 dark:text-slate-400" />;
      case 'reject':
        return <XCircle className="w-4 h-4 text-slate-500 dark:text-slate-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-500 dark:text-slate-400" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'view':
        return 'text-slate-600 bg-slate-100 dark:text-slate-400 dark:bg-slate-700';
      case 'download':
        return 'text-slate-600 bg-slate-100 dark:text-slate-400 dark:bg-slate-700';
      case 'upload':
        return 'text-slate-600 bg-slate-100 dark:text-slate-400 dark:bg-slate-700';
      case 'approve':
        return 'text-slate-600 bg-slate-100 dark:text-slate-400 dark:bg-slate-700';
      case 'reject':
        return 'text-slate-600 bg-slate-100 dark:text-slate-400 dark:bg-slate-700';
      default:
        return 'text-slate-600 bg-slate-100 dark:text-slate-400 dark:bg-slate-700';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
      <div className="p-4 border-b border-gray-200 dark:border-slate-700">
        <h2 className="text-lg font-medium text-slate-800 dark:text-slate-200">Audit Trail</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Complete log of document activities</p>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-slate-700">
        {auditLogs.length === 0 ? (
          <div className="p-6 text-center">
            <Clock className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-500 dark:text-slate-400">No audit logs available</p>
          </div>
        ) : (
          auditLogs.map((log) => (
            <div key={log.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getActionIcon(log.action)}
                </div>
                
                <div className="flex-1 min-w-0">
                  {/* User name on top */}
                  <div className="mb-1">
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{log.userName}</span>
                  </div>
                  
                  {/* Document action description */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                    <span className="capitalize">{log.action}ed</span> document:{' '}
                    <span className="font-medium text-slate-700 dark:text-slate-300">{log.documentTitle}</span>
                  </p>
                  
                  {/* Timestamp and action badge on bottom */}
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      {formatDateTime(log.timestamp)}
                    </span>
                    <span className="text-slate-400">|</span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium capitalize ${getActionColor(log.action)}`}
                    >
                      {log.action}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {auditLogs.length > 0 && (
        <div className="p-3 border-t border-gray-200 dark:border-slate-700 text-center">
          <button className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 font-medium">
            Load More
          </button>
        </div>
      )}
    </div>
  );
}