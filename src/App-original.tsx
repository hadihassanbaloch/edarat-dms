import React, { useState, useMemo } from 'react';
import { Plus, Grid, List, FileText, Clock, Building2, Eye, Upload, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import LoginModal from './components/LoginModal';
import UserLogin from './components/UserLogin';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import FolderView from './components/FolderView';
import ThemeToggle from './components/ThemeToggle';
import SearchBar, { SearchFilters } from './components/SearchBar';
import DepartmentCard from './components/DepartmentCard';
import DocumentCard from './components/DocumentCard';
import DocumentPreview from './components/DocumentPreview';
import AuditTrail from './components/AuditTrail';
import UploadModal from './components/UploadModal';
import StatsDetailPanel from './components/StatsDetailPanel';
import FeedbackModal from './components/FeedbackModal';
import AddDepartmentModal from './components/AddDepartmentModal';
import DepartmentDetailPanel from './components/DepartmentDetailPanel';
import { Document, Department, User } from './types';
import DocumentView from './components/DocumentView';
import { mockUsers, mockUser as defaultUser, mockDocuments, mockDepartments, mockAuditLogs } from './data/mockData';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    department: 'All',
    type: 'All',
    fileType: 'All',
    dateRange: 'All',
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [adminViewMode, setAdminViewMode] = useState<'list' | 'grid' | 'tree'>('grid');
  const [sortBy, setSortBy] = useState<'department' | 'fileType' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [currentView, setCurrentView] = useState<'main' | 'document'>('main');
  const [showDepartmentSidebar, setShowDepartmentSidebar] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [dragOverlay, setDragOverlay] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [statsDetailOpen, setStatsDetailOpen] = useState(false);
  const [selectedStatsType, setSelectedStatsType] = useState<'total' | 'pending' | 'department' | 'public' | null>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set());
  const [bulkMode, setBulkMode] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackDocument, setFeedbackDocument] = useState<Document | null>(null);
  const [bulkRejectModalOpen, setBulkRejectModalOpen] = useState(false);
  const [addDepartmentModalOpen, setAddDepartmentModalOpen] = useState(false);
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [departmentDetailOpen, setDepartmentDetailOpen] = useState(false);
  const [selectedDepartmentDetail, setSelectedDepartmentDetail] = useState<Department | null>(null);

  // Only use currentUser, no fallback to defaultUser
  const user = currentUser;

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    setCurrentUser(null);
    // Reset all state when logging out
    setSelectedDocument(null);
    setCurrentView('main');
    setSearchQuery('');
    setSearchFilters({
      department: 'All',
      type: 'All',
      fileType: 'All',
      dateRange: 'All',
    });
    setSelectedDocuments(new Set());
    setBulkMode(false);
    setUploadModalOpen(false);
    setPreviewOpen(false);
    setStatsDetailOpen(false);
    
    // Small delay to ensure state is properly reset before showing login
    setTimeout(() => {
      setIsLoggingOut(false);
    }, 100);
  };

  // Filter documents based on search query and filters
  const filteredDocuments = useMemo(() => {
    // Early return if user is not logged in
    if (!user) {
      return [];
    }
    
    let filtered = documents.filter(doc => {
      if (bulkMode && user.role === 'manager' && doc.approvalStatus !== 'pending') {
        return false;
      }
      
      const matchesQuery = !searchQuery || 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesDepartment = searchFilters.department === 'All' || doc.department === searchFilters.department;
      const matchesType = searchFilters.type === 'All' || doc.type === searchFilters.type;
      const matchesFileType = searchFilters.fileType === 'All' || doc.fileType === searchFilters.fileType;
      const matchesDateRange = searchFilters.dateRange === 'All';
      
      return matchesQuery && matchesDepartment && matchesType && matchesFileType && matchesDateRange;
    });

    return filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'department':
          comparison = a.department.localeCompare(b.department);
          break;
        case 'fileType':
          comparison = a.fileType.localeCompare(b.fileType);
          break;
        case 'date':
          comparison = new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return filtered;
  }, [searchQuery, searchFilters, documents, sortBy, sortOrder, bulkMode, user]);

  const documentsByDepartment = useMemo(() => {
    const grouped = filteredDocuments.reduce((acc, doc) => {
      if (!acc[doc.department]) {
        acc[doc.department] = [];
      }
      acc[doc.department].push(doc);
      return acc;
    }, {} as Record<string, Document[]>);

    return Object.entries(grouped).map(([name, docs]) => {
      const dept = departments.find(d => d.name === name) || {
        id: name,
        name,
        color: '#6B7280',
        documentCount: docs.length
      };
      return { department: dept, documents: docs };
    });
  }, [filteredDocuments, departments]);

  const handleDocumentClick = (document: Document) => {
    setSelectedDocument(document);
    setCurrentView('document');
    console.log(`User ${user.name} viewed document: ${document.title}`);
  };

  const handleApprove = () => {
    if (selectedDocument) {
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === selectedDocument.id 
            ? { ...doc, approvalStatus: 'approved', approvedBy: user.name, approvedAt: new Date() }
            : doc
        )
      );
      setCurrentView('main');
    }
  };

  const handleReject = () => {
    console.log('🔴 handleReject called!');
    console.log('📄 Selected document:', selectedDocument?.title);
    console.log('📋 Current feedbackModalOpen state:', feedbackModalOpen);
    setFeedbackDocument(selectedDocument);
    setFeedbackModalOpen(true);
    console.log('✅ Modal state should now be true');
  };

  const handleFeedbackSubmit = (feedback: string) => {
    if (selectedDocument) {
      console.log(`Feedback submitted for document ${selectedDocument.title}:`, feedback);
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === selectedDocument.id 
            ? { ...doc, approvalStatus: 'rejected' as const, approvedBy: user.name, approvedAt: new Date() }
            : doc
        )
      );
      setCurrentView('main');
      // Show success message
      alert(`Feedback sent successfully for "${selectedDocument.title}"`);
    }
  };

  const handleSearch = (query: string, filters: SearchFilters) => {
    setSearchQuery(query);
    setSearchFilters(filters);
  };

  const handleUpload = (newDocuments: Partial<Document>[]) => {
    const completeDocuments = newDocuments.map(doc => ({
      ...doc,
      id: doc.id || Math.random().toString(36).substr(2, 9),
      uploadedBy: doc.uploadedBy || user.name,
      uploadedAt: doc.uploadedAt || new Date(),
      lastModified: doc.lastModified || new Date(),
      approvalStatus: doc.approvalStatus || 'pending',
    })) as Document[];

    setDocuments(prev => [...completeDocuments, ...prev]);
  };

  const handleSendApprovalRequest = (documentIds: string[], isIndividual: boolean = false) => {
    const docs = documents.filter(doc => documentIds.includes(doc.id));
    const approverEmails = docs.map(doc => {
      const approver = mockUsers.find(u => 
        u.role === 'manager' && u.department === doc.department
      );
      return approver?.email || 'manager@edaratgroup.com';
    });
    
    console.log(`Sending approval request for ${docs.length} document(s) to:`, approverEmails);
    alert(`Approval request sent for ${docs.length} document(s)`);
    
    setSelectedDocuments(new Set());
    setBulkMode(false);
  };

  const handleBulkApproval = (action: 'approve' | 'reject') => {
    if (action === 'reject') {
      setBulkRejectModalOpen(true);
      return;
    }
    
    const selectedDocs = documents.filter(doc => selectedDocuments.has(doc.id));
    const docsToNotify = selectedDocs.filter(doc => doc.notifyAllAfterApproval && action === 'approve');
    
    setDocuments(prev => 
      prev.map(doc => 
        selectedDocuments.has(doc.id) 
          ? { ...doc, approvalStatus: 'approved', approvedBy: user.name, approvedAt: new Date() }
          : doc
      )
    );
    
    console.log(`Approved ${selectedDocs.length} documents`);
    
    // Send notifications for approved documents that have the flag set
    if (docsToNotify.length > 0) {
      console.log(`Sending notifications to all employees about ${docsToNotify.length} approved documents`);
      alert(`${selectedDocs.length} documents approved! Notifications sent to all employees about ${docsToNotify.length} documents.`);
    } else {
      alert(`${selectedDocs.length} documents approved successfully!`);
    }
    
    setSelectedDocuments(new Set());
    setBulkMode(false);
  };

  const handleResendNotification = (documentIds: string[]) => {
    const docs = documents.filter(doc => documentIds.includes(doc.id));
    const approverEmails = docs.map(doc => {
      const approver = mockUsers.find(u => 
        u.role === 'manager' && u.department === doc.department
      );
      return approver?.email || 'manager@edaratgroup.com';
    });
    
    // Simulate notification resend
    console.log(`Resending approval notifications for ${docs.length} document(s) to:`, approverEmails);
    alert(`Approval notifications resent for ${docs.length} document(s)`);
  };

  const handleDeleteDocument = (documentId: string) => {
    const document = documents.find(doc => doc.id === documentId);
    if (!document) return;
    
    const confirmed = window.confirm(`Are you sure you want to delete "${document.title}"? This action cannot be undone.`);
    if (confirmed) {
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      console.log(`Document deleted: ${documentId} by ${user.name}`);
      alert(`Document "${document.title}" has been deleted successfully.`);
      
      // If we're currently viewing this document, go back to main view
      if (selectedDocument && selectedDocument.id === documentId) {
        setCurrentView('main');
        setSelectedDocument(null);
      }
      
      // Remove from bulk selection if selected
      setSelectedDocuments(prev => {
        const newSet = new Set(prev);
        newSet.delete(documentId);
        return newSet;
      });
    }
  };

  const handleApproveDocument = (documentId: string) => {
    setDocuments(prev => 
      prev.map(doc => 
        doc.id === documentId 
          ? { ...doc, approvalStatus: 'approved', approvedBy: user.name, approvedAt: new Date() }
          : doc
      )
    );
    console.log(`Document approved: ${documentId} by ${user.name}`);
    
    // Remove from selection after approval
    setSelectedDocuments(prev => {
      const newSet = new Set(prev);
      newSet.delete(documentId);
      return newSet;
    });
  };

  const handleRejectDocument = (documentId: string) => {
    const document = documents.find(doc => doc.id === documentId);
    if (document) {
      setFeedbackDocument(document);
      setFeedbackModalOpen(true);
    }
  };

  const handleFeedbackFromPanel = (feedback: string) => {
    if (feedbackDocument) {
      console.log(`Feedback submitted for document ${feedbackDocument.title}:`, feedback);
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === feedbackDocument.id 
            ? { ...doc, approvalStatus: 'rejected', approvedBy: user.name, approvedAt: new Date() }
            : doc
        )
      );
      console.log(`Document rejected: ${feedbackDocument.id} by ${user.name}`);
      
      // Remove from selection after rejection
      setSelectedDocuments(prev => {
        const newSet = new Set(prev);
        newSet.delete(feedbackDocument.id);
        return newSet;
      });
    }
  };

  const handleBulkRejectWithFeedback = (feedback: string) => {
    const selectedDocs = documents.filter(doc => selectedDocuments.has(doc.id));
    
    setDocuments(prev => 
      prev.map(doc => 
        selectedDocuments.has(doc.id) 
          ? { ...doc, approvalStatus: 'rejected', approvedBy: user.name, approvedAt: new Date() }
          : doc
      )
    );
    
    console.log(`Bulk rejected ${selectedDocs.length} documents with feedback:`, feedback);
    alert(`${selectedDocs.length} documents rejected with feedback sent to uploaders.`);
    
    setSelectedDocuments(new Set());
    setBulkMode(false);
  };

  const handleAddDepartment = (newDept: { name: string; color: string }) => {
    const department: Department = {
      id: Math.random().toString(36).substr(2, 9),
      name: newDept.name,
      color: newDept.color,
      documentCount: 0
    };
    
    setDepartments(prev => [...prev, department]);
    console.log(`New department added: ${newDept.name} by ${user.name}`);
    alert(`Department "${newDept.name}" added successfully!`);
  };

  const handleStatsClick = (type: 'total' | 'pending' | 'department' | 'public') => {
    setSelectedStatsType(type);
    setStatsDetailOpen(true);
  };

  const handleShowMoreDepartment = (departmentName: string) => {
    const dept = departments.find(d => d.name === departmentName);
    if (dept) {
      setSelectedDepartmentDetail(dept);
      setDepartmentDetailOpen(true);
    }
  };

  const handleDocumentSelection = (documentId: string, selected: boolean) => {
    setSelectedDocuments(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(documentId);
      } else {
        newSet.delete(documentId);
      }
      return newSet;
    });
  };

  const handlePageDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverlay(true);
  };

  const handlePageDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.currentTarget === e.target) {
      setDragOverlay(false);
    }
  };

  const handlePageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverlay(false);
    setUploadModalOpen(true);
  };

  const renderDocuments = () => {
    // For employees and managers, always show grid/list view (no department cards)
    if (user.role === 'employee' || user.role === 'manager') {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                <Building2 className="w-8 h-8 text-slate-400" />
                  </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No Documents Found</h3>
              <p className="text-slate-600 dark:text-slate-400">No documents are available for your account.</p>
                  </div>
          ) : (
            <div className={`grid ${viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6' 
              : 'grid-cols-1 gap-4'
            }`}>
              <AnimatePresence mode="popLayout">
                {filteredDocuments.map((document, index) => (
                  <motion.div
                    key={document.id}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <DocumentCard
                      document={document}
                      onClick={() => handleDocumentClick(document)}
                      showApprovalStatus={user.role !== 'employee'}
                      compact={viewMode === 'list'}
                      bulkMode={bulkMode}
                      selected={selectedDocuments.has(document.id)}
                      showDeleteButton={user.role === 'admin'}
                      onDelete={handleDeleteDocument}
                      onSelect={handleDocumentSelection}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      );
    }

    // For admin users, show department cards or grid/list view based on selection
    if (selectedDepartment) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className={`grid ${viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6' 
            : 'grid-cols-1 gap-4'
          }`}>
            <AnimatePresence mode="popLayout">
              {filteredDocuments.map((document, index) => (
                <motion.div
                  key={document.id}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <DocumentCard
                    document={document}
                    onClick={() => handleDocumentClick(document)}
                    showApprovalStatus={user.role !== 'employee'}
                    compact={viewMode === 'list'}
                    bulkMode={bulkMode}
                    selected={selectedDocuments.has(document.id)}
                    showDeleteButton={user.role === 'admin'}
                    onDelete={handleDeleteDocument}
                    onSelect={handleDocumentSelection}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      );
    }

    // Admin default view with department cards
    return (
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <AnimatePresence>
          {documentsByDepartment.map(({ department, documents }, index) => (
            <motion.div
              key={department.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <DepartmentCard
                department={department}
                documents={documents}
                onDocumentClick={handleDocumentClick}
                onShowMore={() => handleShowMoreDepartment(department.name)}
                showApprovalStatus={user.role !== 'employee'}
                showDeleteButton={user.role === 'admin'}
                onDeleteDocument={handleDeleteDocument}
                bulkMode={bulkMode}
                selectedDocuments={selectedDocuments}
                onDocumentSelect={handleDocumentSelection}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    );
  };

  // Show UserLogin page if no user is logged in
  if (!currentUser || isLoggingOut) {
    return <UserLogin onLogin={handleLogin} />;
  }

  if (currentView === 'document' && selectedDocument) {
    return (
      <ThemeProvider>
        <DocumentView
          document={selectedDocument}
          user={user}
          onBack={() => setCurrentView('main')}
          onApprove={handleApprove}
          onReject={handleReject}
          onDelete={user.role === 'admin' ? handleDeleteDocument : undefined}
          auditLogs={mockAuditLogs.filter(log => log.documentId === selectedDocument.id)}
        />
        <ThemeToggle />
      </ThemeProvider>
    );
  }

  const stats = {
    totalDocuments: filteredDocuments.length,
    pendingApproval: filteredDocuments.filter(doc => doc.approvalStatus === 'pending').length,
    departments: documentsByDepartment.length,
    recentUploads: filteredDocuments.filter(doc => {
      const daysDiff = Math.floor((Date.now() - new Date(doc.uploadedAt).getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff <= 7;
    }).length,
    approvedDocuments: filteredDocuments.filter(doc => doc.approvalStatus === 'approved').length,
    rejectedDocuments: filteredDocuments.filter(doc => doc.approvalStatus === 'rejected').length,
    myDepartmentDocs: filteredDocuments.filter(doc => doc.department === user.department).length,
    publicDocs: filteredDocuments.filter(doc => doc.accessType === 'public').length,
    recentApprovals: filteredDocuments.filter(doc => {
      if (doc.approvalStatus !== 'approved' || !doc.approvedAt) return false;
      const daysDiff = Math.floor((Date.now() - new Date(doc.approvedAt).getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff <= 7;
    }).length,
  };

  const LayoutComponent = user.role === 'admin' ? AdminLayout : Layout;
  const layoutProps = user.role === 'admin' 
    ? {
        user,
        onSearch: handleSearch,
        onUploadClick: () => setUploadModalOpen(true),
        onLogout: handleLogout,
        viewMode: adminViewMode,
        onViewModeChange: setAdminViewMode
      }
    : {
        user,
        onSearch: handleSearch,
        onUploadClick: () => setUploadModalOpen(true),
        onLogout: handleLogout
      };

  const renderMainContent = () => {
    if (user.role === 'admin') {
      return (
        <FolderView
          departments={departments}
          documentsByDepartment={documentsByDepartment}
          viewMode={adminViewMode}
          onFolderClick={(department) => {
            setSelectedDepartment(department.name);
            setDepartmentDetailOpen(true);
          }}
          onDocumentClick={handleDocumentClick}
        />
      );
    }

    // Original content for non-admin users
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {/* Header Section */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                Document Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage and organize your documents with ease
              </p>
            </div>
            
            {user.role === 'admin' && (
              <div className="flex items-center space-x-3">
                <motion.button
                  onClick={() => setUploadModalOpen(true)}
                  className="glass-button-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Files</span>
                </motion.button>
                
                <motion.button
                  onClick={() => setAddDepartmentModalOpen(true)}
                  className="glass-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Department</span>
                </motion.button>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <SearchBar onSearch={handleSearch} />
              <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 rounded-lg p-1 shadow-sm border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bulk Actions Toggle */}
            <div className="flex items-center space-x-4">
              {user.role === 'admin' && (
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bulkMode}
                    onChange={(e) => setBulkMode(e.target.checked)}
                    className="rounded border-slate-300 dark:border-slate-600 text-teal-600 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Bulk Actions</span>
                </label>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats Cards - Admin Only with branded colors */}
        {user.role === 'admin' && (
          <div className="grid grid-cols-3 gap-4">
            <motion.button
              onClick={() => handleStatsClick('total')}
              className="stats-card"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Documents</h3>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalDocuments}</p>
                </div>
                <div className="p-3 rounded-full" style={{ backgroundColor: 'rgba(10, 172, 204, 0.1)' }}>
                  <FileText className="w-6 h-6" style={{ color: '#0AACCC' }} />
                </div>
              </div>
            </motion.button>

            <motion.button
              onClick={() => handleStatsClick('pending')}
              className="stats-card"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300">Pending Approval</h3>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.pendingApproval}</p>
                </div>
                <div className="p-3 rounded-full" style={{ backgroundColor: 'rgba(10, 172, 204, 0.1)' }}>
                  <Clock className="w-6 h-6" style={{ color: '#0AACCC' }} />
                </div>
              </div>
            </motion.button>

            <motion.button
              onClick={() => handleStatsClick('recentApprovals')}
              className="stats-card"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300">Recent Approvals</h3>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.recentApprovals}</p>
                </div>
                <div className="p-3 rounded-full" style={{ backgroundColor: 'rgba(10, 172, 204, 0.1)' }}>
                  <CheckCircle className="w-6 h-6" style={{ color: '#0AACCC' }} />
                </div>
              </div>
            </motion.button>
          </div>
        )}

        {/* Bulk Actions Bar */}
        {user.role === 'admin' && bulkMode && selectedDocuments.size > 0 && (
          <motion.div 
            className="glass-panel rounded-2xl p-4 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {selectedDocuments.size} document{selectedDocuments.size !== 1 ? 's' : ''} selected
                </p>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleBulkApprove}
                    className="glass-button-success text-sm"
                  >
                    Approve All
                  </button>
                  <button
                    onClick={() => setBulkRejectModalOpen(true)}
                    className="glass-button-secondary text-sm"
                  >
                    Reject All
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className="glass-button text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Delete All
                  </button>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedDocuments(new Set());
                  setBulkMode(false);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {renderDocuments()}
        </motion.div>
      </div>
    );
  };

  return (
    <ThemeProvider>
      {user.role === 'admin' ? (
        <AdminLayout
          user={user}
          onSearch={handleSearch}
          onUploadClick={() => setUploadModalOpen(true)}
          onLogout={handleLogout}
          viewMode={adminViewMode}
          onViewModeChange={setAdminViewMode}
        >
          <FolderView
            departments={departments}
            documentsByDepartment={documentsByDepartment}
            viewMode={adminViewMode}
            onFolderClick={(department) => {
              setSelectedDepartment(department.name);
              setDepartmentDetailOpen(true);
            }}
            onDocumentClick={handleDocumentClick}
          />
        </AdminLayout>
      ) : (
        <div 
          className="min-h-screen bg-gray-100 dark:bg-[#111] relative overflow-hidden"
          onDragOver={handlePageDragOver}
          onDragLeave={handlePageDragLeave}
          onDrop={handlePageDrop}
        >
          <Layout 
            user={user}
            onSearch={handleSearch}
            onUploadClick={() => setUploadModalOpen(true)}
            onLogout={handleLogout}
          >
            {renderMainContent()}
          </Layout>
        </div>
      )}

      {/* Modals and Panels */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                    Document Management
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Manage and organize your documents with ease
                  </p>
                </div>
                
                {user.role === 'admin' && (
                  <div className="flex items-center space-x-3">
                    <motion.button
                      onClick={() => setUploadModalOpen(true)}
                      className="glass-button-primary"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload Files</span>
                    </motion.button>
                    
                    <motion.button
                      onClick={() => setAddDepartmentModalOpen(true)}
                      className="glass-button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Building2 className="w-4 h-4" />
                      <span>Add Department</span>
                    </motion.button>
                    
                    <motion.button
                      onClick={() => setBulkMode(!bulkMode)}
                      className={bulkMode ? "glass-button-dark" : "glass-button"}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {bulkMode ? 'Exit Bulk' : 'Bulk Mode'}
                    </motion.button>
                  </div>
                )}
              </div>

              {/* Stats Cards - Admin Only with branded colors */}
              {user.role === 'admin' && (
                <div className="grid grid-cols-3 gap-4">
                  <motion.button
                    onClick={() => handleStatsClick('total')}
                    className="stats-card text-left"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-slate-800 dark:text-white">
                          {stats.totalDocuments}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          Total Documents
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(10, 172, 204, 0.1)' }}>
                        <FileText className="w-5 h-5" style={{ color: '#0AACCC' }} />
                      </div>
                    </div>
                  </motion.button>

                  <motion.button
                    onClick={() => handleStatsClick('pending')}
                    className="stats-card text-left"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-slate-800 dark:text-white">
                          {stats.pendingApproval}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          Pending Approval
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(10, 172, 204, 0.1)' }}>
                        <Clock className="w-5 h-5" style={{ color: '#0AACCC' }} />
                      </div>
                    </div>
                  </motion.button>

                  <motion.button
                    onClick={() => handleStatsClick('department')}
                    className="stats-card text-left"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-slate-800 dark:text-white">
                          {stats.recentApprovals}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          Recent Approvals
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(10, 172, 204, 0.1)' }}>
                        <CheckCircle className="w-5 h-5" style={{ color: '#0AACCC' }} />
                      </div>
                    </div>
                  </motion.button>
                </div>
              )}
            </motion.div>

            {/* Bulk Actions Bar */}
            {user.role === 'admin' && bulkMode && selectedDocuments.size > 0 && (
              <motion.div 
                className="glass-panel rounded-2xl p-4 mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {selectedDocuments.size} document(s) selected
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <motion.button
                      onClick={() => handleBulkApproval('reject')}
                      className="glass-button-danger"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Reject All
                    </motion.button>
                    <motion.button
                      onClick={() => handleBulkApproval('approve')}
                      className="glass-button-success"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Approve All
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* View Controls */}
            <motion.div 
              className="flex items-center justify-between mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center space-x-2">
                <motion.button
                  onClick={() => setViewMode('grid')}
                  className={`glass-toggle ${viewMode === 'grid' ? 'glass-toggle-active' : ''}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Grid className="w-4 h-4" />
                </motion.button>
                <motion.button
                  onClick={() => setViewMode('list')}
                  className={`glass-toggle ${viewMode === 'list' ? 'glass-toggle-active' : ''}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <List className="w-4 h-4" />
                </motion.button>
              </div>

              {/* View Controls - Available to all users */}
              <div className="flex items-center space-x-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'department' | 'fileType' | 'date')}
                  className="glass-select"
                >
                  <option value="date">Sort by Date</option>
                  <option value="department">Sort by Department</option>
                  <option value="fileType">Sort by File Type</option>
                </select>
                
                <motion.button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="glass-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </motion.button>
              </div>
            </motion.div>

            {/* Documents */}
            {renderDocuments()}
          </div>

        {/* Modals and Panels */}
        <UploadModal
          isOpen={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          onUpload={handleUpload}
          user={user}
        />

        <DocumentPreview
          document={selectedDocument}
          isOpen={previewOpen}
          onClose={() => setPreviewOpen(false)}
          onApprove={handleApprove}
          onReject={handleReject}
          userRole={user.role}
        />

        <StatsDetailPanel
          isOpen={statsDetailOpen}
          onClose={() => setStatsDetailOpen(false)}
          statsType={selectedStatsType}
          documents={filteredDocuments}
          user={user}
          onDocumentClick={handleDocumentClick}
          selectedDocuments={selectedDocuments}
          bulkMode={bulkMode}
          onDocumentSelect={handleDocumentSelection}
          onApproveDocument={handleApproveDocument}
          onRejectDocument={handleRejectDocument} 
          onResendNotification={handleResendNotification}
        />

        <FeedbackModal
          isOpen={feedbackModalOpen}
          onClose={() => {
            setFeedbackModalOpen(false);
            setFeedbackDocument(null);
          }}
          onSubmit={feedbackDocument === selectedDocument ? handleFeedbackSubmit : handleFeedbackFromPanel}
          document={feedbackDocument}
        />

        {/* Bulk Reject Modal */}
        <FeedbackModal
          isOpen={bulkRejectModalOpen}
          onClose={() => setBulkRejectModalOpen(false)}
          onSubmit={handleBulkRejectWithFeedback}
          document={{
            id: 'bulk-reject',
            title: `${selectedDocuments.size} Selected Documents`,
            type: 'Bulk Rejection',
            department: 'Multiple Departments',
            fileType: 'multiple',
            uploadedBy: 'Various Users',
            uploadedAt: new Date(),
            lastModified: new Date(),
            accessType: 'public',
            approvalStatus: 'pending',
            tags: [],
            description: `Bulk rejection of ${selectedDocuments.size} documents`,
            url: ''
          } as Document}
        />

        <AddDepartmentModal
          isOpen={addDepartmentModalOpen}
          onClose={() => setAddDepartmentModalOpen(false)}
          onAdd={handleAddDepartment}
        />

        <DepartmentDetailPanel
          isOpen={departmentDetailOpen}
          onClose={() => setDepartmentDetailOpen(false)}
          department={selectedDepartmentDetail}
          documents={selectedDepartmentDetail ? documentsByDepartment.find(d => d.department.id === selectedDepartmentDetail.id)?.documents || [] : []}
          onDocumentClick={handleDocumentClick}
          showApprovalStatus={user.role !== 'employee'}
          showDeleteButton={user.role === 'admin'}
          onDeleteDocument={handleDeleteDocument}
          bulkMode={bulkMode}
          selectedDocuments={selectedDocuments}
          onDocumentSelect={handleDocumentSelection}
        />

        {/* Drag Overlay */}
        <AnimatePresence>
          {dragOverlay && (
            <motion.div 
              className="fixed inset-0 z-50 bg-teal-500/20 backdrop-blur-sm flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="glass-panel p-8 rounded-2xl text-center"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
              >
                <Upload className="w-16 h-16 text-teal-600 dark:text-teal-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  Drop Files to Upload
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Release to upload your documents
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </ThemeProvider>
  );
}

export default App;