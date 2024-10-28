// pages/middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { session } from './taglogClient'

export function middleware(req: NextRequest) {
  const headers = {
    'User-Agent': req.headers.get('user-agent') || '',
    Origin: req.headers.get('origin') || '',
    Host: req.headers.get('host') || '',
    Referer: req.headers.get('referer') || ''
  }

  // Store headers in a global variable or context
  session.__HEADERS__ = headers

  return NextResponse.next()
}

export const config = {
  matcher: '/:path*'
}
