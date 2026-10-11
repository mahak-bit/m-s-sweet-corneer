import * as React from "react"
import { useRef } from "react"
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"
import { palette, glassStyle } from "./tokens"

type Props = {
    title: string
    body: string
    image?: { src: string; srcSet?: string; alt?: string }
    alt: string
    cocoa: string
    style?: React.CSSProperties
}

/**
 * Story block: short copy beside an image that unmasks and settles as it
 * scrolls into view. Static for reduced-motion users.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function StoryReveal({ title, body, image, alt, cocoa, style }: Props) {
    const ref = useRef<HTMLDivElement>(null)
    const reduce = useReducedMotion()
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] })
    const clip = useTransform(scrollYProgress, [0, 1], ["inset(18% 18% 18% 18% round 40px)", "inset(0% 0% 0% 0% round 28px)"])
    const scale = useTransform(scrollYProgress, [0, 1], [1.25, 1])
    const textY = useTransform(scrollYProgress, [0, 1], [40, 0])
    const textOpacity = useTransform(scrollYProgress, [0, 0.7], [0, 1])

    return (
        <div ref={ref} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,320px),1fr))", gap: "clamp(24px,5vw,72px)", alignItems: "center", width: "100%", boxSizing: "border-box", color: cocoa, fontFamily: "Inter,'DM Sans',system-ui,sans-serif", ...style }}>
            <motion.div style={{ clipPath: reduce ? undefined : clip, borderRadius: 28, overflow: "hidden", aspectRatio: "4 / 5", background: "linear-gradient(160deg,#E9C99A,#C98A4B)" }}>
                {image?.src ? (
                    <motion.img src={image.src} srcSet={image.srcSet} alt={image.alt || alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", scale: reduce ? 1 : scale }} />
                ) : (
                    <div role="img" aria-label={alt} style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", fontSize: 13, opacity: 0.7 }}>REPLACE: story photo</div>
                )}
            </motion.div>
            <motion.div style={{ ...glassStyle(14, "rgba(247,239,227,0.45)"), borderRadius: 28, padding: "clamp(24px,4vw,48px)", y: reduce ? 0 : textY, opacity: reduce ? 1 : textOpacity }}>
                <h2 style={{ margin: 0, fontSize: "clamp(30px,4.5vw,52px)", lineHeight: 1.08, fontFamily: "'Fraunces','Playfair Display',Georgia,serif" }}>{title}</h2>
                <p style={{ margin: "16px 0 0", fontSize: 18, lineHeight: 1.6 }}>{body}</p>
            </motion.div>
        </div>
    )
}

StoryReveal.defaultProps = {
    title: "Small batches, big warmth",
    body: "Every morning we mix, shape and bake in small batches so nothing sits on a shelf for long. Real butter, local flour, and patience: that's the whole secret.",
    alt: "Baker shaping dough by hand on a floured counter",
    cocoa: palette.cocoa,
    width: 1100,
}

addPropertyControls(StoryReveal, {
    title: { type: ControlType.String, title: "Title" },
    body: { type: ControlType.String, title: "Paragraph", displayTextArea: true },
    image: { type: ControlType.ResponsiveImage, title: "Image (replace me)" },
    alt: { type: ControlType.String, title: "Alt text" },
    cocoa: { type: ControlType.Color, title: "Text", defaultValue: palette.cocoa },
})
