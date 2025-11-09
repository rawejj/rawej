import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeContext } from '@/providers/ThemeContext';
import { vi } from 'vitest';
import { ThemeSwitcher } from './ThemeSwitcher';

describe('ThemeSwitcher', () => {
  it('renders current theme and options', () => {
    render(
      <ThemeContext.Provider value={{ theme: 'light', setTheme: () => {} }}>
        <ThemeSwitcher />
      </ThemeContext.Provider>
    );
    // Only Light is visible before opening dropdown
    expect(screen.getByText('Light')).toBeInTheDocument();
    // Open dropdown
    fireEvent.click(screen.getByLabelText('Theme selector'));
    expect(screen.getByText('Dark')).toBeInTheDocument();
    expect(screen.getByText('Auto')).toBeInTheDocument();
  });

  it('calls setTheme when option clicked', () => {
    const setTheme = vi.fn();
    render(
      <ThemeContext.Provider value={{ theme: 'light', setTheme }}>
        <ThemeSwitcher />
      </ThemeContext.Provider>
    );

    // Open dropdown
    fireEvent.click(screen.getByLabelText('Theme selector'));
    fireEvent.click(screen.getByRole('button', { name: 'Switch to Light theme' }));
    // Re-open dropdown for next option
    fireEvent.click(screen.getByLabelText('Theme selector'));
    fireEvent.click(screen.getByRole('button', { name: 'Switch to Dark theme' }));
    // Re-open dropdown for next option
    fireEvent.click(screen.getByLabelText('Theme selector'));
    fireEvent.click(screen.getByRole('button', { name: 'Switch to Auto theme' }));
    expect(setTheme).toHaveBeenCalledWith('light');
    expect(setTheme).toHaveBeenCalledWith('dark');
    expect(setTheme).toHaveBeenCalledWith('system');
  });

  it('closes dropdown when backdrop is clicked', () => {
    render(
      <ThemeContext.Provider value={{ theme: 'light', setTheme: () => {} }}>
        <ThemeSwitcher />
      </ThemeContext.Provider>
    );
    // Open dropdown
    fireEvent.click(screen.getByLabelText('Theme selector'));
    // Backdrop should be present
    const backdrop = screen.getByTestId('theme-switcher-backdrop');
    expect(backdrop).toBeInTheDocument();
    // Click backdrop to close
    fireEvent.click(backdrop);
    // Dropdown should be closed
    expect(screen.queryByText('Dark')).not.toBeInTheDocument();
    expect(screen.queryByText('Auto')).not.toBeInTheDocument();
  });

  it('dropdown has slideIn animation style', () => {
    render(
      <ThemeContext.Provider value={{ theme: 'light', setTheme: () => {} }}>
        <ThemeSwitcher />
      </ThemeContext.Provider>
    );
    fireEvent.click(screen.getByLabelText('Theme selector'));
    // Find dropdown by role or style
    const dropdown = screen.getByRole('menu', { hidden: true });
    expect(dropdown).toHaveStyle('animation: slideIn 0.2s ease-out');
  });

  it('applies hover effects on theme selector button', () => {
    render(
      <ThemeContext.Provider value={{ theme: 'light', setTheme: () => {} }}>
        <ThemeSwitcher />
      </ThemeContext.Provider>
    );
    const button = screen.getByLabelText('Theme selector');
    // Simulate mouse enter
    fireEvent.mouseEnter(button);
    expect(button).toHaveStyle('box-shadow: 0 4px 12px rgba(0,0,0,0.12)');
    expect(button).toHaveStyle('transform: translateY(-1px)');
    // Simulate mouse leave
    fireEvent.mouseLeave(button);
    expect(button).toHaveStyle('box-shadow: 0 2px 8px rgba(0,0,0,0.08)');
    expect(button).toHaveStyle('transform: translateY(0)');
  });

  it('applies hover effects on dropdown menu items', () => {
    render(
      <ThemeContext.Provider value={{ theme: 'light', setTheme: () => {} }}>
        <ThemeSwitcher />
      </ThemeContext.Provider>
    );
    fireEvent.click(screen.getByLabelText('Theme selector'));
    const darkButton = screen.getByRole('button', { name: 'Switch to Dark theme' });
    // Simulate mouse enter on non-active item
    fireEvent.mouseEnter(darkButton);
    expect(darkButton).toHaveStyle('background: rgba(0, 0, 0, 0.04)');
    // Simulate mouse leave
    fireEvent.mouseLeave(darkButton);
    expect(darkButton).toHaveStyle('background: transparent');
  });

  it('does not change background on hover for active menu item', () => {
    render(
      <ThemeContext.Provider value={{ theme: 'light', setTheme: () => {} }}>
        <ThemeSwitcher />
      </ThemeContext.Provider>
    );
    fireEvent.click(screen.getByLabelText('Theme selector'));
    const lightButton = screen.getByRole('button', { name: 'Switch to Light theme' });
    const initialBackground = lightButton.style.background;
    // Simulate mouse enter on active item
    fireEvent.mouseEnter(lightButton);
    // Background should remain the same (gradient for active item)
    expect(lightButton.style.background).toBe(initialBackground);
  });

  it('uses CSS variables for system theme', () => {
    render(
      <ThemeContext.Provider value={{ theme: 'system', setTheme: () => {} }}>
        <ThemeSwitcher />
      </ThemeContext.Provider>
    );
    const button = screen.getByLabelText('Theme selector');
    // System theme should use CSS variables
    expect(button).toHaveStyle('background: var(--background)');
    expect(button).toHaveStyle('color: var(--foreground)');
  });

  it('renders dropdown with system theme using CSS variables', () => {
    render(
      <ThemeContext.Provider value={{ theme: 'system', setTheme: () => {} }}>
        <ThemeSwitcher />
      </ThemeContext.Provider>
    );
    // Open dropdown to trigger getBg() and getFg() calls in dropdown
    fireEvent.click(screen.getByLabelText('Theme selector'));
    const dropdown = screen.getByRole('menu', { hidden: true });
    // The dropdown should be rendered with system theme
    expect(dropdown).toBeInTheDocument();
  });

  it('handles mouse events on toggle button for dark theme', () => {
    render(
      <ThemeContext.Provider value={{ theme: 'dark', setTheme: () => {} }}>
        <ThemeSwitcher />
      </ThemeContext.Provider>
    );
    const button = screen.getByLabelText('Theme selector');
    // Simulate mouse enter for dark theme
    fireEvent.mouseEnter(button);
    expect(button).toHaveStyle('box-shadow: 0 4px 12px rgba(0,0,0,0.42)');
    expect(button).toHaveStyle('transform: translateY(-1px)');
    // Simulate mouse leave for dark theme
    fireEvent.mouseLeave(button);
    expect(button).toHaveStyle('box-shadow: 0 2px 8px rgba(0,0,0,0.32)');
    expect(button).toHaveStyle('transform: translateY(0)');
  });

  it('handles mouse events on dropdown items for dark theme', () => {
    render(
      <ThemeContext.Provider value={{ theme: 'dark', setTheme: () => {} }}>
        <ThemeSwitcher />
      </ThemeContext.Provider>
    );
    fireEvent.click(screen.getByLabelText('Theme selector'));
    const lightButton = screen.getByRole('button', { name: 'Switch to Light theme' });
    // Simulate mouse enter on non-active item in dark theme
    fireEvent.mouseEnter(lightButton);
    expect(lightButton).toHaveStyle('background: rgba(255,255,255,0.04)');
    // Simulate mouse leave
    fireEvent.mouseLeave(lightButton);
    expect(lightButton).toHaveStyle('background: transparent');
  });
});
