'use server'

import { postDev, postProd } from './routeUtils'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 })
  }
  if (process.env.NODE_ENV === 'development') {
    return postDev()
  } else if (process.env.NODE_ENV === 'production') {
    return postProd(req)
  }
}
