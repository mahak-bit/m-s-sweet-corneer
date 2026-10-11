import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
import { cart } from "./cartStore"
import { palette, glassStyle, focusCss, formatPrice } from "./tokens"

type Props = {
    image?: { src: string; srcSet?: string; alt?: string }
    name: string
    description: string
    price: number
    category: string
    productId: string
    currency: string
    buttonLabel: string
    accent: string
    cream: string
    cocoa: string
    style?: React.CSSProperties
}

/**
 * Glass product card. Bind image / name / description / price / category
 * to the Products CMS fields (click the purple dot next to each property).
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function ProductCard(props: Props) {
    const { image, name, description, price, category, productId, currency, buttonLabel, accent, cream, cocoa, style } = props
    const id = productId || name
    return (
        <article
            style={{
                ...glassStyle(14, "rgba(247,239,227,0.5)"),
                borderRadius: 24,
                overflow: "hidden",
                color: cocoa,
                width: "100%",
                boxSizing: "border-box",
                fontFamily: "Inter,'DM Sans',system-ui,sans-serif",
                ["--msc-accent" as any]: accent,
                ...style,
            }}
        >
            <style>{focusCss}</style>
            <div style={{ position: "relative", aspectRatio: "1 / 1", background: "linear-gradient(160deg,#EADBC4,#E3C9A3)" }}>
                {image?.src ? (
                    <img src={image.src} srcSet={image.srcSet} alt={image.alt || name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                ) : (
                    <div role="img" aria-label={`${name} (photo placeholder)`} style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", fontSize: 13, opacity: 0.6 }}>
                        REPLACE: product photo
                    </div>
                )}
                {category && (
                    <span style={{ position: "absolute", top: 12, left: 12, padding: "5px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: "rgba(247,239,227,0.7)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}>
                        {category}
                    </span>
                )}
            </div>
            <div style={{ padding: "18px 20px 20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
                    <h3 style={{ margin: 0, fontSize: 22, lineHeight: 1.15, fontFamily: "'Fraunces','Playfair Display',Georgia,serif" }}>{name}</h3>
                    <span style={{ fontWeight: 700 }}>{formatPrice(price, currency)}</span>
                </div>
                <p style={{ margin: "8px 0 16px", fontSize: 15, lineHeight: 1.5, opacity: 0.85 }}>{description}</p>
                <button
                    type="button"
                    className="msc-focus"
                    onClick={() => cart.add({ id, name, price, image: image?.src })}
                    aria-label={`Add ${name} to cart`}
                    style={{ width: "100%", padding: "12px 20px", borderRadius: 999, border: 0, background: accent, color: cocoa, fontWeight: 600, fontSize: 15, cursor: "pointer" }}
                >
                    {buttonLabel}
                </button>
            </div>
        </article>
    )
}

ProductCard.defaultProps = {
    name: "Product name",
    description: "A short, mouth-watering description.",
    price: 4.5,
    category: "Cookies",
    productId: "",
    currency: "$",
    buttonLabel: "Add to cart",
    accent: palette.caramel,
    cream: palette.cream,
    cocoa: palette.cocoa,
    width: 320,
}

addPropertyControls(ProductCard, {
    image: { type: ControlType.ResponsiveImage, title: "Image" },
    name: { type: ControlType.String, title: "Name", defaultValue: "Product name" },
    description: { type: ControlType.String, title: "Description", displayTextArea: true },
    price: { type: ControlType.Number, title: "Price", min: 0, step: 0.25, defaultValue: 4.5 },
    category: { type: ControlType.String, title: "Category", defaultValue: "Cookies" },
    productId: { type: ControlType.String, title: "Product ID", description: "Bind to the CMS slug so the cart can tell items apart." },
    currency: { type: ControlType.String, title: "Currency", defaultValue: "$" },
    buttonLabel: { type: ControlType.String, title: "Button", defaultValue: "Add to cart" },
    accent: { type: ControlType.Color, title: "Accent", defaultValue: palette.caramel },
    cream: { type: ControlType.Color, title: "Cream", defaultValue: palette.cream },
    cocoa: { type: ControlType.Color, title: "Cocoa", defaultValue: palette.cocoa },
})
