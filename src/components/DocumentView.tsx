import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Share2, CheckCircle, XCircle, Eye, Copy, Calendar, User, Building2, Tag, FileText, Clock, AlertCircle, CalendarX, Users, Send, Trash2, Info, X, Edit3, Bell, File, FileSpreadsheet, FileImage, FileVideo, FileAudio, Archive, Shield } from 'lucide-react';
import { Document, User as UserType, AuditLog } from '../types';
import { mockDocumentAcceptances, mockUsers } from '../data/mockData';
import AuditTrail from './AuditTrail';
import NotificationModal from './NotificationModal';
import DigitalSignatureModal from './DigitalSignatureModal';
import { formatDate, formatDateTimeWithLongFormat } from '../utils/dateUtils';

interface DocumentViewProps {
  document: Document;
  user: UserType;
  onBack: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onDelete?: (documentId: string) => void;
  auditLogs: AuditLog[];
}

export default function DocumentView({ 
  document, 
  user, 
  onBack, 
  onApprove, 
  onReject, 
  onDelete,
  auditLogs 
}: DocumentViewProps) {
  const [activeTab, setActiveTab] = useState('info');
  const [showAcceptanceDetails, setShowAcceptanceDetails] = useState(false);
  const [showInfoPanel, setShowInfoPanel] = useState(true);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showDigitalSignatureModal, setShowDigitalSignatureModal] = useState(false);
  
  const handleSendNotification = (recipients: any[], notes?: string) => {
    console.log('Sending notification for document:', document.title);
    console.log('Recipients:', recipients);
    console.log('Notes:', notes);
    
    // Here you would integrate with your notification system
    alert(`Notification sent to ${recipients.length} recipient(s) for "${document.title}"`);
    
    setShowNotificationModal(false);
  };
  
  const canApprove = user.role !== 'employee' && document.approvalStatus === 'pending';
  const showHistoryTab = user.role === 'admin';
  
  // Security access control
  const canAccessDocument = () => {
    if (user.role === 'admin') return true; // Admins can access everything
    if (!document.securityLevel || document.securityLevel === 'Public') return true;
    if (document.securityLevel === 'Confidential' && user.role === 'manager') return true;
    if (document.securityLevel === 'Highly Confidential') return false; // Only admins
    return false;
  };

  // If user doesn't have access, show access denied message
  if (!canAccessDocument()) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6">
            <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h1>
            <p className="text-gray-600 dark:text-gray-400">
              You do not have permission to view this {document.securityLevel?.toLowerCase()} document.
            </p>
          </div>
          <button
            onClick={onBack}
            className="glass-button-primary px-6 py-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Documents
          </button>
        </div>
      </div>
    );
  }
  
  // Get acceptances for this document
  const documentAcceptances = mockDocumentAcceptances.filter(
    acceptance => acceptance.documentId === document.id
  );
  
  const acceptedUserIds = documentAcceptances.map(acceptance => acceptance.userId);
  const allEmployees = mockUsers.filter(u => u.role === 'employee');
  const pendingEmployees = allEmployees.filter(emp => !acceptedUserIds.includes(emp.id));
  
  const handleSendNotifications = () => {
    console.log('Sending notifications to employees who haven\'t accepted:', pendingEmployees);
    alert(`Notifications sent to ${pendingEmployees.length} employees who haven't accepted this document.`);
  };

  const handleDigitalSignature = (signatureData: string) => {
    console.log(`${user.name} digitally signed document: ${document.title}`);
    console.log('Signature data:', signatureData);
    
    // Here you would save the signature data and document acceptance
    // For demo purposes, we'll show a success message
    alert(`Document "${document.title}" has been digitally signed and acknowledged successfully!`);
    
    // Close the modal
    setShowDigitalSignatureModal(false);
  };

  const getStatusIcon = () => {
    switch (document.approvalStatus) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getFileIcon = () => {
    const iconSize = "w-8 h-8";
    const iconColor = "text-gray-500 dark:text-gray-400";
    
    switch (document.fileType?.toLowerCase()) {
      case 'pdf':
        return <File className={`${iconSize} ${iconColor}`} />;
      case 'doc':
      case 'docx':
        return <FileText className={`${iconSize} ${iconColor}`} />;
      case 'xls':
      case 'xlsx':
        return <FileSpreadsheet className={`${iconSize} ${iconColor}`} />;
      case 'csv':
        return <FileSpreadsheet className={`${iconSize} ${iconColor}`} />;
      case 'ppt':
      case 'pptx':
        return <File className={`${iconSize} ${iconColor}`} />;
      case 'txt':
        return <FileText className={`${iconSize} ${iconColor}`} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
      case 'svg':
      case 'webp':
        return <FileImage className={`${iconSize} ${iconColor}`} />;
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'wmv':
      case 'flv':
      case 'webm':
        return <FileVideo className={`${iconSize} ${iconColor}`} />;
      case 'mp3':
      case 'wav':
      case 'flac':
      case 'aac':
      case 'ogg':
        return <FileAudio className={`${iconSize} ${iconColor}`} />;
      case 'zip':
      case 'rar':
      case '7z':
      case 'tar':
      case 'gz':
        return <Archive className={`${iconSize} ${iconColor}`} />;
      default:
        return <FileText className={`${iconSize} ${iconColor}`} />;
    }
  };

  const renderPreview = () => {
    switch (document.fileType) {
      case 'pdf':
        return (
          <div className="w-full h-full bg-white dark:bg-slate-800 p-8 overflow-auto">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg p-8 shadow-sm min-h-[600px]">
                <div className="space-y-6">
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-12 h-12 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{document.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">PDF Document Preview</p>
                    
                    <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg p-6 max-w-md mx-auto">
                      <p className="text-teal-800 dark:text-teal-200 text-sm">
                        <strong>Document Content:</strong> This PDF document is ready for viewing. 
                        In a production environment, the full PDF content would be rendered here with proper document viewer.
                      </p>
                    </div>
                  </div>

                  {/* Simulated PDF Content */}
                  <div className="text-slate-700 dark:text-slate-300 space-y-4 max-w-3xl mx-auto">
                    <div className="border-l-4 border-teal-500 pl-4">
                      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Document Preview</h2>
                      <p className="text-base leading-relaxed">
                        {document.description || `This document contains important information about ${document.title.toLowerCase()}. The full content includes detailed sections, guidelines, and procedures relevant to ${document.department}.`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'doc':
      case 'docx':
        return (
          <div className="w-full h-full bg-white dark:bg-slate-800 p-8 overflow-auto">
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">{document.title}</h1>

              {/* Content based on document type */}
              {document.type === 'Manual' && (
                <div className="space-y-8">
                  <section>
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">Table of Contents</h2>
                    <ul className="list-decimal pl-6 text-slate-700 dark:text-slate-300 space-y-2 text-lg">
                      <li>Introduction and Welcome</li>
                      <li>Company Mission and Values</li>
                      <li>Employment Policies</li>
                      <li>Code of Conduct</li>
                      <li>Benefits and Compensation</li>
                      <li>Health and Safety Guidelines</li>
                      <li>IT and Security Policies</li>
                      <li>Contact Information</li>
                    </ul>
                  </section>
                  
                  <section>
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">1. Introduction and Welcome</h2>
                    <p className="text-slate-700 dark:text-slate-300 mb-6 text-lg leading-relaxed">
                      Welcome to Edarat Group! This handbook serves as your comprehensive guide to our company policies, 
                      procedures, and culture. Please take time to review all sections carefully.
                    </p>
                    <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed">
                      Our organization is committed to maintaining a professional, inclusive, and productive work environment 
                      for all employees. This handbook will help you understand your rights, responsibilities, and the 
                      resources available to support your success.
                    </p>
                  </section>
                </div>
              )}

              {document.type === 'Policy' && (
                <div className="space-y-8">
                  <section>
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">Policy Statement</h2>
                    <p className="text-slate-700 dark:text-slate-300 mb-6 text-lg leading-relaxed">
                      This policy establishes the framework for {document.title.toLowerCase()} within Edarat Group. 
                      All employees must comply with the guidelines outlined in this document.
                    </p>
                  </section>
                  
                  <section>
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">Scope and Applicability</h2>
                    <p className="text-slate-700 dark:text-slate-300 mb-4 text-lg leading-relaxed">
                      This policy applies to all employees, contractors, and third parties who have access to 
                      company systems and information.
                    </p>
                    <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 text-lg">
                      <li>Full-time and part-time employees</li>
                      <li>Temporary staff and contractors</li>
                      <li>Vendors with system access</li>
                      <li>Board members and executives</li>
              </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">Key Requirements</h2>
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
                      <p className="text-slate-700 dark:text-slate-300 font-medium text-lg">
                        All personnel must acknowledge receipt and understanding of this policy within 30 days of 
                        employment or policy updates.
                      </p>
                    </div>
                  </section>
                </div>
              )}

              {document.type === 'SOP' && (
                <div className="space-y-8">
                  <section>
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">Purpose</h2>
                    <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed">
                      This procedure provides step-by-step instructions for {document.title.toLowerCase()}.
                    </p>
                  </section>
                  
                  <section>
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">Steps</h2>
                    <ol className="list-decimal pl-6 text-slate-700 dark:text-slate-300 space-y-3 text-lg">
                      <li>Initial assessment and preparation</li>
                      <li>Required documentation review</li>
                      <li>Implementation phase</li>
                      <li>Quality assurance and testing</li>
                      <li>Final approval and sign-off</li>
                    </ol>
                  </section>
                </div>
              )}

              {/* Default content if no specific type */}
              {!['Manual', 'Policy', 'Procedure'].includes(document.type) && (
                <div className="space-y-6">
                  <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed">
                    {document.description || `This document contains important information about ${document.title.toLowerCase()}.`}
                  </p>
                  
                  <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
                    <p className="text-slate-700 dark:text-slate-300 text-base">
                      Document content would be displayed here in a production environment with proper document parsing and rendering.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return (
          <div className="w-full h-full bg-white dark:bg-slate-800 p-8 overflow-auto">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">{document.title}</h1>
              
              <div className="space-y-6">
                <div className="text-center py-16">
                  <div className="w-32 h-32 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center mx-auto mb-6">
                    <div className="scale-200">
              {getFileIcon()}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Document Content</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
                    This {document.fileType.toUpperCase()} document is ready for viewing.
                  </p>
                  
                  <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 max-w-lg mx-auto">
                    <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
                      {document.description || `This document contains important information and content related to ${document.title.toLowerCase()}.`}
                    </p>
                  </div>

                  <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg p-4 max-w-md mx-auto mt-6">
                    <p className="text-teal-800 dark:text-teal-200 text-sm">
                      <strong>Note:</strong> Full document content would be rendered here in a production environment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header - No gap below */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <img 
                    src="/fsm-icon.png" 
                    alt="Edarat FMS" 
                    className="w-auto h-8 object-cover"
                  />
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Documents</span>
              </button>
            </div>
            
            {/* Document Status Only */}
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-2">
                  {getStatusIcon()}
                  <span className={`text-sm font-medium capitalize ${
                    document.approvalStatus === 'approved' ? 'text-green-600 dark:text-green-400' :
                    document.approvalStatus === 'rejected' ? 'text-red-600 dark:text-red-400' :
                    'text-yellow-600 dark:text-yellow-400'
                  }`}>
                    {document.approvalStatus}
                  </span>
              </div>
            </div>
            
            {/* Action Buttons - Role-based */}
            <div className="flex items-center space-x-3">
              {/* Information Panel Toggle */}
              <button
                onClick={() => setShowInfoPanel(!showInfoPanel)}
                className="glass-button-secondary p-2"
                title={showInfoPanel ? "Hide Information" : "Show Information"}
              >
                {showInfoPanel ? <X className="w-4 h-4" /> : <Info className="w-4 h-4" />}
              </button>
              {/* Admin users get all buttons including download */}
              {user.role === 'admin' && (
                <>
              <a
                href={document.url}
                download={document.title}
                className="glass-button-secondary p-2"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </a>
              
              <button 
                className="glass-button-secondary p-2" 
                title="Edit Document"
                onClick={() => {
                  console.log(`Admin ${user.name} editing document: ${document.title}`);
                  alert('Edit document functionality would open here.');
                }}
              >
                <Edit3 className="w-4 h-4" />
              </button>
              
              <button 
                className="glass-button-secondary p-2" 
                title="Send Notification"
                onClick={() => setShowNotificationModal(true)}
              >
                <Bell className="w-4 h-4" />
              </button>
              
              <button className="glass-button-secondary p-2" title="Copy Link">
                <Copy className="w-4 h-4" />
              </button>
              
              {onDelete && (
                <button
                  onClick={() => onDelete(document.id)}
                  className="glass-button-danger p-2"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              
              {canApprove && (
                <>
                  <button
                    onClick={onReject}
                    className="glass-button-secondary flex items-center space-x-2 px-3 py-2"
                    title="Send Feedback"
                  >
                    <Send className="w-4 h-4" />
                    <span className="text-sm">Send Feedback</span>
                  </button>
                  <button
                    onClick={onApprove}
                    className="glass-button-success flex items-center space-x-2 px-3 py-2"
                    title="Acknowledge"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Acknowledge</span>
                  </button>
                    </>
                  )}
                </>
              )}

              {/* Employee users - only acknowledge button, no download */}
              {user.role === 'employee' && (
                <>
                  <button className="glass-button-secondary p-2" title="Copy Link">
                    <Copy className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => setShowDigitalSignatureModal(true)}
                    className="glass-button-success flex items-center space-x-2 px-3 py-2"
                    title="Acknowledge with Digital Signature"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Acknowledge</span>
                  </button>
                </>
              )}

              {/* Manager users - send feedback and acknowledge & approve, no download */}
              {user.role === 'manager' && (
                <>
                  <button className="glass-button-secondary p-2" title="Copy Link">
                    <Copy className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={onReject}
                    className="glass-button-secondary flex items-center space-x-2 px-3 py-2"
                    title="Send Feedback"
                  >
                    <Send className="w-4 h-4" />
                    <span className="text-sm">Send Feedback</span>
                  </button>
                  
                  <button
                    onClick={() => setShowDigitalSignatureModal(true)}
                    className="glass-button-success flex items-center space-x-2 px-3 py-2"
                    title="Acknowledge with Digital Signature"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Acknowledge</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout - No gap from header */}
      <div className="flex-1 flex bg-white dark:bg-gray-800">
        {/* Left Panel - Preview */}
        <div className="flex-1 min-h-0">
          <div className="h-full">
            {renderPreview()}
          </div>
        </div>

        {/* Right Panel - Metadata and History - Professional muted styling */}
        {showInfoPanel && (
          <div className="w-96 border-l border-gray-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 flex flex-col">
          {/* Document Info Header */}
          

          {/* Tabs - Professional muted styling */}
          <div className="border-b border-gray-200 dark:border-slate-700">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('info')}
                className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'info'
                    ? 'border-slate-500 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800'
                    : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300'
                }`}
              >
                Information
              </button>
              
              {showHistoryTab && (
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'activity'
                      ? 'border-slate-500 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800'
                      : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300'
                  }`}
                >
                  Activity
                </button>
              )}
              
              {showHistoryTab && (
                <button
                  onClick={() => setActiveTab('version')}
                  className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'version'
                      ? 'border-slate-500 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800'
                      : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300'
                  }`}
                >
                  Version
                </button>
              )}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-auto">
            {activeTab === 'info' && (
              <div className="p-6">
                {/* Document Header */}
                <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-200 dark:border-slate-600">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                    {getFileIcon()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{document.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{document.fileType.toUpperCase()} Document</p>
                  </div>
                </div>

                {/* Document Description */}
                {document.description && (
                  <div className="mb-6">
                    <h4 className="font-medium text-slate-900 dark:text-white mb-2">Description</h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                      {document.description}
                    </p>
                  </div>
                )}

                {/* Document Tags */}
                {document.tags && document.tags.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium text-slate-900 dark:text-white mb-3">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {document.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Document Details</h4>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-sm text-slate-500 dark:text-slate-400">Type:</dt>
                    <dd className="text-sm text-slate-900 dark:text-white font-medium">{document.type}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-slate-500 dark:text-slate-400">File Type:</dt>
                    <dd className="text-sm text-slate-900 dark:text-white font-medium uppercase">{document.fileType}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-slate-500 dark:text-slate-400">Department:</dt>
                    <dd className="text-sm text-slate-900 dark:text-white font-medium">{document.department}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-slate-500 dark:text-slate-400">Uploaded By:</dt>
                    <dd className="text-sm text-slate-900 dark:text-white font-medium">{document.uploadedBy}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-slate-500 dark:text-slate-400">Access Level:</dt>
                    <dd className="text-sm text-slate-900 dark:text-white font-medium capitalize">{document.accessType}</dd>
                  </div>
                  
                  {/* Security Classification */}
                  {document.securityLevel && (
                    <div className="flex justify-between">
                      <dt className="text-sm text-slate-500 dark:text-slate-400">Security Level:</dt>
                      <dd className="flex items-center space-x-2">
                        {document.securityLevel !== 'Public' && (
                          <Shield className={`w-4 h-4 ${
                            document.securityLevel === 'Highly Confidential' 
                              ? 'text-red-600 dark:text-red-400' 
                              : 'text-amber-600 dark:text-amber-400'
                          }`} />
                        )}
                        <span className={`text-sm font-medium ${
                          document.securityLevel === 'Highly Confidential' 
                            ? 'text-red-600 dark:text-red-400' 
                            : document.securityLevel === 'Confidential'
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-slate-900 dark:text-white'
                        }`}>
                          {document.securityLevel}
                        </span>
                      </dd>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <dt className="text-sm text-slate-500 dark:text-slate-400">Upload Date:</dt>
                    <dd className="text-sm text-slate-900 dark:text-white font-medium">
                      {formatDate(document.uploadedAt)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-slate-500 dark:text-slate-400">Last Modified:</dt>
                    <dd className="text-sm text-slate-900 dark:text-white font-medium">
                      {formatDate(document.lastModified)}
                    </dd>
                  </div>
                  
                  {document.expiryDate && (
                    <div className="flex justify-between">
                      <dt className="text-sm text-slate-500 dark:text-slate-400">Expiry Date:</dt>
                      <dd className={`text-sm font-medium ${
                        new Date(document.expiryDate) < new Date() ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'
                      }`}>
                        {formatDate(document.expiryDate)}
                        {new Date(document.expiryDate) < new Date() && (
                          <span className="ml-2 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs rounded-sm">
                            EXPIRED
                          </span>
                        )}
                      </dd>
                    </div>
                  )}
                  
                  {document.requiresAcceptance && (
                    <div className="flex justify-between">
                      <dt className="text-sm text-slate-500 dark:text-slate-400">Requires Acceptance:</dt>
                      <dd className="text-sm text-green-600 dark:text-green-400 font-medium">Yes</dd>
                    </div>
                  )}
                </dl>

                
                {/* Employee Acceptance Section */}
                {document.requiresAcceptance && user.role !== 'employee' && (
                  <>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4 mt-6">Employee Acceptance</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">Accepted</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {documentAcceptances.length} employees
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-amber-500" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">Pending</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {pendingEmployees.length} employees
                        </span>
                      </div>
                      
                      <button
                        onClick={() => setShowAcceptanceDetails(!showAcceptanceDetails)}
                        className="w-full p-3 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 rounded-sm hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors text-sm font-medium"
                      >
                        {showAcceptanceDetails ? 'Hide Details' : 'View Details'}
                      </button>
                      
                      {showAcceptanceDetails && (
                        <div className="space-y-3 mt-3">
                          {/* Accepted Employees */}
                          {documentAcceptances.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">
                                ✓ Accepted ({documentAcceptances.length})
                              </h4>
                              <div className="space-y-2">
                                {documentAcceptances.map((acceptance) => (
                                  <div key={acceptance.id} className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                                    <div>
                                      <span className="text-sm font-medium text-gray-900 dark:text-white">{acceptance.userName}</span>
                                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{acceptance.userEmail}</span>
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                      {formatDate(acceptance.acceptedAt)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Pending Employees */}
                          {pendingEmployees.length > 0 && (
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-medium text-amber-600 dark:text-amber-400">
                                  ⏳ Pending ({pendingEmployees.length})
                                </h4>
                                <button
                                  onClick={handleSendNotifications}
                                  className="flex items-center space-x-1 px-3 py-1 bg-primary-50 dark:bg-primary-900/30 text-eteal-700 dark:text-eteal-400 rounded text-xs font-medium hover:bg-eteal-100 dark:hover:bg-eteal-900/50 transition-colors"
                                >
                                  <Send className="w-3 h-3" />
                                  <span>Send Reminders</span>
                                </button>
                              </div>
                              <div className="space-y-2">
                                {pendingEmployees.map((employee) => (
                                  <div key={employee.id} className="flex items-center justify-between p-2 bg-orange-50 dark:bg-orange-900/20 rounded border border-orange-200 dark:border-orange-800">
                                    <div>
                                      <span className="text-sm font-medium text-gray-900 dark:text-white">{employee.name}</span>
                                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{employee.email}</span>
                                    </div>
                                    <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Not Signed</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
            
            {activeTab === 'activity' && showHistoryTab && (
              <div className="p-6">
                <AuditTrail auditLogs={auditLogs} />
              </div>
            )}
            
            {activeTab === 'version' && showHistoryTab && (
              <div className="p-6">
                <div className="space-y-6">
                  {/* Current Version */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-base font-medium text-slate-900 dark:text-white">Current Version</h3>
                      <button className="flex items-center space-x-1 px-3 py-1 text-sm text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/30 rounded-md transition-colors">
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Updated on {(() => {
                        const date = document.updatedAt ? new Date(document.updatedAt) : new Date();
                        const isValidDate = !isNaN(date.getTime());
                        if (!isValidDate) {
                          const fallbackDate = new Date();
                          return formatDateTimeWithLongFormat(fallbackDate);
                        }
                        return formatDateTimeWithLongFormat(date);
                      })()}
                    </p>
                  </div>

                  {/* Timeline */}
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">This Week</h4>
                    <div className="space-y-3">
                      {/* Current Version Entry */}
                      <div className="flex items-center justify-between p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                          <div>
                            <span className="text-sm text-slate-900 dark:text-white">
                              {(() => {
                                const date = document.updatedAt ? new Date(document.updatedAt) : new Date();
                                const isValidDate = !isNaN(date.getTime());
                                if (!isValidDate) {
                                  const fallbackDate = new Date();
                                  return `${fallbackDate.toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric'
                                  })} at ${fallbackDate.toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}`;
                                }
                                return `${date.toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric'
                                })} at ${date.toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}`;
                              })()}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">(Current)</span>
                          </div>
                        </div>
                        <button className="flex items-center space-x-1 px-2 py-1 text-xs text-teal-600 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-900/40 rounded transition-colors">
                          <Download className="w-3 h-3" />
                          <span>Download</span>
                        </button>
                      </div>

                      {/* Sample Previous Versions */}
                      {(() => {
                        const versions = [];
                        const baseDate = document.updatedAt ? new Date(document.updatedAt) : new Date();
                        const isValidBaseDate = !isNaN(baseDate.getTime());
                        
                        if (!isValidBaseDate) {
                          // If document date is invalid, use current date as fallback
                          const fallbackDate = new Date();
                          for (let i = 1; i <= 3; i++) {
                            const versionDate = new Date(fallbackDate);
                            versionDate.setDate(versionDate.getDate() - i);
                            versionDate.setHours(versionDate.getHours() - (i * 2));
                            
                            versions.push(
                              <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors">
                                <div className="flex items-center space-x-3">
                                  <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                                  <span className="text-sm text-slate-700 dark:text-slate-300">
                                    {versionDate.toLocaleDateString('en-US', { 
                                      month: 'short', 
                                      day: 'numeric'
                                    })} at {versionDate.toLocaleTimeString('en-US', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                                <button className="flex items-center space-x-1 px-2 py-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors">
                                  <Download className="w-3 h-3" />
                                  <span>Download</span>
                                </button>
                              </div>
                            );
                          }
                        } else {
                          // Create 2-3 sample previous versions from this week
                          for (let i = 1; i <= 3; i++) {
                            const versionDate = new Date(baseDate);
                            versionDate.setDate(versionDate.getDate() - i);
                            versionDate.setHours(versionDate.getHours() - (i * 2));
                            
                            // Only show if within the last 7 days
                            const daysDiff = Math.floor((baseDate.getTime() - versionDate.getTime()) / (1000 * 60 * 60 * 24));
                            if (daysDiff <= 7) {
                              versions.push(
                                <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                                    <span className="text-sm text-slate-700 dark:text-slate-300">
                                      {versionDate.toLocaleDateString('en-US', { 
                                        month: 'short', 
                                        day: 'numeric'
                                      })} at {versionDate.toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </span>
                                  </div>
                                  <button className="flex items-center space-x-1 px-2 py-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors">
                                    <Download className="w-3 h-3" />
                                    <span>Download</span>
                                  </button>
                                </div>
                              );
                            }
                          }
                        }
                        
                        return versions.length > 0 ? versions : (
                          <div className="text-center py-6 text-slate-500 dark:text-slate-400">
                            <Clock className="w-6 h-6 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No other versions this week</p>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        </div>
        )}
      </div>

      {/* Notification Modal */}
      <NotificationModal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        onSend={handleSendNotification}
        document={document}
        user={user}
      />

      {/* Digital Signature Modal */}
      <DigitalSignatureModal
        isOpen={showDigitalSignatureModal}
        onClose={() => setShowDigitalSignatureModal(false)}
        onSign={handleDigitalSignature}
        document={document}
        user={user}
      />
    </div>
  );
}