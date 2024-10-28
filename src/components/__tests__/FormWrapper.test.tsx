import { render, screen, fireEvent } from '@testing-library/react'
import FormWrapper from '../FormWrapper'
import React from 'react'

describe('FormWrapper', () => {
  let handleSubmit: jest.Mock

  beforeEach(() => {
    handleSubmit = jest.fn()
    render(
      <FormWrapper onSubmit={handleSubmit}>
        <button type="submit">Submit</button>
        <div>Child Element</div>
      </FormWrapper>
    )
  })

  test('Burde rendre children korrekt', () => {
    expect(screen.getByText('Child Element')).toBeInTheDocument()
  })

  test('Burde kalle onSubmit når formen er sendt inn', () => {
    fireEvent.submit(screen.getByRole('form'))
    expect(handleSubmit).toHaveBeenCalledTimes(1)
  })
})
