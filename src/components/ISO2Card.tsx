import { motion } from 'framer-motion';
import { ChevronRight, FileText } from 'lucide-react';

interface ISO2Document {
  id: string;
  title: string;
  type: string;
  url: string;
}

interface ISO2Section {
  id: string;
  title: string;
  color: string;
  documents: ISO2Document[];
}

interface ISO2CardProps {
  section: ISO2Section;
  onShowAll: () => void;
  onDocumentClick: (document: ISO2Document) => void;
}

export default function ISO2Card({ section, onShowAll, onDocumentClick }: ISO2CardProps) {
  const displayedDocuments = section.documents.slice(0, 5);

  const handleDocumentClick = (document: ISO2Document) => {
    onDocumentClick(document);
  };

  return (
    <motion.div 
      className="iso2-card"
      whileHover={{ 
        scale: 1.02, 
        y: -8,
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
      }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="w-3 h-3 rounded-full transition-all duration-300 ease-out shadow-sm"
            style={{ position: 'relative', top: -8, backgroundColor: section.color }}
          >
          </div>
          <div>
            <h3 className="font-bold text-gray-800 dark:text-white text-lg">
              {section.title}
            </h3>
            <p className="text-xs text-gray-600 dark:text-white/60 mt-1">
              {section.documents.length} documents
            </p>
          </div>
        </div>
      </div>

      {/* Documents List */}
      <div className="flex-1 overflow-hidden">
        {displayedDocuments.map((document, index) => (
          <motion.div 
            key={document.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="group cursor-pointer"
            onClick={() => handleDocumentClick(document)}
          >
            <div className="p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-all duration-200">
              <p className="hover:text-primary-600 text-sm font-medium text-gray-800 dark:text-white truncate group-hover:underline transition-all duration-200">
                {document.title}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Show All Button */}
      <div className="pt-4 mt-auto">
        <motion.button
          onClick={onShowAll}
          className="flex items-center justify-between w-full p-3 rounded-lg bg-gray-50/50 dark:bg-slate-700/30 hover:bg-gray-100 dark:hover:bg-slate-600/50 transition-all duration-200 group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Show All Documents
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>
    </motion.div>
  );
}
