import * as React from "react"
import { useRef } from "react"
import { motion, useScroll, useTransform, useReducedMotion, MotionValue } from "framer-motion"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { palette, glassStyle, focusCss, useMediaQuery } from "./tokens"
import GrainOverlay from "./GrainOverlay"

type SceneData = {
    headline: string
    line: string
    image?: { src: string; srcSet?: string; alt?: string }
    alt?: string
}

type Props = {
    bakeryName: string
    heroText: string
    heroLine: string
    ctaLabel: string
    ctaLink: string
    scenes: SceneData[]
    sceneCount: number
    scrollPerScene: number
    flourScene: number
    showGrain: boolean
    accent: string
    cream: string
    cocoa: string
    butter: string
    headlineFont: Record<string, any>
    bodyFont: Record<string, any>
    staticBreakpoint: number
    style?: React.CSSProperties
}

/* Warm gradients used until the buyer drops in real photos. */
const FALLBACKS = [
    "linear-gradient(160deg,#F7EFE3 0%,#E9C99A 55%,#C98A4B 100%)",
    "radial-gradient(circle at 50% 70%,#F3B15E 0%,#B5622B 45%,#3A2013 100%)",
    "linear-gradient(180deg,#EADBC4 0%,#F7EFE3 50%,#E3C9A3 100%)",
    "linear-gradient(170deg,#D9A66B 0%,#9A5F33 60%,#4A2C1D 100%)",
    "linear-gradient(160deg,#F3D98B 0%,#E7B7A4 50%,#B98A7A 100%)",
    "radial-gradient(circle at 50% 40%,#F7EFE3 0%,#E9C99A 50%,#C98A4B 100%)",
]

/* ---------- scroll keyframes: one scene owns [i/n, (i+1)/n] of progress ---------- */
function keys(i: number, n: number) {
    const start = i / n
    const end = (i + 1) / n
    const h = 0.14 / n // half-width of the cross-fade between scenes
    const first = i === 0
    const last = i === n - 1

    const inputs: number[] = []
    const opacity: number[] = []
    const blur: number[] = []
    const textIn: number[] = []
    const textOpacity: number[] = []
    const textY: number[] = []

    if (!first) {
        inputs.push(start - h, start + h)
        opacity.push(0, 1)
        blur.push(14, 0)
    } else {
        inputs.push(0)
        opacity.push(1)
        blur.push(0)
    }
    if (!last) {
        inputs.push(end - h, end + h)
        opacity.push(1, 0)
        blur.push(0, 12)
    } else {
        inputs.push(1)
        opacity.push(1)
        blur.push(0)
    }

    if (!first) {
        textIn.push(start + h * 0.5, start + h * 3)
        textOpacity.push(0, 1)
        textY.push(48, 0)
    } else {
        textIn.push(0)
        textOpacity.push(1)
        textY.push(0)
    }
    if (!last) {
        textIn.push(end - h * 3, end - h * 0.5)
        textOpacity.push(1, 0)
        textY.push(0, -48)
    } else {
        textIn.push(1)
        textOpacity.push(1)
        textY.push(0)
    }

    return { start, end, h, inputs, opacity, blur, textIn, textOpacity, textY }
}

/* ---------- one cinematic scene ---------- */
function Scene(props: {
    index: number
    total: number
    progress: MotionValue<number>
    data: SceneData
    showCta: boolean
    ctaLabel: string
    ctaLink: string
    accent: string
    cream: string
    cocoa: string
    isCanvas: boolean
    headlineFont: Record<string, any>
    bodyFont: Record<string, any>
    bakeryName: string
}) {
    const { index, total, progress, data, showCta, ctaLabel, ctaLink, accent, cream, cocoa, isCanvas } = props
    const k = keys(index, total)
    const range = [Math.max(0, k.start - k.h), Math.min(1, k.end + k.h)]

    const opacity = useTransform(progress, k.inputs, k.opacity)
    const blurPx = useTransform(progress, k.inputs, k.blur)
    const filter = useTransform(blurPx, (v) => `blur(${v}px)`)
    const visibility = useTransform(opacity, (o) => (o < 0.02 ? "hidden" : "visible"))

    // Camera push-in on the background, faster counter-drift on the foreground.
    const bgScale = useTransform(progress, range, [1.04, 1.32])
    const bgY = useTransform(progress, range, ["4%", "-4%"])
    const fgScale = useTransform(progress, range, [1, 1.7])
    const fgY = useTransform(progress, range, ["10%", "-14%"])

    const textOpacity = useTransform(progress, k.textIn, k.textOpacity)
    const textY = useTransform(progress, k.textIn, k.textY)

    const img = data.image?.src
    const alt = data.alt || data.image?.alt || data.headline

    return (
        <motion.div style={{ position: "absolute", inset: 0, opacity, visibility, overflow: "hidden" }}>
            {/* BACKGROUND: replace in the "Scenes" property */}
            <motion.div
                style={{ position: "absolute", inset: "-8%", scale: bgScale, y: bgY, filter, willChange: "transform, filter" }}
            >
                {img ? (
                    <img
                        src={img}
                        srcSet={data.image?.srcSet}
                        alt={alt}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                ) : (
                    <div
                        role="img"
                        aria-label={alt}
                        style={{ width: "100%", height: "100%", background: FALLBACKS[index % FALLBACKS.length] }}
                    />
                )}
            </motion.div>

            {/* FOREGROUND: warm light bloom that drifts faster than the background */}
            <motion.div
                aria-hidden="true"
                style={{
                    position: "absolute",
                    inset: "-20%",
                    scale: fgScale,
                    y: fgY,
                    background:
                        "radial-gradient(ellipse at 20% 100%, rgba(243,217,139,0.45) 0%, rgba(243,217,139,0) 55%), radial-gradient(ellipse at 90% 0%, rgba(74,44,29,0.35) 0%, rgba(74,44,29,0) 60%)",
                    pointerEvents: "none",
                }}
            />

            {/* legibility wash */}
            <div
                aria-hidden="true"
                style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(0deg, rgba(74,44,29,0.45) 0%, rgba(74,44,29,0) 55%)",
                }}
            />

            {isCanvas && !img && (
                <div
                    style={{
                        position: "absolute",
                        top: 88,
                        right: 24,
                        padding: "6px 10px",
                        borderRadius: 8,
                        fontSize: 12,
                        background: "rgba(74,44,29,0.8)",
                        color: cream,
                        fontFamily: "Inter, sans-serif",
                    }}
                >
                    REPLACE: scene {index + 1} image/video frame
                </div>
            )}

            {/* TEXT: one headline + one line */}
            <motion.div
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    padding: "0 clamp(20px,6vw,96px) clamp(48px,10vh,120px)",
                    opacity: textOpacity,
                    y: textY,
                }}
            >
                <div style={{ ...glassStyle(14, "rgba(74,44,29,0.42)"), maxWidth: 640, padding: "28px 32px", borderRadius: 24 }}>
                    <h2
                        style={{
                            margin: 0,
                            color: cream,
                            fontSize: "clamp(32px,5.5vw,72px)",
                            lineHeight: 1.05,
                            letterSpacing: "-0.02em",
                            fontWeight: 600,
                            fontFamily: "'Fraunces','Playfair Display',Georgia,serif",
                            textShadow: "0 2px 18px rgba(74,44,29,0.45)",
                            ...props.headlineFont,
                        }}
                    >
                        {data.headline}
                    </h2>
                    <p
                        style={{
                            margin: "14px 0 0",
                            color: cream,
                            fontSize: "clamp(16px,1.6vw,20px)",
                            lineHeight: 1.5,
                            fontFamily: "Inter,'DM Sans',system-ui,sans-serif",
                            textShadow: "0 1px 10px rgba(74,44,29,0.5)",
                            ...props.bodyFont,
                        }}
                    >
                        {data.line}
                    </p>
                    {showCta && (
                        <a
                            href={ctaLink}
                            className="msc-focus"
                            style={{
                                display: "inline-block",
                                marginTop: 22,
                                padding: "14px 26px",
                                borderRadius: 999,
                                background: accent,
                                color: cocoa,
                                fontWeight: 600,
                                textDecoration: "none",
                                fontFamily: "Inter,'DM Sans',system-ui,sans-serif",
                                boxShadow: "0 6px 20px rgba(74,44,29,0.3)",
                            }}
                        >
                            {ctaLabel}
                        </a>
                    )}
                </div>
            </motion.div>
        </motion.div>
    )
}

/* ---------- drifting flour ---------- */
function Flour(props: { progress: MotionValue<number>; peak: number; total: number; cream: string }) {
    const { progress, peak, total, cream } = props
    const centre = (peak + 0.5) / total
    const w = 0.9 / total
    const layerOpacity = useTransform(
        progress,
        [0, Math.max(0.001, centre - w), centre, Math.min(0.999, centre + w), 1],
        [0.25, 0.25, 1, 0.25, 0.25]
    )
    const specks = React.useMemo(() => {
        let s = 7
        const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647)
        return Array.from({ length: 22 }, () => ({
            x: rnd() * 100,
            y: rnd() * 100,
            size: 3 + rnd() * 7,
            speed: 0.5 + rnd() * 1.6,
            sway: (rnd() - 0.5) * 60,
        }))
    }, [])
    return (
        <motion.div
            aria-hidden="true"
            style={{ position: "absolute", inset: 0, opacity: layerOpacity, pointerEvents: "none", overflow: "hidden" }}
        >
            {specks.map((p, i) => (
                <Speck key={i} progress={progress} p={p} cream={cream} />
            ))}
        </motion.div>
    )
}

function Speck(props: { progress: MotionValue<number>; p: any; cream: string }) {
    const { progress, p, cream } = props
    const y = useTransform(progress, [0, 1], [`0vh`, `${p.speed * 90}vh`])
    const x = useTransform(progress, [0, 1], [0, p.sway])
    return (
        <motion.span
            style={{
                position: "absolute",
                left: `${p.x}%`,
                top: `${p.y - 40}%`,
                width: p.size,
                height: p.size,
                borderRadius: "50%",
                background: cream,
                filter: "blur(1px)",
                opacity: 0.75,
                x,
                y,
            }}
        />
    )
}

/* ---------- static layout (mobile / reduced motion) ---------- */
function StaticScenes(props: Props & { scenes: SceneData[] }) {
    const { scenes, cream, cocoa, accent, ctaLabel, ctaLink } = props
    return (
        <div style={{ background: cream, padding: "88px 0 24px" }}>
            {scenes.map((s, i) => {
                const alt = s.alt || s.image?.alt || s.headline
                return (
                    <section
                        key={i}
                        aria-labelledby={`msc-s-${i}`}
                        style={{ margin: "0 auto 28px", maxWidth: 720, padding: "0 20px" }}
                    >
                        <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", aspectRatio: "4 / 3" }}>
                            {s.image?.src ? (
                                <img
                                    src={s.image.src}
                                    srcSet={s.image.srcSet}
                                    alt={alt}
                                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                                />
                            ) : (
                                <div
                                    role="img"
                                    aria-label={alt}
                                    style={{ width: "100%", height: "100%", background: FALLBACKS[i % FALLBACKS.length] }}
                                />
                            )}
                        </div>
                        <div style={{ padding: "18px 4px 0", color: cocoa }}>
                            <h2
                                id={`msc-s-${i}`}
                                style={{
                                    margin: 0,
                                    fontSize: "clamp(28px,7vw,40px)",
                                    lineHeight: 1.1,
                                    fontFamily: "'Fraunces','Playfair Display',Georgia,serif",
                                    ...props.headlineFont,
                                }}
                            >
                                {s.headline}
                            </h2>
                            <p style={{ margin: "10px 0 0", fontSize: 17, lineHeight: 1.5, fontFamily: "Inter,'DM Sans',system-ui,sans-serif", ...props.bodyFont }}>
                                {s.line}
                            </p>
                            {(i === 0 || i === scenes.length - 1) && (
                                <a
                                    href={ctaLink}
                                    className="msc-focus"
                                    style={{
                                        display: "inline-block",
                                        marginTop: 16,
                                        padding: "13px 24px",
                                        borderRadius: 999,
                                        background: accent,
                                        color: cocoa,
                                        fontWeight: 600,
                                        textDecoration: "none",
                                        fontFamily: "Inter,'DM Sans',system-ui,sans-serif",
                                    }}
                                >
                                    {ctaLabel}
                                </a>
                            )}
                        </div>
                    </section>
                )
            })}
        </div>
    )
}

/**
 * Sticky, scroll-driven bakery "walk-through".
 * Needs: no ancestor with overflow:hidden (breaks position:sticky).
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function ScrollBakery(props: Props) {
    const {
        bakeryName, heroText, heroLine, ctaLabel, ctaLink, scenes, sceneCount,
        scrollPerScene, flourScene, showGrain, accent, cream, cocoa, butter, staticBreakpoint, style,
    } = props

    const reduce = useReducedMotion()
    const narrow = useMediaQuery(`(max-width: ${staticBreakpoint}px)`)
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const useStatic = (reduce || narrow) && !isCanvas

    const list = React.useMemo(() => {
        const n = Math.max(3, Math.min(6, Math.round(sceneCount)))
        const base = scenes.slice(0, n)
        // Scene 1 is always driven by the "Hero text" properties.
        if (base[0]) base[0] = { ...base[0], headline: heroText, line: heroLine }
        return base
    }, [scenes, sceneCount, heroText, heroLine])

    const ref = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] })
    const n = list.length

    const rootVars = { ["--msc-accent" as any]: accent }

    if (useStatic) {
        return (
            <div style={{ position: "relative", width: "100%", ...style, ...rootVars }}>
                <style>{focusCss}</style>
                <StaticScenes {...props} scenes={list} />
                <GrainOverlay show={showGrain} />
            </div>
        )
    }

    return (
        <div
            ref={ref}
            aria-label={`${bakeryName}: a walk through the bakery`}
            style={{
                position: "relative",
                width: "100%",
                height: isCanvas ? "100vh" : `${n * scrollPerScene}vh`,
                ...style,
                ...rootVars,
            }}
        >
            <style>{focusCss}</style>
            <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", background: cocoa }}>
                {list.map((s, i) => (
                    <Scene
                        key={i}
                        index={i}
                        total={n}
                        progress={scrollYProgress}
                        data={s}
                        showCta={i === 0 || i === n - 1}
                        ctaLabel={ctaLabel}
                        ctaLink={ctaLink}
                        accent={accent}
                        cream={cream}
                        cocoa={cocoa}
                        isCanvas={isCanvas}
                        headlineFont={props.headlineFont}
                        bodyFont={props.bodyFont}
                        bakeryName={bakeryName}
                    />
                ))}
                <Flour progress={scrollYProgress} peak={Math.min(n - 1, Math.max(0, flourScene - 1))} total={n} cream={butter} />
                <GrainOverlay show={showGrain} />
            </div>
        </div>
    )
}

ScrollBakery.defaultProps = {
    bakeryName: "M's Sweet Corner",
    heroText: "Baked fresh this morning",
    heroLine: "Warm loaves, buttery pastries and small-batch sweets, made by hand every day.",
    ctaLabel: "See the menu",
    ctaLink: "#menu",
    sceneCount: 6,
    scrollPerScene: 110,
    flourScene: 3,
    showGrain: true,
    accent: palette.caramel,
    cream: palette.cream,
    cocoa: palette.cocoa,
    butter: palette.butter,
    staticBreakpoint: 809,
    scenes: [
        { headline: "Baked fresh this morning", line: "Step inside: the warmth reaches you first." },
        { headline: "The oven glow", line: "Stone-fired at dawn, one small batch at a time." },
        { headline: "Flour in the air", line: "Real butter, slow dough, nothing hurried." },
        { headline: "Fresh loaves on the counter", line: "Still warm when they reach your hands." },
        { headline: "Cakes, cookies and macarons", line: "The display case, filled before opening." },
        { headline: "Come taste the morning", line: "Order ahead or drop by. Something is always cooling." },
    ],
    width: 1200,
    height: 800,
}

addPropertyControls(ScrollBakery, {
    bakeryName: { type: ControlType.String, title: "Bakery name", defaultValue: "M's Sweet Corner" },
    heroText: { type: ControlType.String, title: "Hero text", defaultValue: "Baked fresh this morning" },
    heroLine: { type: ControlType.String, title: "Hero line", displayTextArea: true },
    ctaLabel: { type: ControlType.String, title: "Button label", defaultValue: "See the menu" },
    ctaLink: { type: ControlType.String, title: "Button link", defaultValue: "#menu", description: "Anchor id of the Menu section, e.g. #menu" },
    sceneCount: { type: ControlType.Number, title: "Scenes", min: 3, max: 6, step: 1, displaySteppers: true, defaultValue: 6 },
    scenes: {
        type: ControlType.Array,
        title: "Scenes",
        maxCount: 6,
        description: "REPLACE the images below with your own bakery photos (or video stills), in order: entrance, oven, flour, counter, display case, finale.",
        control: {
            type: ControlType.Object,
            controls: {
                headline: { type: ControlType.String, title: "Headline" },
                line: { type: ControlType.String, title: "Short line" },
                image: { type: ControlType.ResponsiveImage, title: "Image (replace me)" },
                alt: { type: ControlType.String, title: "Alt text", description: "Describe the photo for screen readers." },
            },
        },
    },
    scrollPerScene: { type: ControlType.Number, title: "Scroll / scene", min: 60, max: 200, step: 5, unit: "vh", defaultValue: 110 },
    flourScene: { type: ControlType.Number, title: "Flour scene #", min: 1, max: 6, step: 1, displaySteppers: true, defaultValue: 3 },
    showGrain: { type: ControlType.Boolean, title: "Show grain", defaultValue: true },
    accent: { type: ControlType.Color, title: "Accent", defaultValue: palette.caramel },
    cream: { type: ControlType.Color, title: "Cream", defaultValue: palette.cream },
    cocoa: { type: ControlType.Color, title: "Cocoa", defaultValue: palette.cocoa },
    butter: { type: ControlType.Color, title: "Butter", defaultValue: palette.butter },
    headlineFont: { type: ControlType.Font, title: "Headline font", controls: "extended", defaultFontType: "serif" },
    bodyFont: { type: ControlType.Font, title: "Body font", controls: "extended", defaultFontType: "sans-serif" },
    staticBreakpoint: {
        type: ControlType.Number,
        title: "Static below",
        min: 0,
        max: 1200,
        step: 1,
        unit: "px",
        defaultValue: 809,
        description: "Below this width (and for reduced-motion users) a simple stacked layout is shown.",
    },
})
