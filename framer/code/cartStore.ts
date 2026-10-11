import { useSyncExternalStore } from "react"

/**
 * Tiny shared cart used by ProductCard, CartButton and CartPanel.
 * Because every component imports this one module, they share state.
 *
 * Persists to localStorage. This is a LOCAL cart only; see CartPanel.tsx
 * (`handleCheckout`) for where to connect a payment provider.
 */
export type CartItem = {
    id: string
    name: string
    price: number
    image?: string
    qty: number
}

type State = { items: CartItem[]; open: boolean; bump: number }

const KEY = "ms-sweet-corner-cart-v1"
const EMPTY: State = { items: [], open: false, bump: 0 }

let state: State = EMPTY
let hydrated = false
const listeners = new Set<() => void>()

function hydrate() {
    if (hydrated || typeof window === "undefined") return
    hydrated = true
    try {
        const raw = window.localStorage.getItem(KEY)
        if (raw) {
            const items = JSON.parse(raw)
            if (Array.isArray(items)) state = { ...state, items }
        }
    } catch {
        /* storage unavailable: run in memory */
    }
}

function commit(next: State) {
    state = next
    try {
        window.localStorage.setItem(KEY, JSON.stringify(state.items))
    } catch {
        /* ignore */
    }
    listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
    hydrate()
    listeners.add(listener)
    // hydrate() may have changed state after first render
    listener()
    return () => listeners.delete(listener)
}

export const cart = {
    add(item: Omit<CartItem, "qty">) {
        hydrate()
        const found = state.items.find((i) => i.id === item.id)
        const items = found
            ? state.items.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i))
            : [...state.items, { ...item, qty: 1 }]
        commit({ ...state, items, bump: state.bump + 1 })
    },
    setQty(id: string, qty: number) {
        const items =
            qty <= 0
                ? state.items.filter((i) => i.id !== id)
                : state.items.map((i) => (i.id === id ? { ...i, qty } : i))
        commit({ ...state, items })
    },
    remove(id: string) {
        commit({ ...state, items: state.items.filter((i) => i.id !== id) })
    },
    clear() {
        commit({ ...state, items: [] })
    },
    open() {
        commit({ ...state, open: true })
    },
    close() {
        commit({ ...state, open: false })
    },
}

export function useCart() {
    const s = useSyncExternalStore(subscribe, () => state, () => EMPTY)
    const count = s.items.reduce((n, i) => n + i.qty, 0)
    const subtotal = s.items.reduce((n, i) => n + i.qty * i.price, 0)
    return { ...s, count, subtotal }
}
