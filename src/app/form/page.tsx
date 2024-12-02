import FormPage from '@/components/FormPage'
import { getGrunnbelop } from '@/functions/grunnbelop'

const Page = async () => {
  const grunnbelop = await getGrunnbelop()

  return (
    <main>
      <FormPage grunnbelop={grunnbelop} />
    </main>
  )
}

export default Page
