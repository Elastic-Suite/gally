import { NextResponse, NextRequest } from 'next/server'

/* Used to redirect automatically to /admin when we are on the domain without rooting label */
export async function middleware(req, ev) {
  const { pathname } = req.nextUrl
  if (pathname == '/') {
    return NextResponse.redirect('/admin#/')
  }
  return NextResponse.next()
}
