import React, { useState } from 'react';
import { X, Building2, Plus } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';

interface AddDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (department: { name: string; color: string }) => void;
}

const predefinedColors = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Orange
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#F97316', // Orange-Red
  '#84CC16', // Lime
  '#EC4899', // Pink
  '#6366F1', // Indigo
];

export default function AddDepartmentModal({ isOpen, onClose, onAdd }: AddDepartmentModalProps) {
  const [departmentName, setDepartmentName] = useState('');
  const [selectedColor, setSelectedColor] = useState(predefinedColors[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!departmentName.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onAdd({
      name: departmentName.trim(),
      color: selectedColor
    });
    
    // Reset form
    setDepartmentName('');
    setSelectedColor(predefinedColors[0]);
    setIsSubmitting(false);
    onClose();
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setDepartmentName('');
      setSelectedColor(predefinedColors[0]);
      onClose();
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[200] bg-black bg-opacity-60 backdrop-blur-sm animate-in fade-in duration-300" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden z-[201] animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-500">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-eteal-600 to-emerald-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <Dialog.Title className="text-lg font-bold">Add New Department</Dialog.Title>
                  <Dialog.Description className="text-eteal-100 text-sm">
                    Create a new department for document organization
                  </Dialog.Description>
                </div>
              </div>
              <Dialog.Close 
                className="p-2 text-eteal-100 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 transform hover:scale-110 hover:rotate-90"
                disabled={isSubmitting}
              >
                <X className="w-5 h-5" />
              </Dialog.Close>
            </div>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Department Name */}
            <div className="mb-6">
              <label 
                htmlFor="departmentName" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Department Name <span className="text-red-500">*</span>
              </label>
              <input
                id="departmentName"
                type="text"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-eteal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Enter department name..."
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Color Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Department Color
              </label>
              <div className="grid grid-cols-5 gap-3">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    disabled={isSubmitting}
                    className={`w-10 h-10 rounded-full border-4 transition-all duration-200 transform hover:scale-110 ${
                      selectedColor === color
                        ? 'border-gray-800 dark:border-white shadow-lg'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="mt-3 flex items-center space-x-3">
                <div
                  className="w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600"
                  style={{ backgroundColor: selectedColor }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Selected color
                </span>
              </div>
            </div>

            {/* Preview */}
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview</h3>
              <div className="flex items-center space-x-3">
                <div 
                  className="w-1.5 h-8 rounded-full"
                  style={{ backgroundColor: selectedColor }}
                />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {departmentName || 'Department Name'}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">0 documents</p>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 text-sm font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !departmentName.trim()}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-700 dark:bg-gray-600 text-white rounded-xl hover:bg-gray-800 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Add Department</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}