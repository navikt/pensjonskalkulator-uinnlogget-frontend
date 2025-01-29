import React from 'react'

import { fireEvent, render, screen } from '@testing-library/react'

import FormWrapper from '../FormWrapper'

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
    expect(screen.getByText('Child Element')).toBeVisible()
  })

  test('Burde kalle onSubmit når formen er sendt inn', () => {
    fireEvent.submit(screen.getByTestId('form'))
    expect(handleSubmit).toHaveBeenCalledTimes(1)
  })
})
