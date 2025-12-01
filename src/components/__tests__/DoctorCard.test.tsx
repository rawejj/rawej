import type { Doctor } from "@/types/doctor";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import DoctorCard from "@/components/DoctorCard";
import { TranslationsProvider } from "@/providers/TranslationsProvider";
import { act } from "@testing-library/react";

const mockTranslations = {
  "book appointment": "Book Appointment",
  theme: {
    light: "Light",
    dark: "Dark",
    system: "Auto",
  },
  callTypes: {
    phone: "Phone",
    video: "Video",
    voice: "Voice",
  },
};

const renderWithTranslations = (component: React.ReactElement) => {
  return render(
    <TranslationsProvider translations={mockTranslations}>
      {component}
    </TranslationsProvider>,
  );
};

describe("DoctorCard", () => {
  const doctor: Doctor = {
    id: 1,
    uuid: "uuid-1",
    name: "Dr. Alice Smith",
    specialty: "Cardiology",
    rating: 4.8,
    image: "/doctor1.jpg",
    bio: "Expert in heart health.",
    callTypes: ["phone", "video", "text"],
  };

  it("renders default doctor image if image is missing", () => {
    renderWithTranslations(
      <DoctorCard doctor={{ ...baseDoctor, image: "" }} onBook={async () => {}} />,
    );
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute(
      "src",
      expect.stringContaining("default-doctor.svg"),
    );
  });

  it("renders doctor name, specialty, and bio", () => {
    renderWithTranslations(<DoctorCard doctor={doctor} onBook={async () => {}} />);
    expect(screen.getByText("Dr. Alice Smith")).toBeInTheDocument();
    expect(screen.getByText("Cardiology")).toBeInTheDocument();
    expect(screen.getByText("Expert in heart health.")).toBeInTheDocument();
  });

  it("shows call type badges at top right", () => {
    renderWithTranslations(<DoctorCard doctor={doctor} onBook={async () => {}} />);
    expect(screen.getByText("Phone")).toBeInTheDocument();
    expect(screen.getByText("Video")).toBeInTheDocument();
    expect(screen.getByText("Text")).toBeInTheDocument();
  });

  it("renders Book Appointment button", () => {
    renderWithTranslations(<DoctorCard doctor={doctor} onBook={async () => {}} />);
    expect(
      screen.getByRole("button", { name: /book appointment/i }),
    ).toBeInTheDocument();
  });

  it("calls onBook when Book Appointment button is clicked", async () => {
    const onBookMock = vi.fn().mockResolvedValue(undefined);
    renderWithTranslations(<DoctorCard doctor={doctor} onBook={onBookMock} />);
    const button = screen.getByRole("button", { name: /book appointment/i });
    await act(async () => {
      fireEvent.click(button);
    });
    expect(onBookMock).toHaveBeenCalledWith(doctor);
  });

  it("does not render call type badges if callTypes is undefined", () => {
    const doctorNoCall: Doctor = {
      id: 2,
      uuid: "uuid-2",
      name: "Dr. Bob Jones",
      specialty: "Dermatology",
      rating: 4.5,
      image: "/doctor2.jpg",
      bio: "Skin care specialist.",
    };
    renderWithTranslations(
      <DoctorCard doctor={doctorNoCall} onBook={async () => {}} />,
    );
    expect(screen.queryByText("Phone")).not.toBeInTheDocument();
    expect(screen.queryByText("Video")).not.toBeInTheDocument();
    expect(screen.queryByText("Text")).not.toBeInTheDocument();
  });

  it("does not render call type badges if callTypes is an empty array", () => {
    const doctorEmptyCall: Doctor = {
      id: 3,
      uuid: "uuid-3",
      name: "Dr. Carol Lee",
      specialty: "Neurology",
      rating: 4.7,
      image: "/doctor3.jpg",
      bio: "Brain and nerves specialist.",
      callTypes: [],
    };
    renderWithTranslations(
      <DoctorCard doctor={doctorEmptyCall} onBook={async () => {}} />,
    );
    expect(screen.queryByText("Phone")).not.toBeInTheDocument();
    expect(screen.queryByText("Video")).not.toBeInTheDocument();
    expect(screen.queryByText("Text")).not.toBeInTheDocument();
  });

  const baseDoctor: Doctor = {
    id: 99,
    uuid: "uuid-test",
    name: "Dr. Test",
    specialty: "Cardiology",
    rating: 4.5,
    image: "/doctor-test.jpg",
    bio: "Test bio",
    callTypes: ["phone", "video", "text"],
  };

  it("renders correctly with only one callType", () => {
    renderWithTranslations(
      <DoctorCard
        doctor={{ ...baseDoctor, callTypes: ["phone"] }}
        onBook={async () => {}}
      />,
    );
    expect(screen.getByText("Phone")).toBeInTheDocument();
    expect(screen.queryByText("Video")).not.toBeInTheDocument();
    expect(screen.queryByText("Voice")).not.toBeInTheDocument();
  });

  it("renders correctly with no bio", () => {
    renderWithTranslations(
      <DoctorCard doctor={{ ...baseDoctor, bio: "" }} onBook={async () => {}} />,
    );
    // Should still render the card, but bio is empty
    expect(screen.getByText("Dr. Test")).toBeInTheDocument();
    expect(screen.getByText("Cardiology")).toBeInTheDocument();
    expect(screen.getByText("4.5")).toBeInTheDocument();
  });

  it("renders default doctor image if image is undefined", () => {
    const doctorNoImage: Doctor = { ...baseDoctor, image: undefined };
    renderWithTranslations(
      <DoctorCard doctor={doctorNoImage} onBook={async () => {}} />,
    );
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute(
      "src",
      expect.stringContaining("default-doctor.svg"),
    );
  });

  it("renders default doctor image if image is missing from object", () => {
    const doctorNoImage = { ...baseDoctor };
    delete doctorNoImage.image;
    renderWithTranslations(
      <DoctorCard doctor={doctorNoImage} onBook={async () => {}} />,
    );
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute(
      "src",
      expect.stringContaining("default-doctor.svg"),
    );
  });

  it("falls back to default image on image load error", () => {
    renderWithTranslations(
      <DoctorCard doctor={baseDoctor} onBook={async () => {}} />,
    );
    const img = screen.getByRole("img");
    fireEvent.error(img);
    expect(img).toHaveAttribute("src", "/images/default-doctor.svg");
  });
});
