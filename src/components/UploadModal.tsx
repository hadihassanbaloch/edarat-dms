import React, { useState, useCallback } from 'react';
import { X, Upload, FileText, CheckCircle, AlertCircle, Plus, Trash2, File, FileSpreadsheet, FileImage, FileVideo, FileAudio, Archive } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { Document, User } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (documents: Partial<Document>[]) => void;
  user: User;
}

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  metadata?: {
    title: string;
    department: string;
    type: 'SOP' | 'Policy' | 'Manual' | 'Guide' | 'Form';
    tags: string[];
    description: string;
    accessType: 'public' | 'department' | 'restricted';
    approvalRequired: boolean;
    approverEmail?: string;
    notifyAllAfterApproval: boolean;
    securityLevel?: 'Public' | 'Confidential' | 'Highly Confidential';
  };
}

const departments = ['Human Resources', 'Finance', 'Information Technology', 'Operations', 'Legal', 'Marketing'];
const documentTypes = ['SOP', 'Policy', 'Manual', 'Guide', 'Form'];
const securityLevels = ['Public', 'Confidential', 'Highly Confidential'] as const;

// Helper function for file type icons
const getFileIconFromName = (fileName: string, size = "w-4 h-4") => {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  const iconColor = "text-gray-500 dark:text-gray-400";
  
  switch (extension) {
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

export default function UploadModal({ isOpen, onClose, onUpload, user }: UploadModalProps) {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [currentStep, setCurrentStep] = useState<'upload' | 'metadata'>('upload');

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const newUploadFiles = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: 'uploading' as const,
      metadata: {
        title: file.name.split('.')[0],
        department: user.department || 'Information Technology',
        type: 'Manual' as const,
        tags: [],
        description: '',
        accessType: 'public' as const,
        approvalRequired: false,
        securityLevel: 'Public' as const,
      }
    }));

    setUploadFiles(prev => [...prev, ...newUploadFiles]);

    // Simulate upload progress
    newUploadFiles.forEach(uploadFile => {
      simulateUpload(uploadFile.id);
    });
  };

  const simulateUpload = (fileId: string) => {
    const interval = setInterval(() => {
      setUploadFiles(prev => 
        prev.map(file => {
          if (file.id === fileId) {
            const newProgress = Math.min(file.progress + 10, 100);
            return {
              ...file,
              progress: newProgress,
              status: newProgress === 100 ? 'completed' : 'uploading'
            };
          }
          return file;
        })
      );
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
    }, 2000);
  };

  const removeFile = (fileId: string) => {
    setUploadFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const updateMetadata = (fileId: string, field: string, value: any) => {
    setUploadFiles(prev =>
      prev.map(file => {
        if (file.id === fileId) {
          return {
            ...file,
            metadata: {
              ...file.metadata!,
              [field]: value
            }
          };
        }
        return file;
      })
    );
  };

  const addTag = (fileId: string, tag: string) => {
    if (!tag.trim()) return;
    
    setUploadFiles(prev =>
      prev.map(file => {
        if (file.id === fileId && file.metadata) {
          const newTags = [...file.metadata.tags, tag.trim()];
          return {
            ...file,
            metadata: {
              ...file.metadata,
              tags: newTags
            }
          };
        }
        return file;
      })
    );
  };

  const removeTag = (fileId: string, tagIndex: number) => {
    setUploadFiles(prev =>
      prev.map(file => {
        if (file.id === fileId && file.metadata) {
          const newTags = file.metadata.tags.filter((_, index) => index !== tagIndex);
          return {
            ...file,
            metadata: {
              ...file.metadata,
              tags: newTags
            }
          };
        }
        return file;
      })
    );
  };

  const handleComplete = () => {
    const completedDocuments = uploadFiles
      .filter(file => file.status === 'completed' && file.metadata)
      .map(file => ({
        id: file.id,
        title: file.metadata!.title,
        type: file.metadata!.type,
        fileType: file.file.name.split('.').pop()?.toLowerCase() || 'pdf',
        department: file.metadata!.department,
        uploadedBy: user.name,
        uploadedAt: new Date(),
        lastModified: new Date(),
        accessType: file.metadata!.accessType,
        approvalStatus: file.metadata!.approvalRequired ? 'pending' : 'approved',
        tags: file.metadata!.tags,
        description: file.metadata!.description,
        url: URL.createObjectURL(file.file),
        notifyAllAfterApproval: file.metadata!.notifyAllAfterApproval,
        securityLevel: file.metadata!.securityLevel,
      } as Partial<Document>));

    onUpload(completedDocuments);
    
    // Reset state
    setUploadFiles([]);
    setCurrentStep('upload');
    onClose();
  };

  const allFilesCompleted = uploadFiles.length > 0 && uploadFiles.every(file => file.status === 'completed');

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-black bg-opacity-50 backdrop-blur-sm animate-in fade-in duration-300" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-sm shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden z-[81] animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-500 mx-4">
          {/* Header */}
          <div className={`flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 transform transition-all duration-300 delay-200 ease-out ${
            isOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
          }`}>
            <div>
              <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">Upload Files</Dialog.Title>
              <Dialog.Description className="text-sm text-gray-500 dark:text-gray-400">
                {currentStep === 'upload' ? 'Drop files or browse to upload' : 'Complete file metadata'}
              </Dialog.Description>
            </div>
            <Dialog.Close className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-700 transform hover:scale-110 hover:rotate-90 transition-all duration-200 ease-out">
              <X className="w-5 h-5" />
            </Dialog.Close>
          </div>

        {/* Content */}
        <div className={`p-6 max-h-[calc(90vh-140px)] overflow-auto transform transition-all duration-400 delay-100 ease-out ${
          isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          {currentStep === 'upload' ? (
            <div className="space-y-6">
              {/* Drop Zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-sm p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-gray-400 bg-gray-50 dark:bg-gray-700'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                } transform hover:scale-[1.02] transition-transform duration-200 ease-out`}
              >
                <Upload className={`w-12 h-12 text-gray-400 mx-auto mb-4 transform transition-all duration-200 ease-out ${
                  dragActive ? 'scale-110 text-eteal-500' : ''
                }`} />
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
                  Drop files here to upload
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  or click to browse
                </p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center px-4 py-2 bg-gray-700 dark:bg-gray-600 text-white rounded-sm hover:bg-gray-800 dark:hover:bg-gray-500 transition-all duration-200 ease-out cursor-pointer text-sm font-medium transform hover:scale-105 hover:shadow-lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Choose Files
                </label>
              </div>

              {/* Upload Progress */}
              {uploadFiles.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900 dark:text-white">Upload Progress</h3>
                  {uploadFiles.map((file) => (
                    <div key={file.id} className="bg-gray-50 dark:bg-gray-700 rounded-sm p-3 transform hover:scale-[1.01] hover:shadow-sm transition-all duration-200 ease-out">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getFileIconFromName(file.file.name)}
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {file.file.name}
                          </span>
                          {file.status === 'completed' && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                          {file.status === 'error' && (
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                        <button
                          onClick={() => removeFile(file.id)}
                          className="text-gray-400 hover:text-red-500 transform hover:scale-110 transition-all duration-200 ease-out"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div
                          className="bg-gray-600 dark:bg-gray-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>{file.status === 'completed' ? 'Completed' : 'Uploading...'}</span>
                        <span>{file.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="font-medium text-gray-900 dark:text-white">Document Metadata</h3>
              {uploadFiles.filter(f => f.status === 'completed').map((file) => (
                <div key={file.id} className="bg-gray-50 dark:bg-gray-700 rounded-sm p-4 space-y-4 transform hover:shadow-sm transition-all duration-200 ease-out">
                  <div className="flex items-center space-x-2 mb-3">
                    {getFileIconFromName(file.file.name, "w-5 h-5")}
                    <span className="font-medium text-gray-900 dark:text-white">{file.file.name}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Document Title
                      </label>
                      <input
                        type="text"
                        value={file.metadata?.title || ''}
                        onChange={(e) => updateMetadata(file.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-sm text-sm focus:ring-1 focus:ring-eteal-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Department
                      </label>
                      <select
                        value={file.metadata?.department || ''}
                        onChange={(e) => updateMetadata(file.id, 'department', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-sm text-sm focus:ring-1 focus:ring-eteal-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Document Type
                      </label>
                      <select
                        value={file.metadata?.type || 'Manual'}
                        onChange={(e) => updateMetadata(file.id, 'type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-sm text-sm focus:ring-1 focus:ring-eteal-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        {documentTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Access Type
                      </label>
                      <select
                        value={file.metadata?.accessType || 'public'}
                        onChange={(e) => updateMetadata(file.id, 'accessType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-sm text-sm focus:ring-1 focus:ring-eteal-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        <option value="public">Public</option>
                        <option value="department">Department Only</option>
                        <option value="restricted">Restricted</option>
                      </select>
                    </div>

                    {/* Security Level - Only show for admins */}
                    {user.role === 'admin' && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Security Classification
                        </label>
                        <select
                          value={file.metadata?.securityLevel || 'Public'}
                          onChange={(e) => updateMetadata(file.id, 'securityLevel', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-sm text-sm focus:ring-1 focus:ring-eteal-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                          {securityLevels.map((level) => (
                            <option key={level} value={level}>
                              {level}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      value={file.metadata?.description || ''}
                      onChange={(e) => updateMetadata(file.id, 'description', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-sm text-sm focus:ring-1 focus:ring-eteal-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Brief description of the document..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {file.metadata?.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-sm"
                        >
                          {tag}
                          <button
                            onClick={() => removeTag(file.id, index)}
                            className="ml-1 text-primary-500 dark:text-primary-200 hover:text-eteal-800 dark:hover:text-eteal-200"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Add tags (press Enter)"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addTag(file.id, e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-sm text-sm focus:ring-1 focus:ring-eteal-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`approval-${file.id}`}
                        checked={file.metadata?.approvalRequired || false}
                        onChange={(e) => updateMetadata(file.id, 'approvalRequired', e.target.checked)}
                        className="rounded border-gray-300 dark:border-gray-600 text-eteal-600 focus:ring-eteal-500"
                      />
                      <label htmlFor={`approval-${file.id}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Send for approval
                      </label>
                    </div>

                    {file.metadata?.approvalRequired && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Approver Email
                        </label>
                        <input
                          type="email"
                          value={file.metadata?.approverEmail || ''}
                          onChange={(e) => updateMetadata(file.id, 'approverEmail', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-sm text-sm focus:ring-1 focus:ring-eteal-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="manager@company.com"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 transform transition-all duration-300 delay-300 ease-out ${
          isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {uploadFiles.length > 0 && `${uploadFiles.filter(f => f.status === 'completed').length} of ${uploadFiles.length} files ready`}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 ease-out text-sm transform hover:scale-105"
            >
              Cancel
            </button>
            
            {currentStep === 'upload' && allFilesCompleted && (
              <button
                onClick={() => setCurrentStep('metadata')}
                className="px-4 py-2 bg-gray-700 dark:bg-gray-600 text-white rounded-sm hover:bg-gray-800 dark:hover:bg-gray-500 transition-all duration-200 ease-out text-sm font-medium transform hover:scale-105 hover:shadow-lg"
              >
                Continue
              </button>
            )}
            
            {currentStep === 'metadata' && (
              <button
                onClick={handleComplete}
                className="px-4 py-2 bg-gray-700 dark:bg-gray-600 text-white rounded-sm hover:bg-gray-800 dark:hover:bg-gray-500 transition-all duration-200 ease-out text-sm font-medium transform hover:scale-105 hover:shadow-lg"
              >
                Complete Upload
              </button>
            )}
          </div>
        </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}