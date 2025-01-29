import LoadingComponent from '../LoadingComponent'
import { RenderResult, render } from '@testing-library/react'

describe('LoadingComponent', () => {
  let getByTestId: RenderResult['getByTestId']

  beforeEach(() => {
    const renderResult = render(<LoadingComponent />)
    getByTestId = renderResult.getByTestId
  })

  it('Burde rendre Box komponenten med riktige props', () => {
    const box = getByTestId('loader-hstack')
    expect(box).toBeVisible()
  })

  it('Burde rendre Loader komponenten med riktige props', () => {
    const loader = getByTestId('loader')
    expect(loader).toBeVisible()
  })
})
