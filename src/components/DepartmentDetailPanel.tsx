import React from 'react';
import { X, FileText, Building2 } from 'lucide-react';
import { Document, Department } from '../types';
import DocumentCard from './DocumentCard';

interface DepartmentDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  department: Department | null;
  documents: Document[];
  onDocumentClick: (document: Document) => void;
  showApprovalStatus?: boolean;
  showDeleteButton?: boolean;
  onDeleteDocument?: (documentId: string) => void;
  bulkMode?: boolean;
  selectedDocuments?: Set<string>;
  onDocumentSelect?: (documentId: string, selected: boolean) => void;
}

export default function DepartmentDetailPanel({ 
  isOpen, 
  onClose, 
  department,
  documents,
  onDocumentClick,
  showApprovalStatus = false,
  showDeleteButton = false,
  onDeleteDocument,
  bulkMode = false,
  selectedDocuments = new Set(),
  onDocumentSelect
}: DepartmentDetailPanelProps) {
  if (!isOpen || !department) return null;

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
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: department.color + '20', color: department.color }}
                >
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{department.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{documents.length} documents</p>
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
            {documents.length === 0 ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No documents found in this department</p>
                </div>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {documents.map((document) => (
                  <DocumentCard
                    key={document.id}
                    document={document}
                    onClick={() => {
                      onDocumentClick(document);
                      onClose();
                    }}
                    showApprovalStatus={showApprovalStatus}
                    compact={true}
                    showDeleteButton={showDeleteButton}
                    onDelete={onDeleteDocument}
                    bulkMode={bulkMode}
                    selected={selectedDocuments.has(document.id)}
                    onSelect={onDocumentSelect}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}