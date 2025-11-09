"use client";

import React, { useContext, useState, useSyncExternalStore } from 'react';
import { Theme } from '@/providers/ThemeProvider';
import { ThemeContext } from '@/providers/ThemeContext';
import { DropdownMenu } from './DropdownMenu';
import { useTranslations } from '@/providers/TranslationsProvider';

const themes: Theme[] = ['light', 'dark', 'system'];

// SVG Icons for each theme
const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const SystemIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
    <line x1="8" y1="21" x2="16" y2="21"/>
    <line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
);

const ChevronIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const icons: Record<Theme, React.FC> = {
  light: SunIcon,
  dark: MoonIcon,
  system: SystemIcon,
};

export const ThemeSwitcher: React.FC = () => {
  const { t } = useTranslations();
  const { theme, setTheme } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);
  const CurrentIcon = icons[theme];

  // Use useSyncExternalStore to safely handle client-only rendering
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // Use CSS variables for background/foreground
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

  return (
    <div style={{ position: 'relative' }} suppressHydrationWarning>
      {/* Toggle Button */}
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
        aria-label="Theme selector"
        aria-expanded={isOpen}
      >
        {mounted ? <CurrentIcon /> : null}
        <span suppressHydrationWarning>{mounted ? t(`theme.${theme}`) : 'Auto'}</span>
        <ChevronIcon />
      </button>
      <DropdownMenu
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        style={{
          minWidth: '160px',
          background: getBg(),
          backdropFilter: 'blur(12px)',
          boxShadow: theme === 'dark'
            ? '0 8px 24px rgba(0,0,0,0.42), 0 2px 6px rgba(0,0,0,0.18)'
            : '0 8px 24px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          color: getFg(),
        }}
        backdropTestId="theme-switcher-backdrop"
      >
        {themes.map((themeOption, index) => {
          const Icon = icons[themeOption];
          const isActive = theme === themeOption;
          return (
            <button
              key={themeOption}
              onClick={() => {
                setTheme(themeOption);
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
              aria-label={`Switch to ${t(`theme.${themeOption}`)} theme`}
            >
              <Icon />
              <span>{t(`theme.${themeOption}`)}</span>
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
                  style={{ marginLeft: 'auto' }}
                >
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </button>
          );
        })}
      </DropdownMenu>
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
