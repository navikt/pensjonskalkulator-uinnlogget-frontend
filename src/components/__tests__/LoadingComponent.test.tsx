import { RenderResult, render } from '@testing-library/react'

import LoadingComponent from '../LoadingComponent'

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
