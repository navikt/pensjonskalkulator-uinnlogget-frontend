import { fireEvent, render } from '@testing-library/react'
import React, { ReactElement } from 'react'

import useMultiStepForm from '@/helpers/useMultiStepForm'

interface TestComponentProps {
  lastPage: ReactElement
}

const steps = {
  AlderStep: <div>Alder</div>,
  UtlandsStep: <div>Utland</div>,
  InntektStep: <div>Inntekt og alderspensjon</div>,
  SivilstandStep: <div>Sivilstand</div>,
  AFPStep: <div>AFP</div>,
}

const TestComponent: React.FC<TestComponentProps> = ({ lastPage }) => {
  const { curStep, step, stepName, goToNext, goBack, goTo } = useMultiStepForm(
    steps,
    lastPage
  )
  return (
    <div>
      <div data-testid="step">{step}</div>
      <div data-testid="stepName">{stepName}</div>
      <div data-testid="curStep">{curStep}</div>
      <button onClick={goToNext} data-testid="next">
        Next
      </button>
      <button onClick={goBack} data-testid="back">
        Back
      </button>
      <button onClick={() => goTo(2)} data-testid="goto">
        Go to Step 3
      </button>
    </div>
  )
}

describe('useMultiStepForm', () => {
  const lastPage = <div>Last Page</div>

  test('Burde initialisere første steg riktig', () => {
    const { getByTestId } = render(<TestComponent lastPage={lastPage} />)
    expect(getByTestId('curStep').textContent).toBe('0')
    expect(getByTestId('step').textContent).toBe('Alder')
    expect(getByTestId('stepName').textContent).toBe('AlderStep')
  })

  test('Burde kunne gå til neste steg', () => {
    const { getByTestId } = render(<TestComponent lastPage={lastPage} />)
    fireEvent.click(getByTestId('next'))
    expect(getByTestId('curStep').textContent).toBe('1')
    expect(getByTestId('step').textContent).toBe('Utland')
    expect(getByTestId('stepName').textContent).toBe('UtlandsStep')
  })

  test('Burde kunne gå tilbake til forrige steg', () => {
    const { getByTestId } = render(<TestComponent lastPage={lastPage} />)
    fireEvent.click(getByTestId('next'))
    fireEvent.click(getByTestId('back'))
    expect(getByTestId('curStep').textContent).toBe('0')
    expect(getByTestId('step').textContent).toBe('Alder')
    expect(getByTestId('stepName').textContent).toBe('AlderStep')
  })

  test('Burde kunne gå til et spesifikt steg', () => {
    const { getByTestId } = render(<TestComponent lastPage={lastPage} />)
    fireEvent.click(getByTestId('goto'))
    expect(getByTestId('curStep').textContent).toBe('2')
    expect(getByTestId('step').textContent).toBe('Inntekt og alderspensjon')
    expect(getByTestId('stepName').textContent).toBe('InntektStep')
  })

  test('Burde rendre siste side når man er på siste steg', () => {
    const { getByTestId } = render(<TestComponent lastPage={lastPage} />)
    fireEvent.click(getByTestId('goto'))
    fireEvent.click(getByTestId('next'))
    fireEvent.click(getByTestId('next'))
    expect(getByTestId('curStep').textContent).toBe('4')
    expect(getByTestId('step').textContent).toBe('AFP')
  })

  test('Burde ikke kunne gå tilbake når man er på første steg', () => {
    const { getByTestId } = render(<TestComponent lastPage={lastPage} />)
    fireEvent.click(getByTestId('back'))
    expect(getByTestId('curStep').textContent).toBe('0')
    expect(getByTestId('step').textContent).toBe('Alder')
  })

  test('Burde ikke kunne gå til neste steg når man er på siste steg', () => {
    const { getByTestId } = render(<TestComponent lastPage={lastPage} />)
    fireEvent.click(getByTestId('goto'))
    fireEvent.click(getByTestId('next'))
    fireEvent.click(getByTestId('next'))
    fireEvent.click(getByTestId('next'))
    fireEvent.click(getByTestId('next'))
    expect(getByTestId('curStep').textContent).toBe('5')
    expect(getByTestId('step').textContent).toBe('Last Page')
  })
})
