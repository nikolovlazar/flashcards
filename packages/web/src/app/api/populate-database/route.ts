import { NextResponse } from 'next/server';

export async function GET() {
  const response = await fetch('http://api:8000/populate-database', {
    cache: 'no-store',
  });
  return NextResponse.json(response.json());
}
