import { FormEvent } from 'react'

import FormButtons from '../FormButtons'
import { logger } from '../utils/logging'
import { FormContext } from '@/contexts/context'
import { initialState } from '@/defaults/initialState'
import { render, screen } from '@testing-library/react'
import { useRouter } from 'next/navigation'

const mockedContextValues = {
  setState: jest.fn(),
  state: initialState,
  formPageProps: {
    curStep: 0,
    length: 5,
    goBack: jest.fn(),
    goTo: jest.fn(),
    handleSubmit: jest.fn(),
    goToNext: jest.fn(),
  },
}

jest.mock('../utils/logging', () => ({
  logger: jest.fn(),
}))

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

const mockRouter = {
  prefetch: jest.fn(),
  push: jest.fn(),
}

describe('FormButtons', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
  })

  describe('Når brukeren er på første steg,', () => {
    test('Renderer 2 knapper', () => {
      render(
        <FormContext.Provider value={mockedContextValues}>
          <FormButtons />
        </FormContext.Provider>
      )
      const formButtonsElement = screen.getAllByRole('button')
      expect(formButtonsElement).toHaveLength(2)
    })

    test('Tilbake-knappen er ikke synlig', () => {
      render(
        <FormContext.Provider value={mockedContextValues}>
          <FormButtons />
        </FormContext.Provider>
      )
      expect(
        screen.queryByRole('button', {
          name: 'Tilbake',
        })
      ).not.toBeInTheDocument()
    })
  })
})
describe('Når brukeren er mellom første og siste steg,,', () => {
  test('Renderer 3 knapper', () => {
    const modifiedContextValues = { ...mockedContextValues }
    modifiedContextValues.formPageProps.curStep = 1

    render(
      <FormContext.Provider value={modifiedContextValues}>
        <FormButtons />
      </FormContext.Provider>
    )
    const formButtonsElement = screen.getAllByRole('button')
    expect(formButtonsElement).toHaveLength(3)
  })

  test("Skal logger kalles når brukeren trykker på 'Tilbake'", () => {
    render(
      <FormContext.Provider value={mockedContextValues}>
        <FormButtons currentStepName="Test-Step" />
      </FormContext.Provider>
    )
    const formButtonsElement = screen.getByRole('button', { name: 'Tilbake' })
    formButtonsElement.click()
    expect(logger).toHaveBeenCalledTimes(1)
    expect(logger).toHaveBeenCalledWith('button klikk', {
      tekst: 'Tilbake fra Test-Step',
    })
  })
})

describe('Når brukeren er på siste steg,', () => {
  test('Renderer 2 knapper', () => {
    const modifiedContextValues = { ...mockedContextValues }
    modifiedContextValues.formPageProps.curStep = 4

    render(
      <FormContext.Provider value={modifiedContextValues}>
        <FormButtons />
      </FormContext.Provider>
    )
    const formButtonsElement = screen.getAllByRole('button')
    expect(formButtonsElement).toHaveLength(3)
  })

  test('Endrer teksten på knappen til "Beregn pensjon"', () => {
    const modifiedContextValues = { ...mockedContextValues }
    modifiedContextValues.formPageProps.curStep = 4
    render(
      <FormContext.Provider value={modifiedContextValues}>
        <FormButtons />
      </FormContext.Provider>
    )
    const formButtonsElement = screen.getAllByRole('button')
    expect(formButtonsElement[0]).toHaveTextContent('Beregn')
  })
})

describe('Når brukeren trykker på', () => {
  const mockGoTo = jest.fn()
  const mockBack = jest.fn()
  const mockNext = jest.fn()
  const mockHandleSubmit = jest.fn()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    mockHandleSubmit()
  }

  const defaultFormPageProps = {
    curStep: 1,
    length: 5,
    goBack: mockBack,
    goTo: mockGoTo,
    handleSubmit: mockHandleSubmit,
    goToNext: mockNext,
  }

  const context = {
    setState: jest.fn(),
    state: initialState,
    formPageProps: defaultFormPageProps,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('Neste-knappen, skal goToNext-funksjonen kalles', () => {
    render(
      <FormContext.Provider value={context}>
        <form onSubmit={handleSubmit}>
          <FormButtons />
        </form>
      </FormContext.Provider>
    )

    const formButtonsElement = screen.getByRole('button', { name: 'Neste' })
    formButtonsElement.click()
    expect(mockHandleSubmit).toHaveBeenCalledTimes(1)
  })

  test('Tilbake-knappen, skal goBack-funksjonen kalles', () => {
    render(
      <FormContext.Provider value={context}>
        <FormButtons />
      </FormContext.Provider>
    )

    const formButtonsElement = screen.getByRole('button', { name: 'Tilbake' })
    formButtonsElement.click()
    expect(mockBack).toHaveBeenCalledTimes(1)
  })
})
