import React from 'react';
import { ChevronRight, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Document, Department } from '../types';
import DocumentCard from './DocumentCard';

interface DepartmentCardProps {
  department: Department;
  documents: Document[];
  onDocumentClick: (document: Document) => void;
  onShowMore: () => void;
  showApprovalStatus?: boolean;
  showDeleteButton?: boolean;
  onDeleteDocument?: (documentId: string) => void;
  bulkMode?: boolean;
  selectedDocuments?: Set<string>;
  onDocumentSelect?: (documentId: string, selected: boolean) => void;
}

export default function DepartmentCard({ 
  department, 
  documents, 
  onDocumentClick, 
  onShowMore,
  showApprovalStatus = false,
  showDeleteButton = false,
  onDeleteDocument,
  bulkMode = false,
  selectedDocuments = new Set(),
  onDocumentSelect
}: DepartmentCardProps) {
  const displayedDocuments = documents.slice(0, 4);
  const hasMore = documents.length > 4;

  return (
    <motion.div 
      className="department-card h-80"
      whileHover={{ 
        scale: 1.02, 
        y: -8,
        boxShadow: "0 20px 40px rgba(255, 255, 255, 0.1)"
      }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      {/* Department Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <div 
            className="w-1.5 h-8 rounded-full transition-all duration-300 ease-out"
            style={{ backgroundColor: department.color }}
          >
          </div>
          <div>
            <motion.button 
              onClick={onShowMore}
              className="font-bold text-gray-800 dark:text-white text-base hover:text-primary-bright dark:hover:text-primary-200 transition-all duration-200"
              whileHover={{ x: 4 }}
            >
              {department.name}
            </motion.button>
            <p className="text-xs text-gray-600 dark:text-white/60 mt-1">
              {department.documentCount} documents
            </p>
          </div>
        </div>
      </div>

      {/* Documents List */}
      <div className="space-y-0 flex-1 overflow-visible relative">
        {displayedDocuments.length === 0 ? (
          <p className="text-xs text-gray-500 dark:text-white/50 py-4 text-center">
            No documents found
          </p>
        ) : (
          <div className="space-y-1 relative">
            <AnimatePresence>
              {displayedDocuments.map((document, index) => (
                <motion.div 
                  key={document.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ x: 8, z: 20 }}
                  className="relative"
              >
                <DocumentCard
                  document={document}
                  onClick={() => onDocumentClick(document)}
                  showApprovalStatus={showApprovalStatus}
                  minimal={true}
                  showDeleteButton={showDeleteButton}
                  onDelete={onDeleteDocument}
                 bulkMode={bulkMode}
                 selected={selectedDocuments.has(document.id)}
                 onSelect={(selected) => onDocumentSelect?.(document.id, selected)}
                />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Show More Link */}
      {hasMore && (
        <div className="pt-3 border-t border-white/10 mt-auto">
          <motion.button
            onClick={onShowMore}
            className="flex items-center space-x-1 text-xs text-primary-500 dark:text-primary-200 hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold transition-all duration-200"
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Show {documents.length - 4} more</span>
            <ChevronRight className="w-3 h-3" />
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}