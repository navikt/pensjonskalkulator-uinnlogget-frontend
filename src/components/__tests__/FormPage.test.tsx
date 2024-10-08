import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import FormPage from '@/components/FormPage'
import { FormContext } from '@/contexts/context'
import { FormValues } from '@/common'

// Mock the necessary modules and functions
jest.mock('@/functions/submitForm', () => jest.fn())

const steps = [
  <div key="step1">First Step</div>,
  <div key="step2">Second Step</div>,
  <div key="step3">Third Step</div>,
]

jest.mock('@/helpers/useMultiStepForm', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    curStep: 0,
    length: steps.length,
    step: steps[0],
    next: jest.fn(),
    back: jest.fn(),
    goTo: jest.fn(),
  })),
}))

describe('FormPage Component', () => {
  const grunnbelop = 100000

  const renderFormPage = () => {
    return render(<FormPage grunnbelop={grunnbelop} />)
  }

  test('should render the FormPage component', () => {
    renderFormPage()
    expect(screen.getByText('Pensjonskalkulator')).toBeInTheDocument()
  })

  test('should render the first step', () => {
    renderFormPage()
    expect(screen.getByText('First Step')).toBeInTheDocument()
  })
})
