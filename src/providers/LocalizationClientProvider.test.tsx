import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { LocalizationClientProvider } from './LocalizationClientProvider';
import { LocalizationContext } from './LocalizationContext';
import { useLocalization } from './useLocalization';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { LanguageKey } from './LocalizationProvider';

vi.mock('next/navigation');

const TestComponent = () => {
  const { language, config, setLanguage } = useLocalization();
  return (
    <div>
      <div data-testid="language">{language}</div>
      <div data-testid="direction">{config.direction}</div>
      <button onClick={() => setLanguage('fa')}>Switch to Persian</button>
      <button onClick={() => setLanguage('en')}>Switch to English</button>
    </div>
  );
};

describe('LocalizationClientProvider', () => {
  const mockUseRouter = vi.mocked(useRouter);
  const mockUsePathname = vi.mocked(usePathname);

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseRouter.mockReturnValue({
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
    } as unknown as ReturnType<typeof useRouter>);
    mockUsePathname.mockReturnValue('/en');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initial language detection', () => {
    it('uses initialLanguage prop when provided', () => {
      mockUsePathname.mockReturnValue('/en/doctors');
        render(
          <LocalizationContext.Provider value={{ language: 'en', config: { label: 'English', direction: 'ltr', dateFormat: 'MM/DD/YYYY', timezone: 'UTC' }, setLanguage: () => {} }}>
            <LocalizationClientProvider initialLanguage={"fa" as LanguageKey}>
              <TestComponent />
            </LocalizationClientProvider>
          </LocalizationContext.Provider>
        );
        expect(screen.getByTestId('language')).toHaveTextContent('fa');
    });

    it('detects language from pathname', () => {
      mockUsePathname.mockReturnValue('/fr/doctors');
        render(
          <LocalizationContext.Provider value={{ language: 'fr', config: { label: 'French', direction: 'ltr', dateFormat: 'DD/MM/YYYY', timezone: 'Europe/Paris' }, setLanguage: () => {} }}>
            <LocalizationClientProvider>
              <TestComponent />
            </LocalizationClientProvider>
          </LocalizationContext.Provider>
        );
      expect(screen.getByTestId('language')).toHaveTextContent('fr');
    });

    it('uses default language when path has no language', () => {
      mockUsePathname.mockReturnValue('/doctors');
        render(
          <LocalizationContext.Provider value={{ language: 'en', config: { label: 'English', direction: 'ltr', dateFormat: 'MM/DD/YYYY', timezone: 'UTC' }, setLanguage: () => {} }}>
            <LocalizationClientProvider>
              <TestComponent />
            </LocalizationClientProvider>
          </LocalizationContext.Provider>
        );
      expect(screen.getByTestId('language')).toBeInTheDocument();
    });

    it('uses default language when detected language is not valid', () => {
      mockUsePathname.mockReturnValue('/invalid/doctors');
        render(
          <LocalizationContext.Provider value={{ language: 'en', config: { label: 'English', direction: 'ltr', dateFormat: 'MM/DD/YYYY', timezone: 'UTC' }, setLanguage: () => {} }}>
            <LocalizationClientProvider>
              <TestComponent />
            </LocalizationClientProvider>
          </LocalizationContext.Provider>
        );
      expect(screen.getByTestId('language')).toBeInTheDocument();
    });
  });

  describe('language switching', () => {
    it('updates language state when setLanguage is called', async () => {
      mockUsePathname.mockReturnValue('/en');
      const mockPush = vi.fn();
      mockUseRouter.mockReturnValue({
        push: mockPush,
        replace: vi.fn(),
        prefetch: vi.fn(),
      } as unknown as ReturnType<typeof useRouter>);

      render(
        <LocalizationClientProvider>
          <TestComponent />
        </LocalizationClientProvider>
      );

  const switchButton = screen.getByRole('button', { name: 'Switch to Persian' });
      fireEvent.click(switchButton);

      await waitFor(() => {
        expect(screen.getByTestId('language')).toHaveTextContent('fa');
      });
    });

    it('navigates to new URL when language changes', async () => {
      mockUsePathname.mockReturnValue('/en/doctors');
      const mockPush = vi.fn();
      mockUseRouter.mockReturnValue({
        push: mockPush,
        replace: vi.fn(),
        prefetch: vi.fn(),
      } as unknown as ReturnType<typeof useRouter>);

      render(
        <LocalizationClientProvider>
          <TestComponent />
        </LocalizationClientProvider>
      );

  const switchButton = screen.getByRole('button', { name: 'Switch to Persian' });
      fireEvent.click(switchButton);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/fa/doctors');
      });
    });

    it('preserves URL path when switching language', async () => {
      mockUsePathname.mockReturnValue('/en/doctors/search');
      const mockPush = vi.fn();
      mockUseRouter.mockReturnValue({
        push: mockPush,
        replace: vi.fn(),
        prefetch: vi.fn(),
      } as unknown as ReturnType<typeof useRouter>);

      render(
        <LocalizationClientProvider>
          <TestComponent />
        </LocalizationClientProvider>
      );

  const switchButton = screen.getByRole('button', { name: 'Switch to Persian' });
      fireEvent.click(switchButton);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/fa/doctors/search');
      });
    });
  });

  describe('document direction', () => {
    it('sets document direction to rtl for Persian', async () => {
      mockUsePathname.mockReturnValue('/fa');
      render(
        <LocalizationClientProvider>
          <TestComponent />
        </LocalizationClientProvider>
      );

      await waitFor(() => {
        expect(document.documentElement.getAttribute('dir')).toBe('rtl');
      });
    });

    it('sets document direction to ltr for English', async () => {
      mockUsePathname.mockReturnValue('/en');
      render(
        <LocalizationClientProvider>
          <TestComponent />
        </LocalizationClientProvider>
      );

      await waitFor(() => {
        expect(document.documentElement.getAttribute('dir')).toBe('ltr');
      });
    });

    it('updates document direction when language changes', async () => {
      mockUsePathname.mockReturnValue('/en');
      const mockPush = vi.fn();
      mockUseRouter.mockReturnValue({
        push: mockPush,
        replace: vi.fn(),
        prefetch: vi.fn(),
      } as unknown as ReturnType<typeof useRouter>);

      render(
        <LocalizationClientProvider>
          <TestComponent />
        </LocalizationClientProvider>
      );

  const switchButton = screen.getByRole('button', { name: 'Switch to Persian' });
      fireEvent.click(switchButton);

      await waitFor(() => {
        expect(document.documentElement.getAttribute('dir')).toBe('rtl');
      });
    });
  });

  describe('context value', () => {
    it('provides language, config, and setLanguage in context', () => {
      mockUsePathname.mockReturnValue('/en');
      render(
        <LocalizationClientProvider>
          <TestComponent />
        </LocalizationClientProvider>
      );

      expect(screen.getByTestId('language')).toBeInTheDocument();
      expect(screen.getByTestId('direction')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Switch to Persian' })).toBeInTheDocument();
    });

    it('provides correct config for language', async () => {
  mockUsePathname.mockReturnValue('/fa');
      render(
        <LocalizationClientProvider>
          <TestComponent />
        </LocalizationClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('direction')).toHaveTextContent('rtl');
      });
    });
  });

  describe('edge cases', () => {
    it('handles root path correctly', () => {
      mockUsePathname.mockReturnValue('/');
      render(
        <LocalizationClientProvider initialLanguage="en">
          <TestComponent />
        </LocalizationClientProvider>
      );

      expect(screen.getByTestId('language')).toHaveTextContent('en');
    });

    it('handles deep nested paths', async () => {
      mockUsePathname.mockReturnValue('/en/doctors/search/results/details');
      const mockPush = vi.fn();
      mockUseRouter.mockReturnValue({
        push: mockPush,
        replace: vi.fn(),
        prefetch: vi.fn(),
      } as unknown as ReturnType<typeof useRouter>);

      render(
        <LocalizationClientProvider>
          <TestComponent />
        </LocalizationClientProvider>
      );

      const switchButton = screen.getByRole('button', { name: 'Switch to Persian' });
      fireEvent.click(switchButton);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/fa/doctors/search/results/details');
      });
    });

    it('handles initialLanguage override of path detection', () => {
      mockUsePathname.mockReturnValue('/fr/doctors');
      render(
        <LocalizationClientProvider initialLanguage="en">
          <TestComponent />
        </LocalizationClientProvider>
      );

      expect(screen.getByTestId('language')).toHaveTextContent('en');
    });
  });

  describe('multiple language switches', () => {
    it('handles multiple language switches correctly', async () => {
      mockUsePathname.mockReturnValue('/en');
      const mockPush = vi.fn();
      mockUseRouter.mockReturnValue({
        push: mockPush,
        replace: vi.fn(),
        prefetch: vi.fn(),
      } as unknown as ReturnType<typeof useRouter>);

      render(
        <LocalizationClientProvider>
          <TestComponent />
        </LocalizationClientProvider>
      );

      fireEvent.click(screen.getByRole('button', { name: 'Switch to Persian' }));
      await waitFor(() => {
        expect(screen.getByTestId('language')).toHaveTextContent('fa');
      });

      fireEvent.click(screen.getByRole('button', { name: 'Switch to English' }));
      await waitFor(() => {
        expect(screen.getByTestId('language')).toHaveTextContent('en');
      });

      expect(mockPush).toHaveBeenCalledTimes(2);
    });
  });

  describe('provider children', () => {
    it('renders children correctly', () => {
      mockUsePathname.mockReturnValue('/en');
      render(
        <LocalizationClientProvider>
          <div>Test Child</div>
        </LocalizationClientProvider>
      );

      expect(screen.getByText('Test Child')).toBeInTheDocument();
    });

    it('passes context to multiple children', () => {
      mockUsePathname.mockReturnValue('/en');
      const ChildOne = () => {
        const { language } = useLocalization();
        return <div>{language}</div>;
      };
      const ChildTwo = () => {
        const { language } = useLocalization();
        return <div>{language}</div>;
      };

      render(
        <LocalizationClientProvider>
          <ChildOne />
          <ChildTwo />
        </LocalizationClientProvider>
      );

      expect(screen.getAllByText('en')).toHaveLength(2);
    });
  });
});
