import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Palette } from 'lucide-react';

interface NewCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (card: { title: string; color: string }) => void;
}

const colorOptions = [
  '#0AACCC', // Blue
  '#10B981', // Green
  '#F59E0B', // Orange
  '#8B5CF6', // Purple
  '#EF4444', // Red
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#F97316', // Orange
  '#EC4899', // Pink
  '#6366F1', // Indigo
];

export default function NewCardModal({ isOpen, onClose, onAdd }: NewCardModalProps) {
  const [title, setTitle] = useState('');
  const [selectedColor, setSelectedColor] = useState('#0AACCC');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd({ title: title.trim(), color: selectedColor });
      setTitle('');
      setSelectedColor('#0AACCC');
      onClose();
    }
  };

  const handleClose = () => {
    setTitle('');
    setSelectedColor('#0AACCC');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={handleClose}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md glass-panel rounded-2xl p-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                    <Plus className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Add New Card
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Card Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Card Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter card title..."
                    className="glass-input w-full"
                    required
                    autoFocus
                  />
                </div>

                {/* Color Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    <div className="flex items-center space-x-2">
                      <Palette className="w-4 h-4" />
                      <span>Label Color</span>
                    </div>
                  </label>
                  <div className="grid grid-cols-5 gap-3">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 ${
                          selectedColor === color
                            ? 'border-gray-400 dark:border-gray-500 scale-110'
                            : 'border-gray-200 dark:border-gray-600 hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Selected: {selectedColor}
                  </div>
                </div>

                {/* Preview */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preview
                  </label>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div 
                      className="w-3 h-3 rounded-full shadow-sm -mt-2"
                      style={{ backgroundColor: selectedColor }}
                    />
                    <div>
                      <h4 className="font-bold text-gray-800 dark:text-white text-lg">
                        {title || 'Card Title'}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-white/60 mt-1">
                        0 documents
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="glass-button"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="glass-button-primary"
                    disabled={!title.trim()}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Card</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
