import React, { useState } from 'react';
import { Folder, FileText, Plus, ChevronDown, ChevronRight, Grid, List, Search, ArrowUpDown, ArrowUp, ArrowDown, Home, Trash2, Edit3, Share2, Download, Copy, Bell, File, FileSpreadsheet, FileImage, FileVideo, FileAudio, Archive, CheckCircle, Upload, UploadCloud, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Department, Document } from '../types';
import { formatDate } from '../utils/dateUtils';
import TreeExplorer from './TreeExplorer';
import DropdownMenu from './DropdownMenu';
import NewFolderModal from './NewFolderModal';
import NotificationModal from './NotificationModal';

interface FolderViewProps {
  departments: Department[];
  documentsByDepartment: { department: Department; documents: Document[] }[];
  viewMode: 'list' | 'grid' | 'tree';
  onFolderClick: (department: Department) => void;
  onDocumentClick: (document: Document) => void;
  onViewModeChange?: (mode: 'list' | 'grid' | 'tree') => void;
  onUploadClick?: () => void;
  userRole?: 'admin' | 'manager' | 'employee';
  selectedDocuments?: Set<string>;
  onDocumentSelect?: (documentId: string, isSelected: boolean, event?: React.MouseEvent) => void;
  onSelectAll?: (documents: Document[]) => void;
  onDeselectAll?: () => void;
  bulkMode?: boolean;
  onBulkAction?: (action: 'delete' | 'approve' | 'publish' | 'notify', documentIds: string[]) => void;
}

interface FolderItemProps {
  department: Department;
  documentCount: number;
  onClick: () => void;
  viewMode: 'list' | 'grid' | 'tree';
  onDrop?: (event: React.DragEvent, folder: Department) => void;
  onDragOver?: (event: React.DragEvent, folderId: string) => void;
  onDragLeave?: (event: React.DragEvent) => void;
  isDragOver?: boolean;
  userRole?: 'admin' | 'manager' | 'employee';
}

function FolderItem({ 
  department, 
  documentCount, 
  onClick, 
  viewMode, 
  onDrop, 
  onDragOver, 
  onDragLeave, 
  isDragOver = false, 
  userRole = 'admin' 
}: FolderItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const pendingCount = department.pendingCount || 0;

  if (viewMode === 'grid') {
    return (
      <motion.div
        className={`bg-white dark:bg-gray-800 rounded-lg hover:border-2 p-4 cursor-pointer hover:shadow-md transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600 ${
          isDragOver && userRole === 'admin' ? 'border-2 border-primary-400 bg-primary-50 dark:bg-primary-900/30' : ''
        }`}
        onClick={onClick}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onDragOver={(e) => onDragOver?.(e, department.id)}
        onDragLeave={onDragLeave}
        onDrop={(e) => onDrop?.(e, department)}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex flex-col items-center text-center space-y-3 group">
          <div className="relative">
            <Folder className="w-12 h-12 stroke-1 text-gray-500 dark:text-gray-400" />
            {/* Color label dot */}
            <div 
              className="absolute top-3 -left-0 w-2 h-6 rounded-full border-2 border-white dark:border-gray-800"
              style={{ backgroundColor: department.color }}
            />
            
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white text-sm truncate max-w-full">
              {department.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {documentCount} {documentCount === 1 ? 'document' : 'documents'}
            </p>
          </div>
          
          {/* 3-dot dropdown menu for folders */}
          <div className="absolute top-0 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
              <DropdownMenu
                position="top-right"
                className="bg-white dark:bg-gray-800 rounded-sm"
                buttonClassName="py-1 px-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full"
                items={[
                  {
                    id: 'rename',
                    label: 'Rename',
                    icon: Edit3,
                    onClick: () => {
                      const newName = prompt('Enter new folder name:', department.name);
                      if (newName) {
                        console.log('Renaming folder to:', newName);
                        alert(`Folder renamed to "${newName}"`);
                      }
                    }
                  },
                  {
                    id: 'share',
                    label: 'Share',
                    icon: Share2,
                    onClick: () => {
                      console.log('Sharing folder:', department.name);
                      alert(`Sharing folder "${department.name}"`);
                    }
                  },
                  {
                    id: 'copy',
                    label: 'Copy Link',
                    icon: Copy,
                    onClick: () => {
                      console.log('Copying link for:', department.name);
                      alert(`Link copied for "${department.name}"`);
                    }
                  },
                  {
                    id: 'delete',
                    label: 'Delete',
                    icon: Trash2,
                    destructive: true,
                    divider: true,
                    onClick: () => {
                      if (confirm(`Are you sure you want to delete "${department.name}" folder?`)) {
                        console.log('Deleting folder:', department.name);
                        alert(`Folder "${department.name}" deleted`);
                      }
                    }
                  }
                ]}
              />
            </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-200"
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center space-x-3">
        <Folder className="w-6 h-6 text-primary-500 dark:text-primary-200" />
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 dark:text-white text-sm truncate">
            {department.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {documentCount} {documentCount === 1 ? 'item' : 'items'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {documentCount > 0 && (
            <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
              {documentCount}
            </span>
          )}
          <motion.div
            animate={{ rotate: isHovered ? 0 : -90 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

interface TreeViewProps {
  departments: Department[];
  documentsByDepartment: { department: Department; documents: Document[] }[];
  onDocumentClick: (document: Document) => void;
}

function TreeView({ departments, documentsByDepartment, onDocumentClick }: TreeViewProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const toggleFolder = (departmentId: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(departmentId)) {
        newSet.delete(departmentId);
      } else {
        newSet.add(departmentId);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-1">
      {departments.map((department) => {
        const departmentData = documentsByDepartment.find(d => d.department.id === department.id);
        const documents = departmentData?.documents || [];
        const isExpanded = expandedFolders.has(department.id);

        return (
          <div key={department.id}>
            {/* Folder */}
            <div
              className="flex items-center space-x-2 py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors duration-200"
              onClick={() => toggleFolder(department.id)}
            >
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </motion.div>
              <Folder className="w-5 h-5 text-primary-500 dark:text-primary-200" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {department.name}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ({documents.length})
              </span>
            </div>

            {/* Documents */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-6 space-y-1"
                >
                  {documents.map((document) => (
                    <div
                      key={document.id}
                      className="flex items-center space-x-2 py-1.5 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors duration-200"
                      onClick={() => onDocumentClick(document)}
                    >
                      {getFileIcon(document.fileType)}
                      <span className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1">
                        {document.title}
                      </span>
                      {/* Security Shield Icon */}
                      {document.securityLevel && document.securityLevel !== 'Public' && (
                        <Shield className={`w-4 h-4 mr-2 ${
                          document.securityLevel === 'Highly Confidential' 
                            ? 'text-red-500 dark:text-red-400' 
                            : 'text-amber-500 dark:text-amber-400'
                        }`} />
                      )}
                      <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                        {document.fileType}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

// Helper function for file type icons
const getFileIcon = (fileType: string, size = "w-4 h-4") => {
  const iconColor = "text-gray-500 dark:text-gray-400";
  
  switch (fileType?.toLowerCase()) {
    case 'pdf':
      return <File className={`${size} ${iconColor}`} />;
    case 'doc':
    case 'docx':
      return <FileText className={`${size} ${iconColor}`} />;
    case 'xls':
    case 'xlsx':
      return <FileSpreadsheet className={`${size} ${iconColor}`} />;
    case 'csv':
      return <FileSpreadsheet className={`${size} ${iconColor}`} />;
    case 'ppt':
    case 'pptx':
      return <File className={`${size} ${iconColor}`} />;
    case 'txt':
      return <FileText className={`${size} ${iconColor}`} />;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'bmp':
    case 'svg':
    case 'webp':
      return <FileImage className={`${size} ${iconColor}`} />;
    case 'mp4':
    case 'avi':
    case 'mov':
    case 'wmv':
    case 'flv':
    case 'webm':
      return <FileVideo className={`${size} ${iconColor}`} />;
    case 'mp3':
    case 'wav':
    case 'flac':
    case 'aac':
    case 'ogg':
      return <FileAudio className={`${size} ${iconColor}`} />;
    case 'zip':
    case 'rar':
    case '7z':
    case 'tar':
    case 'gz':
      return <Archive className={`${size} ${iconColor}`} />;
    default:
      return <FileText className={`${size} ${iconColor}`} />;
  }
};

export default function FolderView({ 
  departments, 
  documentsByDepartment, 
  viewMode, 
  onFolderClick, 
  onDocumentClick,
  onViewModeChange,
  onUploadClick,
  userRole = 'admin',
  selectedDocuments = new Set(),
  onDocumentSelect,
  onSelectAll,
  onDeselectAll,
  bulkMode = false,
  onBulkAction
}: FolderViewProps) {
  const [selectedFolder, setSelectedFolder] = useState<Department | null>(null);
  
  // Helper function to find department by path
  const findDepartmentByPath = (targetPath: string, allDepartments: Department[]): Department | null => {
    for (const dept of allDepartments) {
      if (dept.path === targetPath || dept.name.toLowerCase() === targetPath.toLowerCase()) {
        return dept;
      }
      if (dept.children) {
        const found = findDepartmentByPath(targetPath, dept.children);
        if (found) return found;
      }
    }
    return null;
  };

  // Helper function to build breadcrumb navigation
  const buildBreadcrumbPath = (selectedFolder: Department): Array<{name: string, department: Department | null, path: string}> => {
    if (!selectedFolder.path) {
      return [{name: selectedFolder.name, department: selectedFolder, path: selectedFolder.name}];
    }
    
    const segments = selectedFolder.path.split('/');
    const breadcrumbs: Array<{name: string, department: Department | null, path: string}> = [];
    
    let currentPath = '';
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      currentPath = currentPath ? `${currentPath}/${segment}` : segment;
      
      // Find the department that matches this path
      const dept = findDepartmentByPath(currentPath, departments);
      breadcrumbs.push({
        name: segment,
        department: dept,
        path: currentPath
      });
    }
    
    return breadcrumbs;
  };

  // Function to navigate to a specific breadcrumb level
  const navigateToBreadcrumb = (department: Department | null) => {
    if (department) {
      setSelectedFolder(department);
      // Auto-show tree when navigating via breadcrumb
      if (!showTree) {
        setShowTree(true);
      }
    } else {
      setSelectedFolder(null);
    }
  };

  // Function to handle folder clicks with auto-show tree
  const handleFolderClick = (department: Department) => {
    setSelectedFolder(department);
    onFolderClick(department);
    
    // Auto-show tree when clicking on any folder
    if (!showTree) {
      setShowTree(true);
    }
  };

  // Enhanced document selection with keyboard support
  const handleDocumentSelection = (document: Document, event: React.MouseEvent) => {
    if (!onDocumentSelect) return;
    
    const isSelected = selectedDocuments.has(document.id);
    
    // Handle different selection modes
    if (event.metaKey || event.ctrlKey) {
      // Cmd/Ctrl + Click: Toggle individual selection
      onDocumentSelect(document.id, !isSelected, event);
    } else if (event.shiftKey && event.altKey) {
      // Alt + Shift + Click: Unselect (if selected)
      if (isSelected) {
        onDocumentSelect(document.id, false, event);
      }
    } else if (event.shiftKey) {
      // Shift + Click: Range selection
      handleRangeSelection(document, event);
    } else {
      // Regular click: Single selection or open document
      if (bulkMode) {
        onDocumentSelect(document.id, !isSelected, event);
      } else {
        onDocumentClick(document);
      }
    }
  };

  // Handle range selection with Shift+Click
  const handleRangeSelection = (endDocument: Document, event: React.MouseEvent) => {
    if (!onDocumentSelect) return;
    
    // Get all visible documents in current folder
    const folderData = documentsByDepartment.find(d => {
      if (!selectedFolder) return false;
      return d.department.id === selectedFolder.id || d.department.path === selectedFolder.path;
    });
    
    const visibleDocuments = folderData?.documents || [];
    if (visibleDocuments.length === 0) return;
    
    // Find the last selected document
    const selectedIds = Array.from(selectedDocuments);
    const lastSelectedId = selectedIds[selectedIds.length - 1];
    const lastSelectedDoc = visibleDocuments.find(doc => doc.id === lastSelectedId);
    
    if (!lastSelectedDoc) {
      // No previous selection, just select this document
      onDocumentSelect(endDocument.id, true, event);
      return;
    }
    
    // Find indices of start and end documents
    const startIndex = visibleDocuments.findIndex(doc => doc.id === lastSelectedDoc.id);
    const endIndex = visibleDocuments.findIndex(doc => doc.id === endDocument.id);
    
    if (startIndex === -1 || endIndex === -1) return;
    
    // Select range
    const start = Math.min(startIndex, endIndex);
    const end = Math.max(startIndex, endIndex);
    
    for (let i = start; i <= end; i++) {
      onDocumentSelect(visibleDocuments[i].id, true, event);
    }
  };

  // Handle Ctrl+A / Cmd+A for select all
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'a' && onSelectAll) {
      event.preventDefault();
      
      // Get all visible documents in current folder
      const folderData = documentsByDepartment.find(d => {
        if (!selectedFolder) return false;
        return d.department.id === selectedFolder.id || d.department.path === selectedFolder.path;
      });
      
      const visibleDocuments = folderData?.documents || [];
      onSelectAll(visibleDocuments);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (event: React.DragEvent, folderId?: string) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Only allow admin users to upload
    if (userRole !== 'admin') return;
    
    setIsDragging(true);
    if (folderId) {
      setDragOverFolder(folderId);
    }
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Check if we're leaving the drop zone entirely
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragging(false);
      setDragOverFolder(null);
    }
  };

  const handleDrop = (event: React.DragEvent, targetFolder?: Department) => {
    event.preventDefault();
    event.stopPropagation();
    
    setIsDragging(false);
    setDragOverFolder(null);
    
    // Only allow admin users to upload
    if (userRole !== 'admin') return;
    
    const files = Array.from(event.dataTransfer.files);
    if (files.length === 0) return;
    
    // Determine target folder - use provided folder or current selected folder
    const uploadFolder = targetFolder || selectedFolder;
    const folderName = uploadFolder ? uploadFolder.name : 'Main';
    
    console.log(`Uploading ${files.length} files to folder: ${folderName}`, files);
    
    // Here you would typically handle the actual file upload
    // For now, we'll show a confirmation and trigger the upload modal
    const fileNames = files.map(f => f.name).join(', ');
    alert(`Ready to upload ${files.length} file(s) to "${folderName}" folder:\n${fileNames}\n\nThis would typically trigger the upload process.`);
    
    // Optionally trigger the upload modal with pre-selected folder
    if (onUploadClick) {
      onUploadClick();
    }
  };

  const handleGlobalDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleGlobalDrop = (event: React.DragEvent) => {
    event.preventDefault();
    handleDrop(event);
  };
  const [sortField, setSortField] = useState<'name' | 'date' | 'type' | 'status'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showTree, setShowTree] = useState(viewMode === 'tree');
  const [currentViewMode, setCurrentViewMode] = useState<'list' | 'grid'>(
    viewMode === 'tree' ? 'grid' : viewMode as 'list' | 'grid'
  );
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [selectedDocumentForNotification, setSelectedDocumentForNotification] = useState<Document | null>(null);
  const [dragOverFolder, setDragOverFolder] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleNotifyDocument = (document: Document) => {
    setSelectedDocumentForNotification(document);
    setShowNotificationModal(true);
  };

  const handleUpdateDocumentSecurity = (document: Document, securityLevel: 'Public' | 'Confidential' | 'Highly Confidential') => {
    console.log(`Updating security level for "${document.title}" to: ${securityLevel}`);
    alert(`Security level for "${document.title}" updated to: ${securityLevel}`);
    // In a real app, this would update the document in the backend
  };

  const handleSendNotification = (recipients: any[], notes?: string) => {
    console.log('Sending notification for document:', selectedDocumentForNotification?.title);
    console.log('Recipients:', recipients);
    console.log('Notes:', notes);
    
    // Here you would integrate with your notification system
    alert(`Notification sent to ${recipients.length} recipient(s) for "${selectedDocumentForNotification?.title}"`);
    
    setShowNotificationModal(false);
    setSelectedDocumentForNotification(null);
  };

  const handleSort = (field: 'name' | 'date' | 'type' | 'status') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortDocuments = (documents: any[]) => {
    return [...documents].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortField) {
        case 'name':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'date':
          aValue = new Date(a.uploadedAt).getTime();
          bValue = new Date(b.uploadedAt).getTime();
          break;
        case 'type':
          aValue = a.fileType.toLowerCase();
          bValue = b.fileType.toLowerCase();
          break;
        case 'status':
          aValue = a.approvalStatus.toLowerCase();
          bValue = b.approvalStatus.toLowerCase();
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const getVirtualDepartmentDocuments = (deptId: string) => {
    const allDocs = documentsByDepartment.flatMap(d => d.documents);
    
    if (deptId === 'recent-visited') {
      // Return the 10 most recently uploaded documents
      return allDocs
        .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
        .slice(0, 10);
    } else if (deptId === 'recent-approvals') {
      // Return recently approved documents (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      return allDocs
        .filter(doc => 
          doc.approvalStatus === 'approved' && 
          doc.approvedAt && 
          new Date(doc.approvedAt) >= thirtyDaysAgo
        )
        .sort((a, b) => new Date(b.approvedAt!).getTime() - new Date(a.approvedAt!).getTime());
    } else if (deptId === 'pending-approvals') {
      // Return all pending documents
      return allDocs.filter(doc => doc.approvalStatus === 'pending');
    }
    
    return [];
  };

  const handleCreateFolder = (data: { name: string; color: string; restrictions: string[] }) => {
    console.log('Creating folder:', data);
    alert(`Folder "${data.name}" created with color ${data.color} and restrictions: ${data.restrictions.join(', ') || 'None'}`);
  };

  return (
    <>
      <div className="h-full flex min-h-0">
      {/* Left Panel - Tree Explorer (conditionally shown) */}
      {showTree && (
        <div className="w-80 h-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-l-lg flex flex-col min-h-0">
          <TreeExplorer
            departments={departments}
            documentsByDepartment={documentsByDepartment}
            onFolderClick={handleFolderClick}
            onDocumentClick={onDocumentClick}
            selectedFolder={selectedFolder?.id}
            userRole={userRole}
          />
        </div>
      )}

      {/* Right Panel - Current Folder Contents */}
      <div className="flex-1 h-full min-h-0">
        <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 h-full flex flex-col min-h-0 ${showTree ? 'rounded-r-lg border-l-0' : 'rounded-lg'}`}>
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                {/* Breadcrumb with home navigation */}
                <div className="flex items-center space-x-2 text-sm">
                  {/* Home/Main button */}
                    <button
                    onClick={() => navigateToBreadcrumb(null)}
                    className={`flex items-center space-x-1 transition-colors duration-200 ${
                      !selectedFolder 
                        ? 'text-gray-700 dark:text-gray-300 font-medium' 
                        : 'text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400'
                    }`}
                      title="Go to Main Folders"
                    >
                      <Home className="w-3 h-3" />
                      <span>Main</span>
                    </button>
                  
                  {selectedFolder && (
                    <>
                      <span className="text-gray-400">/</span>
                      <div className="flex items-center space-x-2">
                        {/* Show intermediate path segments as clickable links */}
                        {buildBreadcrumbPath(selectedFolder).map((breadcrumb, idx, arr) => (
                          <React.Fragment key={idx}>
                            <button
                              onClick={() => navigateToBreadcrumb(breadcrumb.department)}
                              className={`capitalize transition-colors duration-200 ${
                                breadcrumb.department?.id === selectedFolder.id
                                  ? 'text-gray-700 dark:text-gray-300 font-medium cursor-default'
                                  : 'text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400'
                              }`}
                              disabled={breadcrumb.department?.id === selectedFolder.id}
                              title={breadcrumb.department?.id === selectedFolder.id ? 'Current folder' : `Navigate to ${breadcrumb.name}`}
                            >
                              {breadcrumb.name}
                            </button>
                            {idx < arr.length - 1 && <span className="text-gray-400">/</span>}
                          </React.Fragment>
                        ))}
                        
                        {/* Show current folder name if it's not already in the path */}
                        {selectedFolder.path && !selectedFolder.path.includes(selectedFolder.name) && (
                          <>
                            <span className="text-gray-400">/</span>
                            <span className="capitalize text-gray-700 dark:text-gray-300 font-medium">
                              {selectedFolder.name}
                            </span>
                          </>
                        )}
                      </div>
                    </>
                  )}
                  
                  {!selectedFolder && showTree && (
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Select a folder
                    </span>
                  )}
                </div>
                
                {/* Document counter */}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {selectedFolder ? (
                    (() => {
                      const folderData = documentsByDepartment.find(d => d.department.id === selectedFolder.id);
                      const docCount = folderData?.documents.length || 0;
                      const subfolderCount = selectedFolder.children?.length || 0;
                      return `${docCount} documents${subfolderCount > 0 ? ` • ${subfolderCount} subfolders` : ''}`;
                    })()
                  ) : (
                    `${departments.length} main folders • ${documentsByDepartment.reduce((total, d) => total + d.documents.length, 0)} total documents`
                  )}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                {/* Layout Toggles - List/Grid group + Tree toggle */}
                <div className="flex items-center space-x-2">

                  {/* Tree Toggle */}
                  <button
                    onClick={() => setShowTree(!showTree)}
                    className={`p-2 rounded-md transition-colors duration-200 border ${
                      showTree
                        ? 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                    title={showTree ? 'Hide Tree' : 'Show Tree'}
                  >
                    <Search className="w-4 h-4" />
                  </button>

                  {/* List/Grid Toggle Group */}
                  <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                    <button
                      onClick={() => setCurrentViewMode('grid')}
                      className={`p-2 rounded-md transition-colors duration-200 ${
                        currentViewMode === 'grid'
                          ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                      title="Grid View"
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCurrentViewMode('list')}
                      className={`p-2 rounded-md transition-colors duration-200 ${
                        currentViewMode === 'list'
                          ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                      title="List View"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                  
                </div>
                
                {/* Action Buttons - Only for admin users */}
                {userRole === 'admin' && !bulkMode && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={onUploadClick}
                      className="flex items-center space-x-2 px-4 py-2 border border-gray-400 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Upload New</span>
                    </button>
                    <button
                      onClick={() => setShowNewFolderModal(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-700 dark:bg-gray-600 hover:bg-gray-800 dark:hover:bg-gray-500 text-white rounded-lg transition-colors duration-200"
                    >
                      <Plus className="w-4 h-4" />
                      <span>New Folder</span>
                    </button>
                  </div>
                )}

                {/* Bulk Actions Toolbar */}
                {bulkMode && selectedDocuments.size > 0 && userRole === 'admin' && onBulkAction && (
                  <div className="flex items-center space-x-2 bg-primary-50 dark:bg-primary-900/20 px-4 py-2 rounded-lg border border-primary-200 dark:border-primary-700">
                    <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                      {selectedDocuments.size} selected
                    </span>
                    <div className="h-4 w-px bg-primary-300 dark:bg-primary-600" />
                    <button
                      onClick={() => onBulkAction('approve', Array.from(selectedDocuments))}
                      className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-white/10 rounded transition-colors"
                      title="Approve selected documents"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => onBulkAction('publish', Array.from(selectedDocuments))}
                      className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-white/10 rounded transition-colors"
                      title="Publish selected documents"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Publish</span>
                    </button>
                    <button
                      onClick={() => onBulkAction('notify', Array.from(selectedDocuments))}
                      className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-white/10 rounded transition-colors"
                      title="Notify users about selected documents"
                    >
                      <Bell className="w-4 h-4" />
                      <span>Notify</span>
                    </button>
                    <button
                      onClick={() => onBulkAction('delete', Array.from(selectedDocuments))}
                      className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-white/10 rounded transition-colors"
                      title="Delete selected documents"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                    <div className="h-4 w-px bg-primary-300 dark:bg-primary-600" />
                    <button
                      onClick={onDeselectAll}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                      title="Clear selection"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

            {/* Content */}
            <div 
              className={`flex-1 p-4 overflow-auto relative ${
                isDragging ? 'bg-primary-50 dark:bg-primary-900/20 border-2 border-dashed border-primary-300 dark:border-primary-600' : ''
              }`}
              onKeyDown={handleKeyDown}
              onDragOver={handleGlobalDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleGlobalDrop}
              tabIndex={0}
            >
              {/* Drag Overlay */}
              {isDragging && userRole === 'admin' && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-primary-100/80 dark:bg-primary-900/80 backdrop-blur-sm">
                  <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-primary-300 dark:border-primary-600">
                    <UploadCloud className="w-16 h-16 text-primary-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Drop files to upload
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedFolder ? `Upload to "${selectedFolder.name}" folder` : 'Upload to selected folder or main directory'}
                    </p>
                  </div>
                </div>
              )}
              {selectedFolder ? (
                <div>
                  {/* Subfolders */}
                  {selectedFolder.children && selectedFolder.children.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Folders</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {selectedFolder.children.map((child) => (
                          <FolderItem
                            key={child.id}
                            department={child}
                            documentCount={child.documentCount}
                            onClick={() => handleFolderClick(child)}
                            viewMode="grid"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Documents */}
                  {(() => {
                    let documents = [];
                    
                    // Check if this is a virtual department
                    if (selectedFolder.id === 'recent-visited' || selectedFolder.id === 'pending-approvals') {
                      documents = getVirtualDepartmentDocuments(selectedFolder.id);
                    } else {
                      // Find documents that belong to this folder or its children
                      const folderData = documentsByDepartment.find(d => {
                        // Direct match by ID
                        if (d.department.id === selectedFolder.id) return true;
                        // Match by path
                        if (d.department.path === selectedFolder.path) return true;
                        return false;
                      });
                      
                      // Also include documents from child folders if any
                      const allFolderDocs = documentsByDepartment
                        .filter(d => {
                          if (selectedFolder.path && d.department.path) {
                            return d.department.path.startsWith(selectedFolder.path + '/') || 
                                   d.department.path === selectedFolder.path;
                          }
                          return false;
                        })
                        .flatMap(d => d.documents);
                      
                      documents = folderData?.documents || allFolderDocs;
                    }
                    
                    if (documents.length > 0) {
                      const sortedDocuments = sortDocuments(documents);
                      
                      return (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Documents</h4>
                          
                          {currentViewMode === 'list' ? (
                            // Table View
                            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                              <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                  <tr>
                                    <th className="px-4 py-3 text-left">
                                      <button
                                        onClick={() => handleSort('name')}
                                        className="flex items-center space-x-1 text-xs font-medium text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
                                      >
                                        <span>Name</span>
                                        {sortField === 'name' ? (
                                          sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                        ) : (
                                          <ArrowUpDown className="w-3 h-3" />
                                        )}
                                      </button>
                                    </th>
                                    <th className="px-4 py-3 text-left">
                                      <button
                                        onClick={() => handleSort('type')}
                                        className="flex items-center space-x-1 text-xs font-medium text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
                                      >
                                        <span>Type</span>
                                        {sortField === 'type' ? (
                                          sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                        ) : (
                                          <ArrowUpDown className="w-3 h-3" />
                                        )}
                                      </button>
                                    </th>
                                    <th className="px-4 py-3 text-left">
                                      <button
                                        onClick={() => handleSort('date')}
                                        className="flex items-center space-x-1 text-xs font-medium text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
                                      >
                                        <span>Date</span>
                                        {sortField === 'date' ? (
                                          sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                        ) : (
                                          <ArrowUpDown className="w-3 h-3" />
                                        )}
                                      </button>
                                    </th>
                                    <th className="px-4 py-3 text-left">
                                      <button
                                        onClick={() => handleSort('status')}
                                        className="flex items-center space-x-1 text-xs font-medium text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
                                      >
                                        <span>Status</span>
                                        {sortField === 'status' ? (
                                          sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                        ) : (
                                          <ArrowUpDown className="w-3 h-3" />
                                        )}
                                      </button>
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                  {sortedDocuments.map((document) => {
                                    const isSelected = selectedDocuments.has(document.id);
                                    return (
                                    <tr
                                      key={document.id}
                                      className={`cursor-pointer transition-colors duration-200 group ${
                                        isSelected 
                                          ? 'bg-primary-50 dark:bg-primary-900/30' 
                                          : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                                      }`}
                                      onClick={(e) => handleDocumentSelection(document, e)}
                                    >
                                      <td className="px-4 py-3">
                                        <div className="flex items-center space-x-3">
                                          {userRole === 'admin' && (
                                            <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-opacity duration-200 ${
                                              isSelected 
                                                ? 'bg-primary-500 border-primary-500 opacity-100' 
                                                : 'border-gray-300 dark:border-gray-600 opacity-0 group-hover:opacity-100'
                                            }`}>
                                              {isSelected && (
                                                <CheckCircle className="w-3 h-3 text-white" />
                                              )}
                                            </div>
                                          )}
                                          {getFileIcon(document.fileType)}
                                          <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                            {document.title}
                                          </span>
                                          {/* Security Shield Icon */}
                                          {document.securityLevel && document.securityLevel !== 'Public' && (
                                            <div className="flex items-center ml-2">
                                              <Shield className={`w-4 h-4 ${
                                                document.securityLevel === 'Highly Confidential' 
                                                  ? 'text-red-500 dark:text-red-400' 
                                                  : 'text-amber-500 dark:text-amber-400'
                                              }`} />
                                            </div>
                                          )}
                                        </div>
                                      </td>
                                      <td className="px-4 py-3">
                                        <span className="text-sm text-gray-600 dark:text-gray-300 uppercase">
                                          {document.fileType}
                                        </span>
                                      </td>
                                      <td className="px-4 py-3">
                                        <span className="text-sm text-gray-600 dark:text-gray-300">
                                          {formatDate(document.uploadedAt)}
                                        </span>
                                      </td>
                                      <td className="px-4 py-3">
                                        <div className="flex flex-col space-y-1">
                                          <div className={`inline-flex px-2 py-1 rounded-full text-xs ${
                                            document.approvalStatus === 'approved' 
                                              ? 'text-green-800 dark:text-green-200'
                                              : document.approvalStatus === 'pending'
                                              ? 'text-yellow-800 dark:text-yellow-200'
                                              : 'text-red-800 dark:text-red-200'
                                          }`}>
                                            {document.approvalStatus}
                                          </div>
                                          {document.publishStatus && (
                                            <div className={`inline-flex px-2 py-1 rounded-full text-xs ${
                                              document.publishStatus === 'published'
                                                ? 'text-blue-800 dark:text-blue-200'
                                                : document.publishStatus === 'archived'
                                                ? 'text-gray-800 dark:text-gray-200'
                                                : 'text-orange-800 dark:text-orange-200'
                                            }`}>
                                              {document.publishStatus}
                                            </div>
                                          )}
                                        </div>
                                      </td>
                                    </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            // Grid View - Card style with large icons
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                              {sortedDocuments.map((document) => {
                                const isSelected = selectedDocuments.has(document.id);
                                return (
                                <div
                                  key={document.id}
                                  className={`relative rounded-lg p-4 cursor-pointer transition-all duration-200 group ${
                                    isSelected 
                                      ? 'bg-primary-50 dark:bg-primary-900/30 border-2 border-primary-300 dark:border-primary-600 shadow-md' 
                                      : 'bg-white dark:bg-gray-800 hover:border-2 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600'
                                  }`}
                                  onClick={(e) => handleDocumentSelection(document, e)}
                                >
                                  {/* Selection indicator - show on hover or when selected */}
                                  {userRole === 'admin' && (
                                    <div className={`absolute top-2 left-2 z-10 transition-opacity duration-200 ${
                                      isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                    }`}>
                                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                                        isSelected 
                                          ? 'bg-primary-500 border-primary-500' 
                                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 group-hover:border-primary-400'
                                      }`}>
                                        {isSelected && (
                                          <CheckCircle className="w-3 h-3 text-white" />
                                        )}
                                      </div>
                                    </div>
                                  )}
                                  <div className="flex flex-col items-center text-center space-y-3">
                                    {/* Large document icon */}
                                    <div className="relative">
                                      {/* Security Shield Icon - Bottom Left */}
                                    {document.securityLevel && document.securityLevel !== 'Public' && (
                                      <div className="absolute bottom-1 -left-0 z-20">
                                        <Shield className={`w-4 h-4 stroke-3 bg-white dark:bg-gray-800 rounded-full ${
                                          document.securityLevel === 'Highly Confidential' 
                                            ? 'text-red-600 dark:text-red-400' 
                                            : 'text-amber-600 dark:text-amber-400'
                                        }`} />
                                      </div>
                                    )}
                                      {getFileIcon(document.fileType, "stroke-1 w-12 h-12")}
                                      {/* Status indicators */}
                                      {document.approvalStatus === 'pending' && (
                                        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 bg-amber-500" />
                                      )}
                                      {document.publishStatus === 'published' && (
                                        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 bg-blue-500" />
                                      )}
                                    </div>

                                    
                                    
                                    {/* Document info */}
                                    <div className="w-full">
                                      <h5 className="text-sm font-medium text-gray-900 dark:text-white truncate mb-1" title={document.title}>
                                        {document.title}
                                      </h5>
                                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                                        {document.fileType}
                                      </p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {new Date(document.uploadedAt).toLocaleDateString()}
                                      </p>
                                    </div>

                                  </div>

                                  {/* 3-dot dropdown menu for documents */}
                                  <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                                        <DropdownMenu
                                          position="top-right"
                                          className="bg-white dark:bg-gray-800 rounded-sm"
                                          buttonClassName="py-1 px-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full"
                                          items={[
                                            {
                                              id: 'edit',
                                              label: 'Edit',
                                              icon: Edit3,
                                              onClick: () => {
                                                console.log('Editing document:', document.title);
                                                alert(`Editing "${document.title}"`);
                                              }
                                            },
                                            {
                                              id: 'download',
                                              label: 'Download',
                                              icon: Download,
                                              onClick: () => {
                                                console.log('Downloading document:', document.title);
                                                alert(`Downloading "${document.title}"`);
                                              }
                                            },
                                            {
                                              id: 'share',
                                              label: 'Share',
                                              icon: Share2,
                                              onClick: () => {
                                                console.log('Sharing document:', document.title);
                                                alert(`Sharing "${document.title}"`);
                                              }
                                            },
                                            {
                                              id: 'copy',
                                              label: 'Copy Link',
                                              icon: Copy,
                                              onClick: () => {
                                                console.log('Copying link for:', document.title);
                                                alert(`Link copied for "${document.title}"`);
                                              }
                                            },
                                            ...(userRole === 'admin' ? [
                                              {
                                                id: 'mark-security',
                                                label: 'Mark As',
                                                icon: Shield,
                                                divider: true,
                                                submenu: [
                                                  {
                                                    id: 'security-public',
                                                    label: 'Public',
                                                    onClick: () => handleUpdateDocumentSecurity(document, 'Public')
                                                  },
                                                  {
                                                    id: 'security-confidential',
                                                    label: 'Confidential',
                                                    onClick: () => handleUpdateDocumentSecurity(document, 'Confidential')
                                                  },
                                                  {
                                                    id: 'security-highly-confidential',
                                                    label: 'Highly Confidential',
                                                    onClick: () => handleUpdateDocumentSecurity(document, 'Highly Confidential')
                                                  }
                                                ]
                                              },
                                              {
                                                id: 'notify',
                                                label: 'Send Notification',
                                                icon: Bell,
                                                divider: true,
                                                onClick: () => handleNotifyDocument(document)
                                              }
                                            ] : []),
                                            {
                                              id: 'delete',
                                              label: 'Delete',
                                              icon: Trash2,
                                              destructive: true,
                                              divider: true,
                                              onClick: () => {
                                                if (confirm(`Are you sure you want to delete "${document.title}"?`)) {
                                                  console.log('Deleting document:', document.title);
                                                  alert(`Document "${document.title}" deleted`);
                                                }
                                              }
                                            }
                                          ]}
                                        />
                                      </div>
                                </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    }
                    
                    return (
                      <div className="text-center py-12">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">No documents in this folder</p>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                // Default folder view when no folder selected
                <div>
                  {/* Show all departments as default */}
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Main Folders</h4>
                  {currentViewMode === 'grid' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                      {departments.map((department) => {
                        const departmentData = documentsByDepartment.find(d => d.department.id === department.id);
                        const documentCount = departmentData?.documents.length || 0;

                        return (
                          <FolderItem
                            key={department.id}
                            department={department}
                            documentCount={documentCount}
                            onClick={() => handleFolderClick(department)}
                            viewMode="grid"
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            isDragOver={dragOverFolder === department.id}
                            userRole={userRole}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    // List view for folders
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Documents</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Subfolders</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {departments.map((department) => {
                            const departmentData = documentsByDepartment.find(d => d.department.id === department.id);
                            const documentCount = departmentData?.documents.length || 0;
                            const subfolderCount = department.children?.length || 0;

                            return (
                              <tr
                                key={department.id}
                                className={`hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200 ${
                                  dragOverFolder === department.id && userRole === 'admin' ? 'bg-primary-50 dark:bg-primary-900/30' : ''
                                }`}
                                onClick={() => handleFolderClick(department)}
                                onDragOver={(e) => handleDragOver(e, department.id)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, department)}
                              >
                                <td className="px-4 py-3">
                                  <div className="flex items-center space-x-3">
                                    <div className="relative">
                                      <Folder className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                      <div 
                                        className="absolute -top-0.5 -left-0.5 w-2 h-2 rounded-full border border-white dark:border-gray-800"
                                        style={{ backgroundColor: department.color }}
                                      />
                                    </div>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                      {department.name}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <span className="text-sm text-gray-600 dark:text-gray-300">
                                    {documentCount}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  <span className="text-sm text-gray-600 dark:text-gray-300">
                                    {subfolderCount}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* New Folder Modal */}
      <NewFolderModal
        isOpen={showNewFolderModal}
        onClose={() => setShowNewFolderModal(false)}
        onCreate={handleCreateFolder}
      />

      {/* Notification Modal */}
      <NotificationModal
        isOpen={showNotificationModal}
        onClose={() => {
          setShowNotificationModal(false);
          setSelectedDocumentForNotification(null);
        }}
        onSend={handleSendNotification}
        document={selectedDocumentForNotification}
      />
    </>
  );
}
