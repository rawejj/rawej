import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { LocalizationContextValue } from './LocalizationProvider';

// Mock the LocalizationContext module
vi.mock('./LocalizationContext', () => ({
  LocalizationContext: {
    _currentValue: null as LocalizationContextValue | null,
  },
}));

const mockContextValue: LocalizationContextValue = {
  language: 'en',
  config: {
    label: 'English',
    direction: 'ltr',
    dateFormat: 'MM/DD/YYYY',
    timezone: 'UTC',
  },
  setLanguage: vi.fn(),
};

describe('useLocalization hook', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    // Reset modules to ensure fresh imports
    vi.resetModules();
  });

  describe('context access', () => {
    it('returns context value when provider exists', async () => {
      const { LocalizationContext } = await import('./LocalizationContext');
      LocalizationContext._currentValue = mockContextValue;
      
      const { useLocalization } = await import('./useLocalization');
      const { result } = renderHook(() => useLocalization());
      
      expect(result.current).toEqual(mockContextValue);
    });
    
    it('returns language from context', async () => {
      const { LocalizationContext } = await import('./LocalizationContext');
      LocalizationContext._currentValue = mockContextValue;
      
      const { useLocalization } = await import('./useLocalization');
      const { result } = renderHook(() => useLocalization());
      
      expect(result.current.language).toBe('en');
    });
  });
  
  it('returns setLanguage function from context', async () => {
    const { LocalizationContext } = await import('./LocalizationContext');
    LocalizationContext._currentValue = mockContextValue;
    
    const { useLocalization } = await import('./useLocalization');
    const { result } = renderHook(() => useLocalization());
    
    expect(result.current.setLanguage).toBeDefined();
    expect(typeof result.current.setLanguage).toBe('function');
  });

  describe('multiple calls', () => {
    it('returns same context on multiple calls', async () => {
      const { LocalizationContext } = await import('./LocalizationContext');
      LocalizationContext._currentValue = mockContextValue;
      
      const { useLocalization } = await import('./useLocalization');
      const { result: result1 } = renderHook(() => useLocalization());
      const { result: result2 } = renderHook(() => useLocalization());
      
      expect(result1.current).toEqual(result2.current);
    });
  });

  describe('config properties', () => {
    it('has direction property', async () => {
      const { LocalizationContext } = await import('./LocalizationContext');
      LocalizationContext._currentValue = mockContextValue;
      
      const { useLocalization } = await import('./useLocalization');
      const { result } = renderHook(() => useLocalization());
      
      expect(result.current.config).toHaveProperty('direction');
    });
    
    it('has label property', async () => {
      const { LocalizationContext } = await import('./LocalizationContext');
      LocalizationContext._currentValue = mockContextValue;
      
      const { useLocalization } = await import('./useLocalization');
      const { result } = renderHook(() => useLocalization());
      
      expect(result.current.config).toHaveProperty('label');
    });
    
    it('supports RTL config', async () => {
      const rtlContext: LocalizationContextValue = {
        language: 'fa',
        config: {
          label: 'Persian',
          direction: 'rtl',
          dateFormat: 'YYYY/MM/DD',
          timezone: 'Asia/Tehran',
        },
        setLanguage: vi.fn(),
      };
      
      const { LocalizationContext } = await import('./LocalizationContext');
      LocalizationContext._currentValue = rtlContext;
      
      const { useLocalization } = await import('./useLocalization');
      const { result } = renderHook(() => useLocalization());
      
      expect(result.current.config.direction).toBe('rtl');
      expect(result.current.config.label).toBe('Persian');
    });
    
    it('supports LTR config', async () => {
      const ltrContext: LocalizationContextValue = {
        language: 'de',
        config: {
          label: 'Deutsch',
          direction: 'ltr',
          dateFormat: 'DD.MM.YYYY',
          timezone: 'Europe/Berlin',
        },
        setLanguage: vi.fn(),
      };
      
      const { LocalizationContext } = await import('./LocalizationContext');
      LocalizationContext._currentValue = ltrContext;
      
      const { useLocalization } = await import('./useLocalization');
      const { result } = renderHook(() => useLocalization());
      
      expect(result.current.config.direction).toBe('ltr');
      expect(result.current.config.label).toBe('Deutsch');
    });
  });

  describe('error handling', () => {
    it('throws error when used outside provider', async () => {
      const { LocalizationContext } = await import('./LocalizationContext');
      LocalizationContext._currentValue = null;
      
      const { useLocalization } = await import('./useLocalization');
      
      expect(() => {
        renderHook(() => useLocalization());
      }).toThrow('useLocalization must be used within LocalizationClientProvider');
    });
    
    it('throws descriptive error message', async () => {
      const { LocalizationContext } = await import('./LocalizationContext');
      LocalizationContext._currentValue = null;
      
      const { useLocalization } = await import('./useLocalization');
      const errorMessage = 'useLocalization must be used within LocalizationClientProvider';
      
      expect(() => {
        renderHook(() => useLocalization());
      }).toThrow(errorMessage);
    });
  });

  describe('setLanguage function', () => {
    it('provides callable setLanguage function', async () => {
      const setLanguageMock = vi.fn();
      const contextWithMock: LocalizationContextValue = {
        language: 'en',
        config: {
          label: 'English',
          direction: 'ltr',
          dateFormat: 'MM/DD/YYYY',
          timezone: 'UTC',
        },
        setLanguage: setLanguageMock,
      };
      
      const { LocalizationContext } = await import('./LocalizationContext');
      LocalizationContext._currentValue = contextWithMock;
      
      const { useLocalization } = await import('./useLocalization');
      const { result } = renderHook(() => useLocalization());
      
      act(() => {
        result.current.setLanguage('fa');
      });
      
      expect(setLanguageMock).toHaveBeenCalledWith('fa');
    });
    
    it('can switch to different languages', async () => {
      const setLanguageMock = vi.fn();
      const contextWithMock: LocalizationContextValue = {
        language: 'en',
        config: {
          label: 'English',
          direction: 'ltr',
          dateFormat: 'MM/DD/YYYY',
          timezone: 'UTC',
        },
        setLanguage: setLanguageMock,
      };
      
      const { LocalizationContext } = await import('./LocalizationContext');
      LocalizationContext._currentValue = contextWithMock;
      
      const { useLocalization } = await import('./useLocalization');
      const { result } = renderHook(() => useLocalization());
      
      act(() => {
        result.current.setLanguage('fa');
        result.current.setLanguage('de');
        result.current.setLanguage('fr');
      });
      
      expect(setLanguageMock).toHaveBeenCalledWith('fa');
      expect(setLanguageMock).toHaveBeenCalledWith('de');
      expect(setLanguageMock).toHaveBeenCalledWith('fr');
    });
  });

  describe('language property', () => {
    it('returns current language', async () => {
      const { LocalizationContext } = await import('./LocalizationContext');
      LocalizationContext._currentValue = mockContextValue;
      
      const { useLocalization } = await import('./useLocalization');
      const { result } = renderHook(() => useLocalization());
      
      expect(result.current.language).toBe('en');
    });
    
    it('supports Persian language', async () => {
      const faContext: LocalizationContextValue = {
        language: 'fa',
        config: {
          label: 'Persian',
          direction: 'rtl',
          dateFormat: 'YYYY/MM/DD',
          timezone: 'Asia/Tehran',
        },
        setLanguage: vi.fn(),
      };
      
      const { LocalizationContext } = await import('./LocalizationContext');
      LocalizationContext._currentValue = faContext;
      
      const { useLocalization } = await import('./useLocalization');
      const { result } = renderHook(() => useLocalization());
      
      expect(result.current.language).toBe('fa');
    });
    
    it('supports French language', async () => {
      const frContext: LocalizationContextValue = {
        language: 'fr',
        config: {
          label: 'French',
          direction: 'ltr',
          dateFormat: 'DD/MM/YYYY',
          timezone: 'Europe/Paris',
        },
        setLanguage: vi.fn(),
      };
      
      const { LocalizationContext } = await import('./LocalizationContext');
      LocalizationContext._currentValue = frContext;
      
      const { useLocalization } = await import('./useLocalization');
      const { result } = renderHook(() => useLocalization());
      
      expect(result.current.language).toBe('fr');
    });
  });
});
