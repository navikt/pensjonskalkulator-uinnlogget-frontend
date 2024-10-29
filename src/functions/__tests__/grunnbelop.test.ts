import { getGrunnbelop } from '../grunnbelop'

describe('grunnbelop', () => {
  beforeEach(() => {
    global.fetch = jest.fn()
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  it('Burde returnere grunnbeløp når fetchinga er vellykket', async () => {
    const mockData = { grunnbeløp: 100000 }
    ;(global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockData),
    })

    const result = await getGrunnbelop()
    expect(result).toBe(2 * mockData.grunnbeløp)
  })

  it('Burde returnere undefined når fetchinga feiler', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Fetch failed'))

    const result = await getGrunnbelop()
    expect(result).toBeUndefined()
  })
})
