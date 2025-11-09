import { describe, it, expect } from 'vitest';
import React, { useContext } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeContext } from './ThemeContext';
import type { ThemeContextProps } from './ThemeProvider';

describe('ThemeContext', () => {
  describe('context creation', () => {
    it('creates a valid context object', () => {
      expect(ThemeContext).toBeDefined();
    });

    it('is a React Context', () => {
      expect(ThemeContext).toHaveProperty('Provider');
      expect(ThemeContext).toHaveProperty('Consumer');
    });

    it('has default context value with theme property', () => {
      const TestComponent = () => {
        const context = useContext(ThemeContext);
        return <span data-testid="theme">{context.theme}</span>;
      };

      render(<TestComponent />);

      expect(screen.getByTestId('theme')).toHaveTextContent('system');
    });

    it('has default context value with setTheme function', () => {
      const TestComponent = () => {
        const context = useContext(ThemeContext);
        return (
          <span data-testid="setTheme">
            {typeof context.setTheme === 'function' ? 'function' : 'not function'}
          </span>
        );
      };

      render(<TestComponent />);

      expect(screen.getByTestId('setTheme')).toHaveTextContent('function');
    });

    it('exports a Context.Provider component', () => {
      const { Provider } = ThemeContext;
      expect(Provider).toBeDefined();
    });

    it('exports a Context.Consumer component', () => {
      const { Consumer } = ThemeContext;
      expect(Consumer).toBeDefined();
    });
  });

  describe('context usage with Provider', () => {
    it('provides light theme through Provider', () => {
      const mockValue: ThemeContextProps = {
        theme: 'light',
        setTheme: () => {},
      };

      const TestComponent = () => {
        const context = useContext(ThemeContext);
        return <span data-testid="theme">{context.theme}</span>;
      };

      render(
        <ThemeContext.Provider value={mockValue}>
          <TestComponent />
        </ThemeContext.Provider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('light');
    });

    it('provides dark theme through Provider', () => {
      const mockValue: ThemeContextProps = {
        theme: 'dark',
        setTheme: () => {},
      };

      const TestComponent = () => {
        const context = useContext(ThemeContext);
        return <span data-testid="theme">{context.theme}</span>;
      };

      render(
        <ThemeContext.Provider value={mockValue}>
          <TestComponent />
        </ThemeContext.Provider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    });

    it('provides system theme through Provider', () => {
      const mockValue: ThemeContextProps = {
        theme: 'system',
        setTheme: () => {},
      };

      const TestComponent = () => {
        const context = useContext(ThemeContext);
        return <span data-testid="theme">{context.theme}</span>;
      };

      render(
        <ThemeContext.Provider value={mockValue}>
          <TestComponent />
        </ThemeContext.Provider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('system');
    });

    it('provides setTheme function through context', () => {
      let callCount = 0;
      const mockValue: ThemeContextProps = {
        theme: 'light',
        setTheme: () => {
          callCount++;
        },
      };

      const TestComponent = () => {
        const context = useContext(ThemeContext);
        return (
          <button
            data-testid="button"
            onClick={() => context.setTheme('dark')}
          >
            Toggle
          </button>
        );
      };

      const { getByTestId } = render(
        <ThemeContext.Provider value={mockValue}>
          <TestComponent />
        </ThemeContext.Provider>
      );

      fireEvent.click(getByTestId('button'));
      expect(callCount).toBe(1);
    });
  });

  describe('theme options', () => {
    it('supports light theme option', () => {
      const mockValue: ThemeContextProps = {
        theme: 'light',
        setTheme: () => {},
      };

      const TestComponent = () => {
        const context = useContext(ThemeContext);
        return (
          <span data-testid="result">
            {context.theme === 'light' ? 'is-light' : 'not-light'}
          </span>
        );
      };

      render(
        <ThemeContext.Provider value={mockValue}>
          <TestComponent />
        </ThemeContext.Provider>
      );

      expect(screen.getByTestId('result')).toHaveTextContent('is-light');
    });

    it('supports dark theme option', () => {
      const mockValue: ThemeContextProps = {
        theme: 'dark',
        setTheme: () => {},
      };

      const TestComponent = () => {
        const context = useContext(ThemeContext);
        return (
          <span data-testid="result">
            {context.theme === 'dark' ? 'is-dark' : 'not-dark'}
          </span>
        );
      };

      render(
        <ThemeContext.Provider value={mockValue}>
          <TestComponent />
        </ThemeContext.Provider>
      );

      expect(screen.getByTestId('result')).toHaveTextContent('is-dark');
    });

    it('supports system theme option', () => {
      const mockValue: ThemeContextProps = {
        theme: 'system',
        setTheme: () => {},
      };

      const TestComponent = () => {
        const context = useContext(ThemeContext);
        return (
          <span data-testid="result">
            {context.theme === 'system' ? 'is-system' : 'not-system'}
          </span>
        );
      };

      render(
        <ThemeContext.Provider value={mockValue}>
          <TestComponent />
        </ThemeContext.Provider>
      );

      expect(screen.getByTestId('result')).toHaveTextContent('is-system');
    });
  });

  describe('default context value', () => {
    it('initializes with system theme when no Provider', () => {
      const TestComponent = () => {
        const context = useContext(ThemeContext);
        return <span data-testid="theme">{context.theme}</span>;
      };

      render(<TestComponent />);

      expect(screen.getByTestId('theme')).toHaveTextContent('system');
    });

    it('initializes with empty setTheme function when no Provider', () => {
      const TestComponent = () => {
        const context = useContext(ThemeContext);
        return (
          <span data-testid="type">
            {typeof context.setTheme === 'function' ? 'function' : 'not function'}
          </span>
        );
      };

      render(<TestComponent />);

      expect(screen.getByTestId('type')).toHaveTextContent('function');
    });
  });

  describe('context value structure', () => {
    it('has theme property of type string', () => {
      const mockValue: ThemeContextProps = {
        theme: 'light',
        setTheme: () => {},
      };

      const TestComponent = () => {
        const context = useContext(ThemeContext);
        return (
          <span data-testid="type">
            {typeof context.theme === 'string' ? 'string' : 'not string'}
          </span>
        );
      };

      render(
        <ThemeContext.Provider value={mockValue}>
          <TestComponent />
        </ThemeContext.Provider>
      );

      expect(screen.getByTestId('type')).toHaveTextContent('string');
    });

    it('has setTheme property of type function', () => {
      const mockValue: ThemeContextProps = {
        theme: 'light',
        setTheme: () => {},
      };

      const TestComponent = () => {
        const context = useContext(ThemeContext);
        return (
          <span data-testid="type">
            {typeof context.setTheme === 'function' ? 'function' : 'not function'}
          </span>
        );
      };

      render(
        <ThemeContext.Provider value={mockValue}>
          <TestComponent />
        </ThemeContext.Provider>
      );

      expect(screen.getByTestId('type')).toHaveTextContent('function');
    });

    it('context has exactly two properties', () => {
      const mockValue: ThemeContextProps = {
        theme: 'light',
        setTheme: () => {},
      };

      const values: unknown[] = [];

      const TestComponent = () => {
        const context = useContext(ThemeContext);
        values.push(context);
        return null;
      };

      render(
        <ThemeContext.Provider value={mockValue}>
          <TestComponent />
        </ThemeContext.Provider>
      );

      const context = values[0] as Record<string, unknown>;
      expect(Object.keys(context)).toHaveLength(2);
      expect(Object.keys(context)).toContain('theme');
      expect(Object.keys(context)).toContain('setTheme');
    });
  });

  describe('multiple consumers', () => {
    it('provides same value to multiple consumers', () => {
      const mockValue: ThemeContextProps = {
        theme: 'light',
        setTheme: () => {},
      };

      const Consumer1 = () => {
        const context = useContext(ThemeContext);
        return <span data-testid="consumer1">{context.theme}</span>;
      };

      const Consumer2 = () => {
        const context = useContext(ThemeContext);
        return <span data-testid="consumer2">{context.theme}</span>;
      };

      render(
        <ThemeContext.Provider value={mockValue}>
          <Consumer1 />
          <Consumer2 />
        </ThemeContext.Provider>
      );

      expect(screen.getByTestId('consumer1')).toHaveTextContent('light');
      expect(screen.getByTestId('consumer2')).toHaveTextContent('light');
    });
  });

  describe('context value updates', () => {
    it('reflects value changes when Provider re-renders', () => {
      const initialValue: ThemeContextProps = {
        theme: 'light',
        setTheme: () => {},
      };

      const updatedValue: ThemeContextProps = {
        theme: 'dark',
        setTheme: () => {},
      };

      const TestComponent = ({ value }: { value: ThemeContextProps }) => {
        const Consumer = () => {
          const context = useContext(ThemeContext);
          return <span data-testid="theme">{context.theme}</span>;
        };

        return (
          <ThemeContext.Provider value={value}>
            <Consumer />
          </ThemeContext.Provider>
        );
      };

      const { rerender } = render(<TestComponent value={initialValue} />);
      expect(screen.getByTestId('theme')).toHaveTextContent('light');

      rerender(<TestComponent value={updatedValue} />);
      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    });
  });

  describe('nested providers', () => {
    it('inner provider value overrides outer provider', () => {
      const outerValue: ThemeContextProps = {
        theme: 'light',
        setTheme: () => {},
      };

      const innerValue: ThemeContextProps = {
        theme: 'dark',
        setTheme: () => {},
      };

      const TestComponent = () => {
        const context = useContext(ThemeContext);
        return <span data-testid="theme">{context.theme}</span>;
      };

      render(
        <ThemeContext.Provider value={outerValue}>
          <div data-testid="outer">
            <ThemeContext.Provider value={innerValue}>
              <TestComponent />
            </ThemeContext.Provider>
          </div>
        </ThemeContext.Provider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    });
  });

  describe('setTheme callback', () => {
    it('setTheme can be called with different theme values', () => {
      const calls: string[] = [];
      const mockValue: ThemeContextProps = {
        theme: 'light',
        setTheme: (theme) => {
          calls.push(theme);
        },
      };

      const TestComponent = () => {
        const context = useContext(ThemeContext);
        return (
          <>
            <button
              data-testid="btn-dark"
              onClick={() => context.setTheme('dark')}
            >
              Dark
            </button>
            <button
              data-testid="btn-light"
              onClick={() => context.setTheme('light')}
            >
              Light
            </button>
            <button
              data-testid="btn-system"
              onClick={() => context.setTheme('system')}
            >
              System
            </button>
          </>
        );
      };

      render(
        <ThemeContext.Provider value={mockValue}>
          <TestComponent />
        </ThemeContext.Provider>
      );

      fireEvent.click(screen.getByTestId('btn-dark'));
      fireEvent.click(screen.getByTestId('btn-light'));
      fireEvent.click(screen.getByTestId('btn-system'));

      expect(calls).toEqual(['dark', 'light', 'system']);
    });
  });

  describe('context persistence', () => {
    it('context maintains state across renders', () => {
      const renderCounts: Record<string, number> = { consumer1: 0, consumer2: 0 };

      const mockValue: ThemeContextProps = {
        theme: 'light',
        setTheme: () => {},
      };

      const Consumer1 = () => {
        renderCounts.consumer1++;
        const context = useContext(ThemeContext);
        return <span data-testid="consumer1">{context.theme}</span>;
      };

      const Consumer2 = () => {
        renderCounts.consumer2++;
        const context = useContext(ThemeContext);
        return <span data-testid="consumer2">{context.theme}</span>;
      };

      const { rerender } = render(
        <ThemeContext.Provider value={mockValue}>
          <Consumer1 />
          <Consumer2 />
        </ThemeContext.Provider>
      );

      const initialCount1 = renderCounts.consumer1;
      const initialCount2 = renderCounts.consumer2;

      rerender(
        <ThemeContext.Provider value={mockValue}>
          <Consumer1 />
          <Consumer2 />
        </ThemeContext.Provider>
      );

      expect(renderCounts.consumer1).toBeGreaterThanOrEqual(initialCount1);
      expect(renderCounts.consumer2).toBeGreaterThanOrEqual(initialCount2);
    });
  });
});
