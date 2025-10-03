import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical, ChevronRight } from 'lucide-react';

interface DropdownSubItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: () => void;
}

interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  destructive?: boolean;
  divider?: boolean;
  submenu?: DropdownSubItem[];
}

interface DropdownMenuProps {
  items: DropdownItem[];
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  className?: string;
  buttonClassName?: string;
}

export default function DropdownMenu({ 
  items, 
  position = 'top-right', 
  className = '', 
  buttonClassName = '' 
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredSubmenu, setHoveredSubmenu] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const submenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHoveredSubmenu(null);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (submenuTimeoutRef.current) {
        clearTimeout(submenuTimeoutRef.current);
      }
    };
  }, [isOpen]);

  const handleSubmenuHover = (itemId: string | null) => {
    if (submenuTimeoutRef.current) {
      clearTimeout(submenuTimeoutRef.current);
    }

    if (itemId) {
      setHoveredSubmenu(itemId);
    } else {
      submenuTimeoutRef.current = setTimeout(() => {
        setHoveredSubmenu(null);
      }, 150);
    }
  };

  const getDropdownClasses = () => {
    const baseClasses = "absolute z-50 min-w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1";
    
    switch (position) {
      case 'top-right':
        return `${baseClasses} top-0 right-0`;
      case 'top-left':
        return `${baseClasses} top-0 left-0`;
      case 'bottom-right':
        return `${baseClasses} bottom-0 right-0`;
      case 'bottom-left':
        return `${baseClasses} bottom-0 left-0`;
      default:
        return `${baseClasses} top-0 right-0`;
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-all duration-200 ${buttonClassName}`}
        title="More actions"
      >
        <MoreVertical className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.15 }}
            className={getDropdownClasses()}
          >
            {items.map((item, index) => (
              <React.Fragment key={item.id}>
                {item.divider && index > 0 && (
                  <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
                )}
                <div 
                  className="relative"
                  onMouseEnter={() => item.submenu && handleSubmenuHover(item.id)}
                  onMouseLeave={() => item.submenu && handleSubmenuHover(null)}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (item.submenu) {
                        // Toggle submenu on click for touch devices
                        setHoveredSubmenu(hoveredSubmenu === item.id ? null : item.id);
                      } else {
                        item.onClick?.();
                        setIsOpen(false);
                      }
                    }}
                    className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${
                      item.destructive 
                        ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {item.icon && <item.icon className="w-4 h-4" />}
                      <span>{item.label}</span>
                    </div>
                    {item.submenu && (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </button>

                  {/* Submenu */}
                  {item.submenu && hoveredSubmenu === item.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, x: -5 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95, x: -5 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-full top-0 z-60 min-w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 ml-1"
                    >
                      {item.submenu.map((subItem) => (
                        <button
                          key={subItem.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            subItem.onClick();
                            setIsOpen(false);
                            setHoveredSubmenu(null);
                          }}
                          className="w-full text-left px-3 py-2 text-sm flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 text-gray-700 dark:text-gray-300"
                        >
                          {subItem.icon && <subItem.icon className="w-4 h-4" />}
                          <span>{subItem.label}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              </React.Fragment>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
