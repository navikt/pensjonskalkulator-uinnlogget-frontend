import { render } from '@testing-library/react'

import Substep from '../Substep'

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
