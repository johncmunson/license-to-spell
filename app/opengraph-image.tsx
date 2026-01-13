import { ImageResponse } from "next/og"

export const alt = "License To Spell - A fun license plate word game"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default async function Image() {
  // License plate data
  const letters = ["P", "K", "L"]
  const numbers = ["4", "7", "3"]
  const state = "TEXAS"
  const motto = "ASK ME ABOUT TEXAS"

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #f1f5f9 0%, #f8fafc 50%, #e2e8f0 100%)",
        fontFamily: "monospace",
      }}
    >
      {/* License Plate */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "820px",
          height: "410px",
          background: "linear-gradient(180deg, #fffbeb 0%, #fef3c7 100%)",
          border: "8px solid #334155",
          borderRadius: "20px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          position: "relative",
          padding: "28px",
        }}
      >
        {/* Bolt holes */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "24px",
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            background: "#94a3b8",
            border: "3px solid #64748b",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "24px",
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            background: "#94a3b8",
            border: "3px solid #64748b",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "24px",
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            background: "#94a3b8",
            border: "3px solid #64748b",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            right: "24px",
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            background: "#94a3b8",
            border: "3px solid #64748b",
          }}
        />

        {/* State name */}
        <div
          style={{
            display: "flex",
            fontSize: "44px",
            color: "#1e40af",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: "20px",
          }}
        >
          {state}
        </div>

        {/* Plate characters */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
          }}
        >
          {/* Letters */}
          {letters.map((char, index) => (
            <div
              key={`letter-${index}`}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "95px",
                height: "126px",
                background: "white",
                border: "4px solid #cbd5e1",
                borderRadius: "10px",
                fontSize: "98px",
                color: "#1e293b",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              {char}
            </div>
          ))}

          {/* Separator */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "44px",
              fontSize: "90px",
              color: "#475569",
            }}
          >
            -
          </div>

          {/* Numbers */}
          {numbers.map((char, index) => (
            <div
              key={`number-${index}`}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "95px",
                height: "126px",
                background: "white",
                border: "4px solid #cbd5e1",
                borderRadius: "10px",
                fontSize: "98px",
                color: "#1e293b",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              {char}
            </div>
          ))}
        </div>

        {/* State motto */}
        <div
          // Use some sort of skew or transform to simulate italics since satori doesn't support it
          style={{
            display: "flex",
            fontSize: "30px",
            color: "#64748b",
            letterSpacing: "0.05em",
            marginTop: "24px",
            transform: "skewX(-15deg)",
          }}
        >
          "{motto}"
        </div>
      </div>

      {/* Word Input */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginTop: "32px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "560px",
            height: "88px",
            background: "white",
            border: "4px solid #cbd5e1",
            borderRadius: "16px",
            fontSize: "38px",
            color: "#cbd5e1",
            letterSpacing: "0.1em",
          }}
        >
          TYPE A WORD
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "88px",
            height: "88px",
            background: "#3b82f6",
            borderRadius: "16px",
            boxShadow: "0 4px 6px -1px rgba(59, 130, 246, 0.3)",
          }}
        >
          {/* Send icon - simplified arrow */}
          <svg
            width="44"
            height="44"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  )
}
