import * as React from "react"
import { useState } from "react"
import { addPropertyControls, ControlType } from "framer"
import { palette, glassStyle, focusCss } from "./tokens"

type Props = {
    title: string
    intro: string
    endpoint: string
    submitLabel: string
    successMessage: string
    accent: string
    cocoa: string
    style?: React.CSSProperties
}

/**
 * Custom-order inquiry form (name, phone, date needed, notes).
 * Set "Endpoint" to a form service URL (Formspree, Formspark, Basin, your own
 * API). It receives a JSON POST. With no endpoint the form runs in demo mode.
 * Prefer Framer's native Form? Replace this component; fields are the same.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function CustomOrderForm(props: Props) {
    const { title, intro, endpoint, submitLabel, successMessage, accent, cocoa, style } = props
    const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle")
    const today = new Date().toISOString().slice(0, 10)

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const form = e.currentTarget
        const data = Object.fromEntries(new FormData(form).entries())
        setStatus("sending")
        try {
            if (endpoint) {
                const res = await fetch(endpoint, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Accept: "application/json" },
                    body: JSON.stringify(data),
                })
                if (!res.ok) throw new Error(String(res.status))
            }
            form.reset()
            setStatus("done")
        } catch {
            setStatus("error")
        }
    }

    const field: React.CSSProperties = { width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: 14, border: "1px solid rgba(74,44,29,0.25)", background: "rgba(247,239,227,0.7)", color: cocoa, fontSize: 16, fontFamily: "inherit" }
    const label: React.CSSProperties = { display: "grid", gap: 6, fontSize: 14, fontWeight: 600 }

    return (
        <section aria-labelledby="msc-order-title" style={{ ...glassStyle(16, "rgba(247,239,227,0.5)"), borderRadius: 28, padding: "32px clamp(20px,4vw,40px)", color: cocoa, fontFamily: "Inter,'DM Sans',system-ui,sans-serif", boxSizing: "border-box", width: "100%", ["--msc-accent" as any]: accent, ...style }}>
            <style>{focusCss}</style>
            <h2 id="msc-order-title" style={{ margin: 0, fontSize: "clamp(28px,4vw,40px)", fontFamily: "'Fraunces','Playfair Display',Georgia,serif" }}>{title}</h2>
            <p style={{ margin: "8px 0 22px", opacity: 0.85 }}>{intro}</p>
            <form onSubmit={onSubmit} style={{ display: "grid", gap: 16 }}>
                <label style={label}>Name
                    <input className="msc-focus" name="name" type="text" autoComplete="name" required style={field} />
                </label>
                <label style={label}>Phone
                    <input className="msc-focus" name="phone" type="tel" autoComplete="tel" required style={field} />
                </label>
                <label style={label}>Date needed
                    <input className="msc-focus" name="date" type="date" min={today} required style={field} />
                </label>
                <label style={label}>Notes
                    <textarea className="msc-focus" name="notes" rows={4} placeholder="Flavours, size, dietary needs, pickup time…" style={{ ...field, resize: "vertical" }} />
                </label>
                <button type="submit" className="msc-focus" disabled={status === "sending"} style={{ padding: "14px 26px", borderRadius: 999, border: 0, background: accent, color: cocoa, fontWeight: 700, fontSize: 16, cursor: "pointer", justifySelf: "start" }}>
                    {status === "sending" ? "Sending…" : submitLabel}
                </button>
                <div role="status" aria-live="polite" style={{ minHeight: 22, fontWeight: 600 }}>
                    {status === "done" && (endpoint ? successMessage : `${successMessage} (Demo mode: no endpoint connected, nothing was sent.)`)}
                    {status === "error" && "Sorry, that didn't send. Please try again or call us."}
                </div>
            </form>
        </section>
    )
}

CustomOrderForm.defaultProps = {
    title: "Custom orders",
    intro: "Birthdays, weddings, or just because. Tell us what you need.",
    endpoint: "",
    submitLabel: "Send inquiry",
    successMessage: "Thank you! We'll be in touch within a day.",
    accent: palette.caramel,
    cocoa: palette.cocoa,
    width: 640,
}

addPropertyControls(CustomOrderForm, {
    title: { type: ControlType.String, title: "Title", defaultValue: "Custom orders" },
    intro: { type: ControlType.String, title: "Intro", displayTextArea: true },
    endpoint: { type: ControlType.String, title: "Endpoint", defaultValue: "", description: "Form service URL that accepts a JSON POST." },
    submitLabel: { type: ControlType.String, title: "Button", defaultValue: "Send inquiry" },
    successMessage: { type: ControlType.String, title: "Success text" },
    accent: { type: ControlType.Color, title: "Accent", defaultValue: palette.caramel },
    cocoa: { type: ControlType.Color, title: "Text", defaultValue: palette.cocoa },
})
