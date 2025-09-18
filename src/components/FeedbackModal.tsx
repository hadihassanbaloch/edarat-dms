import React, { useState } from 'react';
import { X, MessageCircle, Send } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { Document } from '../types';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: string) => void;
  document: Document | null;
}

export default function FeedbackModal({ isOpen, onClose, onSubmit, document }: FeedbackModalProps) {
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSubmit(feedback);
    setFeedback('');
    setIsSubmitting(false);
    onClose();
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFeedback('');
      onClose();
    }
  };

  if (!document) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[200] bg-black bg-opacity-60 backdrop-blur-sm animate-in fade-in duration-300" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden z-[201] animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-500">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-teal-600 to-teal-700 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <Dialog.Title className="text-lg font-bold">Send Feedback</Dialog.Title>
                  <Dialog.Description className="text-teal-100 text-sm">
                    Provide feedback on this document
                  </Dialog.Description>
                </div>
              </div>
              <Dialog.Close 
                className="p-2 text-teal-100 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 transform hover:scale-110 hover:rotate-90"
                disabled={isSubmitting}
              >
                <X className="w-5 h-5" />
              </Dialog.Close>
            </div>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Document Info */}
            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                {document.title}
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {document.type} • {document.department}
              </div>
            </div>

            {/* Feedback Input */}
            <div className="mb-6">
              <label 
                htmlFor="feedback" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Your Feedback <span className="text-red-500">*</span>
              </label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Please provide your feedback or concerns about this document..."
                required
                disabled={isSubmitting}
              />
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {feedback.length}/500 characters
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
                disabled={isSubmitting || !feedback.trim()}
                className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Feedback</span>
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