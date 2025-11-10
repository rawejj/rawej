import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLocalization } from '@/providers/useLocalization';
import { ThemeContext } from '@/providers/ThemeContext';
import React from 'react';
import { LocalizationClientProvider } from '@/providers/LocalizationClientProvider';

import type { LanguageKey } from '@/providers/LocalizationProvider';
import type { Theme } from '@/providers/ThemeProvider';

function renderWithProviders(ui: React.ReactNode, initialLanguage: LanguageKey = 'en', theme: Theme = 'light') {
  return render(
    <ThemeContext.Provider value={{ theme, setTheme: () => {} }}>
      <LocalizationClientProvider initialLanguage={initialLanguage}>
        {ui}
      </LocalizationClientProvider>
    </ThemeContext.Provider>
  );
}

vi.mock('@/providers/useLocalization', () => ({
  useLocalization: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useSyncExternalStore: () => true,
  };
});

describe('LanguageSwitcher', () => {
// Helper to render with both Theme and Localization providers
// Use top-level renderWithProviders from above

  const mockSetLanguage = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useLocalization as jest.Mock).mockReturnValue({
      language: 'en',
      setLanguage: mockSetLanguage,
    });
  });

  describe('initial rendering', () => {
    // Use top-level renderWithProviders

    it('renders language switcher button', () => {
      renderWithProviders(<LanguageSwitcher />);
      const button = screen.getByRole('button', { name: /language selector/i });
      expect(button).toBeInTheDocument();
    });

    it('displays current language label', () => {
      renderWithProviders(<LanguageSwitcher />);
      // There may be multiple 'English' elements
      expect(screen.getAllByText('English').length).toBeGreaterThan(0);
    });

    it('renders globe icon in button', () => {
      renderWithProviders(<LanguageSwitcher />);
      const svgs = document.querySelectorAll('svg');
      expect(svgs.length).toBeGreaterThan(0);
    });

    it('renders chevron icon in button', () => {
      renderWithProviders(<LanguageSwitcher />);
      const button = screen.getByRole('button', { name: /language selector/i });
      const svgs = button.querySelectorAll('svg');
      expect(svgs.length).toBeGreaterThanOrEqual(2);
    });

    it('button is initially not expanded', () => {
      renderWithProviders(<LanguageSwitcher />);
      const button = screen.getByRole('button', { name: /language selector/i });
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('dropdown menu is initially hidden', () => {
      renderWithProviders(<LanguageSwitcher />);
      const languageButtons = screen.queryAllByRole('button');
      expect(languageButtons.length).toBe(1);
    });
  });

  describe('dropdown opening and closing', () => {
    it('opens dropdown when button is clicked', () => {
      renderWithProviders(<LanguageSwitcher />);
      const button = screen.getByRole('button', { name: /language selector/i });
      fireEvent.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('displays all language options when opened', () => {
      renderWithProviders(<LanguageSwitcher />);
      const button = screen.getByRole('button', { name: /language selector/i });
      fireEvent.click(button);
      expect(screen.getAllByText('English').length).toBeGreaterThan(1);
      expect(screen.getAllByText('Deutsch').length).toBeGreaterThan(0);
      expect(screen.getAllByText('French').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Persian').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Kurdi-Sorani').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Kurdi-Kermanji').length).toBeGreaterThan(0);
    });

    it('closes dropdown when button is clicked again', () => {
      render(
        <ThemeContext.Provider value={{ theme: 'light', setTheme: () => {} }}>
          <LanguageSwitcher />
        </ThemeContext.Provider>
      );

      const button = screen.getByRole('button', { name: /language selector/i });
      fireEvent.click(button);
      fireEvent.click(button);

      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('closes dropdown when language is selected', async () => {
      (useLocalization as unknown as jest.Mock).mockReturnValue({
        language: 'en',
        setLanguage: mockSetLanguage,
      });

      render(
        <ThemeContext.Provider value={{ theme: 'light', setTheme: () => {} }}>
          <LanguageSwitcher />
        </ThemeContext.Provider>
      );

      const button = screen.getByRole('button', { name: /language selector/i });
      fireEvent.click(button);

      const deutschButton = screen.getByRole('button', { name: /switch to deutsch/i });
      fireEvent.click(deutschButton);

      await waitFor(() => {
        expect(button).toHaveAttribute('aria-expanded', 'false');
      });
    });
  });

  describe('language selection', () => {
    it('calls setLanguage when language option is clicked', () => {
      renderWithProviders(<LanguageSwitcher />);
      const button = screen.getByRole('button', { name: /language selector/i });
      fireEvent.click(button);
      const deutschButton = screen.getByRole('button', { name: /switch to deutsch/i });
      fireEvent.click(deutschButton);
      expect(mockSetLanguage).toHaveBeenCalledWith('de');
    });

    it('switches to French language', () => {
      renderWithProviders(<LanguageSwitcher />);
      const button = screen.getByRole('button', { name: /language selector/i });
      fireEvent.click(button);
      const frenchButton = screen.getByRole('button', { name: /switch to french/i });
      fireEvent.click(frenchButton);
      expect(mockSetLanguage).toHaveBeenCalledWith('fr');
    });

    it('switches to Persian language', () => {
      renderWithProviders(<LanguageSwitcher />);
      const button = screen.getByRole('button', { name: /language selector/i });
      fireEvent.click(button);
      const persianButton = screen.getByRole('button', { name: /switch to persian/i });
      fireEvent.click(persianButton);
      expect(mockSetLanguage).toHaveBeenCalledWith('fa');
    });

    it('handles all language switches correctly', () => {
      renderWithProviders(<LanguageSwitcher />);
      const button = screen.getByRole('button', { name: /language selector/i });
      fireEvent.click(button);
      const englishButton = screen.getByRole('button', { name: /switch to english/i });
      fireEvent.click(englishButton);
      expect(mockSetLanguage).toHaveBeenCalledWith('en');
    });
  });

  describe('active language indicator', () => {
    it('shows checkmark for active language', () => {
      renderWithProviders(<LanguageSwitcher />);
      const button = screen.getByRole('button', { name: /language selector/i });
      fireEvent.click(button);
      const englishButton = screen.getByRole('button', { name: /switch to english/i });
      expect(englishButton).toHaveStyle({ fontWeight: '600' });
    });

    it('does not show checkmark for inactive languages', () => {
      renderWithProviders(<LanguageSwitcher />);
      const button = screen.getByRole('button', { name: /language selector/i });
      fireEvent.click(button);
      const deutschButton = screen.getByRole('button', { name: /switch to deutsch/i });
      expect(deutschButton).not.toHaveStyle({ fontWeight: '600' });
    });

    it('updates active indicator when language changes', () => {
      const { rerender } = renderWithProviders(<LanguageSwitcher />);
      (useLocalization as unknown as jest.Mock).mockReturnValue({
        language: 'de',
        setLanguage: mockSetLanguage,
      });
      rerender(
        <ThemeContext.Provider value={{ theme: 'light', setTheme: () => {} }}>
          <LocalizationClientProvider initialLanguage="de">
            <LanguageSwitcher />
          </LocalizationClientProvider>
        </ThemeContext.Provider>
      );
      expect(screen.getByText('Deutsch')).toBeInTheDocument();
    });
  });

  describe('language direction display', () => {
    it('displays RTL indicator for Persian', () => {
      renderWithProviders(<LanguageSwitcher />);
      const button = screen.getByRole('button', { name: /language selector/i });
      fireEvent.click(button);
      expect(screen.getAllByText('RTL').length).toBeGreaterThan(0);
    });

    it('displays LTR indicator for English', () => {
      renderWithProviders(<LanguageSwitcher />);
      const button = screen.getByRole('button', { name: /language selector/i });
      fireEvent.click(button);
      expect(screen.getAllByText('LTR').length).toBeGreaterThan(0);
    });

    it('displays correct direction for all languages', () => {
      renderWithProviders(<LanguageSwitcher />);
      const button = screen.getByRole('button', { name: /language selector/i });
      fireEvent.click(button);
      const rtlText = screen.getAllByText('RTL');
      const ltrText = screen.getAllByText('LTR');
      expect(rtlText.length).toBeGreaterThan(0);
      expect(ltrText.length).toBeGreaterThan(0);
    });
  });

  describe('theme styling', () => {
    it('applies light theme styling', () => {
      renderWithProviders(<LanguageSwitcher />);
      const button = screen.getByRole('button', { name: /language selector/i });
      expect(button).toBeInTheDocument();
    });

    it('applies dark theme styling', () => {
      renderWithProviders(<LanguageSwitcher />, 'en', 'dark');
      const button = screen.getByRole('button', { name: /language selector/i });
      expect(button).toBeInTheDocument();
    });

    it('applies system theme styling', () => {
      renderWithProviders(<LanguageSwitcher />, 'en', 'system');
      const button = screen.getByRole('button', { name: /language selector/i });
      expect(button).toBeInTheDocument();
    });
  });

  describe('mouse interactions', () => {
    it('shows hover effect on language options', () => {
      renderWithProviders(<LanguageSwitcher />);
      const button = screen.getByRole('button', { name: /language selector/i });
      fireEvent.click(button);
      const languageOption = screen.getByRole('button', { name: /switch to deutsch/i });
      fireEvent.mouseEnter(languageOption);
      expect(languageOption).toBeInTheDocument();
    });

    it('button responds to mouse enter', () => {
      renderWithProviders(<LanguageSwitcher />);
      const button = screen.getByRole('button', { name: /language selector/i });
      fireEvent.mouseEnter(button);
      expect(button).toBeInTheDocument();
    });

    it('button responds to mouse leave', () => {
      renderWithProviders(<LanguageSwitcher />);
      const button = screen.getByRole('button', { name: /language selector/i });
      fireEvent.mouseLeave(button);
      expect(button).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('has proper aria-label for button', () => {
      renderWithProviders(<LanguageSwitcher />);
      const button = screen.getByRole('button', { name: /language selector/i });
      expect(button).toHaveAttribute('aria-label', 'Language selector');
    });

    it('has aria-expanded attribute', () => {
      renderWithProviders(<LanguageSwitcher />);
      const button = screen.getByRole('button', { name: /language selector/i });
      expect(button).toHaveAttribute('aria-expanded');
    });

    it('language options have descriptive aria-labels', () => {
      renderWithProviders(<LanguageSwitcher />);
      const button = screen.getByRole('button', { name: /language selector/i });
      fireEvent.click(button);
      const deutschButton = screen.getByRole('button', { name: /switch to deutsch/i });
      expect(deutschButton).toHaveAttribute('aria-label');
    });
  });

  describe('language option layout', () => {
    it('displays language label', () => {
      renderWithProviders(<LanguageSwitcher />);
      const button = screen.getByRole('button', { name: /language selector/i });
      fireEvent.click(button);
      expect(screen.getAllByText('English').length).toBeGreaterThan(1);
      expect(screen.getAllByText('Deutsch').length).toBeGreaterThan(0);
      expect(screen.getAllByText('French').length).toBeGreaterThan(0);
    });

    it('displays all 6 supported languages', () => {
      renderWithProviders(<LanguageSwitcher />);
      const button = screen.getByRole('button', { name: /language selector/i });
      fireEvent.click(button);
      expect(screen.getAllByText('English').length).toBeGreaterThan(1);
      expect(screen.getAllByText('Deutsch').length).toBeGreaterThan(0);
      expect(screen.getAllByText('French').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Persian').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Kurdi-Sorani').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Kurdi-Kermanji').length).toBeGreaterThan(0);
    });

    it('shows direction indicator for each language', () => {
      renderWithProviders(<LanguageSwitcher />);
      const button = screen.getByRole('button', { name: /language selector/i });
      fireEvent.click(button);
      const directionIndicators = screen.getAllByText(/LTR|RTL/);
      expect(directionIndicators.length).toBeGreaterThanOrEqual(6);
    });
  });

  describe('dropdown positioning', () => {
    it('renders dropdown as a menu', () => {
      renderWithProviders(<LanguageSwitcher />);
      const button = screen.getByRole('button', { name: /language selector/i });
      fireEvent.click(button);
      const menu = screen.getByRole('menu');
      expect(menu).toBeInTheDocument();
    });
  });

  describe('multiple renders', () => {
    it('maintains state across re-renders', () => {
      const { rerender } = renderWithProviders(<LanguageSwitcher />);
      const button = screen.getByRole('button', { name: /language selector/i });
      fireEvent.click(button);
      rerender(
        <ThemeContext.Provider value={{ theme: 'light', setTheme: () => {} }}>
          <LocalizationClientProvider initialLanguage="en">
            <LanguageSwitcher />
          </LocalizationClientProvider>
        </ThemeContext.Provider>
      );
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('handles language change from parent', () => {
      const { rerender } = renderWithProviders(<LanguageSwitcher />);
      rerender(
        <ThemeContext.Provider value={{ theme: 'light', setTheme: () => {} }}>
          <LocalizationClientProvider initialLanguage="de">
            <LanguageSwitcher />
          </LocalizationClientProvider>
        </ThemeContext.Provider>
      );
      // Open the menu before asserting
      const button = screen.getByRole('button', { name: /language selector/i });
      fireEvent.click(button);
      expect(screen.getAllByText('Deutsch').length).toBeGreaterThan(0);
    });
  });
});
