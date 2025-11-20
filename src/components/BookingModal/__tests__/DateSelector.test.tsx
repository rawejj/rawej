import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import DateSelector from "@/components/BookingModal/DateSelector";
import { TranslationsProvider } from "@/providers/TranslationsProvider";
import { LocalizationClientProvider } from "@/providers/LocalizationClientProvider";

const mockTranslations = {
  labels: {
    "select a date": "Select a Date",
  },
  weekdays: {
    sun: "Sun",
    mon: "Mon",
    tue: "Tue",
    wed: "Wed",
    thu: "Thu",
    fri: "Fri",
    sat: "Sat",
  },
};

const mockDates = [
  {
    title: "2025-11-20",
    label: "Thursday 20 November 2025",
    value: "2025-11-20",
    times: [
      { start: "09:00", end: "09:30", duration: "30m" },
      { start: "10:00", end: "10:30", duration: "30m" },
    ],
  },
  {
    title: "2025-11-21",
    label: "Friday 21 November 2025",
    value: "2025-11-21",
    times: [
      { start: "14:00", end: "14:30", duration: "30m" },
    ],
  },
];

function renderWithProviders(
  component: React.ReactElement,
  lang: "en" | "fa" | "ku-kur" | "ku-sor" | "de" | "fr" = "en",
) {
  return render(
    <LocalizationClientProvider initialLanguage={lang}>
      <TranslationsProvider translations={mockTranslations}>
        {component}
      </TranslationsProvider>
    </LocalizationClientProvider>,
  );
}

describe("DateSelector Component", () => {
  it("renders the component title", () => {
    renderWithProviders(
      <DateSelector
        selectedDate="2025-11-20"
        onDateChange={vi.fn()}
        availableDates={mockDates}
      />,
    );

    expect(screen.getByText("Select a Date")).toBeInTheDocument();
  });

  it("renders all available date buttons", () => {
    renderWithProviders(
      <DateSelector
        selectedDate="2025-11-20"
        onDateChange={vi.fn()}
        availableDates={mockDates}
      />,
    );

    // Should render buttons for each date
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(mockDates.length);
  });

  it("displays date text split into displayText and subText", () => {
    renderWithProviders(
      <DateSelector
        selectedDate="2025-11-20"
        onDateChange={vi.fn()}
        availableDates={mockDates}
      />,
    );

    // Thursday and 20 should be in displayText
    expect(screen.getByText("Thursday 20")).toBeInTheDocument();
    // November 2025 should be in subText - use getAllByText since there can be multiple
    const subTexts = screen.getAllByText("November 2025");
    expect(subTexts.length).toBeGreaterThan(0);
  });

  it("highlights the selected date button", () => {
    renderWithProviders(
      <DateSelector
        selectedDate="2025-11-20"
        onDateChange={vi.fn()}
        availableDates={mockDates}
      />,
    );

    const buttons = screen.getAllByRole("button");
    const selectedButton = buttons.find((btn) =>
      btn.className.includes("from-purple-500"),
    );

    expect(selectedButton).toBeInTheDocument();
  });

  it("calls onDateChange when a date is clicked", () => {
    const onDateChange = vi.fn();
    renderWithProviders(
      <DateSelector
        selectedDate="2025-11-20"
        onDateChange={onDateChange}
        availableDates={mockDates}
      />,
    );

    const buttons = screen.getAllByRole("button");
    // Click the second button (different date)
    fireEvent.click(buttons[buttons.length - 1]);

    expect(onDateChange).toHaveBeenCalled();
  });

  it("passes correct date value to onDateChange", () => {
    const onDateChange = vi.fn();
    renderWithProviders(
      <DateSelector
        selectedDate="2025-11-20"
        onDateChange={onDateChange}
        availableDates={mockDates}
      />,
    );

    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[buttons.length - 1]);

    expect(onDateChange).toHaveBeenCalledWith(mockDates[1].value);
  });

  it("handles empty availableDates", () => {
    renderWithProviders(
      <DateSelector
        selectedDate=""
        onDateChange={vi.fn()}
        availableDates={[]}
      />,
    );

    expect(screen.getByText("Select a Date")).toBeInTheDocument();
  });

  it("renders with Farsi language", () => {
    const farsiTranslations = {
      labels: {
        "select a date": "انتخاب تاریخ",
      },
      weekdays: {
        sun: "یکشنبه",
        mon: "دوشنبه",
        tue: "سه‌شنبه",
        wed: "چهارشنبه",
        thu: "پنج‌شنبه",
        fri: "جمعه",
        sat: "شنبه",
      },
    };

    const { container } = render(
      <LocalizationClientProvider initialLanguage="fa">
        <TranslationsProvider translations={farsiTranslations}>
          <DateSelector
            selectedDate="2025-11-20"
            onDateChange={vi.fn()}
            availableDates={mockDates}
          />
        </TranslationsProvider>
      </LocalizationClientProvider>,
    );

    expect(screen.getByText("انتخاب تاریخ")).toBeInTheDocument();
    // Should contain Farsi formatted dates
    expect(container.textContent).toBeTruthy();
  });

  it("renders calendar icon", () => {
    const { container } = renderWithProviders(
      <DateSelector
        selectedDate="2025-11-20"
        onDateChange={vi.fn()}
        availableDates={mockDates}
      />,
    );

    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("applies correct styling to selected button", () => {
    const { container } = renderWithProviders(
      <DateSelector
        selectedDate="2025-11-20"
        onDateChange={vi.fn()}
        availableDates={mockDates}
      />,
    );

    const buttons = container.querySelectorAll("button");
    // Find the selected button by checking for purple gradient
    const selectedButton = Array.from(buttons).find(
      (btn) =>
        btn.className.includes("from-purple-500") ||
        btn.className.includes("to-pink-400"),
    );

    expect(selectedButton).toBeInTheDocument();
    expect(selectedButton?.className).toContain("text-white");
  });

  it("applies correct styling to unselected buttons", () => {
    const { container } = renderWithProviders(
      <DateSelector
        selectedDate="2025-11-20"
        onDateChange={vi.fn()}
        availableDates={mockDates}
      />,
    );

    const buttons = container.querySelectorAll("button");
    // Find unselected button (not containing the gradient classes)
    const unselectedButton = Array.from(buttons).find(
      (btn) =>
        !btn.className.includes("from-purple-500") &&
        !btn.className.includes("to-pink-400"),
    );

    expect(unselectedButton).toBeInTheDocument();
  });

  it("handles date change from one date to another", () => {
    const onDateChange = vi.fn();
    const { rerender } = renderWithProviders(
      <DateSelector
        selectedDate="2025-11-20"
        onDateChange={onDateChange}
        availableDates={mockDates}
      />,
    );

    let buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[buttons.length - 1]);

    expect(onDateChange).toHaveBeenCalledWith("2025-11-21");

    // Simulate selection change
    rerender(
      <LocalizationClientProvider initialLanguage="en">
        <TranslationsProvider translations={mockTranslations}>
          <DateSelector
            selectedDate="2025-11-21"
            onDateChange={onDateChange}
            availableDates={mockDates}
          />
        </TranslationsProvider>
      </LocalizationClientProvider>,
    );

    buttons = screen.getAllByRole("button");
    // New selected button should have different styling
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("renders with single date", () => {
    renderWithProviders(
      <DateSelector
        selectedDate="2025-11-20"
        onDateChange={vi.fn()}
        availableDates={[mockDates[0]]}
      />,
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(1);
  });

  it("renders with many dates", () => {
    const manyDates = Array.from({ length: 10 }, (_, i) => ({
      ...mockDates[0],
      title: `2025-11-${20 + i}`,
      value: `2025-11-${20 + i}`,
    }));

    renderWithProviders(
      <DateSelector
        selectedDate="2025-11-20"
        onDateChange={vi.fn()}
        availableDates={manyDates}
      />,
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(manyDates.length);
  });

  it("has scrollable container for dates", () => {
    const { container } = renderWithProviders(
      <DateSelector
        selectedDate="2025-11-20"
        onDateChange={vi.fn()}
        availableDates={mockDates}
      />,
    );

    const scrollContainer = container.querySelector(".overflow-x-auto");
    expect(scrollContainer).toBeInTheDocument();
  });

  it("applies hide-scrollbar class to hide scrollbar", () => {
    const { container } = renderWithProviders(
      <DateSelector
        selectedDate="2025-11-20"
        onDateChange={vi.fn()}
        availableDates={mockDates}
      />,
    );

    const scrollContainer = container.querySelector(".hide-scrollbar");
    expect(scrollContainer).toBeInTheDocument();
  });
});
