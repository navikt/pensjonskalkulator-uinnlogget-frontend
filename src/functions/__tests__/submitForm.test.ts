import submitForm from '@/functions/submitForm'
import { State } from '@/common'
import { initialFormState } from '@/defaults/defaultFormState'

global.fetch = jest.fn()
const mockFormState: State = initialFormState

beforeEach(() => {
  ;(fetch as jest.Mock).mockClear()
})

describe('submitForm', () => {
  test('Burde kalle fetch med riktig payload', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ success: true }),
    }
    ;(fetch as jest.Mock).mockResolvedValue(mockResponse)

    const result = await submitForm(mockFormState)

    const {
      boddIUtland: _boddIUtland,
      inntektVsaHelPensjon: _inntektVsaHelPensjon,
      ...expectedApiPayload
    } = mockFormState

    expect(fetch).toHaveBeenCalledWith(
      '/pensjon/kalkulator-uinnlogget/api/simuler',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expectedApiPayload),
      }
    )
    expect(result).toEqual({ success: true })
  })

  it('Burde kaste en error når fetch feiler', async () => {
    const mockResponse = {
      ok: false,
      status: 500,
      json: jest.fn().mockResolvedValue({
        message: 'Failed to submit form',
      }),
    }
    ;(global.fetch as jest.Mock).mockResolvedValue(mockResponse)

    await expect(submitForm(mockFormState)).rejects.toEqual({
      message: 'Failed to submit form',
      status: 500,
    })
  })

  it('Burde kaste en error med standardmelding når errorData.message er undefined', async () => {
    const mockResponse = {
      ok: false,
      status: 500,
      json: jest.fn().mockResolvedValue({}),
    }
    ;(global.fetch as jest.Mock).mockResolvedValue(mockResponse)

    await expect(submitForm(mockFormState)).rejects.toEqual({
      message: 'Failed to submit form',
      status: 500,
    })
  })
})
