import * as React from "react"
import { useState } from "react"
import { addPropertyControls, ControlType } from "framer"
import CartButton from "./CartButton"
import { palette, glassStyle, focusCss, useMediaQuery } from "./tokens"

type LinkItem = { label: string; link: string }
type Props = {
    bakeryName: string
    links: LinkItem[]
    accent: string
    cocoa: string
    collapseBelow: number
    style?: React.CSSProperties
}

/**
 * Frosted navbar: logo/name, links, cart button. Collapses to a menu button
 * on small screens. Set Position: Fixed, top, Width: Fill in Framer.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function GlassNavbar({ bakeryName, links, accent, cocoa, collapseBelow, style }: Props) {
    const small = useMediaQuery(`(max-width: ${collapseBelow}px)`)
    const [menu, setMenu] = useState(false)
    const font = "Inter,'DM Sans',system-ui,sans-serif"
    const linkStyle: React.CSSProperties = { color: cocoa, textDecoration: "none", fontWeight: 500, fontFamily: font, padding: "8px 4px" }

    return (
        <nav
            aria-label="Main"
            style={{ ...glassStyle(18, "rgba(247,239,227,0.42)"), borderRadius: 999, padding: "10px 14px 10px 24px", boxSizing: "border-box", width: "100%", position: "relative", ["--msc-accent" as any]: accent, ...style }}
        >
            <style>{focusCss}</style>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <a href="#top" className="msc-focus" style={{ ...linkStyle, fontFamily: "'Fraunces','Playfair Display',Georgia,serif", fontSize: 22, fontWeight: 600, marginRight: "auto" }}>
                    {bakeryName}
                </a>
                {!small && links.map((l, i) => (
                    <a key={i} href={l.link} className="msc-focus" style={linkStyle}>{l.label}</a>
                ))}
                <CartButton accent={accent} color={cocoa} size={44} previewCount={0} />
                {small && (
                    <button type="button" className="msc-focus" aria-expanded={menu} aria-controls="msc-nav-menu" aria-label={menu ? "Close menu" : "Open menu"} onClick={() => setMenu((m) => !m)} style={{ width: 44, height: 44, borderRadius: 999, border: "1px solid rgba(247,239,227,0.55)", background: "rgba(247,239,227,0.35)", color: cocoa, cursor: "pointer", fontSize: 18 }}>
                        {menu ? "✕" : "☰"}
                    </button>
                )}
            </div>
            {small && menu && (
                <ul id="msc-nav-menu" style={{ listStyle: "none", margin: "12px 0 4px", padding: 0, display: "grid", gap: 4 }}>
                    {links.map((l, i) => (
                        <li key={i}><a href={l.link} className="msc-focus" onClick={() => setMenu(false)} style={{ ...linkStyle, display: "block", padding: "10px 8px" }}>{l.label}</a></li>
                    ))}
                </ul>
            )}
        </nav>
    )
}

GlassNavbar.defaultProps = {
    bakeryName: "M's Sweet Corner",
    links: [
        { label: "Menu", link: "#menu" },
        { label: "Story", link: "#story" },
        { label: "Custom orders", link: "#custom" },
        { label: "Visit", link: "#visit" },
    ],
    accent: palette.caramel,
    cocoa: palette.cocoa,
    collapseBelow: 809,
    width: 1100,
}

addPropertyControls(GlassNavbar, {
    bakeryName: { type: ControlType.String, title: "Bakery name", defaultValue: "M's Sweet Corner" },
    links: {
        type: ControlType.Array,
        title: "Links",
        control: { type: ControlType.Object, controls: { label: { type: ControlType.String, title: "Label" }, link: { type: ControlType.String, title: "Link", description: "Anchor like #menu or a page URL" } } },
    },
    accent: { type: ControlType.Color, title: "Accent", defaultValue: palette.caramel },
    cocoa: { type: ControlType.Color, title: "Text", defaultValue: palette.cocoa },
    collapseBelow: { type: ControlType.Number, title: "Collapse below", min: 320, max: 1200, unit: "px", defaultValue: 809 },
})
