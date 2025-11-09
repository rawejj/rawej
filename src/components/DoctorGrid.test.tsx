
import { render, screen } from '@testing-library/react';
import DoctorGrid from './DoctorGrid';
import { TranslationsProvider } from '@/providers/TranslationsProvider';
import type { Doctor } from '@/app/page';

const mockTranslations = {
  "book appointment": "Book Appointment",
  "theme": {
    "light": "Light",
    "dark": "Dark",
    "system": "Auto"
  }
};

const renderWithTranslations = (component: React.ReactElement) => {
  return render(
    <TranslationsProvider translations={mockTranslations}>
      {component}
    </TranslationsProvider>
  );
};

describe('DoctorGrid', () => {
  const doctors: Doctor[] = [
    {
      id: 1,
      name: 'Dr. Alice Smith',
      specialty: 'Cardiology',
      rating: 4.8,
      image: '/doctor1.jpg',
      bio: 'Expert in heart health.',
      callTypes: ['phone'],
    },
    {
      id: 2,
      name: 'Dr. Bob Jones',
      specialty: 'Dermatology',
      rating: 4.5,
      image: '/doctor2.jpg',
      bio: 'Skin care specialist.',
      callTypes: ['video'],
    },
  ];

  it('renders doctor cards when not loading', () => {
    renderWithTranslations(<DoctorGrid doctors={doctors} onBook={() => {}} loading={false} />);
    expect(screen.getByText('Dr. Alice Smith')).toBeInTheDocument();
    expect(screen.getByText('Dr. Bob Jones')).toBeInTheDocument();
  });

  it('renders skeletons when loading', () => {
    renderWithTranslations(<DoctorGrid doctors={[]} onBook={() => {}} loading={true} />);
    // Should render at least one skeleton
    expect(screen.getAllByText((content, element) => {
      return element?.className.includes('animate-pulse') || false;
    }).length).toBeGreaterThan(0);
  });
});

