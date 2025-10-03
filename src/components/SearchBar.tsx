import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, X, ChevronDown, Clock, Hash, Building2, FileText, Sparkles, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Popover from '@radix-ui/react-popover';
import { Document } from '../types';

interface SearchBarProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  placeholder?: string;
  documents?: Document[];
}

export interface SearchFilters {
  department: string;
  type: string;
  fileType: string;
  dateRange: string;
}

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'document' | 'tag' | 'department' | 'recent';
  icon: React.ReactNode;
  category: string;
  count?: number;
  priority?: number;
}

const departments = ['All', 'Human Resources', 'Information Technology', 'Finance', 'Operations', 'Legal', 'Marketing'];
const documentTypes = ['All', 'SOP', 'Policy', 'Manual', 'Guide', 'Form'];
const fileTypes = ['All', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'image'];
const dateRanges = ['All', 'Last 7 days', 'Last 30 days', 'Last 90 days', 'Last year'];

export default function SearchBar({ onSearch, placeholder = "Search documents...", documents = [] }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [filters, setFilters] = useState<SearchFilters>({
    department: 'All',
    type: 'All',
    fileType: 'All',
    dateRange: 'All',
  });

  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Generate enhanced suggestions with better scoring and theming
  useEffect(() => {
    if (!query.trim()) {
      // Show enhanced recent searches when no query
      const recentSuggestions: SearchSuggestion[] = recentSearches.slice(0, 6).map((search, index) => ({
        id: `recent-${index}`,
        text: search,
        type: 'recent',
        icon: <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500" />,
        category: 'Recent Searches',
        priority: 10 - index
      }));
      
      // Add trending suggestions if no recent searches
      if (recentSuggestions.length === 0) {
        const trendingSuggestions: SearchSuggestion[] = [
          {
            id: 'trending-1',
            text: 'Employee Handbook',
            type: 'document',
            icon: <TrendingUp className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />,
            category: 'Trending',
            count: 24,
            priority: 8
          },
          {
            id: 'trending-2', 
            text: 'Security Policy',
            type: 'document',
            icon: <TrendingUp className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />,
            category: 'Trending',
            count: 18,
            priority: 7
          }
        ];
        setSuggestions(trendingSuggestions);
      } else {
        setSuggestions(recentSuggestions);
      }
      return;
    }

    const queryLower = query.toLowerCase();
    const newSuggestions: SearchSuggestion[] = [];

    // Enhanced document suggestions with relevance scoring
    const documentSuggestions = documents
      .map(doc => {
        let score = 0;
        const titleMatch = doc.title.toLowerCase().includes(queryLower);
        const descMatch = doc.description.toLowerCase().includes(queryLower);
        const tagMatch = doc.tags.some(tag => tag.toLowerCase().includes(queryLower));
        
        if (titleMatch) score += 10;
        if (descMatch) score += 5;
        if (tagMatch) score += 7;
        if (doc.title.toLowerCase().startsWith(queryLower)) score += 5;
        
        return { doc, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(({ doc }) => ({
        id: `doc-${doc.id}`,
        text: doc.title,
        type: 'document' as const,
        icon: <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />,
        category: 'Documents',
        count: Math.floor(Math.random() * 50) + 1,
        priority: 9
      }));

    // Enhanced tag suggestions with usage count
    const allTags = Array.from(new Set(documents.flatMap(doc => doc.tags)));
    const tagSuggestions = allTags
      .filter(tag => tag.toLowerCase().includes(queryLower))
      .slice(0, 4)
      .map(tag => {
        const count = documents.filter(doc => doc.tags.includes(tag)).length;
        return {
          id: `tag-${tag}`,
          text: tag,
          type: 'tag' as const,
          icon: <Hash className="w-4 h-4 text-teal-500 dark:text-teal-400" />,
          category: 'Tags',
          count,
          priority: 8
        };
      });

    // Enhanced department suggestions with document count
    const departmentSuggestions = departments
      .filter(dept => dept !== 'All' && dept.toLowerCase().includes(queryLower))
      .slice(0, 3)
      .map(dept => {
        const count = documents.filter(doc => doc.department === dept).length;
        return {
          id: `dept-${dept}`,
          text: dept,
          type: 'department' as const,
          icon: <Building2 className="w-4 h-4 text-primary-500 dark:text-primary-200" />,
          category: 'Departments',
          count,
          priority: 7
        };
      });

    // Combine and sort by priority and relevance
    newSuggestions.push(...documentSuggestions, ...tagSuggestions, ...departmentSuggestions);
    newSuggestions.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    setSuggestions(newSuggestions.slice(0, 8));
  }, [query, documents, recentSearches]);

  const handleSearch = (searchQuery?: string) => {
    const finalQuery = searchQuery || query;
    if (finalQuery.trim()) {
      // Add to recent searches
      const updatedRecent = [finalQuery, ...recentSearches.filter(s => s !== finalQuery)].slice(0, 10);
      setRecentSearches(updatedRecent);
      localStorage.setItem('recentSearches', JSON.stringify(updatedRecent));
    }
    
    onSearch(finalQuery, filters);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    handleSearch(suggestion.text);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onSearch(query, newFilters);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => prev < suggestions.length - 1 ? prev + 1 : prev);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionSelect(suggestions[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const clearFilters = () => {
    const clearedFilters = {
      department: 'All',
      type: 'All',
      fileType: 'All',
      dateRange: 'All',
    };
    setFilters(clearedFilters);
    onSearch(query, clearedFilters);
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('', filters);
    setShowSuggestions(false);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== 'All');

  return (
    <div className="w-full relative">
      {/* Enhanced Search Input with Command */}
      <div className="relative">
        <motion.div 
          className="relative group"
          whileFocus={{ scale: 1.01 }}
        >
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
            <Search className="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-edarat-light dark:group-focus-within:text-edarat-light transition-colors duration-200" />
          </div>
          
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(!!e.target.value || e.target.value === '');
              setSelectedIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              setShowSuggestions(!!value);
              setSelectedIndex(-1);
            }}
            onBlur={() => {
              setTimeout(() => {
                setShowSuggestions(false);
                setSelectedIndex(-1);
              }, 150);
            }}
            className="glass-input w-full pl-12 pr-24 py-3 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 border-2 border-transparent focus:border-edarat-light dark:focus:border-edarat-light focus:ring-2 focus:ring-edarat-light/20 dark:focus:ring-edarat-dark/30 transition-all duration-200"
            placeholder={placeholder}
            autoComplete="off"
          />
          
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
            {/* Active filters indicator */}
            {hasActiveFilters && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-2 h-2 bg-teal-500 dark:bg-teal-400 rounded-full animate-pulse"
              />
            )}
            
            {query && (
              <motion.button
                onClick={clearSearch}
                className="p-1.5 rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                <X className="h-4 w-4" />
              </motion.button>
            )}
            
            {/* Enhanced Filters Popover */}
            <Popover.Root open={showFilters} onOpenChange={setShowFilters}>
              <Popover.Trigger asChild>
                <motion.button
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    showFilters || hasActiveFilters
                      ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 shadow-sm'
                      : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Filter className="h-4 w-4" />
                </motion.button>
              </Popover.Trigger>
              
              <Popover.Portal>
                <Popover.Content 
                  className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-2xl shadow-xl z-[60] w-80 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200"
                  sideOffset={8}
                  align="end"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-teal-500 dark:text-teal-400" />
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white">Advanced Filters</h3>
                    </div>
                    {hasActiveFilters && (
                      <motion.button
                        onClick={clearFilters}
                        className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <X className="w-3 h-3" />
                        <span>Clear All</span>
                      </motion.button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { key: 'department', label: 'Department', options: departments, icon: Building2 },
                      { key: 'type', label: 'Type', options: documentTypes, icon: FileText },
                      { key: 'fileType', label: 'File Type', options: fileTypes, icon: Hash },
                      { key: 'dateRange', label: 'Date Range', options: dateRanges, icon: Clock }
                    ].map(({ key, label, options, icon: Icon }) => (
                      <div key={key}>
                        <label className="flex items-center space-x-2 text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                          <Icon className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                          <span>{label}</span>
                        </label>
                        <select
                          value={filters[key as keyof SearchFilters]}
                          onChange={(e) => handleFilterChange(key as keyof SearchFilters, e.target.value)}
                          className="glass-select w-full text-xs focus:border-teal-400 dark:focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900/30"
                        >
                          {options.map((option) => (
                            <option key={option} value={option} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                              {option === 'All' ? 'All' : option.toUpperCase()}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </div>
        </motion.div>

        {/* Enhanced Suggestions */}
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-2xl shadow-xl z-[60] overflow-hidden backdrop-blur-xl"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <div className="overflow-auto scrollbar-hide" style={{ maxHeight: '580px' }}>
                {/* Group suggestions by category */}
                {Object.entries(
                  suggestions.reduce((acc, suggestion) => {
                    if (!acc[suggestion.category]) {
                      acc[suggestion.category] = [];
                    }
                    acc[suggestion.category].push(suggestion);
                    return acc;
                  }, {} as Record<string, SearchSuggestion[]>)
                ).map(([category, categorySuggestions], categoryIndex) => (
                  <div key={category} className="overflow-hidden">
                    <div className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-600 flex items-center justify-between">
                      <span>{category}</span>
                      {category === 'Recent Searches' && (
                        <Clock className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                      )}
                    </div>
                    {categorySuggestions.map((suggestion, index) => (
                      <button
                        key={suggestion.id}
                        onClick={() => handleSuggestionSelect(suggestion)}
                        className="group cursor-pointer w-full text-left"
                      >
                        <motion.div
                          className={`w-full text-left px-4 py-3 transition-all duration-200 flex items-center space-x-3 border-l-2 ${
                            selectedIndex === suggestions.findIndex(s => s.id === suggestion.id)
                              ? 'bg-teal-50 dark:bg-teal-900/30 border-teal-400 dark:border-teal-500'
                              : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-teal-400 dark:hover:border-teal-500'
                          }`}
                          whileHover={{ x: 4 }}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (categoryIndex * 0.1) + (index * 0.05) }}
                        >
                          <div className="flex-shrink-0 p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 group-hover:bg-white dark:group-hover:bg-gray-600 transition-colors">
                            {suggestion.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm text-gray-900 dark:text-white truncate block font-medium group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                              {suggestion.text}
                            </span>
                            {suggestion.count && (
                              <span className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors">
                                {suggestion.count} results
                              </span>
                            )}
                          </div>
                          {suggestion.type === 'recent' && (
                            <div className="flex-shrink-0 text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg">
                              Recent
                            </div>
                          )}
                        </motion.div>
                      </button>
                    ))}
                  </div>
                ))}
                
                {/* Empty state */}
                {suggestions.length === 0 && query && (
                <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <Search className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">No results found</p>
                      <p className="text-xs mt-1">Try a different search term or check your spelling</p>
                    </div>
                  </div>
                </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}