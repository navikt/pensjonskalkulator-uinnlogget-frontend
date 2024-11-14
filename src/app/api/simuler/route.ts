'use server'

import { NextRequest } from 'next/server'
import { postDev, postProd } from './routeUtils'

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === 'development') {
    return postDev(req)
  } else if (process.env.NODE_ENV === 'production') {
    return postProd(req)
  }
}
