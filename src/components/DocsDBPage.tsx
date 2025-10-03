import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Eye, 
  FileText,
  User,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  CheckCircle,
  Clock,
  AlertCircle,
  File,
  FileSpreadsheet,
  Archive,
  Trash2,
  Edit,
  Shield,
  Check,
  X
} from 'lucide-react';
import DocumentPreviewModal from './DocumentPreviewModal';
import DocumentEditModal from './DocumentEditModal';

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
}

interface DocsDBPageProps {
  onBack: () => void;
}

export default function DocsDBPage({ onBack }: DocsDBPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedSecurity, setSelectedSecurity] = useState('All');
  const [selectedFileExtension, setSelectedFileExtension] = useState('All');
  const [sortBy, setSortBy] = useState('uploadedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [expandedFilters, setExpandedFilters] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set());
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [bulkActionType, setBulkActionType] = useState<'approve' | 'reject' | 'archive' | 'delete' | 'security' | null>(null);

  // Mock data for documents
  const documents: Document[] = [
    {
      id: '1',
      title: 'Q3 Financial Report.pdf',
      type: 'Financial Report',
      department: 'Finance',
      uploadedBy: 'Sarah Johnson',
      uploadedAt: '2024-01-15T14:00:00Z',
      fileSize: '2.4 MB',
      status: 'approved',
      tags: ['Finance', 'Q3', 'Report'],
      collaborators: [
        { id: '1', name: 'Sarah Johnson', initials: 'SJ' },
        { id: '2', name: 'Mike Chen', initials: 'MC' },
        { id: '3', name: 'Emma Wilson', initials: 'EW' }
      ],
      fileExtension: 'PDF',
      isLocked: true,
      securityLevel: 'confidential'
    },
    {
      id: '2',
      title: 'Budget Analysis 2024.xlsx',
      type: 'Budget Analysis',
      department: 'Finance',
      uploadedBy: 'Mike Chen',
      uploadedAt: '2024-01-14T10:30:00Z',
      fileSize: '1.2 MB',
      status: 'approved',
      tags: ['Budget', 'Analysis', '2024'],
      collaborators: [
        { id: '2', name: 'Mike Chen', initials: 'MC' }
      ],
      fileExtension: 'Excel',
      securityLevel: 'confidential'
    },
    {
      id: '3',
      title: 'Expense Report Template.docx',
      type: 'Template',
      department: 'HR',
      uploadedBy: 'Lisa Davis',
      uploadedAt: '2024-01-13T16:45:00Z',
      fileSize: '0.5 MB',
      status: 'approved',
      tags: ['Template', 'Expense', 'Report'],
      collaborators: [
        { id: '4', name: 'Lisa Davis', initials: 'LD' },
        { id: '5', name: 'HR Manager', initials: 'HM' }
      ],
      fileExtension: 'Word',
      isPublic: true,
      securityLevel: 'public'
    },
    {
      id: '4',
      title: 'Project Proposal - Ruya 2.0.pptx',
      type: 'Project Proposal',
      department: 'Engineering',
      uploadedBy: 'David Wilson',
      uploadedAt: '2024-01-12T09:15:00Z',
      fileSize: '1.8 MB',
      status: 'revision',
      tags: ['Project', 'Proposal', 'Ruya'],
      collaborators: [
        { id: '6', name: 'David Wilson', initials: 'DW' },
        { id: '7', name: 'Engineering Lead', initials: 'EL' }
      ],
      fileExtension: 'PowerPoint'
    },
    {
      id: '5',
      title: 'API Documentation.md',
      type: 'Documentation',
      department: 'Engineering',
      uploadedBy: 'Alex Rodriguez',
      uploadedAt: '2024-01-11T11:20:00Z',
      fileSize: '0.8 MB',
      status: 'approved',
      tags: ['API', 'Documentation', 'Technical'],
      collaborators: [
        { id: '8', name: 'Alex Rodriguez', initials: 'AR' }
      ],
      fileExtension: 'Markdown'
    },
    {
      id: '6',
      title: 'Database Schema.sql',
      type: 'Database Schema',
      department: 'Engineering',
      uploadedBy: 'Sarah Johnson',
      uploadedAt: '2024-01-10T13:30:00Z',
      fileSize: '0.6 MB',
      status: 'approved',
      tags: ['Database', 'Schema', 'SQL'],
      collaborators: [
        { id: '1', name: 'Sarah Johnson', initials: 'SJ' },
        { id: '8', name: 'Alex Rodriguez', initials: 'AR' }
      ],
      fileExtension: 'SQL'
    },
    {
      id: '7',
      title: 'Employee Handbook 2024.docx',
      type: 'Employee Handbook',
      department: 'HR',
      uploadedBy: 'Lisa Davis',
      uploadedAt: '2024-01-09T08:45:00Z',
      fileSize: '5.2 MB',
      status: 'pending',
      tags: ['Employee', 'Handbook', '2024'],
      collaborators: [
        { id: '4', name: 'Lisa Davis', initials: 'LD' },
        { id: '5', name: 'HR Manager', initials: 'HM' },
        { id: '9', name: 'Legal Team', initials: 'LT' }
      ],
      fileExtension: 'Word'
    },
    {
      id: '8',
      title: 'Company Logo Guidelines.pdf',
      type: 'Brand Guidelines',
      department: 'Marketing',
      uploadedBy: 'Emma Brown',
      uploadedAt: '2024-01-08T15:00:00Z',
      fileSize: '0.3 MB',
      status: 'approved',
      tags: ['Brand', 'Logo', 'Guidelines'],
      collaborators: [
        { id: '10', name: 'Emma Brown', initials: 'EB' }
      ],
      fileExtension: 'PDF'
    },
    {
      id: '9',
      title: 'Meeting Notes - All Hands.md',
      type: 'Meeting Notes',
      department: 'Operations',
      uploadedBy: 'John Smith',
      uploadedAt: '2024-01-07T12:00:00Z',
      fileSize: '0.4 MB',
      status: 'approved',
      tags: ['Meeting', 'Notes', 'All Hands'],
      collaborators: [
        { id: '11', name: 'John Smith', initials: 'JS' }
      ],
      fileExtension: 'Markdown'
    }
  ];

  // Filter and sort documents
  const filteredDocuments = useMemo(() => {
    let filtered = documents.filter(doc => {
      const matchesSearch = !searchQuery || 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType = selectedType === 'All' || doc.type === selectedType;
      const matchesDepartment = selectedDepartment === 'All' || doc.department === selectedDepartment;
      const matchesStatus = selectedStatus === 'All' || doc.status === selectedStatus;
      const matchesSecurity = selectedSecurity === 'All' || doc.securityLevel === selectedSecurity || (selectedSecurity === 'internal' && !doc.securityLevel);
      const matchesFileExtension = selectedFileExtension === 'All' || doc.fileExtension.toLowerCase() === selectedFileExtension.toLowerCase();

      return matchesSearch && matchesType && matchesDepartment && matchesStatus && matchesSecurity && matchesFileExtension;
    });

    // Sort documents
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        case 'department':
          comparison = a.department.localeCompare(b.department);
          break;
        case 'uploadedAt':
          comparison = new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [searchQuery, selectedType, selectedDepartment, selectedStatus, selectedSecurity, selectedFileExtension, sortBy, sortOrder]);

  const handleDocumentClick = (document: Document) => {
    setSelectedDocument(document);
    setPreviewModalOpen(true);
  };


  const handleView = (document: Document, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDocument(document);
    setPreviewModalOpen(true);
  };

  const handleEdit = (document: Document, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingDocument(document);
    setEditModalOpen(true);
  };

  const handleSaveDocument = (updatedDocument: Document) => {
    console.log('Document updated:', updatedDocument);
    // Here you would typically update the document in your backend/database
    // For now, we'll just log the changes
    setEditModalOpen(false);
    setEditingDocument(null);
  };

  const handleDocumentSelect = (documentId: string, selected: boolean) => {
    setSelectedDocuments(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(documentId);
      } else {
        newSet.delete(documentId);
      }
      setShowBulkActions(newSet.size > 0);
      return newSet;
    });
  };

  const handleSelectAll = () => {
    const allIds = new Set(filteredDocuments.map(doc => doc.id));
    setSelectedDocuments(allIds);
    setShowBulkActions(allIds.size > 0);
  };

  const handleDeselectAll = () => {
    setSelectedDocuments(new Set());
    setShowBulkActions(false);
    setBulkActionType(null);
  };

  const handleBulkAction = (actionType: 'approve' | 'reject' | 'archive' | 'delete' | 'security') => {
    setBulkActionType(actionType);
    console.log(`Bulk ${actionType} action on documents:`, Array.from(selectedDocuments));
    
    // Here you would implement the actual bulk operation
    // For now, we'll just show a confirmation
    const actionMessages = {
      approve: 'Approve selected documents',
      reject: 'Reject selected documents', 
      archive: 'Archive selected documents',
      delete: 'Delete selected documents',
      security: 'Update security level of selected documents'
    };
    
    alert(`${actionMessages[actionType]} (${selectedDocuments.size} documents)`);
    
    // Reset after action
    setTimeout(() => {
      setBulkActionType(null);
    }, 1000);
  };

  const getSecurityLevelColor = (level?: string) => {
    switch (level) {
      case 'public':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'internal':
        return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30';
      case 'confidential':
        return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30';
      case 'restricted':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getFileIcon = (extension: string) => {
    switch (extension.toLowerCase()) {
      case 'pdf':
        return <FileText className="w-4 h-4 text-gray-500" />;
      case 'excel':
      case 'xlsx':
        return <FileSpreadsheet className="w-4 h-4 text-gray-500" />;
      case 'word':
      case 'docx':
        return <FileText className="w-4 h-4 text-gray-500" />;
      case 'powerpoint':
      case 'pptx':
        return <FileText className="w-4 h-4 text-gray-500" />;
      case 'markdown':
      case 'md':
        return <FileText className="w-4 h-4 text-gray-500" />;
      case 'sql':
        return <FileText className="w-4 h-4 text-gray-500" />;
      default:
        return <File className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'revision':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
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
        return <File className="w-3 h-3" />;
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInHours < 168) { // 7 days
      const days = Math.floor(diffInHours / 24);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      const weeks = Math.floor(diffInHours / 168);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
      {/* Header */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={onBack}
              className="glass-button-icon"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-4 h-4" />
            </motion.button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                ISO Documentation Database
              </h1>
            </div>
          </div>
          
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by title, type, department, author, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="glass-input pl-10 w-full"
                />
              </div>
              
              <motion.button
                onClick={() => setExpandedFilters(!expandedFilters)}
                className="flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Advanced Filters</span>
                {expandedFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </motion.button>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <span>{filteredDocuments.length} documents found</span>
            </div>
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {expandedFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="glass-panel rounded-lg p-6"
              >
                <div className="space-y-6">
                  {/* Filter Row 1 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Document Type
                      </label>
                      <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="glass-select w-full"
                      >
                        <option value="All">All Types</option>
                        <option value="Financial Report">Financial Report</option>
                        <option value="Budget Analysis">Budget Analysis</option>
                        <option value="Template">Template</option>
                        <option value="Project Proposal">Project Proposal</option>
                        <option value="Documentation">Documentation</option>
                        <option value="Database Schema">Database Schema</option>
                        <option value="Employee Handbook">Employee Handbook</option>
                        <option value="Brand Guidelines">Brand Guidelines</option>
                        <option value="Meeting Notes">Meeting Notes</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Department
                      </label>
                      <select
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        className="glass-select w-full"
                      >
                        <option value="All">All Departments</option>
                        <option value="Finance">Finance</option>
                        <option value="HR">HR</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Operations">Operations</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Status
                      </label>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="glass-select w-full"
                      >
                        <option value="All">All Status</option>
                        <option value="approved">Approved</option>
                        <option value="pending">Pending</option>
                        <option value="revision">Revision</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>

                  {/* Filter Row 2 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Security Level
                      </label>
                      <select
                        value={selectedSecurity}
                        onChange={(e) => setSelectedSecurity(e.target.value)}
                        className="glass-select w-full"
                      >
                        <option value="All">All Security Levels</option>
                        <option value="public">Public</option>
                        <option value="internal">Internal</option>
                        <option value="confidential">Confidential</option>
                        <option value="restricted">Restricted</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        File Type
                      </label>
                      <select
                        value={selectedFileExtension}
                        onChange={(e) => setSelectedFileExtension(e.target.value)}
                        className="glass-select w-full"
                      >
                        <option value="All">All File Types</option>
                        <option value="PDF">PDF</option>
                        <option value="Excel">Excel</option>
                        <option value="Word">Word</option>
                        <option value="PowerPoint">PowerPoint</option>
                        <option value="Markdown">Markdown</option>
                        <option value="SQL">SQL</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Sort By
                      </label>
                      <select
                        value={`${sortBy}-${sortOrder}`}
                        onChange={(e) => {
                          const [field, order] = e.target.value.split('-');
                          setSortBy(field);
                          setSortOrder(order as 'asc' | 'desc');
                        }}
                        className="glass-select w-full"
                      >
                        <option value="uploadedAt-desc">Newest First</option>
                        <option value="uploadedAt-asc">Oldest First</option>
                        <option value="title-asc">Title A-Z</option>
                        <option value="title-desc">Title Z-A</option>
                        <option value="type-asc">Type A-Z</option>
                        <option value="type-desc">Type Z-A</option>
                        <option value="department-asc">Department A-Z</option>
                        <option value="department-desc">Department Z-A</option>
                        <option value="fileSize-asc">Size Small to Large</option>
                        <option value="fileSize-desc">Size Large to Small</option>
                      </select>
                    </div>
                  </div>

                  {/* Filter Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {filteredDocuments.length} of {documents.length} documents match your filters
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedType('All');
                          setSelectedDepartment('All');
                          setSelectedStatus('All');
                          setSelectedSecurity('All');
                          setSelectedFileExtension('All');
                          setSearchQuery('');
                        }}
                        className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 px-3 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {showBulkActions && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4"
          >
            <div className="glass-panel rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {selectedDocuments.size} document{selectedDocuments.size > 1 ? 's' : ''} selected
                  </span>
                  <button
                    onClick={handleDeselectAll}
                    className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    Clear selection
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <motion.button
                    onClick={() => handleBulkAction('approve')}
                    className="glass-button text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={bulkActionType === 'approve'}
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve</span>
                  </motion.button>
                  
                  <motion.button
                    onClick={() => handleBulkAction('reject')}
                    className="glass-button text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={bulkActionType === 'reject'}
                  >
                    <X className="w-4 h-4" />
                    <span>Reject</span>
                  </motion.button>
                  
                  <motion.button
                    onClick={() => handleBulkAction('archive')}
                    className="glass-button text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={bulkActionType === 'archive'}
                  >
                    <Archive className="w-4 h-4" />
                    <span>Archive</span>
                  </motion.button>
                  
                  <motion.button
                    onClick={() => handleBulkAction('security')}
                    className="glass-button text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={bulkActionType === 'security'}
                  >
                    <Shield className="w-4 h-4" />
                    <span>Security</span>
                  </motion.button>
                  
                  <motion.button
                    onClick={() => handleBulkAction('delete')}
                    className="glass-button text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={bulkActionType === 'delete'}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Documents Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="glass-panel rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedDocuments.size === filteredDocuments.length && filteredDocuments.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleSelectAll();
                        } else {
                          handleDeselectAll();
                        }
                      }}
                      className="rounded border-gray-300 dark:border-gray-600 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Security
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Collaborators
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredDocuments.map((document) => (
                  <motion.tr
                    key={document.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                    onMouseEnter={() => setHoveredRow(document.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedDocuments.has(document.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleDocumentSelect(document.id, e.target.checked);
                        }}
                        className="rounded border-gray-300 dark:border-gray-600 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div 
                        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 -m-2 transition-colors"
                        onClick={() => handleDocumentClick(document)}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                            {document.title}
                          </span>
                          {document.isLocked && (
                            <Shield className="w-3 h-3 text-gray-400" />
                          )}
                          {document.isPublic && (
                            <Eye className="w-3 h-3 text-gray-400" />
                          )}
                        </div>
                        <div className="mt-1">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatRelativeTime(document.uploadedAt)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getFileIcon(document.fileExtension)}
                        <span className="text-sm text-gray-900 dark:text-white">
                          {document.fileExtension}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {document.fileSize}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}
                        style={getStatusBackgroundColor(document.status)}
                      >
                        {getStatusIcon(document.status)}
                        <span className="ml-1">{document.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSecurityLevelColor(document.securityLevel)}`}>
                        <Shield className="w-3 h-3 mr-1" />
                        <span className="capitalize">{document.securityLevel || 'internal'}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center -space-x-1">
                        {document.collaborators.slice(0, 4).map((collaborator) => (
                          <div
                            key={collaborator.id}
                            className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xs font-medium text-primary-600 dark:text-primary-400 border-2 border-white dark:border-gray-800"
                            title={collaborator.name}
                          >
                            {collaborator.initials}
                          </div>
                        ))}
                        {document.collaborators.length > 4 && (
                          <div className="relative group">
                            <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-400 border-2 border-white dark:border-gray-800 cursor-pointer">
                              +{document.collaborators.length - 4}
                            </div>
                            {/* Dropdown */}
                            <div className="absolute top-full left-0 mt-2 w-48 glass-panel rounded-lg shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                              <div className="py-2">
                                {document.collaborators.slice(4).map((collaborator) => (
                                  <div key={collaborator.id} className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xs font-medium text-primary-600 dark:text-primary-400">
                                      {collaborator.initials}
                                    </div>
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{collaborator.name}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {hoveredRow === document.id && (
                        <div className="flex items-center space-x-2">
                          <motion.button
                            onClick={(e) => handleView(document, e)}
                            className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            onClick={(e) => handleEdit(document, e)}
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Edit className="w-4 h-4" />
                          </motion.button>
                          <div className="relative">
                            <motion.button
                              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {filteredDocuments.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No documents found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search criteria or filters
          </p>
        </motion.div>
      )}

      {/* Document Preview Modal */}
      <DocumentPreviewModal
        isOpen={previewModalOpen}
        onClose={() => {
          setPreviewModalOpen(false);
          setSelectedDocument(null);
        }}
        document={selectedDocument}
        onEdit={(document) => {
          setPreviewModalOpen(false);
          setSelectedDocument(null);
          setEditingDocument(document);
          setEditModalOpen(true);
        }}
      />

      {/* Document Edit Modal */}
      <DocumentEditModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingDocument(null);
        }}
        document={editingDocument}
        onSave={handleSaveDocument}
      />
    </div>
  );
}
