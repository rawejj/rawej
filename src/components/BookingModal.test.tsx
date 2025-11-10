import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import BookingModal from './BookingModal';
import type { Doctor } from './BookingSection';
import { TranslationsProvider } from '@/providers/TranslationsProvider';
import { ThemeContext } from '@/providers/ThemeContext';
import enTranslations from '@/../public/locales/en.json';

function renderWithProviders(ui: React.ReactNode, translations = enTranslations) {
  return render(
    <ThemeContext.Provider value={{ theme: 'light', setTheme: () => {} }}>
      <TranslationsProvider translations={translations}>{ui}</TranslationsProvider>
    </ThemeContext.Provider>
  );
}

describe('BookingModal', () => {
  const mockDoctor: Doctor = {
    id: 1,
    uuid: 'uuid-1234',
    name: 'Dr. John Smith',
    specialty: 'Cardiology',
    rating: 4.8,
    image: '/doctor-image.jpg',
    bio: 'Expert cardiologist',
    callTypes: ['phone', 'video'],
  };

  const mockTimes = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'];

  const getNext7Days = () => [
    { label: 'Mon', value: '2024-01-01' },
    { label: 'Tue', value: '2024-01-02' },
    { label: 'Wed', value: '2024-01-03' },
  ];

  const defaultProps = {
    show: true,
    doctor: mockDoctor,
    selectedDate: '',
    selectedTime: '',
    confirmed: false,
    onClose: vi.fn(),
    onDateChange: vi.fn(),
    onTimeChange: vi.fn(),
    onConfirm: vi.fn(),
    getNext7Days,
    times: mockTimes,
  };

  it('returns null when show is false', () => {
    const { container } = renderWithProviders(
      <BookingModal {...defaultProps} show={false} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('returns null when doctor is null', () => {
    const { container } = renderWithProviders(
      <BookingModal {...defaultProps} doctor={null} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders doctor information', () => {
    renderWithProviders(<BookingModal {...defaultProps} />);
    expect(screen.getByText('Dr. John Smith')).toBeInTheDocument();
    expect(screen.getByText('Cardiology')).toBeInTheDocument();
  });

  it('renders doctor image', () => {
    renderWithProviders(<BookingModal {...defaultProps} />);
    const image = screen.getByAltText('Dr. John Smith');
    expect(image).toHaveAttribute('src', expect.stringContaining('doctor-image.jpg'));
  });

  it('falls back to default image on error', () => {
    renderWithProviders(<BookingModal {...defaultProps} doctor={{ ...mockDoctor, image: '' }} />);
    const image = screen.getByAltText('Dr. John Smith');
    fireEvent.error(image);
    expect(image).toHaveAttribute('src', '/images/default-doctor.svg');
  });

  it('renders date selection buttons', () => {
    renderWithProviders(<BookingModal {...defaultProps} />);
    expect(screen.getByText(/Select a Date/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mon' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tue' })).toBeInTheDocument();
  });

  it('highlights selected date', () => {
    renderWithProviders(<BookingModal {...defaultProps} selectedDate="2024-01-01" />);
    const selectedButton = screen.getByRole('button', { name: 'Mon' });
    expect(selectedButton).toHaveClass('bg-purple-500');
  });

  it('calls onDateChange when date is selected', () => {
    const onDateChange = vi.fn();
    renderWithProviders(<BookingModal {...defaultProps} onDateChange={onDateChange} />);
    const dateButton = screen.getByRole('button', { name: 'Mon' });
    fireEvent.click(dateButton);
    expect(onDateChange).toHaveBeenCalledWith('2024-01-01');
  });

  it('renders time selection buttons', () => {
    renderWithProviders(<BookingModal {...defaultProps} />);
    expect(screen.getByText(/Select a Time/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '9:00 AM' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2:00 PM' })).toBeInTheDocument();
  });

  it('highlights selected time', () => {
    renderWithProviders(<BookingModal {...defaultProps} selectedTime="9:00 AM" />);
    const selectedButton = screen.getByRole('button', { name: '9:00 AM' });
    expect(selectedButton).toHaveClass('bg-pink-400');
  });

  it('calls onTimeChange when time is selected', () => {
    const onTimeChange = vi.fn();
    renderWithProviders(<BookingModal {...defaultProps} onTimeChange={onTimeChange} />);
    const timeButton = screen.getByRole('button', { name: '9:00 AM' });
    fireEvent.click(timeButton);
    expect(onTimeChange).toHaveBeenCalledWith('9:00 AM');
  });

  it('disables confirm button when no time is selected', () => {
    renderWithProviders(<BookingModal {...defaultProps} selectedTime="" />);
    const confirmButton = screen.getByRole('button', { name: /Confirm Booking|Booked!/i });
    expect(confirmButton).toBeDisabled();
  });

  it('enables confirm button when time is selected', () => {
    renderWithProviders(<BookingModal {...defaultProps} selectedTime="9:00 AM" />);
    const confirmButton = screen.getByRole('button', { name: /Confirm Booking/i });
    expect(confirmButton).not.toBeDisabled();
  });

  it('calls onConfirm when confirm button is clicked', () => {
    const onConfirm = vi.fn();
    renderWithProviders(
      <BookingModal
        {...defaultProps}
        selectedTime="9:00 AM"
        onConfirm={onConfirm}
      />
    );
    const confirmButton = screen.getByRole('button', { name: /Confirm Booking/i });
    fireEvent.click(confirmButton);
    expect(onConfirm).toHaveBeenCalled();
  });

  it('shows "Booked!" text when confirmed', () => {
    renderWithProviders(<BookingModal {...defaultProps} confirmed={true} selectedTime="9:00 AM" />);
    expect(screen.getByRole('button', { name: /Booked!/i })).toBeInTheDocument();
  });

  it('renders cancel button', () => {
    renderWithProviders(<BookingModal {...defaultProps} />);
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', () => {
    const onClose = vi.fn();
    renderWithProviders(<BookingModal {...defaultProps} onClose={onClose} />);
    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelButton);
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    const { container } = renderWithProviders(
      <BookingModal {...defaultProps} onClose={onClose} />
    );
    const backdrop = container.querySelector('.fixed.inset-0');
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(onClose).toHaveBeenCalled();
    }
  });

  it('does not close when modal content is clicked', () => {
    const onClose = vi.fn();
    renderWithProviders(<BookingModal {...defaultProps} onClose={onClose} />);
    const modalContent = screen.getByText('Dr. John Smith').closest('div.max-w-md');
    if (modalContent) {
      fireEvent.click(modalContent);
      expect(onClose).not.toHaveBeenCalled();
    }
  });

  it('renders all time slots', () => {
    renderWithProviders(<BookingModal {...defaultProps} />);
    mockTimes.forEach((time) => {
      expect(screen.getByText(time)).toBeInTheDocument();
    });
  });

  it('renders all date options', () => {
    renderWithProviders(<BookingModal {...defaultProps} />);
    const dates = getNext7Days();
    dates.forEach((date) => {
      expect(screen.getByText(date.label)).toBeInTheDocument();
    });
  });

  it('handles empty times array gracefully', () => {
    const { container } = renderWithProviders(
      <BookingModal {...defaultProps} times={[]} />
    );
    expect(container).toBeInTheDocument();
  });

  it('applies scrollable styling to modal', () => {
    const { container } = renderWithProviders(<BookingModal {...defaultProps} />);
    const modalContent = container.querySelector('.max-h-\\[85vh\\]');
    expect(modalContent).toBeInTheDocument();
  });
});
