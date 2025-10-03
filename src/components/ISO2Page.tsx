import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MoreHorizontal, Search, Clock, CheckCircle, Upload } from 'lucide-react';
import ISO2Card from './ISO2Card';
import NewCardModal from './NewCardModal';
import DocumentPreviewModal from './DocumentPreviewModal';
import DocumentEditModal from './DocumentEditModal';
import UploadModal from './UploadModal';
import Toaster, { useToaster } from './Toaster';

interface ISO2Document {
  id: string;
  title: string;
  type: string;
  url: string;
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
  collaborators: Array<{
    id: string;
    name: string;
    initials: string;
    avatar?: string;
  }>;
  fileExtension: string;
  isLocked?: boolean;
  isPublic?: boolean;
  securityLevel?: 'public' | 'internal' | 'confidential' | 'restricted';
  description?: string;
}

interface ISO2Section {
  id: string;
  title: string;
  color: string;
  documents: ISO2Document[];
}

interface ISO2PageProps {
  onNavigateToDocsDB: () => void;
}

export default function ISO2Page({ onNavigateToDocsDB }: ISO2PageProps) {
  const [newCardModalOpen, setNewCardModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const { toasts, removeToast, showSuccess } = useToaster();
  
  // State for ISO2 sections
  const [iso2Sections, setIso2Sections] = useState<ISO2Section[]>([
    {
      id: '1',
      title: 'Quality Management System',
      color: '#0AACCC',
      documents: [
        { id: '1', title: 'Quality Policy', type: 'Policy', url: '#' },
        { id: '2', title: 'Quality Objectives', type: 'Document', url: '#' },
        { id: '3', title: 'Management Review', type: 'Procedure', url: '#' },
        { id: '4', title: 'Internal Audit', type: 'Procedure', url: '#' },
        { id: '5', title: 'Corrective Actions', type: 'Form', url: '#' }
      ]
    },
    {
      id: '2',
      title: 'Environmental Management',
      color: '#10B981',
      documents: [
        { id: '6', title: 'Environmental Policy', type: 'Policy', url: '#' },
        { id: '7', title: 'Environmental Aspects', type: 'Register', url: '#' },
        { id: '8', title: 'Legal Compliance', type: 'Checklist', url: '#' },
        { id: '9', title: 'Emergency Response', type: 'Plan', url: '#' },
        { id: '10', title: 'Environmental Training', type: 'Record', url: '#' }
      ]
    },
    {
      id: '3',
      title: 'Occupational Health & Safety',
      color: '#F59E0B',
      documents: [
        { id: '11', title: 'OH&S Policy', type: 'Policy', url: '#' },
        { id: '12', title: 'Risk Assessment', type: 'Form', url: '#' },
        { id: '13', title: 'Safety Procedures', type: 'SOP', url: '#' },
        { id: '14', title: 'Incident Investigation', type: 'Form', url: '#' },
        { id: '15', title: 'Safety Training Records', type: 'Register', url: '#' }
      ]
    },
    {
      id: '4',
      title: 'Information Security',
      color: '#8B5CF6',
      documents: [
        { id: '16', title: 'Information Security Policy', type: 'Policy', url: '#' },
        { id: '17', title: 'Risk Management', type: 'Procedure', url: '#' },
        { id: '18', title: 'Access Control', type: 'SOP', url: '#' },
        { id: '19', title: 'Incident Management', type: 'Plan', url: '#' },
        { id: '20', title: 'Security Awareness', type: 'Training', url: '#' }
      ]
    },
    {
      id: '5',
      title: 'Energy Management',
      color: '#EF4444',
      documents: [
        { id: '21', title: 'Energy Policy', type: 'Policy', url: '#' },
        { id: '22', title: 'Energy Baseline', type: 'Report', url: '#' },
        { id: '23', title: 'Energy Review', type: 'Assessment', url: '#' },
        { id: '24', title: 'Energy Performance', type: 'Indicators', url: '#' },
        { id: '25', title: 'Energy Action Plan', type: 'Plan', url: '#' }
      ]
    },
    {
      id: '6',
      title: 'Food Safety Management',
      color: '#06B6D4',
      documents: [
        { id: '26', title: 'Food Safety Policy', type: 'Policy', url: '#' },
        { id: '27', title: 'HACCP Plan', type: 'Plan', url: '#' },
        { id: '28', title: 'Prerequisite Programs', type: 'SOP', url: '#' },
        { id: '29', title: 'Traceability System', type: 'Procedure', url: '#' },
        { id: '30', title: 'Corrective Actions', type: 'Form', url: '#' }
      ]
    }
  ]);

  const handleAddNewCard = (card: { title: string; color: string }) => {
    const newSection: ISO2Section = {
      id: Date.now().toString(),
      title: card.title,
      color: card.color,
      documents: []
    };
    setIso2Sections(prev => [...prev, newSection]);
  };

  const handleDocumentClick = (document: ISO2Document) => {
    // Convert ISO2Document to Document format for edit
    const editDocument: Document = {
      id: document.id,
      title: document.title,
      type: document.type,
      department: 'ISO Management',
      uploadedBy: 'System Admin',
      uploadedAt: new Date().toISOString(),
      fileSize: '1.2 MB',
      status: 'approved',
      tags: ['ISO', 'Management', 'Quality'],
      collaborators: [
        { id: '1', name: 'Admin User', initials: 'AU' }
      ],
      fileExtension: document.type,
      description: `${document.title} - ISO management system document`
    };
    
    setEditingDocument(editDocument);
    setEditModalOpen(true);
  };

  const handleUploadComplete = (files: File[]) => {
    // Show success notification
    showSuccess(
      'Upload Successful',
      `${files.length} file${files.length > 1 ? 's' : ''} uploaded successfully. Click the edit icon to modify document details.`,
      6000
    );
    
    // Here you would typically add the uploaded files to your document list
    console.log('Files uploaded:', files);
  };

  const handleEditUploadedDocument = (file: File) => {
    // Convert uploaded file to Document format for editing
    const uploadedDocument: Document = {
      id: Math.random().toString(36).substr(2, 9),
      title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
      type: file.type || 'Unknown',
      department: 'ISO Management',
      uploadedBy: 'Current User',
      uploadedAt: new Date().toISOString(),
      fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      status: 'pending',
      tags: [],
      collaborators: [],
      fileExtension: file.name.split('.').pop()?.toUpperCase() || 'Unknown',
      description: `Uploaded file: ${file.name}`,
      isLocked: false,
      isPublic: false,
      securityLevel: 'internal'
    };
    
    setEditingDocument(uploadedDocument);
    setEditModalOpen(true);
    setUploadModalOpen(false); // Close upload modal when opening edit modal
  };

  const handleSaveDocument = (updatedDocument: Document) => {
    console.log('Document updated:', updatedDocument);
    // Here you would typically update the document in your backend/database
    setEditModalOpen(false);
    setEditingDocument(null);
  };

  // Filter sections based on search query
  const filteredSections = iso2Sections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.documents.some(doc => 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

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
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                  ISO 9001
                </h1>
                <motion.button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="glass-button-icon"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MoreHorizontal className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </motion.button>
              </div>
              
              {/* Dropdown Menu */}
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 w-56 glass-panel rounded-lg shadow-lg z-50"
                  >
                    <div className="py-2">
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          console.log('Recent Visited clicked');
                        }}
                        className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <Clock className="w-4 h-4" />
                          <span>Recent Visited</span>
                        </div>
                        <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-2 py-1 rounded-full">
                          12
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          console.log('Pending Approval clicked');
                        }}
                        className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-4 h-4" />
                          <span>Pending Approval</span>
                        </div>
                        <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-1 rounded-full">
                          5
                        </span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search subjects and documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-input pl-10 w-96"
              />
            </div>
            
            <motion.button
              onClick={() => setUploadModalOpen(true)}
              className="glass-button-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Upload className="w-4 h-4" />
              <span>Upload New</span>
            </motion.button>
            
            <motion.button
              onClick={() => setNewCardModalOpen(true)}
              className="glass-button-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-4 h-4" />
              <span>New Subject</span>
            </motion.button>
          </div>
        </div>

      </motion.div>

      {/* ISO2 Cards Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <AnimatePresence>
          {filteredSections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <ISO2Card
                section={section}
                onShowAll={() => onNavigateToDocsDB()}
                onDocumentClick={handleDocumentClick}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* New Card Modal */}
      <NewCardModal
        isOpen={newCardModalOpen}
        onClose={() => setNewCardModalOpen(false)}
        onAdd={handleAddNewCard}
      />

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

      <DocumentEditModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingDocument(null);
        }}
        document={editingDocument}
        onSave={handleSaveDocument}
      />

      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUploadComplete={handleUploadComplete}
        onEditDocument={handleEditUploadedDocument}
      />

      <Toaster
        toasts={toasts}
        onRemove={removeToast}
      />
    </div>
  );
}
