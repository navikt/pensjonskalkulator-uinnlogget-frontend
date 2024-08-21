'use server'

export const getGrunnbelop = async () => {
  const grunnbelop = await fetch('https://g.nav.no/api/v1/grunnbel%C3%B8p', {
    next: { revalidate: 3600 }
  })
  const data = await grunnbelop.json()
  return data.grunnbeløp
}
