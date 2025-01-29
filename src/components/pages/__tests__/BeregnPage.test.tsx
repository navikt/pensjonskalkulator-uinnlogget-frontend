import { axe } from 'jest-axe'
import React from 'react'

import BeregnPage from '../BeregnPage'
import { FormContext } from '@/contexts/context'
import { initialState } from '@/defaults/initialState'
import { submitForm } from '@/functions/submitForm'
import { render, screen, waitFor } from '@testing-library/react'

jest.mock('@/functions/submitForm', () => ({
  submitForm: jest.fn(),
}))

const mockSubmitForm = submitForm as jest.Mock
jest.mock('../../ResponseWarning.tsx', () =>
  jest.fn(() => <div>Mocked ResponseWarning</div>)
)

const mockSimuleringsresultat = {
  alderspensjon: [
    { alder: 67, beloep: 200000 },
    { alder: 68, beloep: 210000 },
  ],
  afpPrivat: [
    { alder: 67, beloep: 50000 },
    { alder: 68, beloep: 55000 },
  ],
  afpOffentlig: [],
  vilkaarsproeving: {
    vilkaarErOppfylt: true,
  },
}

const mockGoToNext = jest.fn()
const mockSetState = jest.fn()

const defaultFormPageProps = {
  curStep: 1,
  length: 5,
  goBack: jest.fn(),
  goTo: jest.fn(),
  handleSubmit: jest.fn(),
  goToNext: mockGoToNext,
}

const mockContextValue = {
  state: initialState,
  setState: mockSetState,
  formPageProps: defaultFormPageProps,
}

describe('BeregnPage Component', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendring', () => {
    test('Når data hentes, vises LoadingComponent', async () => {
      const pendingPromise = new Promise(() => {})
      mockSubmitForm.mockReturnValue(pendingPromise)

      render(
        <FormContext.Provider value={mockContextValue}>
          <BeregnPage />
        </FormContext.Provider>
      )

      expect(screen.getByTestId('loader')).toBeVisible()
    })

    test('Skal ikke være noen a11y violations når komponenten laster', async () => {
      const pendingPromise = new Promise(() => {})
      mockSubmitForm.mockReturnValue(pendingPromise)
      const { container } = render(
        <FormContext.Provider value={mockContextValue}>
          <BeregnPage />
        </FormContext.Provider>
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    test('Når det oppstår en feil ved henting av data, returneres det child-component med undefined resultat', async () => {
      mockSubmitForm.mockReturnValue(Promise.reject('Error parsing JSON'))

      render(
        <FormContext.Provider value={mockContextValue}>
          <BeregnPage />
        </FormContext.Provider>
      )
      expect(screen.getByTestId('loader')).toBeVisible()

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument()
      })

      expect(screen.getByText('Mocked ResponseWarning')).toBeVisible()
    })

    test('Når henting av data er vellykket, returneres det child-component med resultat', async () => {
      mockSubmitForm.mockReturnValue(Promise.resolve(mockSimuleringsresultat))

      render(
        <FormContext.Provider value={mockContextValue}>
          <BeregnPage />
        </FormContext.Provider>
      )
      expect(screen.getByTestId('loader')).toBeVisible()

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument()
      })

      expect(screen.getByText('Beregning')).toBeVisible()
    })

    test('Skal ikke være noen a11y violations når det er et resultat', async () => {
      mockSubmitForm.mockReturnValue(Promise.resolve(mockSimuleringsresultat))

      const { container } = render(
        <FormContext.Provider value={mockContextValue}>
          <BeregnPage />
        </FormContext.Provider>
      )
      expect(screen.getByTestId('loader')).toBeVisible()

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument()
      })

      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
