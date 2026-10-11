import { build } from "esbuild"
import { mkdirSync, writeFileSync } from "node:fs"
mkdirSync("dev/out", { recursive: true })
await build({
  entryPoints: ["dev/preview.tsx"], bundle: true, outfile: "dev/out/preview.js",
  alias: { framer: "./dev/framer-stub.tsx" }, jsx: "transform", loader: { ".tsx": "tsx" },
  define: { "process.env.NODE_ENV": '"development"' }, logLevel: "error",
})
writeFileSync("dev/out/index.html", `<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><body style="margin:0"><div id=root></div><script src=preview.js></script>`)
