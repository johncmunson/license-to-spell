import React from "react"

/*
NOTE: THIS IS CHATGPT CODE AND HAS NOT BEEN TESTED YET!

useKeyboardOpen is a React hook that infers whether the on-screen (software) keyboard
is currently visible on a mobile browser.

Mobile operating systems do not expose any direct or reliable API for detecting
keyboard state. There is no "keyboardopen" event, and browsers intentionally hide
keyboard visibility for privacy and security reasons. The only usable signal we get
is that when the keyboard appears, the visible portion of the page (the visual
viewport) becomes shorter.

This hook uses the Visual Viewport API (window.visualViewport) to track changes in
viewport height. When the keyboard opens, visualViewport.height drops; when it
closes, the height returns to normal. By comparing the current height to the
initial height, the hook estimates whether the keyboard is open.

A pixel threshold is used instead of exact equality because keyboard height varies
by device, orientation, language, and keyboard type. Small viewport changes can
also happen for reasons unrelated to the keyboard (browser UI, zoom, safe areas),
so the threshold helps avoid false positives.

Limitations and pitfalls:
- Some keyboards (e.g., floating or split keyboards on tablets) do not resize the
  viewport at all, making detection impossible.
- iOS Safari sometimes reports viewport changes via "scroll" instead of "resize",
  so both events must be listened to.
- The hook detects viewport changes, not the keyboard itself, so unusual UI
  changes or browser chrome can occasionally trigger false positives.
- Hardware keyboards do not trigger any viewport change and therefore cannot be
  detected.

This approach is the most reliable method currently available on the web, but it
should be treated as an inference rather than a guaranteed signal.
*/
export function useKeyboardOpen(threshold = 150) {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    if (!window.visualViewport) return

    const viewport = window.visualViewport
    const initialHeight = viewport.height

    const handler = () => {
      const delta = initialHeight - viewport.height
      setOpen(delta > threshold)
    }

    viewport.addEventListener("resize", handler)
    viewport.addEventListener("scroll", handler) // iOS fires scroll instead of resize

    return () => {
      viewport.removeEventListener("resize", handler)
      viewport.removeEventListener("scroll", handler)
    }
  }, [])

  return open
}
