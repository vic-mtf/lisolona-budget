import { useEffect, useState } from "react"

export function useWindowSize(max = 500) {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      function handleResize() {
        setWindowSize({
          width: Math.max(window.innerWidth, max),
          height: window.innerHeight
        })
      }

      // Add event listener
      window.addEventListener("resize", handleResize)

      // Call handler right away so state gets updated with initial window size
      handleResize()

      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize)
    }
  }, []) // Empty array ensures that effect is only run on mount
  return windowSize
}
