// =====================================================================
//  UI / OVERLAYS
// =====================================================================

import { emo, iname, spawnerName, ORDER_POOLS } from '../data.ts'
import { state, getLevelCfg, getNextLevelCfg, type Order } from '../state.ts'
import { getOrderPositions } from '../game/orders.ts'
import { renderOrders } from './render.ts'

// recipeOrderId is exported so main.ts can reference it for the
// deliver button inside the recipe overlay
export let recipeOrderId: number | null = null

// ── Recipe overlay ────────────────────────────────────────────────────

export function showRecipe(order: Order): void {
  recipeOrderId = order.id

  ;(document.getElementById('recipe-order-name') as HTMLElement).textContent =
    `📋 ${order.label}`

  const content = document.getElementById('recipe-content') as HTMLElement
  content.innerHTML = ''

  order.items.forEach((item, idx) => {
    if (idx > 0) {
      const div = document.createElement('div')
      div.className = 'recipe-divider'
      content.appendChild(div)
    }

    const block = document.createElement('div')
    block.className = 'recipe-block'

    const hdr = document.createElement('div')
    hdr.className = 'recipe-block-hdr'
    hdr.innerHTML =
      `<span class="rh-goal">${emo(item.cat, item.lvl)}</span> ` +
      `${iname(item.cat, item.lvl)} needed`
    block.appendChild(hdr)

    if (item.lvl === 1) {
      const sp = document.createElement('div')
      sp.className   = 'recipe-spawn'
      sp.textContent = `Tap the ${spawnerName(item.cat)} spawner — no merging needed`
      block.appendChild(sp)
    } else {
      const spawnRow = document.createElement('div')
      spawnRow.className   = 'recipe-spawn'
      spawnRow.textContent =
        `Start: spawn ${emo(item.cat, 1)} ${iname(item.cat, 1)} ` +
        `from ${spawnerName(item.cat)} spawner`
      block.appendChild(spawnRow)

      for (let lvl = 1; lvl < item.lvl; lvl++) {
        const step = document.createElement('div')
        step.className = 'recipe-step'
        const isFinal = lvl + 1 === item.lvl
        step.innerHTML =
          `<span class="rs-from">${emo(item.cat, lvl)}</span>` +
          `<span class="rs-plus">+</span>` +
          `<span class="rs-from">${emo(item.cat, lvl)}</span>` +
          `<span class="rs-arrow">→</span>` +
          `<span class="rs-to">${emo(item.cat, lvl + 1)}</span>` +
          `<span class="rs-name">${iname(item.cat, lvl + 1)}</span>` +
          (isFinal ? `<span class="rs-final">✓ goal</span>` : '')
        block.appendChild(step)
      }
    }

    content.appendChild(block)
  })

  // Deliver button visibility
  const deliverBtn = document.getElementById('btn-recipe-deliver') as HTMLElement
  deliverBtn.style.display = getOrderPositions(state, order) ? 'block' : 'none'

  ;(document.getElementById('overlay-recipe') as HTMLElement).classList.add('active')
}

export function closeRecipe(): void {
  ;(document.getElementById('overlay-recipe') as HTMLElement).classList.remove('active')
  recipeOrderId = null
}

/** Call after deliver to update the in-recipe deliver button. */
export function updateRecipeDeliverBtn(orderId: number): void {
  if (recipeOrderId !== orderId) return
  const order = state.orders.find(o => o.id === orderId)
  const deliverBtn = document.getElementById('btn-recipe-deliver') as HTMLElement
  if (!order) {
    deliverBtn.style.display = 'none'
    return
  }
  deliverBtn.style.display = getOrderPositions(state, order) ? 'block' : 'none'
}

// ── Level Complete overlay ────────────────────────────────────────────

export function showLevelComplete(): void {
  state.phase = 'lvlcomplete'

  const nextLevel = state.level + 1
  const nc        = getNextLevelCfg()
  const c         = getLevelCfg()

  ;(document.getElementById('lvl-stars') as HTMLElement).textContent         = '⭐⭐⭐'
  ;(document.getElementById('lvl-complete-title') as HTMLElement).textContent = `Level ${state.level} Complete!`
  ;(document.getElementById('lvl-msg') as HTMLElement).textContent            = `You earned 🪙 ${state.coins} coins total!`
  ;(document.getElementById('next-lvl-num') as HTMLElement).textContent       = String(nextLevel)

  const preview    = document.getElementById('lvl-next-preview') as HTMLElement
  const poolSample = ORDER_POOLS[nc.pool]
  const maxItemLvl = poolSample.reduce(
    (mx, t) => Math.max(mx, ...t.items.map(([, l]) => l as number)),
    0,
  )
  const diffLabel  = nc.label
  const hints: string[] = []
  if      (maxItemLvl >= 6) hints.push('Lv6 ingredients — needs 31 merges each')
  else if (maxItemLvl >= 5) hints.push('Lv5 ingredients — needs 15 merges each')
  else if (maxItemLvl >= 4) hints.push('Lv4 ingredients — needs 7 merges each')
  else if (maxItemLvl >= 3) hints.push('Lv3 ingredients — needs 3 merges each')
  else if (maxItemLvl >= 2) hints.push('Lv2 ingredients — needs 1 merge each')
  else                      hints.push('Lv1 ingredients — just spawn!')

  if (nc.maxOrders > c.maxOrders)
    hints.push(`${nc.maxOrders} active orders (up from ${c.maxOrders})`)
  if (nc.need > c.need)
    hints.push(`${nc.need} orders to complete (up from ${c.need})`)

  preview.innerHTML =
    `<strong style="color:#fff">Level ${nextLevel}: ${diffLabel}</strong><br>` +
    hints.map(h => `• ${h}`).join('<br>')

  ;(document.getElementById('overlay-lvlcomplete') as HTMLElement).classList.add('active')
}

export function hideLevelComplete(): void {
  ;(document.getElementById('overlay-lvlcomplete') as HTMLElement).classList.remove('active')
}

// ── Welcome overlay ───────────────────────────────────────────────────

export function showWelcome(): void {
  ;(document.getElementById('overlay-welcome') as HTMLElement).classList.add('active')
}

export function hideWelcome(): void {
  ;(document.getElementById('overlay-welcome') as HTMLElement).classList.remove('active')
}
