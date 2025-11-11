import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { DropdownMenu } from "./DropdownMenu";

describe("DropdownMenu", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    children: <button onClick={vi.fn()}>Test Option</button>,
  };

  it("does not render when isOpen is false", () => {
    const { container } = render(
      <DropdownMenu {...defaultProps} isOpen={false} />,
    );
    expect(container.querySelector('[role="menu"]')).not.toBeInTheDocument();
  });

  it("renders children when isOpen is true", () => {
    render(<DropdownMenu {...defaultProps} />);
    expect(screen.getByText("Test Option")).toBeInTheDocument();
  });

  it("renders menu role when open", () => {
    const { container } = render(<DropdownMenu {...defaultProps} />);
    expect(container.querySelector('[role="menu"]')).toBeInTheDocument();
  });

  it("calls onClose when backdrop is clicked", () => {
    const onClose = vi.fn();
    const { container } = render(
      <DropdownMenu {...defaultProps} onClose={onClose} />,
    );
    const backdrop = container.querySelector(
      '[data-testid="dropdown-backdrop"]',
    );
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(onClose).toHaveBeenCalled();
    }
  });

  it("uses custom backdrop test id when provided", () => {
    const { container } = render(
      <DropdownMenu {...defaultProps} backdropTestId="custom-backdrop" />,
    );
    expect(
      container.querySelector('[data-testid="custom-backdrop"]'),
    ).toBeInTheDocument();
  });

  it("applies inline styles when provided", () => {
    const customStyle = { minWidth: "300px", backgroundColor: "red" };
    const { container } = render(
      <DropdownMenu {...defaultProps} style={customStyle} />,
    );
    const menu = container.querySelector('[role="menu"]');
    expect(menu).toHaveStyle("min-width: 300px");
    expect(menu).toHaveStyle("background-color: rgb(255, 0, 0)");
  });

  it("does not prevent propagation when backdrop is clicked", () => {
    const onClose = vi.fn();
    const { container } = render(
      <DropdownMenu {...defaultProps} onClose={onClose} />,
    );
    const backdrop = container.querySelector(
      '[data-testid="dropdown-backdrop"]',
    );
    if (backdrop) {
      const event = new MouseEvent("click", { bubbles: true });
      backdrop.dispatchEvent(event);
      expect(onClose).toHaveBeenCalled();
    }
  });

  it("renders multiple children elements", () => {
    const children = (
      <>
        <button>Option 1</button>
        <button>Option 2</button>
        <button>Option 3</button>
      </>
    );
    render(<DropdownMenu {...defaultProps}>{children}</DropdownMenu>);
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
    expect(screen.getByText("Option 3")).toBeInTheDocument();
  });

  it("allows interaction with menu items", () => {
    const handleClick = vi.fn();
    const children = <button onClick={handleClick}>Click Me</button>;
    render(<DropdownMenu {...defaultProps}>{children}</DropdownMenu>);
    const button = screen.getByText("Click Me");
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalled();
  });

  it("does not call onClose when menu item is clicked", () => {
    const onClose = vi.fn();
    const handleClick = vi.fn();
    const children = <button onClick={handleClick}>Click Me</button>;
    render(
      <DropdownMenu {...defaultProps} onClose={onClose}>
        {children}
      </DropdownMenu>,
    );
    const button = screen.getByText("Click Me");
    fireEvent.click(button);
    expect(onClose).not.toHaveBeenCalled();
  });

  it("renders with custom z-index style", () => {
    const customStyle = { zIndex: 9999 };
    const { container } = render(
      <DropdownMenu {...defaultProps} style={customStyle} />,
    );
    const menu = container.querySelector('[role="menu"]');
    expect(menu).toHaveStyle("z-index: 9999");
  });

  it("stops propagation on menu click", () => {
    const onClose = vi.fn();
    const { container } = render(
      <DropdownMenu {...defaultProps} onClose={onClose} />,
    );
    const menu = container.querySelector('[role="menu"]');
    if (menu) {
      fireEvent.click(menu);
      expect(onClose).not.toHaveBeenCalled();
    }
  });

  it("renders with complex styling", () => {
    const complexStyle = {
      backdropFilter: "blur(12px)",
      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      border: "1px solid rgba(0, 0, 0, 0.08)",
      borderRadius: "8px",
    };
    const { container } = render(
      <DropdownMenu {...defaultProps} style={complexStyle} />,
    );
    const menu = container.querySelector('[role="menu"]');
    expect(menu).toHaveStyle("border-radius: 8px");
  });

  it("handles rapid backdrop clicks", () => {
    const onClose = vi.fn();
    const { container } = render(
      <DropdownMenu {...defaultProps} onClose={onClose} />,
    );
    const backdrop = container.querySelector(
      '[data-testid="dropdown-backdrop"]',
    );
    if (backdrop) {
      fireEvent.click(backdrop);
      fireEvent.click(backdrop);
      expect(onClose).toHaveBeenCalledTimes(2);
    }
  });

  it("preserves children order", () => {
    const children = (
      <>
        <button>First</button>
        <button>Second</button>
        <button>Third</button>
      </>
    );
    const { container } = render(
      <DropdownMenu {...defaultProps}>{children}</DropdownMenu>,
    );
    const buttons = container.querySelectorAll("button");
    expect(buttons[0].textContent).toBe("First");
    expect(buttons[1].textContent).toBe("Second");
    expect(buttons[2].textContent).toBe("Third");
  });
});
