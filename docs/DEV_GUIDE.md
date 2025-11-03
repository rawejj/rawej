# Developer Guide

## Setup
- Clone the repo and run `npm install`.
- Configure `.env` for API endpoints and credentials.
- Use `ENABLE_MOCK_FALLBACK=true` for local development with mock data.

## Key Files
- `src/app/api/v1/doctors/route.ts`: API route for doctors, handles token, pagination, mock fallback.
- `src/components/DoctorCard.tsx`: Doctor card UI, default image logic.
- `src/components/BookingSection.tsx`: Infinite scroll, booking modal logic.
- `src/utils/auth.ts`: Token fetch/refresh helpers.
- `src/utils/doctorCache.ts`: In-memory cache for first page.

## Adding Features
- Use idiomatic Next.js and React patterns.
- Keep UI responsive and accessible.
- Add skeleton loaders for async data.
- Use IntersectionObserver for infinite scroll.


## Testing & Coverage
- Add unit and integration tests for new features.
- Use mock data for frontend tests.
- Run all tests:
	```bash
	npm test
	```
- Run coverage report:
	```bash
	npm run test:coverage
	```
- Coverage report is generated in the `coverage/` folder. Open `coverage/lcov-report/index.html` for details.

## Troubleshooting
- If API fails, check token validity and `.env` config.
- For UI bugs, check grid/flex layouts and default images.

## Deployment
- Use Vercel or similar for Next.js hosting.
- Set production API endpoints and secrets in `.env`.

## Useful Scripts
- `npm run dev`: Start local dev server
- `npm run build`: Build for production
- `npm run lint`: Run linter

---
For more details, see the main README and other docs in this folder.
