import { render } from '@testing-library/react'
import Page from '@/app/form/page'
import { getGrunnbelop } from '@/functions/grunnbelop'
import FormPage from '@/components/FormPage'

// Explicitly cast getGrunnbelop as a jest mock
jest.mock('@/functions/grunnbelop', () => ({
  getGrunnbelop: jest.fn(),
}))

jest.mock('../../../components/FormPage.tsx', () => ({
  __esModule: true,
  default: jest.fn(() => <div>Mocked FormPage</div>),
}))

describe('Page Component', () => {
  it('Skal rendre "FormPage" med riktig grunnbeløp', async () => {
    const mockGrunnbelop = 12345
    ;(getGrunnbelop as jest.Mock).mockResolvedValue(mockGrunnbelop)

    render(await Page())

    expect(FormPage).toHaveBeenCalledWith({ grunnbelop: mockGrunnbelop }, {})
  })
})
