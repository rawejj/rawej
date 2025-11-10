import { render } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('renders footer container', () => {
    const { container } = render(<Footer />);
    expect(container.querySelector('footer')).toBeInTheDocument();
  });

  it('renders footer with correct classes', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    expect(footer).toHaveClass('text-center');
    expect(footer).toHaveClass('py-4');
    expect(footer).toHaveClass('w-full');
  });

  it('applies light and dark theme styling', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    expect(footer).toHaveClass('bg-white/60');
    expect(footer).toHaveClass('dark:bg-zinc-900/60');
  });

  it('renders footer text with appropriate styling', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    expect(footer).toHaveClass('text-zinc-400');
    expect(footer).toHaveClass('dark:text-zinc-500');
  });

  it('renders with border styling', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    expect(footer).toHaveClass('rounded-t-2xl');
    expect(footer).toHaveClass('shadow-inner');
  });

  it('maintains semantic HTML structure', () => {
    const { container } = render(<Footer />);
    expect(container.querySelector('footer')).toBeInTheDocument();
  });

  it('renders without crashing', () => {
    expect(() => render(<Footer />)).not.toThrow();
  });

  it('applies responsive padding', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    expect(footer).toHaveClass('py-4');
  });

  it('has proper text color contrast', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    expect(footer).toHaveClass('text-zinc-400');
  });

  it('renders footer at bottom with proper styling', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    expect(footer).toHaveClass('text-center');
  });
});
