import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
import { palette, glassStyle, focusCss } from "./tokens"

type Props = {
    bakeryName: string
    location: string
    hours: { days: string; time: string }[]
    socials: { label: string; link: string }[]
    accent: string
    cocoa: string
    style?: React.CSSProperties
}

/**
 * Footer: hours, address, social links.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function SiteFooter({ bakeryName, location, hours, socials, accent, cocoa, style }: Props) {
    const h: React.CSSProperties = { margin: "0 0 10px", fontSize: 20, fontFamily: "'Fraunces','Playfair Display',Georgia,serif" }
    return (
        <footer style={{ ...glassStyle(16, "rgba(247,239,227,0.5)"), borderRadius: 28, padding: "clamp(24px,4vw,48px)", color: cocoa, fontFamily: "Inter,'DM Sans',system-ui,sans-serif", boxSizing: "border-box", width: "100%", ["--msc-accent" as any]: accent, ...style }}>
            <style>{focusCss}</style>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,220px),1fr))", gap: 32 }}>
                <div>
                    <p style={{ ...h, fontSize: 28 }}>{bakeryName}</p>
                    <p style={{ margin: 0, lineHeight: 1.6 }}>{location}</p>
                </div>
                <div>
                    <h2 style={h}>Hours</h2>
                    <dl style={{ margin: 0, display: "grid", gridTemplateColumns: "auto 1fr", gap: "4px 16px" }}>
                        {hours.map((r, i) => (
                            <React.Fragment key={i}><dt style={{ fontWeight: 600 }}>{r.days}</dt><dd style={{ margin: 0 }}>{r.time}</dd></React.Fragment>
                        ))}
                    </dl>
                </div>
                <div>
                    <h2 style={h}>Follow</h2>
                    <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 6 }}>
                        {socials.map((s, i) => (
                            <li key={i}><a className="msc-focus" href={s.link} target="_blank" rel="noopener noreferrer" style={{ color: cocoa }}>{s.label}</a></li>
                        ))}
                    </ul>
                </div>
            </div>
            <p style={{ margin: "28px 0 0", fontSize: 13, opacity: 0.7 }}>© {new Date().getFullYear()} {bakeryName}</p>
        </footer>
    )
}

SiteFooter.defaultProps = {
    bakeryName: "M's Sweet Corner",
    location: "[LOCATION] — 123 Placeholder Street, Your Town",
    hours: [
        { days: "Mon–Fri", time: "[HOURS] 7am – 5pm" },
        { days: "Sat", time: "[HOURS] 8am – 4pm" },
        { days: "Sun", time: "[HOURS] 8am – 1pm" },
    ],
    socials: [
        { label: "Instagram", link: "https://instagram.com/" },
        { label: "Facebook", link: "https://facebook.com/" },
        { label: "TikTok", link: "https://tiktok.com/" },
    ],
    accent: palette.caramel,
    cocoa: palette.cocoa,
    width: 1100,
}

addPropertyControls(SiteFooter, {
    bakeryName: { type: ControlType.String, title: "Bakery name" },
    location: { type: ControlType.String, title: "Address", displayTextArea: true },
    hours: { type: ControlType.Array, title: "Hours", control: { type: ControlType.Object, controls: { days: { type: ControlType.String, title: "Days" }, time: { type: ControlType.String, title: "Time" } } } },
    socials: { type: ControlType.Array, title: "Socials", control: { type: ControlType.Object, controls: { label: { type: ControlType.String, title: "Label" }, link: { type: ControlType.String, title: "URL" } } } },
    accent: { type: ControlType.Color, title: "Accent", defaultValue: palette.caramel },
    cocoa: { type: ControlType.Color, title: "Text", defaultValue: palette.cocoa },
})
