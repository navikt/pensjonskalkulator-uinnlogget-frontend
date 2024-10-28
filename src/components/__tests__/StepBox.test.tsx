import { render, screen } from '@testing-library/react'
import StepBox from '../StepBox'

describe('StepBox Component', () => {
  test('Burde rendre komponenten med children', () => {
    render(
      <StepBox>
        <div data-testid="child">Child Content</div>
      </StepBox>
    )

    expect(screen.getByText('Pensjonskalkulator')).toBeInTheDocument()
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  test('Burde rendre Neste- og Forrige knappene', () => {
    render(
      <StepBox>
        <div data-testid="child">Child Content</div>
      </StepBox>
    )

    expect(screen.getByText('Neste')).toBeInTheDocument()
    expect(screen.getByText('Forrige')).toBeInTheDocument()
  })

  test('Burde rendre Box komponentene med korrekt data-testid attributter', () => {
    render(
      <StepBox>
        <div data-testid="child">Child Content</div>
      </StepBox>
    )

    const outerBox = screen.getByTestId('outer-box')
    const innerBox = screen.getByTestId('inner-box')

    expect(outerBox).toBeInTheDocument()
    expect(innerBox).toBeInTheDocument()
  })
})
