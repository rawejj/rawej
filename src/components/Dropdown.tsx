import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "@/providers/TranslationsProvider";

interface DropdownOption {
  value: string;
  label: string;
  flag?: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
  className?: string;
  disabled?: boolean;
  dir?: "ltr" | "rtl";
}

export default function Dropdown({
  options,
  value,
  onChange,
  placeholder = "Select...",
  searchable = false,
  className = "",
  disabled = false,
  dir,
}: DropdownProps) {
  const { t } = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isAbove, setIsAbove] = useState(false); // Track if dropdown is above trigger
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Filter options based on search term
  const filteredOptions = searchable
    ? options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.value.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : options;

  // Handle dropdown close with animation
  const closeDropdown = useCallback(() => {
    setIsAnimating(false);
    // Delay the actual closing to allow animation to complete
    animationTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      setSearchTerm("");
      setHighlightedIndex(-1);
    }, 200); // Match animation duration
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeDropdown]);

  const handleSelect = useCallback((optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm("");
    setHighlightedIndex(-1);
  }, [onChange]);

  // Handle dropdown open with animation
  const openDropdown = useCallback(() => {
    // Clear any pending close animation
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }

    if (dropdownRef.current) {
      // Calculate position relative to viewport
      const rect = dropdownRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownHeight = 256; // Approximate max height
      
      // Check if there's enough space below
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      
      let top = rect.bottom + 4; // 4px gap
      let above = false;
      
      // If not enough space below and more space above, position above
      if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
        top = rect.top - dropdownHeight - 4;
        above = true;
      }
      
      setDropdownPosition({
        top,
        left: rect.left,
        width: rect.width
      });
      setIsAbove(above);
    }
    
    setIsOpen(true);
    setIsAnimating(false); // Start with initial state
    // Trigger animation after render
    setTimeout(() => setIsAnimating(true), 0);
    if (searchable) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [searchable]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      if (!isOpen) {
        openDropdown();
        setHighlightedIndex(0);
      } else {
        setHighlightedIndex(prev =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
      }
      break;
    case "ArrowUp":
      event.preventDefault();
      setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev);
      break;
    case "Enter":
      event.preventDefault();
      if (isOpen && highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
        handleSelect(filteredOptions[highlightedIndex].value);
      } else if (!isOpen) {
        openDropdown();
      }
      break;
    case "Escape":
      closeDropdown();
      break;
    }
  }, [isOpen, highlightedIndex, filteredOptions, disabled, handleSelect, openDropdown, closeDropdown]);

  const toggleDropdown = () => {
    if (disabled) return;
    
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  };

  const selectedOption = options.find(option => option.value === value);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        className={`relative h-12 pl-3 pr-10 border rounded-lg shadow-sm cursor-pointer transition-all duration-200 ease-in-out ${
          disabled
            ? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 cursor-not-allowed opacity-60'
            : 'bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 hover:border-gray-400 dark:hover:border-zinc-500 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20'
        }`}
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls="dropdown-list"
      >
        <div className="flex items-center h-full">
          <span className={`truncate text-sm ${selectedOption ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
            {selectedOption ? (
              <div className="flex items-center justify-center">
                {selectedOption.flag && <span className="mr-2 text-lg">{selectedOption.flag}</span>}
                <span className="font-medium">{selectedOption.label}</span>
              </div>
            ) : (
              t("dropdown.select", placeholder)
            )}
          </span>
        </div>

        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {(isOpen || isAnimating) && createPortal(
        <div
          className={`
            fixed z-9999 bg-white dark:bg-zinc-800
            border border-gray-200 dark:border-zinc-600 rounded-lg shadow-xl
            max-h-64 overflow-hidden
            transition-all duration-200 ease-out ${isAnimating  ? 'opacity-100 translate-y-0' : 'opacity-0 '
            + (isAbove ? '-translate-y-2' : 'translate-y-2')}
          `}
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`
          }}
          role="listbox"
          dir={dir}
        >
          {searchable && (
            <div className="p-1 border-b border-gray-200 dark:border-zinc-600 bg-gray-50 dark:bg-zinc-700/50">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t("dropdown.search", "Search")}
                  className="
                    w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-zinc-600
                    rounded-md bg-white dark:bg-zinc-700 text-gray-900 dark:text-white
                    placeholder-gray-500 dark:placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition-colors duration-200
                  "
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}

          <div className="overflow-auto max-h-48">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={option.value}
                  className={`px-3 py-2 cursor-pointer transition-all duration-150 flex items-center justify-start ${
                    index === highlightedIndex
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : value === option.value
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-700'
                  }`}
                  onClick={() => handleSelect(option.value)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  role="option"
                  aria-selected={value === option.value}
                >
                  {option.flag && <span className="mr-3 text-lg">{option.flag}</span>}
                  <span className="truncate font-semibold text-sm">{option.label}</span>
                  {value === option.value && (
                    <svg className="ml-auto h-4 w-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                <svg className="mx-auto h-8 w-8 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-.98-5.625-2.508" />
                </svg>
                <p className="text-sm">{t("dropdown.no options found", "No options found")}</p>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}