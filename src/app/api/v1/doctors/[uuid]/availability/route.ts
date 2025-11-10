import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Mock doctor availability data
const doctorAvailability: Record<string, Availability> = {
  'cace0bc5-32ea-420b-927a-a4ae485686ee': {
    dates: [
      {
        label: 'Nov 11, 2025',
        value: '2025-11-11',
        times: ['09:00', '10:00', '11:00']
      },
      {
        label: 'Nov 12, 2025',
        value: '2025-11-12',
        times: ['14:00', '15:00']
      },
      {
        label: 'Nov 13, 2025',
        value: '2025-11-13',
        times: ['09:30', '12:00']
      },
    ],
  },
  '2': {
    dates: [
      {
        label: 'Nov 12, 2025',
        value: '2025-11-12',
        times: ['08:30', '09:30']
      },
      {
        label: 'Nov 13, 2025',
        value: '2025-11-13',
        times: ['13:00', '16:00']
      },
      {
        label: 'Nov 14, 2025',
        value: '2025-11-14',
        times: ['10:00', '11:30']
      },
    ],
  },
};


type Availability = {
  dates: { label: string; value: string; times: string[] }[];
};

type Params = { uuid: string };

export async function GET(request: NextRequest, context: { params: Params }) {
  const { uuid } = await context.params;
 
  const availability: Availability | undefined = doctorAvailability[uuid];
  const commonHeaders = {
    'Cache-Control': 'no-store, must-revalidate',
    'Content-Type': 'application/json',
    'Vary': '*',
  };
  
  // if (!availability) {
  //   return new NextResponse(
  //     JSON.stringify({ dates: [], times: [] }),
  //     {
  //       status: 404,
  //       headers: commonHeaders,
  //     }
  //   );
  // }
  return new NextResponse(
    JSON.stringify(availability),
    {
      status: 200,
      headers: commonHeaders,
    }
  );
}
