'use server'

export const getGrunnbelop = async (): Promise<number | undefined> => {
  try {
    const grunnbelop = await fetch('https://g.nav.no/api/v1/grunnbel%C3%B8p', {
      next: { revalidate: 3600 },
    })
    const data = await grunnbelop.json()
    return 2 * data.grunnbeløp
  } catch (error) {
    console.error('Error fetching grunnbelop:', error)
    return undefined
  }
}
