import { NextRequest, NextResponse } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  console.log(
    request.headers.get('sec-fetch-mode'),
    request.headers.get('sec-fetch-site')
  )
  const fetchMode = request.headers.get('sec-fetch-mode')
  const targetUrl = new URL(
    '/pensjon/uinnlogget-kalkulator/alder',
    request.url
  ).toString()

  if (fetchMode === 'navigate' && request.url !== targetUrl) {
    return NextResponse.redirect(targetUrl)
  }
}

export const config = {
  matcher: ['/alder', '/utland', '/inntekt', '/sivilstand', '/afp', '/beregn'],
}
