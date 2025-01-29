import Substep from '../Substep'
import { render } from '@testing-library/react'

describe('Substep', () => {
  it('Renderer som forventet', () => {
    const { getByText } = render(
      <Substep>
        <div>Child Component</div>
      </Substep>
    )

    expect(getByText('Child Component')).toBeVisible()
  })
})
