import { AldersgrenseResultV1 } from '@/common'

export const getAldersgrense = async (
  foedselsdato: number
): Promise<AldersgrenseResultV1 | undefined> => {
  const payload = {
    foedselsdato,
  }

  try {
    const aldersgrense = await fetch(
      '/pensjon/uinnlogget-kalkulator/api/aldersgrense',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    )
    const data = await aldersgrense.json()
    return data
  } catch (error) {
    console.error('Internal Server Error', error)
    return undefined
  }
}
