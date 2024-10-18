import { render, screen } from '@testing-library/react'
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
      /Velkommen til pensjonskalkulatoren som kan vise deg:/i
    )
    expect(welcomeMessage).toBeTruthy()
  })

  test('Rendrer listen over pensjonstyper', () => {
    render(<LandingPage />)
    const pensionTypes = [
      'Alderspensjon (NAV)',
      'AFP (avtalefestet pensjon)',
      'Pensjonsavtaler',
    ]
    pensionTypes.forEach((type) => {
      expect(screen.getByText(type)).toBeTruthy()
    })
  })

  test('Rendrer startknappen med riktig lenke', () => {
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
})
