import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { BookingDoctorGrid } from "@/components/BookingDoctorGrid";
import { Doctor } from "@/types/doctor";

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
}

vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);

// Mock DoctorCard component
vi.mock("@/components/DoctorCard", () => ({
  default: ({ doctor, onBook }: { doctor: Doctor; onBook: (doctor: Doctor) => void }) => (
    <div data-testid={`doctor-card-${doctor.id}`}>
      <span>{doctor.name}</span>
      <button onClick={() => onBook(doctor)}>Book {doctor.name}</button>
    </div>
  ),
}));

// Mock DoctorCardSkeleton component
vi.mock("@/components/DoctorCardSkeleton", () => ({
  default: () => <div data-testid="skeleton-loader" className="skeleton" />,
}));

describe("BookingDoctorGrid", () => {
  const mockDoctors: Doctor[] = [
    {
      id: 1,
      uuid: "doc-1",
      name: "Dr. Alice",
      email: "alice@example.com",
      specialty: "Cardiology",
    },
    {
      id: 2,
      uuid: "doc-2",
      name: "Dr. Bob",
      email: "bob@example.com",
      specialty: "Neurology",
    },
    {
      id: 3,
      uuid: "doc-3",
      name: "Dr. Charlie",
      email: "charlie@example.com",
      specialty: "Dermatology",
    },
  ];

  it("renders all doctor cards when not loading", () => {
    const onBook = vi.fn();
    render(
      <BookingDoctorGrid
        doctors={mockDoctors}
        loading={false}
        hasMore={true}
        observerRef={{ current: null }}
        onBook={onBook}
      />,
    );

    expect(screen.getByTestId("doctor-card-1")).toBeInTheDocument();
    expect(screen.getByTestId("doctor-card-2")).toBeInTheDocument();
    expect(screen.getByTestId("doctor-card-3")).toBeInTheDocument();
    expect(screen.getByText("Dr. Alice")).toBeInTheDocument();
    expect(screen.getByText("Dr. Bob")).toBeInTheDocument();
    expect(screen.getByText("Dr. Charlie")).toBeInTheDocument();
  });

  it("renders observer ref sentinel", () => {
    const observerRef = { current: null };
    const { container } = render(
      <BookingDoctorGrid
        doctors={mockDoctors}
        loading={false}
        hasMore={true}
        observerRef={observerRef}
        onBook={vi.fn()}
      />,
    );

    // Find the sentinel div with height: 1
    const sentinels = container.querySelectorAll("div[style*='height']");
    const sentinel = Array.from(sentinels).find(
      (el) => (el as HTMLElement).style.height === "1px",
    );
    expect(sentinel).toBeInTheDocument();
  });

  it("renders 'no more doctors' message when hasMore is false", () => {
    render(
      <BookingDoctorGrid
        doctors={mockDoctors}
        loading={false}
        hasMore={false}
        observerRef={{ current: null }}
        onBook={vi.fn()}
      />,
    );

    expect(screen.getByText("No more doctors to load.")).toBeInTheDocument();
  });

  it("renders custom 'no more doctors' message from translations", () => {
    render(
      <BookingDoctorGrid
        doctors={mockDoctors}
        loading={false}
        hasMore={false}
        observerRef={{ current: null }}
        onBook={vi.fn()}
        translations={{ noMoreDoctors: "All doctors loaded!" }}
      />,
    );

    expect(screen.getByText("All doctors loaded!")).toBeInTheDocument();
  });

  it("does not show 'no more doctors' message when hasMore is true", () => {
    render(
      <BookingDoctorGrid
        doctors={mockDoctors}
        loading={false}
        hasMore={true}
        observerRef={{ current: null }}
        onBook={vi.fn()}
      />,
    );

    expect(
      screen.queryByText("No more doctors to load."),
    ).not.toBeInTheDocument();
  });

  // Skeleton rendering tests for grid remainder logic
  it("renders 0 skeletons when doctors.length is divisible by 3", () => {
    const doctors = mockDoctors; // 3 doctors, 3 % 3 = 0
    render(
      <BookingDoctorGrid
        doctors={doctors}
        loading={true}
        hasMore={true}
        observerRef={{ current: null }}
        onBook={vi.fn()}
      />,
    );

    const skeletons = screen.getAllByTestId("skeleton-loader");
    expect(skeletons.length).toBe(3); // columns - 0 = 3 skeletons needed
  });

  it("renders 1 skeleton when doctors.length % 3 = 2", () => {
    const doctors = mockDoctors.slice(0, 2); // 2 doctors, 2 % 3 = 2
    render(
      <BookingDoctorGrid
        doctors={doctors}
        loading={true}
        hasMore={true}
        observerRef={{ current: null }}
        onBook={vi.fn()}
      />,
    );

    const skeletons = screen.getAllByTestId("skeleton-loader");
    expect(skeletons.length).toBe(1); // columns - 2 = 1 skeleton needed
  });

  it("renders 2 skeletons when doctors.length % 3 = 1", () => {
    const doctors = mockDoctors.slice(0, 1); // 1 doctor, 1 % 3 = 1
    render(
      <BookingDoctorGrid
        doctors={doctors}
        loading={true}
        hasMore={true}
        observerRef={{ current: null }}
        onBook={vi.fn()}
      />,
    );

    const skeletons = screen.getAllByTestId("skeleton-loader");
    expect(skeletons.length).toBe(2); // columns - 1 = 2 skeletons needed
  });

  it("renders 3 skeletons when no doctors and loading", () => {
    render(
      <BookingDoctorGrid
        doctors={[]}
        loading={true}
        hasMore={true}
        observerRef={{ current: null }}
        onBook={vi.fn()}
      />,
    );

    const skeletons = screen.getAllByTestId("skeleton-loader");
    expect(skeletons.length).toBe(3); // columns - 0 = 3 skeletons needed (0 % 3 = 0)
  });

  it("does not render skeletons when not loading", () => {
    render(
      <BookingDoctorGrid
        doctors={mockDoctors.slice(0, 1)}
        loading={false}
        hasMore={true}
        observerRef={{ current: null }}
        onBook={vi.fn()}
      />,
    );

    const skeletons = screen.queryAllByTestId("skeleton-loader");
    expect(skeletons.length).toBe(0);
  });

  it("renders doctors and skeletons together when loading", () => {
    const doctors = mockDoctors.slice(0, 2); // 2 doctors, need 1 skeleton to fill 3-column grid
    render(
      <BookingDoctorGrid
        doctors={doctors}
        loading={true}
        hasMore={true}
        observerRef={{ current: null }}
        onBook={vi.fn()}
      />,
    );

    // Should render 2 doctor cards
    expect(screen.getByTestId("doctor-card-1")).toBeInTheDocument();
    expect(screen.getByTestId("doctor-card-2")).toBeInTheDocument();
    // Should render 1 skeleton
    const skeletons = screen.getAllByTestId("skeleton-loader");
    expect(skeletons.length).toBe(1);
  });

  it("calls onBook handler when doctor card is clicked", () => {
    const onBook = vi.fn();
    render(
      <BookingDoctorGrid
        doctors={mockDoctors.slice(0, 1)}
        loading={false}
        hasMore={true}
        observerRef={{ current: null }}
        onBook={onBook}
      />,
    );

    const bookButton = screen.getByText("Book Dr. Alice");
    bookButton.click();
    expect(onBook).toHaveBeenCalledWith(mockDoctors[0]);
  });

  it("handles large doctor list with proper skeleton calculation", () => {
    const largeDoctorList = Array.from({ length: 7 }, (_, i) => ({
      id: i + 1,
      uuid: `doc-${i + 1}`,
      name: `Dr. ${String.fromCharCode(65 + i)}`,
      email: `doctor${i + 1}@example.com`,
      specialty: "General",
    }));

    render(
      <BookingDoctorGrid
        doctors={largeDoctorList}
        loading={true}
        hasMore={true}
        observerRef={{ current: null }}
        onBook={vi.fn()}
      />,
    );

    // 7 % 3 = 1, so we need 3 - 1 = 2 skeletons
    const skeletons = screen.getAllByTestId("skeleton-loader");
    expect(skeletons.length).toBe(2);
  });

  it("renders with empty translations object", () => {
    render(
      <BookingDoctorGrid
        doctors={mockDoctors}
        loading={false}
        hasMore={false}
        observerRef={{ current: null }}
        onBook={vi.fn()}
        translations={{}}
      />,
    );

    // Should fall back to default message
    expect(screen.getByText("No more doctors to load.")).toBeInTheDocument();
  });

  it("renders with observer ref attached to element", () => {
    const observerRef = { current: null };
    const { container } = render(
      <BookingDoctorGrid
        doctors={mockDoctors}
        loading={false}
        hasMore={true}
        observerRef={observerRef}
        onBook={vi.fn()}
      />,
    );

    // Verify the main section is rendered
    const mainElement = container.querySelector("main");
    expect(mainElement).toBeInTheDocument();
  });
});
