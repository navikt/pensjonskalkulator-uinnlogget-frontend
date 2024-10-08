import { render, screen } from '@testing-library/react'
import FormButtons from '../FormButtons'
import { FormContext } from '@/contexts/context'
import { initialFormState } from '../FormPage'

describe('FormButtons', () => {
  // test('Renderer uten feilmelding', () => {
  //   render(<FormButtons />)
  //   const formButtonsElement = screen.getByTestId('form-buttons')
  //   expect(formButtonsElement).toBeInTheDocument()
  // })

  describe('Når brukeren er på første steg,', () => {
    test('Renderer 1 knapp', () => {
      render(
        <FormContext.Provider
          value={{
            setState: jest.fn(),
            states: initialFormState,
            formPageProps: {
              curStep: 0,
              length: 5,
              back: jest.fn(),
              onStepChange: jest.fn(),
              handleSubmit: jest.fn(),
              next: jest.fn(),
            },
          }}
        >
          <FormButtons />
        </FormContext.Provider>
      )
      const formButtonsElement = screen.getAllByRole('button')
      expect(formButtonsElement).toHaveLength(1)
    })
  })
})
describe('Når brukeren er mellom første og siste steg,,', () => {
  test('Renderer 2 knapper', () => {
    render(
      <FormContext.Provider
        value={{
          setState: jest.fn(),
          states: initialFormState,
          formPageProps: {
            curStep: 1,
            length: 5,
            back: jest.fn(),
            onStepChange: jest.fn(),
            handleSubmit: jest.fn(),
            next: jest.fn(),
          },
        }}
      >
        <FormButtons />
      </FormContext.Provider>
    )
    const formButtonsElement = screen.getAllByRole('button')
    expect(formButtonsElement).toHaveLength(2)
  })
})

describe('Når brukeren er på siste steg,', () => {
  test('Renderer 2 knapper', () => {
    render(
      <FormContext.Provider
        value={{
          setState: jest.fn(),
          states: initialFormState,
          formPageProps: {
            curStep: 4,
            length: 5,
            back: jest.fn(),
            onStepChange: jest.fn(),
            handleSubmit: jest.fn(),
            next: jest.fn(),
          },
        }}
      >
        <FormButtons />
      </FormContext.Provider>
    )
    const formButtonsElement = screen.getAllByRole('button')
    expect(formButtonsElement).toHaveLength(2)
  })

  test('Endrer teksten på knappen til "Send"', () => {
    render(
      <FormContext.Provider
        value={{
          setState: jest.fn(),
          states: initialFormState,
          formPageProps: {
            curStep: 4,
            length: 5,
            back: jest.fn(),
            onStepChange: jest.fn(),
            handleSubmit: jest.fn(),
            next: jest.fn(),
          },
        }}
      >
        <FormButtons />
      </FormContext.Provider>
    )
    const formButtonsElement = screen.getByRole('button')
    expect(formButtonsElement).toHaveTextContent('Send')
  })
})
