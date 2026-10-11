import { chromium } from "playwright-core"
import { pathToFileURL } from "node:url"
import { readdirSync } from "node:fs"
const base = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers"
const dir = readdirSync(base).find(d => d.startsWith("chromium"))
const exe = process.env.CHROME || `${base}/${dir}/chrome-linux/chrome`
const url = pathToFileURL("dev/out/index.html").href
const b = await chromium.launch({ executablePath: exe })
const errs = []
async function page(opts) { const c = await b.newContext(opts); const p = await c.newPage(); p.on("pageerror", e => errs.push(e.message)); p.on("console", m => m.type()==="error" && !m.text().includes("defaultProps") && errs.push(m.text())); await p.goto(url); await p.waitForTimeout(400); return p }

const d = await page({ viewport: { width: 1280, height: 800 } })
const total = await d.evaluate(() => document.querySelector("#top > div").offsetHeight)
console.log("scroll section height", total)
for (const [i, f] of [0, 0.2, 0.45, 0.7, 0.95].entries()) {
  await d.evaluate(y => window.scrollTo(0, y), f * (total - 800)); await d.waitForTimeout(250)
  await d.screenshot({ path: `dev/out/desk-${i}.png` })
}
await d.evaluate(() => document.querySelector("#menu").scrollIntoView()); await d.waitForTimeout(300)
const btn = d.getByRole("button", { name: "Add Brown Butter Cookie to cart" })
await btn.click(); await btn.click()
console.log("cart label:", await d.getByRole("button", { name: /Open cart/ }).getAttribute("aria-label"))
await d.keyboard.press("Tab"); // focus ring check
await d.screenshot({ path: "dev/out/menu.png" })
await d.getByRole("button", { name: /Open cart/ }).click(); await d.waitForTimeout(700)
console.log("dialog focus:", await d.evaluate(() => document.activeElement.getAttribute("aria-label")))
await d.screenshot({ path: "dev/out/cart.png" })
await d.getByRole("button", { name: "Increase quantity of Brown Butter Cookie" }).click()
console.log("subtotal text:", (await d.locator("footer", { hasText: "Subtotal" }).innerText()).replace(/\n/g," "))
await d.keyboard.press("Escape"); await d.waitForTimeout(600)
console.log("dialog after Esc:", await d.getByRole("dialog").count(), "| focus restored to:", await d.evaluate(() => document.activeElement.getAttribute("aria-label")||document.activeElement.tagName))
await d.reload(); await d.waitForTimeout(300)
console.log("persisted after reload:", await d.getByRole("button", { name: /Open cart/ }).getAttribute("aria-label"))
// empty state
await d.evaluate(() => localStorage.clear()); await d.reload(); await d.getByRole("button", { name: /Open cart/ }).click(); await d.waitForTimeout(700)
await d.screenshot({ path: "dev/out/cart-empty.png" })

const m = await page({ viewport: { width: 390, height: 844 } })
console.log("mobile has sticky section:", await m.evaluate(() => getComputedStyle(document.querySelector("#top > div > div") || document.body).position))
await m.screenshot({ path: "dev/out/mobile.png" })
const r = await page({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" })
console.log("reduced-motion #top height:", await r.evaluate(() => document.querySelector("#top").offsetHeight))
await r.screenshot({ path: "dev/out/reduced.png" })
const t = await page({ viewport: { width: 820, height: 1100 } })
await t.screenshot({ path: "dev/out/tablet.png" })
console.log("errors:", errs.length ? errs : "none")
await b.close()
