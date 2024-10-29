'use client'

import FormPage from '@/components/FormPage'
import { getGrunnbelop } from '@/functions/grunnbelop'
import React, { Suspense, useEffect, useState } from 'react'

const Page = () => {
  const [grunnbelop, setGrunnbelop] = useState<number | undefined>(undefined)

  useEffect(() => {
    getGrunnbelop().then(setGrunnbelop)
  }, [])

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FormPage grunnbelop={grunnbelop} />
    </Suspense>
  )
}

export default Page
