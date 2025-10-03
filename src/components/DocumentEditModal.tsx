import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Save, 
  FileText, 
  Tag,
  UserPlus,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  initials: string;
  avatar?: string;
}

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
  collaborators: User[];
  fileExtension: string;
  isLocked?: boolean;
  isPublic?: boolean;
  securityLevel?: 'public' | 'internal' | 'confidential' | 'restricted';
  description?: string;
}

interface DocumentEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document | null;
  onSave: (updatedDocument: Document) => void;
}

const departments = ['Finance', 'HR', 'Engineering', 'Marketing', 'Operations'];
const availableUsers = [
  { id: '1', name: 'Sarah Johnson', initials: 'SJ' },
  { id: '2', name: 'Mike Chen', initials: 'MC' },
  { id: '3', name: 'Emma Wilson', initials: 'EW' },
  { id: '4', name: 'Lisa Davis', initials: 'LD' },
  { id: '5', name: 'HR Manager', initials: 'HM' },
  { id: '6', name: 'David Wilson', initials: 'DW' },
  { id: '7', name: 'Engineering Lead', initials: 'EL' },
  { id: '8', name: 'Alex Rodriguez', initials: 'AR' },
  { id: '9', name: 'Legal Team', initials: 'LT' },
  { id: '10', name: 'Emma Brown', initials: 'EB' },
  { id: '11', name: 'John Smith', initials: 'JS' }
];

export default function DocumentEditModal({ isOpen, onClose, document, onSave }: DocumentEditModalProps) {
  const [isInfoPanelVisible, setIsInfoPanelVisible] = useState(true);
  const [editedDocument, setEditedDocument] = useState<Document | null>(null);
  const [newTag, setNewTag] = useState('');
  const [showAddCollaborator, setShowAddCollaborator] = useState(false);

  // Initialize edited document when modal opens
  React.useEffect(() => {
    if (document && isOpen) {
      setEditedDocument({ ...document });
    }
  }, [document, isOpen]);

  if (!document || !editedDocument) return null;

  const handleSave = () => {
    onSave(editedDocument);
    onClose();
  };

  const handleInputChange = (field: keyof Document, value: string) => {
    setEditedDocument(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      const tagsToAdd = newTag.split(',').map(tag => tag.trim()).filter(tag => tag);
      const uniqueTags = tagsToAdd.filter(tag => !editedDocument.tags.includes(tag));
      
      if (uniqueTags.length > 0) {
        setEditedDocument(prev => prev ? {
          ...prev,
          tags: [...prev.tags, ...uniqueTags]
        } : null);
      }
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditedDocument(prev => prev ? {
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    } : null);
  };

  const handleAddCollaborator = (userId: string) => {
    const user = availableUsers.find(u => u.id === userId);
    if (user && !editedDocument.collaborators.some(c => c.id === userId)) {
      setEditedDocument(prev => prev ? {
        ...prev,
        collaborators: [...prev.collaborators, user]
      } : null);
    }
    setShowAddCollaborator(false);
  };

  const handleRemoveCollaborator = (userId: string) => {
    setEditedDocument(prev => prev ? {
      ...prev,
      collaborators: prev.collaborators.filter(c => c.id !== userId)
    } : null);
  };


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
                        Edit Document
                      </h1>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {editedDocument.fileExtension} • {editedDocument.fileSize}
                      </p>
                    </div>
                  </div>
                  {editedDocument.isLocked && (
                    <span className="text-gray-400 text-xs" title="Locked">
                      LOCKED
                    </span>
                  )}
                  {editedDocument.isPublic && (
                    <span className="text-gray-400 text-xs" title="Public">
                      PUBLIC
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <motion.button
                    onClick={handleSave}
                    className="glass-button-primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
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
                        Document content preview would be displayed here
                      </p>
                    </div>
                  </div>
                </div>

                {/* Toggle Button - Centered between panels */}
                <div onClick={() => setIsInfoPanelVisible(!isInfoPanelVisible)} className="flex items-center justify-center border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <motion.button
                    
                    className="p-2 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title={isInfoPanelVisible ? "Hide Edit Panel" : "Show Edit Panel"}
                  >
                    {isInfoPanelVisible ? (
                      <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    ) : (
                      <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    )}
                  </motion.button>
                </div>

                {/* Edit Panel */}
                <AnimatePresence>
                  {isInfoPanelVisible && (
                    <motion.div 
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 400, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 overflow-hidden"
                    >
                      <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                        <div className="space-y-6">
                          {/* Document Title */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Document Title
                            </label>
                            <input
                              type="text"
                              value={editedDocument.title}
                              onChange={(e) => handleInputChange('title', e.target.value)}
                              className="glass-input w-full"
                              placeholder="Enter document title"
                            />
                          </div>

                          {/* Description */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Description
                            </label>
                            <textarea
                              value={editedDocument.description || ''}
                              onChange={(e) => handleInputChange('description', e.target.value)}
                              className="glass-input w-full h-24 resize-none"
                              placeholder="Enter document description"
                            />
                          </div>

                          {/* Department */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Department
                            </label>
                            <select
                              value={editedDocument.department}
                              onChange={(e) => handleInputChange('department', e.target.value)}
                              className="glass-select w-full"
                            >
                              {departments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                              ))}
                            </select>
                          </div>

                          {/* Collaborators */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Collaborators
                              </label>
                              <motion.button
                                onClick={() => setShowAddCollaborator(!showAddCollaborator)}
                                className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center space-x-1"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <UserPlus className="w-3 h-3" />
                                <span>Add</span>
                              </motion.button>
                            </div>
                            
                            {/* Add Collaborator Dropdown */}
                            <AnimatePresence>
                              {showAddCollaborator && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="mb-3"
                                >
                                  <div className="glass-panel rounded-lg p-3 max-h-32 overflow-y-auto">
                                    <div className="space-y-1">
                                      {availableUsers
                                        .filter(user => !editedDocument.collaborators.some(c => c.id === user.id))
                                        .map(user => (
                                          <button
                                            key={user.id}
                                            onClick={() => handleAddCollaborator(user.id)}
                                            className="flex items-center space-x-3 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                          >
                                            <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xs font-medium text-primary-600 dark:text-primary-400">
                                              {user.initials}
                                            </div>
                                            <span className="text-sm text-gray-700 dark:text-gray-300">{user.name}</span>
                                          </button>
                                        ))}
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {/* Current Collaborators */}
                            <div className="space-y-2">
                              {editedDocument.collaborators.map((collaborator) => (
                                <div
                                  key={collaborator.id}
                                  className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded-lg"
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-sm font-medium text-primary-600 dark:text-primary-400">
                                      {collaborator.initials}
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {collaborator.name}
                                      </p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Collaborator
                                      </p>
                                    </div>
                                  </div>
                                  <motion.button
                                    onClick={() => handleRemoveCollaborator(collaborator.id)}
                                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </motion.button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Document Status */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Status
                            </label>
                            <select
                              value={editedDocument.status}
                              onChange={(e) => handleInputChange('status', e.target.value)}
                              className="glass-select w-full"
                            >
                              <option value="pending">Pending</option>
                              <option value="approved">Approved</option>
                              <option value="revision">Revision</option>
                              <option value="archived">Archived</option>
                            </select>
                          </div>

                          {/* Tags */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Tags
                            </label>
                            <div className="space-y-3">
                              <div className="flex space-x-2">
                                <input
                                  type="text"
                                  value={newTag}
                                  onChange={(e) => setNewTag(e.target.value)}
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      handleAddTag();
                                    }
                                  }}
                                  onBlur={(e) => {
                                    if (e.target.value.includes(',')) {
                                      const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
                                      tags.forEach(tag => {
                                        if (!editedDocument.tags.includes(tag)) {
                                          setEditedDocument(prev => prev ? {
                                            ...prev,
                                            tags: [...prev.tags, tag]
                                          } : null);
                                        }
                                      });
                                      setNewTag('');
                                    }
                                  }}
                                  className="glass-input flex-1"
                                  placeholder="Add tags (separate with comma)"
                                />
                                <motion.button
                                  onClick={handleAddTag}
                                  className="glass-button-icon"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Plus className="w-4 h-4" />
                                </motion.button>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {editedDocument.tags.map((tag, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white text-gray-800 dark:bg-gray-900/30 dark:text-white"
                                  >
                                    <Tag className="w-3 h-3 mr-1" />
                                    {tag}
                                    <motion.button
                                      onClick={() => handleRemoveTag(tag)}
                                      className="ml-1 hover:text-red-500 transition-colors"
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </motion.button>
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
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
