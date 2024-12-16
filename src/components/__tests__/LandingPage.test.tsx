import { render, screen, fireEvent } from '@testing-library/react'
import LandingPage from '../LandingPage'

describe('LandingPage', () => {
  test('Rendrer overskriften', () => {
    render(<LandingPage />)
    const headingElements = screen.getAllByText(/Pensjonskalkulator/i)
    expect(headingElements[0]).toBeTruthy()
  })

  test('Rendrer velkomstmeldingen', () => {
    render(<LandingPage />)
    const welcomeMessage = screen.getByText(
      /Velkommen til forenklet pensjonskalkulator som kan gi deg et estimat på:/i
    )
    expect(welcomeMessage).toBeTruthy()
  })

  test('Rendrer listen over pensjonstyper', () => {
    render(<LandingPage />)
    const pensionTypes = [
      'alderspensjon (Nav)',
      'AFP i privat sektor (avtalefestet pensjon)',
    ]
    pensionTypes.forEach((type) => {
      expect(screen.getByText(type)).toBeTruthy()
    })
  })

  test('Rendrer startknappen med riktig lenke og klikker på den', () => {
    render(<LandingPage />)
    const startButton = screen.getByRole('button', { name: /Kom i Gang/i })
    expect(startButton).toBeTruthy()
    const startLink = screen.getByRole('link', { name: /Kom i Gang/i })
    expect(startLink.getAttribute('href')).toBe('./kalkulator-uinnlogget/form')
  })

  test('Rendrer avbrytknappen', () => {
    render(<LandingPage />)
    const cancelButton = screen.getByRole('button', { name: /Avbryt/i })
    expect(cancelButton).toBeTruthy()
  })

  test('Rendrer anbefaling om innlogging og klikker på den', () => {
    render(<LandingPage />)
    const link = screen.getByRole('link', { name: /innlogget kalkulator/i })
    expect(link).toBeTruthy()
    expect(link.getAttribute('href')).toBe(
      'https://www.nav.no/pensjon/kalkulator/login'
    )
    fireEvent.click(link)
  })
})
