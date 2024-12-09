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
  inntekt: string,
  updateInntekt: (s: string) => void
) => {
  const formattedInntekt = formatInntekt(inntekt)
  updateInntekt(formattedInntekt)
}
