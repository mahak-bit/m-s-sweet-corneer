import * as React from "react"
import { useEffect, useRef } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { cart, useCart } from "./cartStore"
import { palette, glassStyle, focusCss, formatPrice } from "./tokens"

type Props = {
    currency: string
    menuLink: string
    checkoutUrl: string
    checkoutLabel: string
    emptyTitle: string
    emptyLine: string
    accent: string
    cream: string
    cocoa: string
    previewOpen: boolean
    style?: React.CSSProperties
}

const FOCUSABLE = 'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Glass slide-in cart. Place ONE instance near the top of the page
 * (Position: Fixed, any size). Opened by CartButton, closed with the X,
 * the backdrop, or Escape. Focus is trapped while open and restored on close.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function CartPanel(props: Props) {
    const { currency, menuLink, checkoutUrl, checkoutLabel, emptyTitle, emptyLine, accent, cream, cocoa, previewOpen } = props
    const { items, open: storeOpen, subtotal } = useCart()
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const open = storeOpen || (isCanvas && previewOpen)
    const reduce = useReducedMotion()
    const panelRef = useRef<HTMLElement>(null)
    const closeRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        if (!open || isCanvas) return
        const opener = document.activeElement as HTMLElement | null
        const t = window.setTimeout(() => closeRef.current?.focus(), 30)
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") return cart.close()
            if (e.key !== "Tab" || !panelRef.current) return
            const f = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE))
            if (!f.length) return
            const first = f[0]
            const last = f[f.length - 1]
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault()
                last.focus()
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault()
                first.focus()
            }
        }
        document.addEventListener("keydown", onKey)
        return () => {
            window.clearTimeout(t)
            document.removeEventListener("keydown", onKey)
            opener?.focus?.()
        }
    }, [open, isCanvas])

    /**
     * ── CONNECT PAYMENTS HERE ─────────────────────────────────────────
     * `items` is [{ id, name, price, qty }]. Options:
     *  1. Payment Link / hosted checkout: set the "Checkout URL" property.
     *  2. Stripe Checkout: POST `items` to your server/serverless function,
     *     which creates a Checkout Session; then redirect to session.url.
     *  3. Shopify / Snipcart / Ecwid: map items to their cart API here.
     * Never put secret keys in this file: it runs in the browser.
     */
    const handleCheckout = () => {
        if (checkoutUrl) window.location.href = checkoutUrl
    }

    const goToMenu = () => cart.close()

    return (
        <div style={{ position: "fixed", inset: 0, pointerEvents: open ? "auto" : "none", zIndex: 9999, ...props.style, ["--msc-accent" as any]: accent }}>
            <style>{focusCss}</style>
            <AnimatePresence>
                {open && (
                    <>
                        <motion.div
                            key="backdrop"
                            aria-hidden="true"
                            onClick={() => cart.close()}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: reduce ? 0 : 0.25 }}
                            style={{ position: "absolute", inset: 0, background: "rgba(74,44,29,0.28)" }}
                        />
                        <motion.aside
                            key="panel"
                            ref={panelRef as any}
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="msc-cart-title"
                            initial={{ x: reduce ? 0 : "100%", opacity: reduce ? 0 : 1 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: reduce ? 0 : "100%", opacity: reduce ? 0 : 1 }}
                            transition={{ type: "tween", ease: [0.22, 1, 0.36, 1], duration: reduce ? 0 : 0.45 }}
                            style={{
                                ...glassStyle(22, "rgba(247,239,227,0.62)"),
                                position: "absolute",
                                top: 0,
                                right: 0,
                                bottom: 0,
                                width: "min(420px, 100vw)",
                                display: "flex",
                                flexDirection: "column",
                                color: cocoa,
                                fontFamily: "Inter,'DM Sans',system-ui,sans-serif",
                                borderRadius: "24px 0 0 24px",
                            }}
                        >
                            <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 24px 12px" }}>
                                <h2 id="msc-cart-title" style={{ margin: 0, fontSize: 26, fontFamily: "'Fraunces','Playfair Display',Georgia,serif" }}>
                                    Your cart
                                </h2>
                                <button ref={closeRef} type="button" className="msc-focus" onClick={() => cart.close()} aria-label="Close cart" style={iconBtn(cocoa)}>
                                    ✕
                                </button>
                            </header>

                            {items.length === 0 ? (
                                <div style={{ flex: 1, display: "grid", placeItems: "center", textAlign: "center", padding: 32 }}>
                                    <div>
                                        <p style={{ margin: 0, fontSize: 22, fontFamily: "'Fraunces','Playfair Display',Georgia,serif" }}>{emptyTitle}</p>
                                        <p style={{ margin: "8px 0 20px", opacity: 0.8 }}>{emptyLine}</p>
                                        <a href={menuLink} onClick={goToMenu} className="msc-focus" style={pill(accent, cocoa)}>
                                            Back to the menu
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <ul style={{ listStyle: "none", margin: 0, padding: "4px 24px", flex: 1, overflowY: "auto" }}>
                                        {items.map((it) => (
                                            <li key={it.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(74,44,29,0.12)" }}>
                                                {it.image && <img src={it.image} alt="" style={{ width: 56, height: 56, borderRadius: 12, objectFit: "cover" }} />}
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontWeight: 600 }}>{it.name}</div>
                                                    <div style={{ fontSize: 14, opacity: 0.75 }}>{formatPrice(it.price, currency)}</div>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                                                        <button type="button" className="msc-focus" onClick={() => cart.setQty(it.id, it.qty - 1)} aria-label={`Decrease quantity of ${it.name}`} style={qtyBtn(cocoa)}>−</button>
                                                        <span aria-live="polite" aria-label={`Quantity ${it.qty}`} style={{ minWidth: 20, textAlign: "center", fontWeight: 600 }}>{it.qty}</span>
                                                        <button type="button" className="msc-focus" onClick={() => cart.setQty(it.id, it.qty + 1)} aria-label={`Increase quantity of ${it.name}`} style={qtyBtn(cocoa)}>+</button>
                                                        <button type="button" className="msc-focus" onClick={() => cart.remove(it.id)} aria-label={`Remove ${it.name} from cart`} style={{ marginLeft: "auto", background: "none", border: 0, color: cocoa, textDecoration: "underline", cursor: "pointer", fontSize: 14 }}>
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                    <footer style={{ padding: "16px 24px 24px" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 600, marginBottom: 14 }}>
                                            <span>Subtotal</span>
                                            <span>{formatPrice(subtotal, currency)}</span>
                                        </div>
                                        <button type="button" className="msc-focus" onClick={handleCheckout} style={{ ...pill(accent, cocoa), width: "100%", border: 0, cursor: "pointer", fontSize: 16 }}>
                                            {checkoutLabel}
                                        </button>
                                        {!checkoutUrl && (
                                            <p style={{ margin: "10px 0 0", fontSize: 12, opacity: 0.7 }}>
                                                Template note: no payment provider is connected yet (see the guide).
                                            </p>
                                        )}
                                    </footer>
                                </>
                            )}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

const iconBtn = (c: string): React.CSSProperties => ({ width: 40, height: 40, borderRadius: 999, border: "1px solid rgba(74,44,29,0.2)", background: "rgba(247,239,227,0.5)", color: c, cursor: "pointer", fontSize: 16 })
const qtyBtn = (c: string): React.CSSProperties => ({ width: 30, height: 30, borderRadius: 999, border: "1px solid rgba(74,44,29,0.25)", background: "rgba(247,239,227,0.6)", color: c, cursor: "pointer", fontSize: 16, lineHeight: 1 })
const pill = (bg: string, fg: string): React.CSSProperties => ({ display: "inline-block", padding: "14px 26px", borderRadius: 999, background: bg, color: fg, fontWeight: 600, textDecoration: "none", textAlign: "center", boxSizing: "border-box" })

CartPanel.defaultProps = {
    currency: "$",
    menuLink: "#menu",
    checkoutUrl: "",
    checkoutLabel: "Checkout",
    emptyTitle: "Your cart is empty",
    emptyLine: "Something warm is waiting on the menu.",
    accent: palette.caramel,
    cream: palette.cream,
    cocoa: palette.cocoa,
    previewOpen: false,
    width: 420,
    height: 800,
}

addPropertyControls(CartPanel, {
    currency: { type: ControlType.String, title: "Currency", defaultValue: "$" },
    menuLink: { type: ControlType.String, title: "Menu link", defaultValue: "#menu" },
    checkoutUrl: { type: ControlType.String, title: "Checkout URL", defaultValue: "", description: "Payment Link / hosted checkout. For custom checkout edit handleCheckout in the code." },
    checkoutLabel: { type: ControlType.String, title: "Checkout label", defaultValue: "Checkout" },
    emptyTitle: { type: ControlType.String, title: "Empty title", defaultValue: "Your cart is empty" },
    emptyLine: { type: ControlType.String, title: "Empty line", defaultValue: "Something warm is waiting on the menu." },
    accent: { type: ControlType.Color, title: "Accent", defaultValue: palette.caramel },
    cream: { type: ControlType.Color, title: "Cream", defaultValue: palette.cream },
    cocoa: { type: ControlType.Color, title: "Cocoa", defaultValue: palette.cocoa },
    previewOpen: { type: ControlType.Boolean, title: "Open on canvas", defaultValue: false },
})
