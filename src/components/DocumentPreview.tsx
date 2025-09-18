import React from 'react';
import { X, Download, ExternalLink, Clock, User, Tag } from 'lucide-react';
import { Document } from '../types';

interface DocumentPreviewProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  userRole: 'admin' | 'manager' | 'employee';
}

export default function DocumentPreview({ 
  document, 
  isOpen, 
  onClose, 
  onApprove, 
  onReject, 
  userRole 
}: DocumentPreviewProps) {
  if (!isOpen || !document) return null;

  const canApprove = userRole === 'manager' && document.approvalStatus === 'pending';

  const renderPreview = () => {
    switch (document.fileType) {
      case 'pdf':
        // Use HTML preview if available, otherwise show PDF placeholder
        if (document.htmlPreviewUrl) {
          return (
            <div className="w-full h-96 bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
              <iframe
                src={document.htmlPreviewUrl}
                className="w-full h-full border-none"
                title={`HTML Preview of ${document.title}`}
                onError={(e) => {
                  console.error('HTML preview failed to load:', e);
                  // Could implement fallback to PDF placeholder here
                }}
              />
            </div>
          );
        }
        // Fallback to PDF placeholder
        return (
          <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-red-600 font-bold">PDF</span>
              </div>
              <p className="text-gray-600">PDF Preview</p>
              <p className="text-sm text-gray-500 mt-1">Click download to view full document</p>
            </div>
          </div>
        );
      case 'doc':
      case 'docx':
        return (
          <div className="w-full h-96 bg-gray-50 rounded-lg p-6 overflow-auto">
            <div className="prose prose-sm max-w-none">
              <h1>Document Title</h1>
              <p>This is a preview of the document content. In a real implementation, you would parse and display the actual document content here.</p>
              <h2>Section 1</h2>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              <ul>
                <li>Point 1</li>
                <li>Point 2</li>
                <li>Point 3</li>
              </ul>
            </div>
          </div>
        );
      case 'xls':
      case 'xlsx':
        return (
          <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold">XLS</span>
              </div>
              <p className="text-gray-600">Spreadsheet Preview</p>
              <p className="text-sm text-gray-500 mt-1">Click download to view full spreadsheet</p>
            </div>
          </div>
        );
      case 'image':
        return (
          <div className="w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={document.thumbnail || '/api/placeholder/400/300'}
              alt={document.title}
              className="w-full h-full object-contain"
            />
          </div>
        );
      default:
        return (
          <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Preview not available</p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-1">{document.title}</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>Uploaded by {document.uploadedBy}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{new Date(document.uploadedAt).toLocaleDateString()}</span>
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-200px)] overflow-auto">
          {renderPreview()}
          
          {/* Document Details */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Document Details</h3>
              <dl className="space-y-1">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Type:</dt>
                  <dd className="text-sm text-gray-900">{document.type}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Department:</dt>
                  <dd className="text-sm text-gray-900">{document.department}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Access:</dt>
                  <dd className="text-sm text-gray-900 capitalize">{document.accessType}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Status:</dt>
                  <dd className={`text-sm capitalize ${
                    document.approvalStatus === 'approved' ? 'text-green-600' :
                    document.approvalStatus === 'rejected' ? 'text-red-600' :
                    'text-yellow-600'
                  }`}>
                    {document.approvalStatus}
                  </dd>
                </div>
              </dl>
            </div>
            
            {document.tags && document.tags.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center space-x-1">
                  <Tag className="w-4 h-4" />
                  <span>Tags</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {document.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-teal-50 text-teal-700 text-sm rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div className="flex space-x-3">
            <a
              href={document.url}
              download={document.title}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </a>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <ExternalLink className="w-4 h-4" />
              <span>Open</span>
            </button>
          </div>
          
          {canApprove && (
            <div className="flex space-x-3">
              <button
                onClick={onReject}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                Reject
              </button>
              <button
                onClick={onApprove}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
              >
                Approve
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}