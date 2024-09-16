import { NextResponse } from 'next/server';
export async function GET() {
  const customers = [
    { id: 1, name: 'Nazeer Test 1' },
    { id: 2, name: 'TBD' },
  ];
  return NextResponse.json(customers);
}

