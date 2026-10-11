import * as React from "react"
import { useEffect } from "react"
import { motion, useAnimationControls } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"
import { cart, useCart } from "./cartStore"
import { palette, focusCss } from "./tokens"

type Props = { accent: string; color: string; size: number; previewCount: number; style?: React.CSSProperties }

/**
 * Cart icon with live item count. Bumps whenever something is added.
 * Opens the CartPanel. Used inside GlassNavbar and usable on its own.
 *
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
export default function CartButton({ accent, color, size, previewCount, style }: Props) {
    const { count: realCount, bump } = useCart()
    const count = realCount || previewCount
    const controls = useAnimationControls()

    useEffect(() => {
        if (bump > 0) controls.start({ scale: [1, 1.35, 0.92, 1], transition: { duration: 0.45 } })
    }, [bump, controls])

    return (
        <motion.button
            type="button"
            className="msc-focus"
            animate={controls}
            onClick={() => cart.open()}
            aria-label={`Open cart, ${count} ${count === 1 ? "item" : "items"}`}
            style={{
                position: "relative",
                width: size,
                height: size,
                borderRadius: 999,
                border: "1px solid rgba(247,239,227,0.55)",
                background: "rgba(247,239,227,0.35)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                color,
                cursor: "pointer",
                display: "grid",
                placeItems: "center",
                padding: 0,
                ["--msc-accent" as any]: accent,
                ...style,
            }}
        >
            <style>{focusCss}</style>
            <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 7h12l-1 12H7L6 7Z" />
                <path d="M9 7a3 3 0 0 1 6 0" />
            </svg>
            <span
                aria-hidden="true"
                style={{
                    position: "absolute",
                    top: -4,
                    right: -4,
                    minWidth: 20,
                    height: 20,
                    padding: "0 5px",
                    borderRadius: 999,
                    background: accent,
                    color: palette.cocoa,
                    fontSize: 12,
                    fontWeight: 700,
                    lineHeight: "20px",
                    textAlign: "center",
                    fontFamily: "Inter,system-ui,sans-serif",
                    boxSizing: "border-box",
                }}
            >
                {count}
            </span>
        </motion.button>
    )
}

CartButton.defaultProps = { accent: palette.caramel, color: palette.cocoa, size: 44, previewCount: 0 }

addPropertyControls(CartButton, {
    accent: { type: ControlType.Color, title: "Accent", defaultValue: palette.caramel },
    color: { type: ControlType.Color, title: "Icon", defaultValue: palette.cocoa },
    size: { type: ControlType.Number, title: "Size", min: 36, max: 72, defaultValue: 44, unit: "px" },
    previewCount: { type: ControlType.Number, title: "Canvas count", min: 0, max: 99, defaultValue: 0, description: "Only for previewing the badge on the canvas." },
})
