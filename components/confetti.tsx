import { useEffect, useRef, useCallback, useState, ReactNode } from "react"
import confetti from "canvas-confetti"

type ConfettiApi = (opts?: confetti.Options) => void

type ConfettiProps = {
  children: (api: { fire: ConfettiApi; reset: () => void }) => ReactNode
  globalOptions?: confetti.CreateTypes
  className?: string
  style?: React.CSSProperties
}

export function Confetti({
  children,
  globalOptions,
  className,
  style,
}: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const instanceRef = useRef<ReturnType<typeof confetti.create> | null>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // Update canvas dimensions on mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  // Create confetti instance after canvas is properly sized
  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0) return

    instanceRef.current = confetti.create(canvasRef.current, {
      resize: true,
      useWorker: true,
      ...globalOptions,
    })

    return () => {
      instanceRef.current?.reset()
      instanceRef.current = null
    }
  }, [dimensions.width, dimensions.height, globalOptions])

  const fire = useCallback<ConfettiApi>((opts = {}) => {
    instanceRef.current?.(opts)
  }, [])

  const reset = useCallback(() => {
    instanceRef.current?.reset()
  }, [])

  return (
    <>
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className={className}
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 1000,
          ...style,
        }}
      />
      {children({ fire, reset })}
    </>
  )
}

// Example usage
{
  /* <Confetti>
  {({ fire }) => (
    <button
      onClick={() =>
        fire({
          particleCount: 150,
          spread: 180,
        })
      }
    >
      Celebrate
    </button>
  )}
</Confetti> */
}
