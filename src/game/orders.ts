// =====================================================================
//  GAME / ORDERS — pure logic, no DOM
// =====================================================================

import { ORDER_POOLS } from '../data.ts'
import { G, type GameState, type Order } from '../state.ts'
import { getLevelCfg } from '../state.ts'

/** Creates a new random order based on the current level config. */
export function makeOrder(state: GameState): Order {
  const cfg = getLevelCfg()
  const pool = ORDER_POOLS[cfg.pool]
  const tmpl = pool[Math.floor(Math.random() * pool.length)]
  return {
    id: state.nextOId++,
    label: tmpl.label,
    coins: tmpl.coins,
    items: tmpl.items.map(([cat, lvl]) => ({ cat, lvl })),
  }
}

/** Fills orders up to maxOrders for the current level. Mutates state.orders. */
export function fillOrders(state: GameState): void {
  const cfg = getLevelCfg()
  while (state.orders.length < cfg.maxOrders) {
    state.orders.push(makeOrder(state))
  }
}

/** Returns an array of [r, c] positions for each item in the order,
 *  or null if any item cannot be matched in the grid. */
export function getOrderPositions(
  state: GameState,
  order: Order,
): [number, number][] | null {
  const taken = new Set<number>()
  const out: [number, number][] = []

  for (const item of order.items) {
    let found = false
    for (let r = 0; r < G && !found; r++) {
      for (let c = 0; c < G && !found; c++) {
        const key = r * G + c
        const cell = state.grid[r][c]
        if (
          cell &&
          cell.cat === item.cat &&
          cell.lvl === item.lvl &&
          !taken.has(key)
        ) {
          taken.add(key)
          out.push([r, c])
          found = true
        }
      }
    }
    if (!found) return null
  }

  return out
}
