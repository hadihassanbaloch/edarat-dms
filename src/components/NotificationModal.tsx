import React, { useState, useRef, useEffect } from 'react';
import { X, Search, User, Users, Check, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Document, User as UserType, Department } from '../types';
import { mockUsers } from '../data/mockData';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (recipients: NotificationRecipient[], notes?: string) => void;
  document: Document | null;
}

interface NotificationRecipient {
  type: 'user' | 'department';
  id: string;
  name: string;
  email?: string;
}

interface AutocompleteOption {
  type: 'user' | 'department';
  id: string;
  name: string;
  email?: string;
  department?: string;
}

export default function NotificationModal({ isOpen, onClose, onSend, document }: NotificationModalProps) {
  const [selectedRecipients, setSelectedRecipients] = useState<NotificationRecipient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [notes, setNotes] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Mock departments for autocomplete
  const departments = [
    { id: 'hr', name: 'Human Resources' },
    { id: 'it', name: 'Information Technology' },
    { id: 'finance', name: 'Finance' },
    { id: 'legal', name: 'Legal' },
    { id: 'operations', name: 'Operations' },
    { id: 'marketing', name: 'Marketing' }
  ];

  // Create autocomplete options from users and departments
  const autocompleteOptions: AutocompleteOption[] = [
    ...mockUsers.map(user => ({
      type: 'user' as const,
      id: user.id,
      name: user.name,
      email: user.email,
      department: user.department
    })),
    ...departments.map(dept => ({
      type: 'department' as const,
      id: dept.id,
      name: dept.name
    }))
  ];

  // Filter options based on search query
  const filteredOptions = autocompleteOptions.filter(option => {
    if (searchQuery.length < 1) return false;
    
    // Don't show already selected options
    const isSelected = selectedRecipients.some(recipient => 
      recipient.type === option.type && recipient.id === option.id
    );
    if (isSelected) return false;

    // Filter by name or email
    const searchLower = searchQuery.toLowerCase();
    const nameMatch = option.name.toLowerCase().includes(searchLower);
    const emailMatch = option.email?.toLowerCase().includes(searchLower);
    const departmentMatch = option.department?.toLowerCase().includes(searchLower);
    
    return nameMatch || emailMatch || departmentMatch;
  }).slice(0, 6); // Limit to 6 suggestions

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    setShowSuggestions(value.length > 0);
    setFocusedSuggestionIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || filteredOptions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedSuggestionIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedSuggestionIndex >= 0) {
          selectOption(filteredOptions[focusedSuggestionIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setFocusedSuggestionIndex(-1);
        break;
    }
  };

  const selectOption = (option: AutocompleteOption) => {
    const newRecipient: NotificationRecipient = {
      type: option.type,
      id: option.id,
      name: option.name,
      email: option.email
    };

    setSelectedRecipients(prev => [...prev, newRecipient]);
    setSearchQuery('');
    setShowSuggestions(false);
    setFocusedSuggestionIndex(-1);
    inputRef.current?.focus();
  };

  const removeRecipient = (index: number) => {
    setSelectedRecipients(prev => prev.filter((_, i) => i !== index));
  };

  const handleSend = () => {
    if (selectedRecipients.length === 0) return;
    
    onSend(selectedRecipients, notes.trim() || undefined);
    
    // Reset form
    setSelectedRecipients([]);
    setSearchQuery('');
    setNotes('');
    onClose();
  };

  const handleClose = () => {
    setSelectedRecipients([]);
    setSearchQuery('');
    setNotes('');
    setShowSuggestions(false);
    onClose();
  };

  // Focus management for suggestions
  useEffect(() => {
    if (focusedSuggestionIndex >= 0) {
      suggestionRefs.current[focusedSuggestionIndex]?.scrollIntoView({
        block: 'nearest'
      });
    }
  }, [focusedSuggestionIndex]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Send Notification
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Request acknowledgment for document
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-6 pb-6">
            {/* Document Info */}
            {document && (
              <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {document.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {document.department} • {document.type}
                </p>
              </div>
            )}

            {/* Recipients Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Recipients
              </label>
              
              {/* Selected Recipients */}
              {selectedRecipients.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedRecipients.map((recipient, index) => (
                    <motion.div
                      key={`${recipient.type}-${recipient.id}`}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center space-x-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-3 py-1 rounded-full text-sm"
                    >
                      {recipient.type === 'user' ? (
                        <User className="w-3 h-3" />
                      ) : (
                        <Users className="w-3 h-3" />
                      )}
                      <span>{recipient.name}</span>
                      <button
                        onClick={() => removeRecipient(index)}
                        className="text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Search Input */}
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setShowSuggestions(searchQuery.length > 0)}
                    placeholder="Search users or departments..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && filteredOptions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto"
                  >
                    {filteredOptions.map((option, index) => (
                      <div
                        key={`${option.type}-${option.id}`}
                        ref={el => suggestionRefs.current[index] = el}
                        onClick={() => selectOption(option)}
                        className={`flex items-center space-x-3 px-4 py-2 cursor-pointer transition-colors duration-150 ${
                          index === focusedSuggestionIndex
                            ? 'bg-teal-50 dark:bg-teal-900/20'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-600'
                        }`}
                      >
                        {option.type === 'user' ? (
                          <User className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Users className="w-4 h-4 text-gray-400" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {option.name}
                          </p>
                          {option.email && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {option.email}
                            </p>
                          )}
                          {option.department && option.type === 'user' && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {option.department}
                            </p>
                          )}
                        </div>
                        <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                          {option.type}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Notes Field */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes <span className="text-gray-400">(Optional)</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add a note about why this document needs acknowledgment..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={selectedRecipients.length === 0}
                className="flex items-center space-x-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200"
              >
                <Bell className="w-4 h-4" />
                <span>Send Notification</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

