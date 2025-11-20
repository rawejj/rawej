# Testing & Coverage Guide

## Running Tests

This project uses Jest and React Testing Library for unit and integration tests.

### 1. Run All Tests

```bash
npm test
```

Or, for more verbose output:

```bash
npm run test:watch
```

### 2. Run Coverage Report

```bash
npm run test:coverage
```

This will generate a coverage report in the `coverage/` folder and print a summary in the terminal.

## Viewing Coverage

- Open `coverage/lcov-report/index.html` in your browser for a detailed coverage report.
- The summary includes statements, branches, functions, and lines covered.

## Adding Tests

- Place test files next to the code, e.g. `DoctorCard.test.tsx`.
- Use React Testing Library for UI components:

  ```tsx
  import { render, screen } from "@testing-library/react";
  import DoctorCard from "./DoctorCard";

  test("renders doctor name", () => {
    render(<DoctorCard doctor={mockDoctor} onBook={() => {}} />);
    expect(screen.getByText(mockDoctor.name)).toBeInTheDocument();
  });
  ```

- Mock API calls using Jest or MSW.

## Useful Scripts

- `npm test`: Run all tests
- `npm run test:watch`: Watch mode
- `npm run test:coverage`: Coverage report

## Troubleshooting

- If tests fail, check for missing mocks or incorrect imports.
- For coverage issues, ensure your tests cover all branches and edge cases.

---

For more details, see the main README and DEV_GUIDE in the docs folder.
