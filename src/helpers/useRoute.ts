import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export const useRoute = (backEvent: () => void) => {
  const pathname = usePathname()

  useEffect(() => {
    const handlePopState = () => {
      backEvent()
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [backEvent])

  const setRoute = (route: string) => {
    window.history.pushState(null, '', route)
  }

  return { setRoute }
}
