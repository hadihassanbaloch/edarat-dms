import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, PenTool, Check, AlertCircle, FileText, User, Calendar } from 'lucide-react';
import { User as UserType, Document } from '../types';

interface DigitalSignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSign: (signature: string) => void;
  document: Document;
  user: UserType;
}

export default function DigitalSignatureModal({
  isOpen,
  onClose,
  onSign,
  document,
  user
}: DigitalSignatureModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [currentStep, setCurrentStep] = useState<'consent' | 'sign' | 'confirm'>('consent');
  const [signatureData, setSignatureData] = useState<string>('');

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep('consent');
      setHasSignature(false);
      setSignatureData('');
      clearCanvas();
    }
  }, [isOpen]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasSignature(false);
        setSignatureData('');
      }
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      setIsDrawing(true);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#1f2937';
      setHasSignature(true);
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas && hasSignature) {
      const dataURL = canvas.toDataURL();
      setSignatureData(dataURL);
    }
  };

  const handleSign = () => {
    if (hasSignature && signatureData) {
      onSign(signatureData);
      onClose();
    }
  };

  const renderConsentStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
          <FileText className="w-8 h-8 text-primary-600 dark:text-primary-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Digital Signature Required
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          You are about to digitally sign and acknowledge this document
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Document Details:</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Title:</span>
            <span className="font-medium text-gray-900 dark:text-white">{document.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Department:</span>
            <span className="font-medium text-gray-900 dark:text-white">{document.department}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Date:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">Legal Notice</p>
            <p className="text-blue-800 dark:text-blue-200">
              By proceeding with the digital signature, you confirm that you have read, understood, 
              and agree to acknowledge this document. This digital signature has the same legal 
              validity as a handwritten signature.
            </p>
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => setCurrentStep('sign')}
          className="flex-1 px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          Proceed to Sign
        </button>
      </div>
    </div>
  );

  const renderSignStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
          <PenTool className="w-8 h-8 text-primary-600 dark:text-primary-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Create Your Signature
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Draw your signature in the box below
        </p>
      </div>

      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
        <canvas
          ref={canvasRef}
          width={400}
          height={150}
          className="w-full border border-gray-200 dark:border-gray-700 rounded bg-white cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
        <div className="flex justify-between items-center mt-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Draw your signature above
          </p>
          <button
            onClick={clearCanvas}
            className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={() => setCurrentStep('consent')}
          className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Back
        </button>
        <button
          onClick={() => setCurrentStep('confirm')}
          disabled={!hasSignature}
          className="flex-1 px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );

  const renderConfirmStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
          <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Confirm Your Signature
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Please review your signature before finalizing
        </p>
      </div>

      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Signature Preview:</h4>
        {signatureData && (
          <img 
            src={signatureData} 
            alt="Your signature" 
            className="border border-gray-300 dark:border-gray-600 rounded bg-white p-2 w-full max-h-32 object-contain"
          />
        )}
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Signature Details:</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600 dark:text-gray-400">Signed by:</span>
            <span className="font-medium text-gray-900 dark:text-white">{user.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600 dark:text-gray-400">Date & Time:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {new Date().toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={() => setCurrentStep('sign')}
          className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Redo Signature
        </button>
        <button
          onClick={handleSign}
          className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Check className="w-4 h-4" />
          <span>Sign Document</span>
        </button>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Digital Signature
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <div className="p-6">
            {currentStep === 'consent' && renderConsentStep()}
            {currentStep === 'sign' && renderSignStep()}
            {currentStep === 'confirm' && renderConfirmStep()}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
