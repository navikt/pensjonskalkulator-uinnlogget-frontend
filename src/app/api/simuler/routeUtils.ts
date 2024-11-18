'use server'

import { NextRequest, NextResponse } from 'next/server'
import { requestAzureClientCredentialsToken } from '@navikt/oasis'

export const generateBearerToken = async (): Promise<string> => {
  const clientCredentials = await requestAzureClientCredentialsToken(
    'api://dev-gcp.pensjonskalkulator.pensjonskalkulator-backend/.default'
  )

  if (clientCredentials.ok) {
    return clientCredentials.token
  } else {
    throw new Error('Failed to generate token')
  }
}

export const postDev = async () => {
  const backendUrl = 'http://localhost:3001/anonym-simulering'
  const backendResponse = await fetch(backendUrl)

  await new Promise((resolve) => setTimeout(resolve, 2000))

  const backendResponseText = await backendResponse.text()
  return NextResponse.json(backendResponseText, {
    status: backendResponse.status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export const postProd = async (req: NextRequest) => {
  const backendUrl =
    'http://pensjonskalkulator-backend/api/v1/alderspensjon/anonym-simulering'

  try {
    const token = await generateBearerToken()
    const body = await req.text()
    const backendResponse = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: body,
    })

    const backendResponseText = await backendResponse.text()
    return NextResponse.json(backendResponseText, {
      status: backendResponse.status,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error(`Error in POST handler: ${(error as Error).message}`, error)
    const errorObj: Error = error as Error
    return NextResponse.json({ error: errorObj.message }, { status: 500 })
  }
}