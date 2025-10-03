import React, { useState } from 'react';
import { Folder, FolderOpen, ChevronRight, Search, Clock, AlertCircle, FileText, File, FileSpreadsheet, FileImage, FileVideo, FileAudio, Archive, Check, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Department, Document } from '../types';

interface TreeExplorerProps {
  departments: Department[];
  documentsByDepartment: { department: Department; documents: Document[] }[];
  onFolderClick: (department: Department) => void;
  onDocumentClick: (document: Document) => void;
  selectedFolder?: string;
  userRole?: 'admin' | 'manager' | 'employee';
}

interface FolderItemProps {
  department: Department;
  level: number;
  isExpanded: boolean;
  isSelected: boolean;
  onToggle: () => void;
  onSelect: () => void;
  expandedDepartments: Set<string>;
  onDepartmentToggle: (id: string) => void;
  onFolderClick: (department: Department) => void;
  documents: Document[];
  onDocumentClick: (document: Document) => void;
  selectedFolder?: string;
}

function FolderItem({
  department,
  level,
  isExpanded,
  isSelected,
  onToggle,
  onSelect,
  expandedDepartments,
  onDepartmentToggle,
  onFolderClick,
  documents,
  onDocumentClick,
  selectedFolder
}: FolderItemProps) {
  const departmentDocuments = documents.filter(doc => {
    // Match by department name (for main departments)
    if (doc.department === department.name) return true;
    // Match by path (for nested folders)
    if (doc.department === department.path) return true;
    // Match if document department starts with this folder's path
    if (department.path && doc.department.startsWith(department.path)) return true;
    return false;
  });
  const hasChildren = department.children && department.children.length > 0;

  const getFileIcon = (fileType: string) => {
    const iconSize = "w-4 h-4";
    const iconColor = "text-gray-500 dark:text-gray-400";
    
    switch (fileType?.toLowerCase()) {
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

  return (
    <div>
      {/* Folder Row */}
      <div
        className={`flex items-center py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200 ${
          isSelected ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-200' : ''
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {/* Expand/Collapse Icon */}
        <div 
          className="w-4 h-4 mr-1 flex items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
          onClick={(e) => {
            e.stopPropagation();
            if (hasChildren) {
              onToggle();
            }
          }}
        >
          {hasChildren && (
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="w-3 h-3 text-gray-500" />
            </motion.div>
          )}
        </div>

        {/* Folder Icon and Name - Clickable */}
        <div 
          className="flex items-center flex-1 cursor-pointer"
          onClick={() => onSelect()}
        >
          <div className="relative mr-2">
            {isExpanded && hasChildren ? (
              <FolderOpen className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            ) : (
              <Folder className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            )}
            
            {/* Color label dot */}
            {department.color && (
              <div 
                className="absolute -top-0.5 -left-0.5 w-2 h-2 rounded-full border border-white dark:border-gray-800"
                style={{ backgroundColor: department.color }}
              />
            )}
          </div>

          {/* Folder Name with Document Count */}
          <span className="text-sm font-medium text-gray-900 dark:text-white flex-1 truncate">
            {department.name}
          </span>
          
          {/* Document Count Badge */}
          {departmentDocuments.length > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
              {departmentDocuments.length}
            </span>
          )}
        </div>
      </div>

      {/* Children */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Documents are hidden in tree view - only folders shown */}
            
            {/* Child folders */}
            {department.children?.map((child) => (
                  <FolderItem
                    key={child.id}
                    department={child}
                    level={level + 1}
                    isExpanded={expandedDepartments.has(child.id)}
                    isSelected={selectedFolder === child.id}
                    onToggle={() => onDepartmentToggle(child.id)}
                    onSelect={() => onFolderClick(child)}
                    expandedDepartments={expandedDepartments}
                    onDepartmentToggle={onDepartmentToggle}
                    onFolderClick={onFolderClick}
                    documents={documents}
                    onDocumentClick={onDocumentClick}
                    selectedFolder={selectedFolder}
                  />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function TreeExplorer({
  departments,
  documentsByDepartment,
  onFolderClick,
  onDocumentClick,
  selectedFolder,
  userRole = 'admin'
}: TreeExplorerProps) {
  const [expandedDepartments, setExpandedDepartments] = useState<Set<string>>(new Set(['main-root']));
  const [searchQuery, setSearchQuery] = useState('');

  // Auto-expand path to selected folder
  React.useEffect(() => {
    if (selectedFolder) {
      const newExpanded = new Set(expandedDepartments);
      
      // Find the selected department and expand its path
      const findAndExpandPath = (depts: Department[], targetId: string): boolean => {
        for (const dept of depts) {
          if (dept.id === targetId) {
            newExpanded.add('main-root'); // Always expand main root
            return true;
          }
          if (dept.children && findAndExpandPath(dept.children, targetId)) {
            newExpanded.add(dept.id);
            return true;
          }
        }
        return false;
      };
      
      findAndExpandPath(departments, selectedFolder);
      setExpandedDepartments(newExpanded);
    }
  }, [selectedFolder, departments]);

  const toggleDepartment = (departmentId: string) => {
    const newExpanded = new Set(expandedDepartments);
    if (newExpanded.has(departmentId)) {
      newExpanded.delete(departmentId);
    } else {
      newExpanded.add(departmentId);
    }
    setExpandedDepartments(newExpanded);
  };

  const buildDepartmentTree = (departments: Department[]): Department[] => {
    const departmentMap = new Map<string, Department>();
    const roots: Department[] = [];

    // Build map
    departments.forEach(dept => {
      departmentMap.set(dept.id, { ...dept, children: [] });
    });

    // Build tree
    departments.forEach(dept => {
      const departmentNode = departmentMap.get(dept.id)!;
      if (dept.parentId) {
        const parent = departmentMap.get(dept.parentId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(departmentNode);
        }
      } else {
        roots.push(departmentNode);
      }
    });

    return roots;
  };

  const departmentTree = buildDepartmentTree(departments);

  // Filter departments and documents based on search
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return { departments: [], documents: [] };
    
    const query = searchQuery.toLowerCase();
    
    // Find matching departments (recursive search through all levels)
    const findMatchingDepartments = (depts: Department[], parentPath = ''): Department[] => {
      const matches: Department[] = [];
      
      depts.forEach(dept => {
        const fullPath = parentPath ? `${parentPath}/${dept.name}` : dept.name;
        const isMatch = dept.name.toLowerCase().includes(query) || 
                       dept.path?.toLowerCase().includes(query);
        
        if (isMatch) {
          matches.push({ ...dept, path: fullPath });
        }
        
        // Recursively search children
        if (dept.children) {
          const childMatches = findMatchingDepartments(dept.children, fullPath);
          matches.push(...childMatches);
        }
      });
      
      return matches;
    };
    
    // Find matching documents
    const matchingDocuments = documentsByDepartment.flatMap(({ documents }) =>
      documents.filter(doc => 
        doc.title.toLowerCase().includes(query) ||
        doc.description?.toLowerCase().includes(query) ||
        doc.department.toLowerCase().includes(query) ||
        doc.tags.some(tag => tag.toLowerCase().includes(query))
      )
    );
    
    return {
      departments: findMatchingDepartments(departmentTree),
      documents: matchingDocuments
    };
  }, [searchQuery, departmentTree, documentsByDepartment]);

  const filteredDepartments = searchResults.departments;

  // Get main department folders
  const mainDepartments = [
    'Human Resources',
    'Information Technology', 
    'Finance',
    'Legal',
    'Operations',
    'Marketing'
  ];

  const organizedDepartments = departmentTree.filter(dept => 
    mainDepartments.includes(dept.name)
  );

  return (
    <div className="h-full flex flex-col">
      {/* Search Field */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Quick search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
      </div>

      {/* Tree Content */}
      <div className="flex-1 overflow-y-auto">
        {searchQuery ? (
          /* Search Results */
          <div className="p-4">
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Search Results ({filteredDepartments.length + searchResults.documents.length} items)
            </h4>
            
            {/* Matching Folders */}
            {filteredDepartments.length > 0 && (
              <div className="mb-4">
                <h5 className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Folders ({filteredDepartments.length})</h5>
                <div className="space-y-1">
                  {filteredDepartments.map((department) => (
                    <div
                      key={department.id}
                      className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md cursor-pointer transition-colors duration-200"
                      onClick={() => onFolderClick(department)}
                    >
                      <Folder className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 dark:text-white truncate">{department.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{department.path}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Matching Documents */}
            {searchResults.documents.length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Documents ({searchResults.documents.length})</h5>
                <div className="space-y-1">
                  {searchResults.documents.map((document) => (
                    <div
                      key={document.id}
                      className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md cursor-pointer transition-colors duration-200"
                      onClick={() => onDocumentClick(document)}
                    >
                      <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 dark:text-white truncate">{document.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{document.department}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {filteredDepartments.length === 0 && searchResults.documents.length === 0 && (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500 dark:text-gray-400">No folders or documents found</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Try a different search term</p>
              </div>
            )}
          </div>
        ) : (
          /* Organized Sections */
          <>
            {/* Recent Visited - Clickable List Item */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-800">
              <div
                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-md transition-colors duration-200"
                onClick={() => {
                  // Create a virtual "Recent Visited" department to show recent documents
                  const recentVisitedDept = {
                    id: 'recent-visited',
                    name: 'Recent Visited',
                    color: '#6B7280',
                    documentCount: 10,
                    pendingCount: 0,
                    parentId: null,
                    path: 'Recent Visited'
                  };
                  onFolderClick(recentVisitedDept);
                }}
              >
                <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Recent Visited
                </h4>
                <span className="text-xs text-gray-400 ml-auto">(10 docs)</span>
              </div>
            </div>

            {/* Recent Approvals - Admin only */}
            {userRole === 'admin' && (
              <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                <div
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-md transition-colors duration-200"
                  onClick={() => {
                    // Create a virtual "Recent Approvals" department
                    const recentApprovalsDept = {
                      id: 'recent-approvals',
                      name: 'Recent Approvals',
                      color: '#10B981',
                      documentCount: 0,
                      pendingCount: 0,
                      parentId: null,
                      path: 'Recent Approvals'
                    };
                    onFolderClick(recentApprovalsDept);
                  }}
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-teal-500" />
                  </div>
                  <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Recent Approvals
                  </h4>
                  <span className="text-xs text-gray-400 ml-auto">
                    ({documentsByDepartment.flatMap(d => d.documents).filter(doc => {
                      if (doc.approvalStatus !== 'approved' || !doc.approvedAt) return false;
                      const thirtyDaysAgo = new Date();
                      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                      return new Date(doc.approvedAt) >= thirtyDaysAgo;
                    }).length} docs)
                  </span>
                </div>
              </div>
            )}

            {/* Pending Approvals - Hidden for employee users */}
            {userRole !== 'employee' && (
              <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                <div
                  className="flex items-center space-x-2 cursor-pointer hover:bg-amber-50 dark:hover:bg-amber-900/20 p-2 rounded-md transition-colors duration-200"
                  onClick={() => {
                    // Create a virtual "Pending Approvals" department to show pending documents
                    const pendingApprovalsDept = {
                      id: 'pending-approvals',
                      name: 'Pending Approvals',
                      color: '#F59E0B',
                      documentCount: 15,
                      pendingCount: 8,
                      parentId: null,
                      path: 'Pending Approvals'
                    };
                    onFolderClick(pendingApprovalsDept);
                  }}
                >
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Pending Approvals
                  </h4>
                  <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs rounded-full ml-auto">
                    8
                  </span>
                </div>
              </div>
            )}

            {/* Full Tree Structure starting from Main */}
            <div className="p-4">
              {/* Main Root Folder */}
              <div className="space-y-1">
                <FolderItem
                  key="main-root"
                  department={{
                    id: 'main-root',
                    name: 'Main',
                    color: '#6B7280',
                    documentCount: departmentTree.reduce((total, dept) => total + (dept.documentCount || 0), 0),
                    pendingCount: 0,
                    parentId: null,
                    path: 'Main',
                    children: departmentTree
                  }}
                  level={0}
                  isExpanded={expandedDepartments.has('main-root')}
                  isSelected={selectedFolder === 'main-root'}
                  onToggle={() => toggleDepartment('main-root')}
                  onSelect={() => {
                    const mainDept = {
                      id: 'main-root',
                      name: 'Main',
                      color: '#6B7280',
                      documentCount: departmentTree.reduce((total, dept) => total + (dept.documentCount || 0), 0),
                      pendingCount: 0,
                      parentId: null,
                      path: 'Main'
                    };
                    onFolderClick(mainDept);
                  }}
                  expandedDepartments={expandedDepartments}
                  onDepartmentToggle={toggleDepartment}
                  onFolderClick={onFolderClick}
                  documents={documentsByDepartment.flatMap(item => item.documents)}
                  onDocumentClick={onDocumentClick}
                  selectedFolder={selectedFolder}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}