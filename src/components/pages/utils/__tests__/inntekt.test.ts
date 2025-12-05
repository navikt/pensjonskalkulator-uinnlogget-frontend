import {
  calculateProportionalYearlyIncome,
  formatAndUpdateBeloep,
  formatInntekt,
  formatInntektToNumber,
  handleCaretPosition,
} from '../inntekt'

const createEvent = (value: string, selectionStart: number) => {
  const input = document.createElement('input')
  input.value = value
  input.selectionStart = selectionStart
  input.selectionEnd = selectionStart
  return { target: input } as React.ChangeEvent<HTMLInputElement>
}

describe('formatInntekt', () => {
  test('Burde returnere tom streng for null, undefined eller tom streng', () => {
    expect(formatInntekt(null)).toBe('')
    expect(formatInntekt(undefined)).toBe('')
    expect(formatInntekt('')).toBe('')
  })

  test('Burde returnere original streng hvis den inneholder ikke-numeriske tegn', () => {
    expect(formatInntekt('abc')).toBe('abc')
    expect(formatInntekt('123abc')).toBe('123abc')
  })

  test('Burde formatere numerisk streng riktig', () => {
    expect(formatInntekt('12345')).toBe('12 345')
    expect(formatInntekt('12 345')).toBe('12 345')
  })

  test('Burde formatere tall riktig', () => {
    expect(formatInntekt(12345)).toBe('12 345')
  })

  test('Burde returnere original streng hvis den ikke kan parses til et tall', () => {
    expect(formatInntekt('abc123')).toBe('abc123')
  })
})

describe('formatInntektToNumber', () => {
  test('Burde returnere 0 for null, undefined eller tom streng', () => {
    expect(formatInntektToNumber(null)).toBe(0)
    expect(formatInntektToNumber(undefined)).toBe(0)
    expect(formatInntektToNumber('')).toBe(0)
  })

  test('Burde returnere NaN for strenger med ikke-numeriske tegn', () => {
    expect(formatInntektToNumber('abc')).toBeNaN()
    expect(formatInntektToNumber('123abc')).toBeNaN()
  })

  test('Burde parse numerisk streng riktig', () => {
    expect(formatInntektToNumber('12345')).toBe(12345)
    expect(formatInntektToNumber('12 345')).toBe(12345)
  })
})

describe('formatAndUpdateBeloep', () => {
  const createEvent = (value: string, selectionStart: number) => {
    const input = document.createElement('input')
    input.value = value
    input.selectionStart = selectionStart
    input.selectionEnd = selectionStart
    return { target: input } as React.ChangeEvent<HTMLInputElement>
  }

  test('Burde oppdatere og formatere inntekt riktig', () => {
    const mockUpdateInntekt = jest.fn()
    const event = createEvent('12345', 3)
    formatAndUpdateBeloep(event, '12345', mockUpdateInntekt)
    expect(mockUpdateInntekt).toHaveBeenCalledWith('12 345')
  })
})

describe('handleCaretPosition', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  test('Burde flytte caret posisjon tilbake når bruker trykker "space"', () => {
    const event = createEvent('12 34 5', 6)
    handleCaretPosition(event, '12 345')
    jest.runAllTimers()
    expect(event.target.selectionStart).toBe(5)
  })

  test('Burde beholde caret posisjon når lengden reduseres med 1', () => {
    const event = createEvent('235', 2)
    handleCaretPosition(event, '25')
    jest.runAllTimers()
    expect(event.target.selectionStart).toBe(1)
    jest.runAllTimers()
  })

  test('Burde flytte caret posisjon fremover når lengden øker med 2', () => {
    const event = createEvent('12345', 3)
    handleCaretPosition(event, '12 345')
    jest.runAllTimers()
    expect(event.target.selectionStart).toBe(4)
  })
})

describe('calculateProportionalYearlyIncome', () => {
  test('burde beregne proporsjonal inntekt korrekt for et helt år med første inntekt', () => {
    expect(calculateProportionalYearlyIncome(12, 120000, 60000)).toBe(120000)
  })

  test('burde beregne proporsjonal inntekt korrekt for et helt år med andre inntekt', () => {
    expect(calculateProportionalYearlyIncome(0, 120000, 60000)).toBe(60000)
  })

  test('burde beregne proporsjonal inntekt korrekt for et halvt år med hver inntekt', () => {
    expect(calculateProportionalYearlyIncome(6, 120000, 60000)).toBe(90000)
  })

  test('burde beregne proporsjonal inntekt korrekt for ujevn månedsfordeling', () => {
    expect(calculateProportionalYearlyIncome(9, 120000, 60000)).toBe(105000)
    expect(calculateProportionalYearlyIncome(3, 120000, 60000)).toBe(75000)
    expect(calculateProportionalYearlyIncome(8, 100000, 200000)).toBe(133333)
  })

  test('burde håndtere grensetilfeller med nullverdier', () => {
    expect(calculateProportionalYearlyIncome(6, 0, 60000)).toBe(30000)
    expect(calculateProportionalYearlyIncome(6, 120000, 0)).toBe(60000)
    expect(calculateProportionalYearlyIncome(6, 0, 0)).toBe(0)
  })

  test('burde avrunde resultatet riktig til nærmeste heltall', () => {
    // Med divisjon som resulterer i ikke-heltall
    expect(calculateProportionalYearlyIncome(5, 100000, 50000)).toBe(70833) // (5/12)*100000 + (7/12)*50000 = 41667 + 29167 = 70833 avrundet
    expect(calculateProportionalYearlyIncome(7, 120000, 60000)).toBe(95000) // (7/12)*120000 + (5/12)*60000 = 70000 + 25000 = 95000
    expect(calculateProportionalYearlyIncome(1, 510000, 420000)).toBe(427500) // (1/12)*510000 + (11/12)*420000 = 42500 + 385000 = 427500
  })
})
