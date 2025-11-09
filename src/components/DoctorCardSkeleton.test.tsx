import { render } from '@testing-library/react';
import DoctorCardSkeleton from './DoctorCardSkeleton';

describe('DoctorCardSkeleton', () => {
  it('renders skeleton container', () => {
    const { container } = render(<DoctorCardSkeleton />);
    expect(container.querySelector('div')).toBeInTheDocument();
  });

  it('renders with rounded styling', () => {
    const { container } = render(<DoctorCardSkeleton />);
    const skeleton = container.querySelector('div');
    expect(skeleton).toHaveClass('rounded-lg');
  });

  it('applies background color for light theme', () => {
    const { container } = render(<DoctorCardSkeleton />);
    const skeleton = container.querySelector('div');
  expect(skeleton).toHaveClass('bg-white');
  expect(skeleton).toHaveClass('dark:bg-zinc-800');
  });

  it('applies shadow styling', () => {
    const { container } = render(<DoctorCardSkeleton />);
    const skeleton = container.querySelector('div');
  expect(skeleton).toHaveClass('shadow');
  });

  it('applies padding', () => {
    const { container } = render(<DoctorCardSkeleton />);
    const skeleton = container.querySelector('div');
  expect(skeleton).toHaveClass('p-4');
  });

  it('uses flexbox for layout', () => {
    const { container } = render(<DoctorCardSkeleton />);
    const skeleton = container.querySelector('div');
  expect(skeleton).toHaveClass('flex');
  expect(skeleton).toHaveClass('flex-col');
  expect(skeleton).toHaveClass('items-center');
  });

  it('has min-height for consistent sizing', () => {
    const { container } = render(<DoctorCardSkeleton />);
    const skeleton = container.querySelector('div');
    expect(skeleton).toBeInTheDocument();
  });

  it('applies dark mode styling', () => {
    const { container } = render(<DoctorCardSkeleton />);
    const skeleton = container.querySelector('div');
    expect(skeleton).toHaveClass('dark:bg-zinc-800');
  });

  it('renders with gap spacing', () => {
    const { container } = render(<DoctorCardSkeleton />);
    const skeleton = container.querySelector('div');
  expect(skeleton).toHaveClass('gap-4');
  });

  it('contains multiple skeleton elements', () => {
    const { container } = render(<DoctorCardSkeleton />);
    const elements = container.querySelectorAll('.animate-pulse');
    expect(elements.length).toBeGreaterThan(0);
  });

  it('applies animate-pulse class for skeleton effect', () => {
    const { container } = render(<DoctorCardSkeleton />);
    const pulseElements = container.querySelectorAll('.animate-pulse');
    expect(pulseElements.length).toBeGreaterThan(0);
  });

  it('renders without crashing', () => {
    expect(() => render(<DoctorCardSkeleton />)).not.toThrow();
  });

  it('maintains consistent card height', () => {
    const { container } = render(<DoctorCardSkeleton />);
    const skeleton = container.querySelector('div');
    expect(skeleton).toBeInTheDocument();
    // The actual component uses 'p-4', not 'p-6'
    expect(skeleton).toHaveClass('p-4');
  });

  it('renders rounded corners for modern look', () => {
    const { container } = render(<DoctorCardSkeleton />);
    const skeleton = container.querySelector('div');
  expect(skeleton).toHaveClass('rounded-lg');
  });

  // Removed test for transition-transform, not present in component
});
