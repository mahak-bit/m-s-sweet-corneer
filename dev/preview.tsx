import * as React from "react"
import { createRoot } from "react-dom/client"
import ScrollBakery from "../framer/code/ScrollBakery"
import GlassNavbar from "../framer/code/GlassNavbar"
import CartPanel from "../framer/code/CartPanel"
import ProductCard from "../framer/code/ProductCard"
import StoryReveal from "../framer/code/StoryReveal"
import CustomOrderForm from "../framer/code/CustomOrderForm"
import SiteFooter from "../framer/code/SiteFooter"

const items = [["Strawberry Celebration Cake","Cakes",38],["Brown Butter Cookie","Cookies",3.5],["Pistachio Macaron","Macarons",2.75]] as const
const D = (C: any, p: any = {}) => <C {...C.defaultProps} {...p} />

createRoot(document.getElementById("root")!).render(
  <div style={{ background: "#F7EFE3" }}>
    <div style={{ position: "fixed", top: 16, left: 0, right: 0, padding: "0 16px", zIndex: 50, maxWidth: 1100, margin: "0 auto" }}>{D(GlassNavbar)}</div>
    {D(CartPanel)}
    <div id="top">{D(ScrollBakery)}</div>
    <div id="menu" style={{ padding: "80px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 24, maxWidth: 1100, margin: "0 auto" }}>
      {items.map(([name, category, price]) => D(ProductCard, { key: name, name, category, price, productId: name }))}
    </div>
    <div id="story" style={{ padding: "40px 24px", maxWidth: 1100, margin: "0 auto" }}>{D(StoryReveal)}</div>
    <div id="custom" style={{ padding: "40px 24px", maxWidth: 700, margin: "0 auto" }}>{D(CustomOrderForm)}</div>
    <div id="visit" style={{ padding: "40px 24px", maxWidth: 1100, margin: "0 auto" }}>{D(SiteFooter)}</div>
  </div>
)
