import { render, screen } from '@testing-library/react'
import FormButtons from '../FormButtons'
import { FormContext } from '@/contexts/context'
import { initialFormState } from '../FormPage'
import { FormEvent } from 'react'

const mockedContextValues = {
  setState: jest.fn(),
  states: initialFormState,
  formPageProps: {
    curStep: 0,
    length: 5,
    goBack: jest.fn(),
    onStepChange: jest.fn(),
    handleSubmit: jest.fn(),
    goToNext: jest.fn(),
  },
}
describe('FormButtons', () => {
  describe('Når brukeren er på første steg,', () => {
    test('Renderer 1 knapp', () => {
      render(
        <FormContext.Provider value={mockedContextValues}>
          <FormButtons />
        </FormContext.Provider>
      )
      const formButtonsElement = screen.getAllByRole('button')
      expect(formButtonsElement).toHaveLength(1)
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
  test('Renderer 2 knapper', () => {
    const modifiedContextValues = { ...mockedContextValues }
    modifiedContextValues.formPageProps.curStep = 1

    render(
      <FormContext.Provider value={modifiedContextValues}>
        <FormButtons />
      </FormContext.Provider>
    )
    const formButtonsElement = screen.getAllByRole('button')
    expect(formButtonsElement).toHaveLength(2)
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
    expect(formButtonsElement).toHaveLength(2)
  })

  test('Endrer teksten på knappen til "Send"', () => {
    const modifiedContextValues = { ...mockedContextValues }
    modifiedContextValues.formPageProps.curStep = 4
    render(
      <FormContext.Provider value={modifiedContextValues}>
        <FormButtons />
      </FormContext.Provider>
    )
    const formButtonsElement = screen.getAllByRole('button')
    expect(formButtonsElement[0]).toHaveTextContent('Send')
  })
})

describe('Når brukeren trykker på', () => {
  const mockOnStepChange = jest.fn()
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
    onStepChange: mockOnStepChange,
    handleSubmit: mockHandleSubmit,
    goToNext: mockNext,
  }

  const context = {
    setState: jest.fn(),
    states: initialFormState,
    formPageProps: defaultFormPageProps,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('Neste-knappen, skal next-funksjonen kalles', () => {
    render(
      <FormContext.Provider value={context}>
        <form onSubmit={handleSubmit}>
          <FormButtons />
        </form>
      </FormContext.Provider>
    )

    //Expext button to submit form
    const formButtonsElement = screen.getByRole('button', { name: 'Neste' })
    formButtonsElement.click()
    expect(mockHandleSubmit).toHaveBeenCalledTimes(1)
  })

  test('Tilbake-knappen, skal back-funksjonen kalles', () => {
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
