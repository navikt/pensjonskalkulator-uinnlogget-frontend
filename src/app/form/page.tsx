import FormPage from '@/components/FormPage'
import { getGrunnbelop } from '@/functions/functions'
import React, { Suspense } from 'react'

const Page = async () => {
  const grunnbelop = await getGrunnbelop()

  return (
    <>
      <Suspense fallback={<div>Laster...</div>}>
        <FormPage grunnbelop={grunnbelop} />
      </Suspense>
    </>
  )
}

export default Page
