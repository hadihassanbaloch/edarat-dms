import React, { useState } from 'react';
import { ArrowLeft, Folder, FolderOpen, File, ChevronRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TreeExamplesProps {
  onBack: () => void;
}

interface TreeNode {
  id: string;
  label: string;
  icon?: React.ComponentType<any>;
  children?: TreeNode[];
  type?: 'folder' | 'file' | 'database' | 'config' | 'document';
}

// Sample data for different tree styles
const fileSystemTree: TreeNode[] = [
  {
    id: '1',
    label: 'src',
    icon: Folder,
    type: 'folder',
    children: [
      {
        id: '1.1',
        label: 'components',
        icon: Folder,
        type: 'folder',
        children: [
          { id: '1.1.1', label: 'Header.tsx', icon: File, type: 'file' },
          { id: '1.1.2', label: 'Sidebar.tsx', icon: File, type: 'file' },
          { id: '1.1.3', label: 'TreeExplorer.tsx', icon: File, type: 'file' }
        ]
      },
      {
        id: '1.2',
        label: 'pages',
        icon: Folder,
        type: 'folder',
        children: [
          { id: '1.2.1', label: 'Dashboard.tsx', icon: File, type: 'file' },
          { id: '1.2.2', label: 'Settings.tsx', icon: File, type: 'file' }
        ]
      },
      { id: '1.3', label: 'App.tsx', icon: File, type: 'file' },
      { id: '1.4', label: 'index.css', icon: File, type: 'file' }
    ]
  },
  {
    id: '2',
    label: 'public',
    icon: Folder,
    type: 'folder',
    children: [
      { id: '2.1', label: 'index.html', icon: File, type: 'file' },
      { id: '2.2', label: 'favicon.ico', icon: File, type: 'file' }
    ]
  }
];


interface TreeComponentProps {
  data: TreeNode[];
  style: 'classic';
  title: string;
}

function TreeComponent({ data, style, title }: TreeComponentProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['1']));

  const toggleExpand = (nodeId: string) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpanded(newExpanded);
  };

  const renderNode = (node: TreeNode, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expanded.has(node.id);
    
    // For folders, use FolderOpen when expanded, Folder when collapsed
    let Icon = node.icon || File;
    if (node.type === 'folder' && hasChildren) {
      Icon = isExpanded ? FolderOpen : Folder;
    }

    const getNodeStyles = () => {
      return {
        container: 'py-1',
        indent: level * 20,
        icon: 'text-gray-600 dark:text-gray-400',
        text: 'text-gray-800 dark:text-gray-200',
        hover: 'hover:bg-gray-100 dark:hover:bg-gray-700'
      };
    };

    const styles = getNodeStyles();

    const ExpandIcon = () => {
      if (!hasChildren) return <div className="w-4 h-4" />;
      
      return isExpanded ? (
        <ChevronDown className="w-3 h-3 text-gray-500 mr-2" />
      ) : (
        <ChevronRight className="w-3 h-3 text-gray-500 mr-2" />
      );
    };

    return (
      <div key={node.id}>
        <div
          className={`flex items-center cursor-pointer transition-colors ${styles.container} ${styles.hover}`}
          style={{ paddingLeft: `${styles.indent}px` }}
          onClick={() => hasChildren && toggleExpand(node.id)}
        >
          <ExpandIcon />
          <Icon className={`w-4 h-4 mr-2 ${styles.icon}`} />
          <span className={styles.text}>{node.label}</span>
        </div>
        
        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {node.children!.map(child => renderNode(child, level + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const getContainerStyles = () => {
    return 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg';
  };

  return (
    <div className={`p-4 ${getContainerStyles()}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <div className="space-y-1">
        {data.map(node => renderNode(node))}
      </div>
    </div>
  );
}

export default function TreeExamples({ onBack }: TreeExamplesProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tree Menu Examples</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Classic File System Tree</h2>
            <p className="text-gray-600 dark:text-gray-400">
              A traditional file system tree component with dynamic folder icons, smooth animations, and intuitive expand/collapse behavior.
            </p>
          </div>

          <div className="max-w-2xl">
            {/* Classic File System Tree */}
            <TreeComponent
              data={fileSystemTree}
              style="classic"
              title="Classic File System Tree"
            />
          </div>

          {/* Style Guide */}
          <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Classic File System Tree Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Visual Design</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Traditional expand/collapse chevrons</li>
                  <li>• Clean, minimal styling</li>
                  <li>• Standard 20px indentation per level</li>
                  <li>• Subtle hover effects</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Interactive Features</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Dynamic folder icons (open/closed)</li>
                  <li>• Smooth expand/collapse animations</li>
                  <li>• File type specific icons</li>
                  <li>• Click anywhere on row to expand</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
