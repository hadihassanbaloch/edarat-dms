import React, { useState } from 'react';
import { ChevronRight, Building2, FileText } from 'lucide-react';
import { Document, Department } from '../types';
import DocumentCard from './DocumentCard';

interface DepartmentSectionProps {
  department: Department;
  documents: Document[];
  onDocumentClick: (document: Document) => void;
  showApprovalStatus?: boolean;
}

export default function DepartmentSection({ 
  department, 
  documents, 
  onDocumentClick, 
  showApprovalStatus = false 
}: DepartmentSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  
  const displayedDocuments = showAll ? documents : documents.slice(0, 7);
  const hasMore = documents.length > 7;

  const handleShowMore = () => {
    setShowSidebar(true);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Department Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: department.color + '20', color: department.color }}
              >
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{department.name}</h2>
                <p className="text-sm text-gray-500">
                  {department.documentCount} documents
                </p>
              </div>
            </div>
            {hasMore && !showAll && (
              <button
                onClick={handleShowMore}
                className="flex items-center space-x-1 text-sm text-eteal-600 hover:text-eteal-700 font-medium"
              >
                <span>Show more</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Documents Grid */}
        <div className="p-6">
          {documents.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No documents found in this department</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {displayedDocuments.map((document) => (
                <DocumentCard
                  key={document.id}
                  document={document}
                  onClick={() => onDocumentClick(document)}
                  showApprovalStatus={showApprovalStatus}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Modal for All Documents */}
      {showSidebar && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex">
          <div className="ml-auto w-full max-w-md bg-white shadow-xl">
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{department.name}</h2>
                    <p className="text-sm text-gray-500">All documents</p>
                  </div>
                  <button
                    onClick={() => setShowSidebar(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Documents List */}
              <div className="flex-1 overflow-auto p-4">
                <div className="space-y-3">
                  {documents.map((document) => (
                    <DocumentCard
                      key={document.id}
                      document={document}
                      onClick={() => {
                        onDocumentClick(document);
                        setShowSidebar(false);
                      }}
                      compact={true}
                      showApprovalStatus={showApprovalStatus}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}