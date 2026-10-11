import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

const NOISE =
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.29  0 0 0 0 0.17  0 0 0 0 0.11  0 0 0 0.9 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")"

/**
 * Light film-grain overlay. Drop it on top of a page (Position: Fixed,
 * full width/height) and toggle "Show grain" to turn it off everywhere.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function GrainOverlay(props: { show?: boolean; opacity?: number; style?: React.CSSProperties }) {
    const { show = true, opacity = 0.14, style } = props
    if (!show) return null
    return (
        <div
            aria-hidden="true"
            style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                backgroundImage: NOISE,
                backgroundSize: "220px 220px",
                mixBlendMode: "multiply",
                opacity,
                ...style,
            }}
        />
    )
}

GrainOverlay.defaultProps = { show: true, opacity: 0.14, width: 1200, height: 800 }

addPropertyControls(GrainOverlay, {
    show: { type: ControlType.Boolean, title: "Show grain", defaultValue: true },
    opacity: { type: ControlType.Number, title: "Strength", min: 0, max: 0.4, step: 0.01, defaultValue: 0.14 },
})
