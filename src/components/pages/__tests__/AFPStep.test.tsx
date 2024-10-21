import { render, screen, fireEvent } from '@testing-library/react'
import AFPStep from '../AFPStep'
import { FormContext } from '@/contexts/context'
import useErrorHandling from '../../../helpers/useErrorHandling'
import { initialFormState } from '@/defaults/defaultFormState'

// Mock the useErrorHandling hook
jest.mock('../../../helpers/useErrorHandling', () => ({
  __esModule: true,
  default: jest.fn(),
}))

// Mock the FormButtons component
jest.mock('../../FormButtons', () => ({
  __esModule: true,
  default: jest.fn(() => <div>Mocked FormButtons</div>),
}))

const mockGoToNext = jest.fn()
const mockSetState = jest.fn()

const defaultFormPageProps = {
  curStep: 1,
  length: 5,
  goBack: jest.fn(),
  onStepChange: jest.fn(),
  handleSubmit: jest.fn(),
  goToNext: mockGoToNext,
}

const context = {
  setState: mockSetState,
  state: initialFormState,
  formPageProps: defaultFormPageProps,
}

const mockValidateFields = jest.fn()
const mockClearError = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
  ;(useErrorHandling as jest.Mock).mockReturnValue([
    {},
    { validateFields: mockValidateFields, clearError: mockClearError },
  ])
})

const renderComponent = () => {
  return render(
    <FormContext.Provider value={context}>
      <AFPStep />
    </FormContext.Provider>
  )
}
describe('AFPStep Component', () => {

  test('Burde rendre komponenten', () => {
    renderComponent()
    expect(
      screen.getByText('Har du rett til AFP i privat sektor?')
    ).toBeInTheDocument()
    expect(screen.getByText('Mocked FormButtons')).toBeInTheDocument()
  })

  test('skal kalle handleFieldChange når radio endres', () => {
    renderComponent()
    const radioButton = screen.getByLabelText('Ja')
    fireEvent.click(radioButton)
    expect(mockSetState).toHaveBeenCalledWith(expect.any(Function))
    expect(mockClearError).toHaveBeenCalledWith('simuleringType')
  })

  test('skal kalle validateFields og goToNext når skjemaet sendes inn uten feil', () => {
    mockValidateFields.mockReturnValue(false)
    renderComponent()
    const form = screen.getByRole('form')
    fireEvent.submit(form)
    expect(mockValidateFields).toHaveBeenCalledWith('AFPStep')
    expect(mockGoToNext).toHaveBeenCalled()
  })

  test('skal ikke kalle validateFields og goToNext når skjemaet sendes inn med feil', () => {
    mockValidateFields.mockReturnValue(true)
    renderComponent()
    const form = screen.getByRole('form')
    fireEvent.submit(form)
    expect(mockValidateFields).toHaveBeenCalledWith('AFPStep')
    expect(mockGoToNext).not.toHaveBeenCalled()
  })

  //Test if correct default value
  test('Burde ikke være huket av', () => {
    renderComponent()
  
    expect(screen.getByLabelText('Ja')).not.toBeChecked()
    expect(screen.getByLabelText('Nei')).not.toBeChecked()
    
  })



})
describe('Dersom det tidligere er huket av JA for AFP, ', () => {
  const contextWithState = {
    ...context,
    state: {
      ...initialFormState,
      simuleringType: 'ALDERSPENSJON_MED_AFP_PRIVAT',
    },
  }

  test('Burde rendre komponenten med Ja huket av', () => {
    render(
      <FormContext.Provider value={contextWithState}>
        <AFPStep />
      </FormContext.Provider>
    )

    expect(screen.getByLabelText('Ja')).toBeChecked()
    expect(screen.getByLabelText('Nei')).not.toBeChecked()
  })
})

describe('Dersom det tidligere er huket av NEI for AFP, ', () => {
  const contextWithState = {
    ...context,
    state: {
      ...initialFormState,
      simuleringType: 'ALDERSPENSJON',
    },
  }

  test('Burde rendre komponenten med Nei huket av', () => {
    render(
      <FormContext.Provider value={contextWithState}>
        <AFPStep />
      </FormContext.Provider>
    )

    expect(screen.getByLabelText('Ja')).not.toBeChecked()
    expect(screen.getByLabelText('Nei')).toBeChecked()
  })
})