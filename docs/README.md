# Doctor App Documentation

Welcome to the Doctor App! This documentation will help both developers and end users understand, use, and contribute to the project.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [UI Guide](#ui-guide)
- [Contributing](#contributing)
- [Testing & Coverage](#testing--coverage)
- [FAQ](#faq)

---

## Overview

A modern Next.js app for browsing, booking, and managing doctor appointments. Supports infinite scroll, dark/light theme, robust error handling, and more.

## Features

- Doctor listing with infinite scroll
- Booking modal with date/time selection
- Responsive grid layout
- Skeleton loaders for smooth UX
- Dark/light theme support
- API integration with token management
- Mock data fallback for development
- Sticky footer and gradient backgrounds
- Default doctor image for missing avatars

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Configure environment:**
   - Copy `.env.example` to `.env` and set API endpoints and credentials.
3. **Run the app:**
   ```bash
   npm run dev
   ```
4. **Open in browser:**
   - Visit `http://localhost:3000`

## Project Structure

```
public/
  images/
    default-doctor.svg
src/
  app/
    api/v1/doctors/route.ts
    layout.tsx
    page.tsx
  components/
    DoctorCard.tsx
    DoctorGrid.tsx
    BookingModal.tsx
    ...
  mocks/
    doctors.ts
  utils/
    auth.ts
    doctorCache.ts
```

## API Reference

- **GET /api/v1/doctors?page=N&limit=M**
  - Returns paginated list of doctors.
  - Supports mock fallback for local dev.
- **Token Management:**
  - Automatic refresh and storage in `/src/utils/auth.ts`.

## UI Guide

- **Doctor List:** Infinite scroll loads more doctors as you scroll.
- **Booking Modal:** Click "Book Appointment" to select date/time and confirm.
- **Skeleton Loader:** Shown while loading more doctors.
- **Default Image:** Used if doctor avatar is missing.
- **Theme:** Toggle dark/light mode in your OS or browser.

## Testing & Coverage

Run all tests:

```bash
npm test
```

Run coverage report:

```bash
npm run test:coverage
```

Coverage report is generated in the `coverage/` folder. Open `coverage/lcov-report/index.html` for details.

## Contributing

Fork the repo and create a feature branch.
Follow code style and add tests for new features.
Submit a pull request with a clear description.

## FAQ

**Q: How do I add a new doctor?**
A: Update the API or mock data in `src/mocks/doctors.ts`.

**Q: How do I change the default doctor image?**
A: Replace `public/images/default-doctor.svg` with your own SVG.

**Q: How do I enable mock data?**
A: Set `ENABLE_MOCK_FALLBACK=true` in your `.env` file.

---

For more details, see individual docs in this folder.
