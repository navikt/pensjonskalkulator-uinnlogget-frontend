import FormPage from '@/components/FormPage'
import { getGrunnbelop } from '@/functions/grunnbelop'

const Page = async () => {
  const grunnbelop = await getGrunnbelop()

  return <FormPage grunnbelop={grunnbelop} />
}

export default Page
