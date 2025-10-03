import React, { useState } from 'react';
import { FileText, Eye, Download, Clock, CheckCircle, XCircle, AlertCircle, File, FileImage, FileSpreadsheet, Calendar, CalendarX, Trash2, FileVideo, FileAudio, Archive, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { Document } from '../types';
import { formatDate } from '../utils/dateUtils';

interface DocumentCardProps {
  document: Document;
  onClick: () => void;
  showApprovalStatus?: boolean;
  compact?: boolean;
  minimal?: boolean;
  bulkMode?: boolean;
  selected?: boolean;
  onSelect?: (selected: boolean) => void;
  showDeleteButton?: boolean;
  onDelete?: (documentId: string) => void;
}

export default function DocumentCard({ 
  document, 
  onClick, 
  showApprovalStatus = false, 
  compact = false,
  minimal = false,
  bulkMode = false,
  selected = false,
  onSelect,
  showDeleteButton = false,
  onDelete
}: DocumentCardProps) {

  const getStatusIcon = () => {
    switch (document.approvalStatus) {
      case 'approved':
        return <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />;
      case 'rejected':
        return <XCircle className="w-3 h-3 text-red-600 dark:text-red-400" />;
      case 'pending':
        return <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" />;
      default:
        return null;
    }
  };

  const getFileIcon = () => {
    const iconSize = "w-4 h-4";
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

  const getSecurityIcon = () => {
    if (!document.securityLevel || document.securityLevel === 'Public') {
      return null;
    }

    const iconColor = document.securityLevel === 'Highly Confidential' 
      ? 'text-red-600 dark:text-red-400' 
      : 'text-amber-600 dark:text-amber-400';
    
    const bgColor = document.securityLevel === 'Highly Confidential'
      ? 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-700'
      : 'bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-700';

    return (
      <div className="absolute bottom-2 left-2 z-20">
        <Shield className={`w-5 h-5 ${iconColor}`} />
      </div>
    );
  };

  if (minimal) {
    return (
      <div 
        className="relative border-b border-gray-100 dark:border-gray-700 last:border-b-0 z-10"
      >
        <div className="flex items-center">
          {bulkMode && onSelect && (
            <div className="px-2">
              <input
                type="checkbox"
                checked={selected}
                onChange={(e) => {
                  e.stopPropagation();
                  onSelect(e.target.checked);
                }}
                className="rounded border-gray-300 dark:border-gray-600 text-teal-600 focus:ring-teal-500"
              />
            </div>
          )}
          <button
            onClick={onClick}
            className="flex-1 text-left px-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all group ripple"
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {getFileIcon()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-medium text-gray-900 dark:text-white truncate leading-tight">
                  {document.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {document.type}
                </p>
              </div>
              <div className="flex items-center space-x-1">
                {document.securityLevel && document.securityLevel !== 'Public' && (
                  <div className="flex items-center">
                    <Shield className={`w-4 h-4 ${
                      document.securityLevel === 'Highly Confidential' 
                        ? 'text-red-500 dark:text-red-400' 
                        : 'text-amber-500 dark:text-amber-400'
                    }`} />
                  </div>
                )}
                {showApprovalStatus && getStatusIcon()}
                {showDeleteButton && onDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(document.id);
                    }}
                    className="p-1 text-gray-400 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                    title="Delete document"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </button>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <motion.div 
        className={`flex items-center w-full text-left p-3 document-card ${
          selected ? 'border-teal-400/50 bg-teal-500/10 shadow-glass-lg' : ''
        }`}
        whileHover={{ scale: 1.02, x: 5 }}
        whileTap={{ scale: 0.98 }}
      >
        {bulkMode && onSelect && (
          <div className="px-2">
            <input
              type="checkbox"
              checked={selected}
              onChange={(e) => {
                e.stopPropagation();
                onSelect(e.target.checked);
              }}
              className="rounded border-white/20 bg-white/10 text-neon-blue focus:ring-neon-blue/50"
            />
          </div>
        )}
        <button
          onClick={onClick}
          className="flex-1 text-left ripple"
        >
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              {getFileIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                {document.title}
              </h3>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                <div className="flex items-center space-x-2">
                  <span>{document.type}</span>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>Updated: {formatDate(document.lastModified)}</span>
                  </div>
                </div>
              </div>
              {document.expiryDate && (
                <div className={`flex items-center space-x-1 mt-1 ${
                  new Date(document.expiryDate) < new Date() ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'
                }`}>
                  <CalendarX className="w-3 h-3" />
                  <span>Expires: {formatDate(document.expiryDate)}</span>
                </div>
              )}
            </div>
          </div>
        </button>
        {showDeleteButton && onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(document.id);
            }}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            title="Delete document"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </motion.div>
    );
  }

  // Default grid mode
  return (
    <motion.div 
      className={`bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-600 p-4 hover:border-gray-300 dark:hover:border-slate-500 hover:shadow-md transition-all duration-200 cursor-pointer relative ${
        selected ? 'border-teal-400/50 bg-teal-500/10 shadow-lg' : ''
      }`}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Expiry Date - Top Left Absolute */}
      {document.expiryDate && (
        <div className="absolute top-2 left-2 z-10">
          <div className={`flex items-center space-x-1 text-xs px-2 py-1 rounded-md ${
            new Date(document.expiryDate) < new Date() 
              ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800' 
              : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
          }`}>
            <CalendarX className="w-3 h-3" />
            <span className="font-medium">
              {formatDate(document.expiryDate)}
            </span>
          </div>
        </div>
      )}

      {bulkMode && onSelect && (
        <div className={`absolute top-3 z-10 ${document.expiryDate ? 'left-3 top-12' : 'left-3'}`}>
          <input
            type="checkbox"
            checked={selected}
            onChange={(e) => {
              e.stopPropagation();
              onSelect(e.target.checked);
            }}
            className="rounded border-gray-300 dark:border-gray-600 text-teal-600 focus:ring-teal-500"
          />
        </div>
      )}
      
      {/* Approval Status - Top Right Absolute */}
      {showApprovalStatus && (
        <div className="absolute top-3 right-3 z-10">
          {getStatusIcon()}
        </div>
      )}

      {/* Delete Button - Top Right Absolute */}
      {showDeleteButton && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(document.id);
          }}
          className="absolute top-3 right-3 z-10 p-2 text-gray-400 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
          title="Delete document"
          style={{ marginTop: showApprovalStatus ? '32px' : '0' }}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}

      {/* Security Icon - Bottom Left Absolute */}
      {getSecurityIcon()}

      <button
        onClick={onClick}
        className="w-full text-center p-6 group"
      >
        <div className="flex flex-col items-center space-y-4">
          {/* Large Icon at Top Center */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
              <div className="scale-150">
                {getFileIcon()}
              </div>
            </div>
          </div>
          
          {/* Title Below Icon */}
          <div className="w-full px-2">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white truncate text-center">
              {document.title}
            </h3>
            
            <div className="space-y-1 mt-2">
              <div className="flex items-center justify-center space-x-1 text-xs text-slate-500 dark:text-slate-400">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(document.uploadedAt)}</span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
                <span className="uppercase font-medium">{document.fileType}</span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
                <span>{document.department}</span>
              </div>
            </div>
          </div>
        </div>
      </button>
    </motion.div>
  );
}