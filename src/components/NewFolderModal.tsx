import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Folder, Check, Shield, Eye, Download, Share2, Edit3 } from 'lucide-react';

interface NewFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: { name: string; color: string; restrictions: string[] }) => void;
}

const colorOptions = [
  { value: '#6B7280', label: 'Gray' },
  { value: '#EF4444', label: 'Red' },
  { value: '#F97316', label: 'Orange' },
  { value: '#EAB308', label: 'Yellow' },
  { value: '#22C55E', label: 'Green' },
  { value: '#0AACCC', label: 'Teal' },
  { value: '#3B82F6', label: 'Blue' },
  { value: '#8B5CF6', label: 'Purple' },
  { value: '#EC4899', label: 'Pink' },
];

const restrictionOptions = [
  { id: 'view', label: 'View Only', icon: Eye, description: 'Users can only view documents' },
  { id: 'download', label: 'No Download', icon: Download, description: 'Prevent downloading of documents' },
  { id: 'share', label: 'No Sharing', icon: Share2, description: 'Prevent sharing documents externally' },
  { id: 'edit', label: 'No Editing', icon: Edit3, description: 'Prevent editing or modification' },
  { id: 'admin', label: 'Admin Only', icon: Shield, description: 'Only administrators can access' },
];

export default function NewFolderModal({ isOpen, onClose, onCreate }: NewFolderModalProps) {
  const [folderName, setFolderName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#6B7280');
  const [enableRestrictions, setEnableRestrictions] = useState(false);
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (folderName.trim()) {
      onCreate({
        name: folderName.trim(),
        color: selectedColor,
        restrictions: enableRestrictions ? selectedRestrictions : []
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setFolderName('');
    setSelectedColor('#6B7280');
    setEnableRestrictions(false);
    setSelectedRestrictions([]);
    onClose();
  };

  const toggleRestriction = (restrictionId: string) => {
    setSelectedRestrictions(prev => 
      prev.includes(restrictionId)
        ? prev.filter(id => id !== restrictionId)
        : [...prev, restrictionId]
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50"
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <Folder className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Create New Folder
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Folder Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Folder Name
              </label>
              <input
                type="text"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Enter folder name..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                autoFocus
                required
              />
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Color Label
              </label>
              <div className="grid grid-cols-5 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setSelectedColor(color.value)}
                    className={`relative w-10 h-10 rounded-lg border-2 transition-all duration-200 ${
                      selectedColor === color.value
                        ? 'border-gray-400 dark:border-gray-500 scale-110'
                        : 'border-gray-200 dark:border-gray-600 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.label}
                  >
                    {selectedColor === color.value && (
                      <Check className="w-4 h-4 text-white absolute inset-0 m-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Restrictions Toggle */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Access Restrictions
                </label>
                <button
                  type="button"
                  onClick={() => setEnableRestrictions(!enableRestrictions)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    enableRestrictions ? 'bg-gray-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                      enableRestrictions ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Restrictions Options */}
              <AnimatePresence>
                {enableRestrictions && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                  >
                    {restrictionOptions.map((restriction) => (
                      <label
                        key={restriction.id}
                        className="flex items-start space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <input
                          type="checkbox"
                          checked={selectedRestrictions.includes(restriction.id)}
                          onChange={() => toggleRestriction(restriction.id)}
                          className="mt-1 w-4 h-4 text-primary-500 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <restriction.icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {restriction.label}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {restriction.description}
                          </p>
                        </div>
                      </label>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!folderName.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-700 dark:bg-gray-600 hover:bg-gray-800 dark:hover:bg-gray-500 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg transition-colors duration-200"
              >
                Create Folder
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
