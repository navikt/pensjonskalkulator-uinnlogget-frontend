import { render, screen } from '@testing-library/react'
import FormPage from '../FormPage'
import useMultiStepForm from '@/helpers/useMultiStepForm'

// Mock the useMultiStepForm hook
jest.mock('@/helpers/useMultiStepForm')
jest.mock('@/components/pages/BeregnPage', () =>
  jest.fn(() => <div>Mocked BeregnPage</div>)
)
// Mock useEffect to avoid calling it
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: jest.fn(),
}))

const mockPagesDict = {
  alder: <div key="alder">Mocked AlderStep</div>,
  utland: <div key="utland">Mocked UtlandsStep</div>,
  inntekt: <div key="inntekt">Mocked InntektStep</div>,
  sivilstand: <div key="sivilstand">Mocked SivilstandStep</div>,
  afp: <div key="afp">Mocked AFPStep</div>,
}

const pagesNames = Object.keys(mockPagesDict)

const length = pagesNames.length

describe('FormPage Component', () => {
  test('Burde rendre første steg', () => {
    // Set up the mock to return the first step
    ;(useMultiStepForm as jest.Mock).mockReturnValue({
      curStep: 0,
      length: length,
      step: mockPagesDict.alder,
      next: jest.fn(),
      back: jest.fn(),
      goTo: jest.fn(),
    })

    render(<FormPage />)
    expect(screen.getByText('Mocked AlderStep')).toBeVisible()
  })

  test('Burde rendre andre steg', () => {
    // Set up the mock to return the second step
    ;(useMultiStepForm as jest.Mock).mockReturnValue({
      curStep: 1,
      length: length,
      step: mockPagesDict.utland,
      next: jest.fn(),
      back: jest.fn(),
      goTo: jest.fn(),
    })

    render(<FormPage />)
    expect(screen.getByText('Mocked UtlandsStep')).toBeVisible()
  })

  describe('BeregnPage Component', () => {
    test('Burde rendre når curStep er lik lenged av antall steps', () => {
      // Set up the mock to return the BeregnPage
      ;(useMultiStepForm as jest.Mock).mockReturnValue({
        curStep: length,
        length: length,
        step: null,
        next: jest.fn(),
        back: jest.fn(),
        goTo: jest.fn(),
      })

      render(<FormPage />)
      expect(screen.getByText('Mocked BeregnPage')).toBeVisible()
    })
  })
})
