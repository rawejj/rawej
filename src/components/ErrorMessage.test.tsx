import { render, screen, fireEvent } from "@testing-library/react";
import ErrorMessage from "./ErrorMessage";

describe("ErrorMessage", () => {
  it("renders error message", () => {
    render(<ErrorMessage error="Something went wrong" />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("renders default header text", () => {
    render(<ErrorMessage error="Test error" />);
    expect(screen.getByText("Error loading doctors")).toBeInTheDocument();
  });

  it("renders custom header text from translations", () => {
    const translations = { errorLoadingDoctors: "Failed to load doctors" };
    render(<ErrorMessage error="Test error" translations={translations} />);
    expect(screen.getByText("Failed to load doctors")).toBeInTheDocument();
  });

  it("renders retry button with default text", () => {
    render(<ErrorMessage error="Test error" />);
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });

  it("renders retry button with custom text from translations", () => {
    const translations = { retry: "Try Again" };
    render(<ErrorMessage error="Test error" translations={translations} />);
    expect(
      screen.getByRole("button", { name: /try again/i }),
    ).toBeInTheDocument();
  });

  it("renders only one button", () => {
    render(<ErrorMessage error="Test error" />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(1);
  });

  it("shows loading state while reloading", () => {
    render(<ErrorMessage error="Test error" />);
    const retryButton = screen.getByRole("button", {
      name: /retry/i,
    }) as HTMLButtonElement;
    fireEvent.click(retryButton);
    expect(retryButton.disabled).toBe(true);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays error with HTML special characters", () => {
    const errorText = 'Error: <script>alert("xss")</script>';
    render(<ErrorMessage error={errorText} />);
    expect(screen.getByText(errorText)).toBeInTheDocument();
  });

  it("shows loading spinner when clicked", () => {
    render(<ErrorMessage error="Test error" />);
    const retryButton = screen.getByRole("button", { name: /retry/i });
    fireEvent.click(retryButton);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("hides loading spinner text before retry is clicked", () => {
    render(<ErrorMessage error="Test error" />);
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("renders with dark mode styling", () => {
    const { container } = render(<ErrorMessage error="Test error" />);
    const errorDiv = container.querySelector('[class*="dark:"]');
    expect(errorDiv).toBeInTheDocument();
  });

  it("applies correct styling classes to main container", () => {
    const { container } = render(<ErrorMessage error="Test error" />);
    const mainDiv = container.querySelector(".max-w-xl");
    expect(mainDiv).toHaveClass("mx-auto", "mt-12", "p-6");
  });

  it("renders error message without translations gracefully", () => {
    render(<ErrorMessage error="Test error" />);
    expect(screen.getByText("Error loading doctors")).toBeInTheDocument();
    expect(screen.getByText("Test error")).toBeInTheDocument();
  });

  it("handles empty error message", () => {
    render(<ErrorMessage error="" />);
    expect(screen.getByText("Error loading doctors")).toBeInTheDocument();
  });

  it("displays custom translations for all text elements", () => {
    const translations = {
      errorLoadingDoctors: "Could not fetch doctors",
      retry: "Refresh Page",
    };
    render(<ErrorMessage error="Custom error" translations={translations} />);
    expect(screen.getByText("Could not fetch doctors")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /refresh page/i }),
    ).toBeInTheDocument();
  });

  it("button is disabled when loading", () => {
    render(<ErrorMessage error="Test error" />);
    const retryButton = screen.getByRole("button", {
      name: /retry/i,
    }) as HTMLButtonElement;
    fireEvent.click(retryButton);
    expect(retryButton.disabled).toBe(true);
  });

  it("button is enabled initially", () => {
    render(<ErrorMessage error="Test error" />);
    const retryButton = screen.getByRole("button", {
      name: /retry/i,
    }) as HTMLButtonElement;
    expect(retryButton.disabled).toBe(false);
  });

  it("renders error message in correct container", () => {
    const { container } = render(<ErrorMessage error="Test error" />);
    const mainContainer = container.querySelector(".max-w-xl");
    expect(mainContainer).toBeInTheDocument();
    const errorText = screen.getByText("Test error");
    expect(mainContainer).toContainElement(errorText);
  });

  it("error message appears below the header", () => {
    render(<ErrorMessage error="Detailed error" />);
    expect(screen.getByText("Error loading doctors")).toBeInTheDocument();
    expect(screen.getByText("Detailed error")).toBeInTheDocument();
  });

  it("contains retry button with proper styling", () => {
    render(<ErrorMessage error="Test error" />);
    const button = screen.getByRole("button", { name: /retry/i });
    expect(button).toHaveClass("rounded-lg", "bg-red-500");
  });
});
