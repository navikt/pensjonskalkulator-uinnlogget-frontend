import { useEffect } from 'react'

export const useRoute = (backEvent: () => void) => {
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
