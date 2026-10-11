// Dev-only stand-in for the "framer" package so components typecheck and render outside Framer.
export const ControlType: Record<string, string> = new Proxy({}, { get: (_, k) => String(k) })
export const RenderTarget = { canvas: "CANVAS", preview: "PREVIEW", current: () => "PREVIEW" }
export function addPropertyControls(_c: unknown, _p: unknown) {}
