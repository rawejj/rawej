"use client";

import { useState, useContext, useSyncExternalStore } from 'react';
import { useLocalization, languages, LanguageKey } from '@/providers/LocalizationProvider';
import { ThemeContext } from '@/providers/ThemeProvider';

// SVG Icon for Globe
const GlobeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

const ChevronIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLocalization();
  const { theme } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);
  
  // Use useSyncExternalStore to safely handle client-only rendering
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const getBg = () => {
    if (theme === 'dark') return 'rgba(30, 30, 40, 0.98)';
    if (theme === 'light') return 'rgba(255, 255, 255, 0.95)';
    return 'var(--background)';
  };

  const getFg = () => {
    if (theme === 'dark') return '#ededed';
    if (theme === 'light') return '#171717';
    return 'var(--foreground)';
  };

  const currentLang = languages[language];

  return (
    <div style={{ position: 'relative' }} suppressHydrationWarning>
      <button
        onClick={() => setIsOpen(!isOpen)}
        suppressHydrationWarning
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 0.75rem',
          borderRadius: '20px',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          background: getBg(),
          backdropFilter: 'blur(8px)',
          boxShadow: theme === 'dark' ? '0 2px 8px rgba(0,0,0,0.32)' : '0 2px 8px rgba(0,0,0,0.08)',
          cursor: 'pointer',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: getFg(),
          transition: 'all 0.2s',
          outline: 'none',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = theme === 'dark' ? '0 4px 12px rgba(0,0,0,0.42)' : '0 4px 12px rgba(0,0,0,0.12)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = theme === 'dark' ? '0 2px 8px rgba(0,0,0,0.32)' : '0 2px 8px rgba(0,0,0,0.08)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
        aria-label="Language selector"
        aria-expanded={isOpen}
      >
        <GlobeIcon />
        <span suppressHydrationWarning>{mounted ? currentLang.label : 'English'}</span>
        <ChevronIcon />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop to close dropdown */}
          <div
            data-testid="language-switcher-backdrop"
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 999,
            }}
          />
          
          {/* Dropdown */}
          <div
            role="menu"
            style={{
              position: 'absolute',
              top: 'calc(100% + 0.5rem)',
              right: 0,
              minWidth: '200px',
              borderRadius: '12px',
              background: getBg(),
              backdropFilter: 'blur(12px)',
              boxShadow: theme === 'dark'
                ? '0 8px 24px rgba(0,0,0,0.42), 0 2px 6px rgba(0,0,0,0.18)'
                : '0 8px 24px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.08)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              overflow: 'hidden',
              zIndex: 1000,
              animation: 'slideIn 0.2s ease-out',
            }}
          >
            {Object.entries(languages).map(([key, lang], index) => {
              const isActive = language === key;
              return (
                <button
                  key={key}
                  onClick={() => {
                    setLanguage(key as LanguageKey);
                    setIsOpen(false);
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    border: 'none',
                    background: isActive 
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : 'transparent',
                    color: isActive ? '#fff' : getFg(),
                    fontSize: '0.875rem',
                    fontWeight: isActive ? '600' : '500',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    textAlign: 'left',
                    borderTop: index > 0 ? '1px solid rgba(0, 0, 0, 0.05)' : 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0, 0, 0, 0.04)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                  aria-label={`Switch to ${lang.label}`}
                >
                  <span>{lang.label}</span>
                  <span style={{ fontSize: '0.75rem', opacity: 0.7, marginLeft: 'auto' }}>
                    {lang.direction.toUpperCase()}
                  </span>
                  {isActive && (
                    <svg 
                      width="14" 
                      height="14" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="3" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
      
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
