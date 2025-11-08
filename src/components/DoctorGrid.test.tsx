
import { render, screen } from '@testing-library/react';
import DoctorGrid from './DoctorGrid';
import type { Doctor } from '@/app/page';

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
    render(<DoctorGrid doctors={doctors} onBook={() => {}} loading={false} />);
    expect(screen.getByText('Dr. Alice Smith')).toBeInTheDocument();
    expect(screen.getByText('Dr. Bob Jones')).toBeInTheDocument();
  });

  it('renders skeletons when loading', () => {
    render(<DoctorGrid doctors={[]} onBook={() => {}} loading={true} />);
    // Should render at least one skeleton
    expect(screen.getAllByText((content, element) => {
      return element?.className.includes('animate-pulse') || false;
    }).length).toBeGreaterThan(0);
  });
});

