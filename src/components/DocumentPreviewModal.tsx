import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Download, 
  Share, 
  FileText, 
  Tag,
  Clock,
  CheckCircle,
  AlertCircle,
  Archive,
  Edit,
  MoreHorizontal,
  Info,
  Activity,
  GitBranch,
  File,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

interface Document {
  id: string;
  title: string;
  type: string;
  department: string;
  uploadedBy: string;
  uploadedAt: string;
  fileSize: string;
  status: 'approved' | 'pending' | 'revision' | 'archived';
  tags: string[];
  collaborators: Array<{
    id: string;
    name: string;
    initials: string;
    avatar?: string;
  }>;
  fileExtension: string;
  isLocked?: boolean;
  isPublic?: boolean;
  description?: string;
  accessLevel?: string;
  lastModified?: string;
}

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document | null;
  onEdit?: (document: Document) => void;
}

export default function DocumentPreviewModal({ isOpen, onClose, document, onEdit }: DocumentPreviewModalProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'activity' | 'version'>('info');
  const [isInfoPanelVisible, setIsInfoPanelVisible] = useState(true);

  if (!document) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 dark:text-green-400';
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'revision':
        return 'text-orange-600 dark:text-orange-400';
      case 'archived':
        return 'text-gray-600 dark:text-gray-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusBackgroundColor = (status: string) => {
    switch (status) {
      case 'approved':
        return { backgroundColor: 'rgba(16, 185, 129, 0.1)' };
      case 'pending':
        return {};
      case 'revision':
        return {};
      case 'archived':
        return {};
      default:
        return {};
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-3 h-3" />;
      case 'pending':
        return <Clock className="w-3 h-3" />;
      case 'revision':
        return <AlertCircle className="w-3 h-3" />;
      case 'archived':
        return <Archive className="w-3 h-3" />;
      default:
        return <FileText className="w-3 h-3" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const tabs = [
    { id: 'info', label: 'Info', icon: Info },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'version', label: 'Version', icon: GitBranch }
  ];

  const renderInfoTab = () => (
    <div className="space-y-6">
      {/* Description */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {document.description || "Security best practices for API development and integration."}
        </p>
      </div>

      {/* Collaborators */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Collaborators</h4>
        <div className="space-y-2">
          {document.collaborators.map((collaborator) => (
            <div
              key={collaborator.id}
              className="flex items-center space-x-3 p-2 bg-white dark:bg-gray-700 rounded-lg"
            >
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-sm font-medium text-primary-600 dark:text-primary-400">
                {collaborator.initials}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {collaborator.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Collaborator
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Document Details */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Document Details</h4>
          <span 
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}
            style={getStatusBackgroundColor(document.status)}
          >
            {getStatusIcon(document.status)}
            <span className="ml-1 capitalize">{document.status}</span>
          </span>
        </div>
        <div className="space-y-0">
          <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">Type:</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">Manual</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">File Type:</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">{document.fileExtension.toLowerCase()}</span>
          </div>
          <div className="flex justify-between items-start py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">Department:</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white text-right">
              Main/Information.Technology/System<br />
              Documentation/API Documentation
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">Uploaded By:</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">{document.uploadedBy}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">Access Level:</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">department</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">Upload Date:</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(document.uploadedAt)}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Last Modified:</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(document.uploadedAt)}</span>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</h4>
        <div className="flex flex-wrap gap-2">
          {document.tags.map((tag, index) => (
            <motion.button
              key={index}
              onClick={() => console.log(`Clicked tag: ${tag}`)}
              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white text-gray-800 dark:bg-gray-900/30 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderActivityTab = () => (
    <div className="space-y-4">
      <div className="text-center py-8">
        <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Activity Feed</h3>
        <p className="text-gray-500 dark:text-gray-400">
          Document activity and changes will be displayed here
        </p>
      </div>
      
      {/* Mock activity items */}
      <div className="space-y-3">
        <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-900 dark:text-white">Document approved</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Edit className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-900 dark:text-white">Document edited by {document.uploadedBy}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">1 day ago</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <File className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-900 dark:text-white">Document uploaded</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(document.uploadedAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderVersionTab = () => (
    <div className="space-y-4">
      <div className="text-center py-8">
        <GitBranch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Version History</h3>
        <p className="text-gray-500 dark:text-gray-400">
          Document versions and revision history
        </p>
      </div>
      
      {/* Mock version items */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Version 2.0</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Current version</p>
            </div>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(document.uploadedAt)}</span>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center">
              <File className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Version 1.5</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Previous version</p>
            </div>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">01/15/2024</span>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center">
              <File className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Version 1.0</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Initial version</p>
            </div>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">12/20/2023</span>
        </div>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={onClose}
            />

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="relative flex-1 flex flex-col bg-white dark:bg-gray-900"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-8 h-8 text-gray-500" />
                    <div>
                      <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {document.title}
                      </h1>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {document.fileExtension} • {document.fileSize}
                      </p>
                    </div>
                  </div>
                  {document.isLocked && (
                    <span className="text-gray-400" title="Locked">
                      🔒
                    </span>
                  )}
                  {document.isPublic && (
                    <span className="text-gray-400" title="Public">
                      🌐
                    </span>
                  )}
                </div>
                
                        <div className="flex items-center space-x-2">
                          <motion.button
                            className="glass-button-icon"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Download className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            className="glass-button-icon"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Share className="w-4 h-4" />
                          </motion.button>
                          {onEdit && (
                            <motion.button
                              onClick={() => onEdit(document)}
                              className="glass-button-icon"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Edit className="w-4 h-4" />
                            </motion.button>
                          )}
                          <motion.button
                            className="glass-button-icon"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </motion.button>
                          <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          >
                            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          </button>
                        </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 flex">
                {/* Document Preview */}
                <div className="flex-1 p-6 relative">

                  <div className="h-full bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="w-24 h-24 stroke-1 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Document Preview
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Preview content would be displayed here
                      </p>
                    </div>
                  </div>
                </div>

                {/* Toggle Button - Centered between panels */}
                <div className="flex items-center justify-center border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" onClick={() => setIsInfoPanelVisible(!isInfoPanelVisible)}>
                  <motion.button
                    
                    className="p-2 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title={isInfoPanelVisible ? "Hide Info Panel" : "Show Info Panel"}
                  >
                    {isInfoPanelVisible ? (
                      <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    ) : (
                      <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    )}
                  </motion.button>
                </div>

                {/* Info Panel with Tabs */}
                <AnimatePresence>
                  {isInfoPanelVisible && (
                    <motion.div 
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 384, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 overflow-hidden"
                    >
                  {/* Tab Navigation */}
                  <div className="border-b border-gray-200 dark:border-gray-700">
                    <div className="flex">
                      {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
                              activeTab === tab.id
                                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400 bg-white dark:bg-gray-900'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span>{tab.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tab Content */}
                  <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        {activeTab === 'info' && renderInfoTab()}
                        {activeTab === 'activity' && renderActivityTab()}
                        {activeTab === 'version' && renderVersionTab()}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}