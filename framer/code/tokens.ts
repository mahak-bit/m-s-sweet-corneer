import * as React from "react"
import { useEffect, useState } from "react"

/**
 * Default palette. In Framer, link each color prop to your Color Styles
 * (cream / caramel / cocoa / butter) and these defaults are never used.
 */
export const palette = {
    cream: "#F7EFE3",
    caramel: "#C98A4B",
    cocoa: "#4A2C1D",
    butter: "#F3D98B",
}

/** Light frosted-glass surface. Kept translucent so imagery stays visible. */
export function glassStyle(blur = 16, tint = "rgba(247, 239, 227, 0.38)"): React.CSSProperties {
    return {
        background: tint,
        backdropFilter: `blur(${blur}px) saturate(140%)`,
        WebkitBackdropFilter: `blur(${blur}px) saturate(140%)`,
        border: "1px solid rgba(247, 239, 227, 0.55)",
        boxShadow: "0 8px 32px rgba(74, 44, 29, 0.18)",
    }
}

/** Visible keyboard focus ring. Render <style>{focusCss}</style> once per component. */
export const focusCss = `
.msc-focus:focus-visible{outline:3px solid var(--msc-accent,#C98A4B);outline-offset:3px;border-radius:inherit}
.msc-sr{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
`

export function useMediaQuery(query: string, initial = false): boolean {
    const [matches, setMatches] = useState(initial)
    useEffect(() => {
        if (typeof window === "undefined" || !window.matchMedia) return
        const mq = window.matchMedia(query)
        const update = () => setMatches(mq.matches)
        update()
        mq.addEventListener("change", update)
        return () => mq.removeEventListener("change", update)
    }, [query])
    return matches
}

export function formatPrice(value: number, currency = "$"): string {
    return `${currency}${(Number.isFinite(value) ? value : 0).toFixed(2)}`
}
