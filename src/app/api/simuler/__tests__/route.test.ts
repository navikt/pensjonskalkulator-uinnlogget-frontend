/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server'
import { requestAzureClientCredentialsToken } from '@navikt/oasis'
import * as route from '../route'
import * as routeUtils from '../routeUtils'

global.fetch = jest.fn()

const originalEnv = process.env

jest.mock('@navikt/oasis', () => ({
  requestAzureClientCredentialsToken: jest.fn(),
}))

jest.mock('next/server', () => ({
  NextRequest: jest.fn().mockImplementation((url, init) => ({
    url,
    method: init.method,
    headers: init.headers,
    json: jest.fn().mockResolvedValue(init.body),
  })),
  NextResponse: {
    json: jest.fn((body, init) => ({
      status: init.status,
      json: jest.fn().mockResolvedValue(body),
    })),
  },
}))

describe('route.ts', () => {
  afterEach(() => {
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: originalEnv,
      writable: true,
    })
    jest.clearAllMocks()
  })

  describe('generateBearerToken', () => {
    it('Burde returnere en token når kallet på requestAzureClientCredentialsToken er vellykket', async () => {
      ;(requestAzureClientCredentialsToken as jest.Mock).mockResolvedValue({
        ok: true,
        token: 'test-token',
      })

      const token = await routeUtils.generateBearerToken()
      expect(token).toBe('test-token')
    })

    it('Burde kaste en error ved feilet token generering', async () => {
      ;(requestAzureClientCredentialsToken as jest.Mock).mockResolvedValue({
        ok: false,
      })

      await expect(routeUtils.generateBearerToken()).rejects.toThrow(
        'Failed to generate token'
      )
    })
  })

  describe('POST', () => {
    it('Burde kalle postDev i dev miljø', async () => {
      process.env = {
        ...originalEnv,
        NODE_ENV: 'development',
      }

      const resp = await route.POST({} as unknown as NextRequest)
      expect(resp?.status).toBe(405)
    })

    it('Burde kalle postProd i prod miljø', async () => {
      process.env = {
        ...originalEnv,
        NODE_ENV: 'production',
      }

      const resp = await route.POST({} as unknown as NextRequest)
      expect(resp?.status).toBe(405)
    })
  })

  describe('postDev', () => {
    it('Burde returnere "Method not allowed" for requests som ikke er POST', async () => {
      const req = new NextRequest('http://localhost', { method: 'GET' })
      const response = await routeUtils.postDev(req)
      expect(response.status).toBe(405)
      expect(await response.json()).toEqual({ message: 'Method not allowed' })
    })

    it('Burde returnere en backend response for POST request', async () => {
      const req = new NextRequest('http://localhost', { method: 'POST' })
      global.fetch = jest.fn().mockResolvedValue({
        status: 200,
        text: jest.fn().mockResolvedValue('backend response'),
      })

      const response = await routeUtils.postDev(req)
      expect(response.status).toBe(200)
      expect(await response.json()).toBe('backend response')
    })
  })

  describe('postProd', () => {
    it('Burde returnere "Method not allowed" for requests som ikke er POST', async () => {
      const req = new NextRequest('http://localhost', { method: 'GET' })
      const response = await routeUtils.postProd(req)
      expect(response.status).toBe(405)
      expect(await response.json()).toEqual({ message: 'Method not allowed' })
    })

    it('Burde returnere backend response for POST request', async () => {
      const req = new NextRequest('http://localhost', { method: 'POST' })
      req.text = jest.fn().mockResolvedValue('request body')
      ;(requestAzureClientCredentialsToken as jest.Mock).mockResolvedValueOnce({
        ok: true,
        token: 'test-token',
      })

      global.fetch = jest.fn().mockResolvedValueOnce({
        status: 200,
        text: jest.fn().mockResolvedValue('backend response'),
      })

      const response = await routeUtils.postProd(req)
      expect(response.status).toBe(200)
      expect(await response.json()).toBe('backend response')
    })

    it('Burde gi response status 500 dersom token generingen feiler', async () => {
      const req = new NextRequest('http://localhost', { method: 'POST' })

      ;(requestAzureClientCredentialsToken as jest.Mock).mockRejectedValue(
        new Error('Token error')
      )

      const response = await routeUtils.postProd(req)
      expect(response.status).toBe(500)
      expect(await response.json()).toEqual({ error: 'Token error' })
    })

    it('Burde gi response status 500 dersom fetchen feilet', async () => {
      const req = new NextRequest('http://localhost', { method: 'POST' })
      req.text = jest.fn().mockResolvedValue('request body')
      ;(requestAzureClientCredentialsToken as jest.Mock).mockResolvedValue({
        ok: true,
        token: 'test-token',
      })

      global.fetch = jest.fn().mockRejectedValue(new Error('Fetch error'))

      const response = await routeUtils.postProd(req)
      expect(response.status).toBe(500)
      expect(await response.json()).toEqual({ error: 'Fetch error' })
    })
  })
})
