export const formatInntekt = (amount?: number | string | null): string => {
  if (amount === null || amount === undefined || amount === '') return ''

  if (typeof amount === 'string') {
    // Check if the string contains any non-numeric characters
    if (/\D/.test(amount.replace(/\s/g, ''))) {
      return amount
    }
    // Parse the string to an integer after removing non-digit characters
    const integerAmount = parseInt(amount.replace(/\D+/g, ''), 10)
    return !isNaN(integerAmount)
      ? Intl.NumberFormat('nb-NO', {
          style: 'decimal',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(integerAmount)
      : amount
  }

  // If the amount is a number, format it directly
  return !isNaN(amount)
    ? Intl.NumberFormat('nb-NO', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount)
    : amount.toString()
}

export const formatInntektToNumber = (s?: string | null | undefined) => {
  if (!s) return 0

  // Check if the string contains any non-numeric characters (excluding whitespace)
  if (/[^\d\s-]/.test(s)) {
    return NaN
  }
  const inntekt = parseInt(s.replace(/[^-0-9]/g, ''), 10)
  return !isNaN(inntekt) ? inntekt : NaN
}

export const updateAndFormatInntektFromInputField = (
  e: React.ChangeEvent<HTMLInputElement>,
  oldFormattedInntekt: string,
  inntekt: string,
  updateInntekt: (s: string) => void
) => {
  const formattedInntekt = formatInntekt(inntekt)
  handleCaretPosition(e, oldFormattedInntekt, formattedInntekt)
  updateInntekt(formattedInntekt)
}

export function handleCaretPosition(
  e: React.ChangeEvent<HTMLInputElement>,
  oldFormattedValue: string,
  newFormattedValue: string
) {
  const input = e.target
  const caretPosition = input.selectionStart ?? 0

  const valueLengthDifference =
    newFormattedValue.length - oldFormattedValue.length

  setTimeout(() => {
    let start = caretPosition
    let end = caretPosition

    if (valueLengthDifference === 0 || valueLengthDifference === -1) {
      start = caretPosition
      end = start
    } else if (valueLengthDifference === -2) {
      start = Math.max(caretPosition - 1, 0)
      end = start
    } else if (valueLengthDifference === 2) {
      start = caretPosition + 1
      end = caretPosition + 1
    }

    input.setSelectionRange(start, end)
  }, 0)
}
