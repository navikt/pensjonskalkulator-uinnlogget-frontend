/* import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { FormContext } from '@/contexts/context'
import EktefelleStep from '@/components/pages/EktefelleStep'
import { initialFormState } from '@/components/FormPage'
import { FormValues } from '@/common'

describe('EktefelleStep Component', () => {
  const grunnbelop = 100000

  const renderEktefelleStep = (state: FormValues) => {
    return render(
      <FormContext.Provider
        value={{
          states: state,
          setState: jest.fn(),
          formPageProps: {
            curStep: 0,
            length: 5,
            goBack: jest.fn(),
            onStepChange: jest.fn(),
            handleSubmit: jest.fn(),
            goToNext: jest.fn(),
          },
        }}
      >
        <EktefelleStep grunnbelop={grunnbelop} />
      </FormContext.Provider>
    )
  }

  test('should render the EktefelleStep component', () => {
    renderEktefelleStep(initialFormState)
    expect(screen.getByLabelText('Hva er din sivilstand?')).toBeInTheDocument()
  })

  test('should not clear epsHarInntektOver2G and epsHarPensjon when sivilstand is UGIFT, but the questions should not be displayed', () => {
    const state = {
      ...initialFormState,
      sivilstand: 'GIFT',
      epsHarInntektOver2G: true,
      epsHarPensjon: true,
    }
    const { getByLabelText, queryByText } = renderEktefelleStep(state)

    fireEvent.change(getByLabelText('Hva er din sivilstand?'), {
      target: { value: 'UGIFT' },
    })

    expect(state.epsHarInntektOver2G).toBe(true)
    expect(state.epsHarPensjon).toBe(true)
    expect(
      queryByText(
        `Har du ektefelle, partner eller samboer som har inntekt større enn ${
          2 * grunnbelop
        }kr når du starter å ta ut pensjon?`
      )
    ).not.toBeInTheDocument()
    expect(
      queryByText(
        'Har du ektefelle, partner eller samboer som mottar pensjon eller uføretrygd fra folketrygden eller AFP når du starter å ta ut pensjon?'
      )
    ).not.toBeInTheDocument()
  })

  test('should show additional fields when sivilstand is not UGIFT', () => {
    const state = { ...initialFormState, sivilstand: 'GIFT' }
    renderEktefelleStep(state)

    expect(
      screen.getByText(
        `Har du ektefelle, partner eller samboer som har inntekt større enn ${
          2 * grunnbelop
        }kr når du starter å ta ut pensjon?`
      )
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'Har du ektefelle, partner eller samboer som mottar pensjon eller uføretrygd fra folketrygden eller AFP når du starter å ta ut pensjon?'
      )
    ).toBeInTheDocument()
  })
})
 */
