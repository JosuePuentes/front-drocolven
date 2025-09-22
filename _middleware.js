import { NextResponse } from 'next/server';

export function middleware(request) {
  console.log('Middleware executed for:', request.url);
  return NextResponse.next();
}