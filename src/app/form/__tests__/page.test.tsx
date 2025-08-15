import { render } from '@testing-library/react'

import Page from '@/app/form/page'
import FormPage from '@/components/FormPage'
import { getGrunnbelop } from '@/functions/grunnbelop'

// Explicitly cast getGrunnbelop as a jest mock
jest.mock('@/functions/grunnbelop', () => ({
  getGrunnbelop: jest.fn(),
}))

jest.mock('../../../components/FormPage.tsx', () => ({
  __esModule: true,
  default: jest.fn(() => <div>Mocked FormPage</div>),
}))

describe('Page Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('Skal kalle getGrunnbelop når komponenten rendres', async () => {
    render(await Page())
    expect(getGrunnbelop).toHaveBeenCalled()
  })

  it('Skal rendre "FormPage" med riktig grunnbeløp', async () => {
    const mockGrunnbelop = 12345
    ;(getGrunnbelop as jest.Mock).mockResolvedValue(mockGrunnbelop)

    render(await Page())

    expect(FormPage).toHaveBeenCalledWith(
      { grunnbelop: mockGrunnbelop },
      undefined
    )
  })
})
