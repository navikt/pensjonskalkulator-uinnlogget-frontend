import React from 'react'
import { render, screen } from '@testing-library/react'
import NotFoundPage from '@/app/not-found'

describe('NotFoundPage', () => {
  test('Burde rendre hoved headingen på norsk', () => {
    render(<NotFoundPage />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Beklager, vi fant ikke siden'
    )
  })

  test('Burde rendre hoved headingen på engelsk', () => {
    render(<NotFoundPage />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Page not found'
    )
  })

  test('Burde rendre den norske beskrivelsen', () => {
    render(<NotFoundPage />)
    expect(
      screen.getByText(
        'Denne siden kan være slettet eller flyttet, eller det er en feil i lenken.'
      )
    ).toBeInTheDocument()
  })

  test('Burde rendre den engelske beskrivelsen', () => {
    render(<NotFoundPage />)
    expect(
      screen.getByText('The page you requested cannot be found.')
    ).toBeInTheDocument()
  })

  test('Burde rendre listeelementene', () => {
    render(<NotFoundPage />)
    expect(
      screen.getByText('Bruk gjerne søket eller menyen')
    ).toBeInTheDocument()
    expect(screen.getByText('Gå til forsiden')).toBeInTheDocument()
  })

  test('Burde rendre knappene og lenkene', () => {
    render(<NotFoundPage />)
    expect(
      screen.getByRole('button', { name: 'Gå til Min side' })
    ).toBeInTheDocument()
    expect(
      screen.getByText('Meld gjerne fra om at lenken ikke virker')
    ).toBeInTheDocument()
    expect(screen.getByText('front page')).toBeInTheDocument()
  })
})
