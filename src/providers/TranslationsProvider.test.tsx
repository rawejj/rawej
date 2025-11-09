import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TranslationsProvider, useTranslations } from './TranslationsProvider';
import type { Translations } from '@/lib/translationHelpers';

describe('TranslationsProvider', () => {
  const mockTranslations: Translations = {
    appTitle: 'Doctor App',
    bookAppointment: 'Book Appointment',
    theme: {
      light: 'Light Mode',
      dark: 'Dark Mode',
      system: 'System Default',
    },
    noMoreDoctors: 'No more doctors',
    meta: {
      title: 'Test Title',
      description: 'Test Description',
    },
  };

  describe('TranslationsProvider - providing context', () => {
    it('provides translations to children', () => {
      const TestComponent = () => {
        const { translations } = useTranslations();
        return <span data-testid="title">{translations.appTitle}</span>;
      };

      render(
        <TranslationsProvider translations={mockTranslations}>
          <TestComponent />
        </TranslationsProvider>
      );

      expect(screen.getByTestId('title')).toHaveTextContent('Doctor App');
    });

    it('provides t function for accessing translations', () => {
      const TestComponent = () => {
        const { t } = useTranslations();
        return <span data-testid="result">{t('appTitle')}</span>;
      };

      render(
        <TranslationsProvider translations={mockTranslations}>
          <TestComponent />
        </TranslationsProvider>
      );

      expect(screen.getByTestId('result')).toHaveTextContent('Doctor App');
    });

    it('provides nested translation access via t function', () => {
      const TestComponent = () => {
        const { t } = useTranslations();
        return <span data-testid="result">{t('theme.dark')}</span>;
      };

      render(
        <TranslationsProvider translations={mockTranslations}>
          <TestComponent />
        </TranslationsProvider>
      );

      expect(screen.getByTestId('result')).toHaveTextContent('Dark Mode');
    });

    it('provides fallback value when translation not found', () => {
      const TestComponent = () => {
        const { t } = useTranslations();
        return <span data-testid="result">{t('missingKey', 'Default Value')}</span>;
      };

      render(
        <TranslationsProvider translations={mockTranslations}>
          <TestComponent />
        </TranslationsProvider>
      );

      expect(screen.getByTestId('result')).toHaveTextContent('Default Value');
    });

    it('renders children correctly', () => {
      render(
        <TranslationsProvider translations={mockTranslations}>
          <div data-testid="child">Child Content</div>
        </TranslationsProvider>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(screen.getByTestId('child')).toHaveTextContent('Child Content');
    });

    it('renders multiple children', () => {
      render(
        <TranslationsProvider translations={mockTranslations}>
          <div data-testid="child1">First Child</div>
          <div data-testid="child2">Second Child</div>
        </TranslationsProvider>
      );

      expect(screen.getByTestId('child1')).toBeInTheDocument();
      expect(screen.getByTestId('child2')).toBeInTheDocument();
    });

    it('handles nested TranslationsProvider components', () => {
      const innerTranslations = {
        ...mockTranslations,
        appTitle: 'Inner App',
      };

      const TestComponent = () => {
        const { t } = useTranslations();
        return <span data-testid="result">{t('appTitle')}</span>;
      };

      render(
        <TranslationsProvider translations={mockTranslations}>
          <div data-testid="outer">
            <TranslationsProvider translations={innerTranslations}>
              <TestComponent />
            </TranslationsProvider>
          </div>
        </TranslationsProvider>
      );

      expect(screen.getByTestId('result')).toHaveTextContent('Inner App');
    });
  });

  describe('useTranslations hook', () => {
    it('returns translations object', () => {
      const TestComponent = () => {
        const { translations } = useTranslations();
        return <span>{Object.keys(translations).length}</span>;
      };

      render(
        <TranslationsProvider translations={mockTranslations}>
          <TestComponent />
        </TranslationsProvider>
      );

      expect(screen.getByText(String(Object.keys(mockTranslations).length))).toBeInTheDocument();
    });

    it('returns t function as a callable', () => {
      const TestComponent = () => {
        const { t } = useTranslations();
        return <span>{typeof t === 'function' ? 'function' : 'not function'}</span>;
      };

      render(
        <TranslationsProvider translations={mockTranslations}>
          <TestComponent />
        </TranslationsProvider>
      );

      expect(screen.getByText('function')).toBeInTheDocument();
    });

    it('throws error when used outside TranslationsProvider', () => {
      const TestComponent = () => {
        const { t } = useTranslations();
        return <span>{t('appTitle')}</span>;
      };

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useTranslations must be used within TranslationsProvider');

      consoleErrorSpy.mockRestore();
    });

    it('provides consistent context on multiple calls', () => {
      const calls: unknown[] = [];

      const TestComponent = () => {
        const context = useTranslations();
        calls.push(context);
        return <span data-testid="component">Content</span>;
      };

      render(
        <TranslationsProvider translations={mockTranslations}>
          <TestComponent />
          <TestComponent />
        </TranslationsProvider>
      );

      expect(calls).toHaveLength(2);
      expect(calls[0]).toEqual(calls[1]);
    });

    it('t function returns key as fallback when no fallback provided', () => {
      const TestComponent = () => {
        const { t } = useTranslations();
        return <span data-testid="result">{t('nonexistent')}</span>;
      };

      render(
        <TranslationsProvider translations={mockTranslations}>
          <TestComponent />
        </TranslationsProvider>
      );

      expect(screen.getByTestId('result')).toHaveTextContent('nonexistent');
    });

    it('returns fresh t function instance', () => {
      const tFunctions: Array<(key: string) => string> = [];

      const TestComponent = () => {
        const { t } = useTranslations();
        tFunctions.push(t);
        return null;
      };

      render(
        <TranslationsProvider translations={mockTranslations}>
          <TestComponent />
        </TranslationsProvider>
      );

      expect(tFunctions).toHaveLength(1);
      expect(typeof tFunctions[0]).toBe('function');
    });
  });

  describe('Translation access patterns', () => {
    it('supports simple string keys', () => {
      const TestComponent = () => {
        const { t } = useTranslations();
        return <span data-testid="result">{t('bookAppointment')}</span>;
      };

      render(
        <TranslationsProvider translations={mockTranslations}>
          <TestComponent />
        </TranslationsProvider>
      );

      expect(screen.getByTestId('result')).toHaveTextContent('Book Appointment');
    });

    it('supports nested object keys with dot notation', () => {
      const TestComponent = () => {
        const { t } = useTranslations();
        return <span data-testid="result">{t('theme.light')}</span>;
      };

      render(
        <TranslationsProvider translations={mockTranslations}>
          <TestComponent />
        </TranslationsProvider>
      );

      expect(screen.getByTestId('result')).toHaveTextContent('Light Mode');
    });

    it('supports deep nesting', () => {
      const TestComponent = () => {
        const { t } = useTranslations();
        return <span data-testid="result">{t('meta.title')}</span>;
      };

      render(
        <TranslationsProvider translations={mockTranslations}>
          <TestComponent />
        </TranslationsProvider>
      );

      expect(screen.getByTestId('result')).toHaveTextContent('Test Title');
    });

    it('handles missing deep nested keys', () => {
      const TestComponent = () => {
        const { t } = useTranslations();
        return <span data-testid="result">{t('theme.invalid.deep', 'Not Found')}</span>;
      };

      render(
        <TranslationsProvider translations={mockTranslations}>
          <TestComponent />
        </TranslationsProvider>
      );

      expect(screen.getByTestId('result')).toHaveTextContent('Not Found');
    });
  });

  describe('Context value structure', () => {
    it('context value has translations property', () => {
      const contextValues: unknown[] = [];

      const TestComponent = () => {
        const context = useTranslations();
        contextValues.push(context);
        return null;
      };

      render(
        <TranslationsProvider translations={mockTranslations}>
          <TestComponent />
        </TranslationsProvider>
      );

      expect(contextValues[0]).toHaveProperty('translations');
    });

    it('context value has t property', () => {
      const contextValues: unknown[] = [];

      const TestComponent = () => {
        const context = useTranslations();
        contextValues.push(context);
        return null;
      };

      render(
        <TranslationsProvider translations={mockTranslations}>
          <TestComponent />
        </TranslationsProvider>
      );

      expect(contextValues[0]).toHaveProperty('t');
    });

    it('context has only translations and t properties', () => {
      const contextValues: unknown[] = [];

      const TestComponent = () => {
        const context = useTranslations();
        contextValues.push(context);
        return null;
      };

      render(
        <TranslationsProvider translations={mockTranslations}>
          <TestComponent />
        </TranslationsProvider>
      );

      const context = contextValues[0] as Record<string, unknown>;
      const keys = Object.keys(context);
      expect(keys).toEqual(['translations', 't']);
    });
  });

  describe('Different translation structures', () => {
    it('handles empty translations object', () => {
      const emptyTranslations: Translations = {};

      const TestComponent = () => {
        const { t } = useTranslations();
        return <span data-testid="result">{t('any', 'fallback')}</span>;
      };

      render(
        <TranslationsProvider translations={emptyTranslations}>
          <TestComponent />
        </TranslationsProvider>
      );

      expect(screen.getByTestId('result')).toHaveTextContent('fallback');
    });

    it('handles translations with special characters', () => {
      const specialTranslations: Translations = {
        emoji: '👨‍⚕️ Doctor',
        rtl: 'نص عربي',
        unicode: '你好',
      };

      const TestComponent = () => {
        const { t } = useTranslations();
        return (
          <>
            <span data-testid="emoji">{t('emoji')}</span>
            <span data-testid="rtl">{t('rtl')}</span>
            <span data-testid="unicode">{t('unicode')}</span>
          </>
        );
      };

      render(
        <TranslationsProvider translations={specialTranslations}>
          <TestComponent />
        </TranslationsProvider>
      );

      expect(screen.getByTestId('emoji')).toHaveTextContent('👨‍⚕️ Doctor');
      expect(screen.getByTestId('rtl')).toHaveTextContent('نص عربي');
      expect(screen.getByTestId('unicode')).toHaveTextContent('你好');
    });

    it('handles translations with mixed types in nested objects', () => {
      const mixedTranslations: Translations = {
        app: {
          name: 'Doctor App',
          version: '1.0',
          features: {
            booking: 'Booking System',
            payment: 'Payment',
          },
        },
      };

      const TestComponent = () => {
        const { t } = useTranslations();
        return (
          <>
            <span data-testid="name">{t('app.name')}</span>
            <span data-testid="feature">{t('app.features.booking')}</span>
          </>
        );
      };

      render(
        <TranslationsProvider translations={mixedTranslations}>
          <TestComponent />
        </TranslationsProvider>
      );

      expect(screen.getByTestId('name')).toHaveTextContent('Doctor App');
      expect(screen.getByTestId('feature')).toHaveTextContent('Booking System');
    });
  });
});
