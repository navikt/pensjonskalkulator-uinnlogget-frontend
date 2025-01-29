import { ContextForm } from '@/common'
import { FormContext } from '@/contexts/context'
import { render } from '@testing-library/react'

type GoToNextFunction = () => void

export const generateDefaultFormPageProps = (
  goToNextMock: GoToNextFunction
) => ({
  curStep: 1,
  length: 5,
  goBack: jest.fn(),
  goTo: jest.fn(),
  handleSubmit: jest.fn(),
  goToNext: goToNextMock,
})

export const renderMockedComponent = (
  Component: React.ComponentType,
  contextOverride: ContextForm
) => {
  return render(
    <FormContext.Provider value={contextOverride}>
      <Component />
    </FormContext.Provider>
  )
}
