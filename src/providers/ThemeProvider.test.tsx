import { render, screen } from "@testing-library/react";
import { ThemeContext } from "./ThemeContext";
import React from "react";

describe("ThemeProvider context", () => {
  it("provides default theme and setTheme", () => {
    const Test = () => {
      const ctx = React.useContext(ThemeContext);
      return <span data-testid="theme">{ctx.theme}</span>;
    };
    render(
      <ThemeContext.Provider value={{ theme: "dark", setTheme: () => {} }}>
        <Test />
      </ThemeContext.Provider>,
    );
    expect(screen.getByTestId("theme").textContent).toBe("dark");
  });
});
