import { NextResponse, NextRequest } from 'next/server'

/* Used to redirect automatically to /admin when we are on the domain without rooting label */
export async function middleware(req, ev) {
  const url = req.nextUrl.clone()
  if (url.pathname == '/') {
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}
