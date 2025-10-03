import React from 'react';
import { X, FileText, Clock, Building2, Eye, CheckCircle, XCircle, Calendar, User, Check, X as XIcon, Bell, Send, MessageCircle } from 'lucide-react';
import { Document, User as UserType } from '../types';
import { formatDate } from '../utils/dateUtils';

interface StatsDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onExitComplete?: () => void;
  statsType: 'total' | 'pending' | 'department' | 'public' | null;
  documents: Document[];
  user: UserType;
  onDocumentClick: (document: Document) => void;
  selectedDocuments?: Set<string>;
  bulkMode?: boolean;
  onDocumentSelect?: (documentId: string, selected: boolean) => void;
  onApproveDocument?: (documentId: string) => void;
  onRejectDocument?: (documentId: string) => void;
  onResendNotification?: (documentIds: string[]) => void;
}

export default function StatsDetailPanel({ 
  isOpen, 
  onClose, 
  onExitComplete,
  statsType, 
  documents, 
  user,
  onDocumentClick,
  selectedDocuments = new Set(),
  bulkMode = false,
  onDocumentSelect,
  onApproveDocument,
  onRejectDocument,
  onResendNotification
}: StatsDetailPanelProps) {
  if (!isOpen || !statsType) return null;

  const getFilteredDocuments = () => {
    switch (statsType) {
      case 'total':
        return documents;
      case 'pending':
        return documents.filter(doc => doc.approvalStatus === 'pending');
      case 'department':
        return documents.filter(doc => doc.department === user.department);
      case 'public':
        return documents.filter(doc => doc.accessType === 'public');
      default:
        return [];
    }
  };

  const getTitle = () => {
    switch (statsType) {
      case 'total':
        return 'All Documents';
      case 'pending':
        return 'Pending Approval';
      case 'department':
        return `${user.department} Documents`;
      case 'public':
        return 'Public Documents';
      default:
        return 'Documents';
    }
  };

  const getIcon = () => {
    switch (statsType) {
      case 'total':
        return <FileText className="w-5 h-5 text-primary-500 dark:text-primary-200" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case 'department':
        return <Building2 className="w-5 h-5 text-primary-500 dark:text-primary-200" />;
      case 'public':
        return <Eye className="w-5 h-5 text-green-600 dark:text-green-400" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  const filteredDocuments = getFilteredDocuments();
  const selectedPendingDocs = Array.from(selectedDocuments).filter(docId => 
    filteredDocuments.find(doc => doc.id === docId && doc.approvalStatus === 'pending')
  );

  return (
    <div className={`fixed inset-0 z-[90] flex transition-all duration-300 ease-out ${
      isOpen ? 'bg-black bg-opacity-50' : 'bg-black bg-opacity-0 pointer-events-none'
    }`}>
      <div className={`ml-auto w-full max-w-md bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className={`p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 transform transition-all duration-500 delay-100 ease-out ${
            isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getIcon()}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{getTitle()}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{filteredDocuments.length} documents</p>
                  {user.role === 'admin' && statsType === 'pending' && selectedPendingDocs.length > 0 && (
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        onClick={() => onResendNotification?.(selectedPendingDocs)}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-primary-50 dark:bg-primary-900/30 text-eteal-700 dark:text-eteal-400 rounded-sm hover:bg-eteal-100 dark:hover:bg-eteal-900/50 transition-colors text-xs"
                      >
                        <Send className="w-3 h-3" />
                        <span>Resend Notifications ({selectedPendingDocs.length})</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-700 transform hover:scale-110 hover:rotate-90 transition-all duration-200 ease-out"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className={`flex-1 overflow-auto transform transition-all duration-500 delay-200 ease-out ${
            isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            {filteredDocuments.length === 0 ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No documents found</p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredDocuments.map((document) => (
                  <div
                    key={document.id}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 ease-out hover:translate-x-2 hover:shadow-sm transform"
                  >
                    {bulkMode && onDocumentSelect && (
                      <div className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          checked={selectedDocuments.has(document.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            onDocumentSelect(document.id, e.target.checked);
                          }}
                          className="rounded border-gray-300 dark:border-gray-600 text-teal-600 focus:ring-teal-500"
                        />
                      </div>
                    )}
                    <button
                      onClick={() => {
                        onDocumentClick(document);
                        onClose();
                      }}
                      className="w-full text-left"
                    >
                      <div className="flex items-start space-x-3 transition-all duration-200 ease-out">
                      <div className="flex-shrink-0 mt-1">
                        <div className={`w-8 h-8 rounded-sm flex items-center justify-center ${
                          document.fileType === 'pdf' ? 'bg-red-100 dark:bg-red-900/30' :
                          document.fileType === 'doc' || document.fileType === 'docx' ? 'bg-blue-100 dark:bg-blue-900/30' :
                          document.fileType === 'xls' || document.fileType === 'xlsx' ? 'bg-green-100 dark:bg-green-900/30' :
                          'bg-gray-100 dark:bg-gray-700'
                        }`}>
                          <FileText className={`w-4 h-4 ${
                            document.fileType === 'pdf' ? 'text-red-600 dark:text-red-400' :
                            document.fileType === 'doc' || document.fileType === 'docx' ? 'text-blue-600 dark:text-blue-400' :
                            document.fileType === 'xls' || document.fileType === 'xlsx' ? 'text-green-600 dark:text-green-400' :
                            'text-gray-600 dark:text-gray-400'
                          }`} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {document.title}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500 dark:text-gray-400">{document.type}</span>
                          <span className="text-gray-300 dark:text-gray-600">•</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{document.department}</span>
                        </div>
                        <div className="flex items-center space-x-3 mt-2">
                          <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                            <User className="w-3 h-3" />
                            <span>{document.uploadedBy}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(document.uploadedAt)}</span>
                          </div>
                          {statsType === 'pending' && (
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3 text-amber-500" />
                              <span className="text-xs text-amber-600 dark:text-amber-400">Pending</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {document.approvalStatus === 'approved' && <CheckCircle className="w-4 h-4 text-green-500" />}
                        {document.approvalStatus === 'rejected' && <XCircle className="w-4 h-4 text-red-500" />}
                        {document.approvalStatus === 'pending' && <Clock className="w-4 h-4 text-amber-500" />}
                      </div>
                      </div>
                    </button>
                    
                    {/* Manager Approval Actions */}
                    {user.role === 'admin' && onResendNotification && document.approvalStatus === 'pending' && (
                      <div className="mt-3 flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onResendNotification([document.id]);
                          }}
                          className="flex items-center space-x-1 px-3 py-1.5 bg-primary-50 dark:bg-primary-900/30 text-eteal-700 dark:text-eteal-400 rounded-sm hover:bg-eteal-100 dark:hover:bg-eteal-900/50 transition-colors text-xs"
                        >
                          <Bell className="w-3 h-3" />
                          <span>Resend Notification</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}