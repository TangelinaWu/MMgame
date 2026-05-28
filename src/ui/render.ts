// =====================================================================
//  UI / RENDER — DOM rendering
// =====================================================================

import { emo, iname, maxLvl } from '../data.ts'
import { G, state, getLevelCfg, type Order } from '../state.ts'
import { getOrderPositions } from '../game/orders.ts'

// ── Render callbacks ─────────────────────────────────────────────────

type RenderCallbacks = {
  onDeliver: (oid: number) => void
  onShowRecipe: (order: Order) => void
}

const _callbacks: RenderCallbacks = {
  onDeliver: () => { /* noop until set */ },
  onShowRecipe: () => { /* noop until set */ },
}

export function setRenderCallbacks(cb: RenderCallbacks): void {
  _callbacks.onDeliver  = cb.onDeliver
  _callbacks.onShowRecipe = cb.onShowRecipe
}

// ── Header ────────────────────────────────────────────────────────────

let _lastDone = 0

export function resetLastDone(): void {
  _lastDone = 0
}

export function renderHeader(): void {
  const c    = getLevelCfg()
  const done = Math.min(state.ordersCompleted, c.need)

  ;(document.getElementById('level-badge') as HTMLElement).textContent     = `Lv ${state.level}`
  ;(document.getElementById('progress-label') as HTMLElement).textContent  = `${done} / ${c.need} orders`
  ;(document.getElementById('coins-badge') as HTMLElement).textContent     = `🪙 ${state.coins}`

  const dotsEl      = document.getElementById('progress-dots') as HTMLElement
  const justCompleted = done > _lastDone ? done - 1 : -1
  _lastDone = done

  if (dotsEl.children.length !== c.need) {
    dotsEl.innerHTML = ''
    for (let i = 0; i < c.need; i++) {
      const d = document.createElement('div')
      d.className = 'pdot'
      dotsEl.appendChild(d)
    }
  }

  Array.from(dotsEl.children).forEach((d, i) => {
    const dot = d as HTMLElement
    dot.className = 'pdot' + (i < done ? ' done' : '')
    if (i === justCompleted) {
      dot.classList.add('just-done')
      dot.addEventListener('animationend', () => dot.classList.remove('just-done'), { once: true })
    }
  })
}

// ── Orders ────────────────────────────────────────────────────────────

export function renderOrders(): void {
  const con = document.getElementById('orders-container') as HTMLElement

  // Remove stale cards, but skip cards currently animating out
  con.querySelectorAll<HTMLElement>('.order-card').forEach(el => {
    if (el.classList.contains('removing')) return
    if (!state.orders.find(o => String(o.id) === el.dataset.oid)) el.remove()
  })

  state.orders.forEach(order => {
    const isReady = !!getOrderPositions(state, order)

    let card = con.querySelector<HTMLElement>(`.order-card[data-oid="${order.id}"]`)
    const isNew = !card

    if (!card) {
      card = buildOrderCard(order)
      con.appendChild(card)
    }

    // Apply appearing animation for new cards
    if (isNew) {
      card.classList.add('appearing')
      card.addEventListener('animationend', () => {
        card!.classList.remove('appearing')
      }, { once: true })
    }

    card.className = 'order-card' + (isReady ? ' ready' : '') + (isNew ? ' appearing' : '')

    // Update chip colours
    const chips = card.querySelectorAll<HTMLElement>('.order-item-chip')
    const taken = new Set<number>()
    order.items.forEach((item, idx) => {
      const chip = chips[idx]
      if (!chip) return
      let found = false
      for (let r = 0; r < G && !found; r++) {
        for (let c = 0; c < G && !found; c++) {
          const key  = r * G + c
          const cell = state.grid[r][c]
          if (cell && cell.cat === item.cat && cell.lvl === item.lvl && !taken.has(key)) {
            taken.add(key)
            found = true
          }
        }
      }
      chip.className = 'order-item-chip ' + (found ? 'found' : 'missing')
    })
  })
}

export function buildOrderCard(order: Order): HTMLElement {
  const card = document.createElement('div')
  card.className   = 'order-card'
  card.dataset.oid = String(order.id)

  const deliverBtn = document.createElement('button')
  deliverBtn.className   = 'order-deliver-btn'
  deliverBtn.textContent = 'Deliver!'
  deliverBtn.addEventListener('pointerdown', e => e.stopPropagation())
  deliverBtn.addEventListener('click', e => {
    e.stopPropagation()
    _callbacks.onDeliver(order.id)
  })

  const nameEl = document.createElement('div')
  nameEl.className   = 'order-name'
  nameEl.textContent = order.label

  const itemsRow = document.createElement('div')
  itemsRow.className = 'order-items-row'
  order.items.forEach(item => {
    const chip = document.createElement('div')
    chip.className   = 'order-item-chip missing'
    chip.textContent = emo(item.cat, item.lvl)
    chip.title       = `${iname(item.cat, item.lvl)} Lv${item.lvl}`
    itemsRow.appendChild(chip)
  })

  const reward = document.createElement('div')
  reward.className   = 'order-reward'
  reward.textContent = `🪙 ${order.coins}`

  const hint = document.createElement('div')
  hint.className   = 'order-info-hint'
  hint.textContent = 'tap for recipe'

  card.append(deliverBtn, nameEl, itemsRow, reward, hint)

  card.addEventListener('click', () => _callbacks.onShowRecipe(order))

  return card
}

// ── Grid ──────────────────────────────────────────────────────────────

export function renderGrid(): void {
  document.querySelectorAll<HTMLElement>('.cell').forEach(el => {
    const r    = +(el.dataset.r ?? 0)
    const c    = +(el.dataset.c ?? 0)
    const item = state.grid[r][c]

    const isSel = state.selected !== null &&
      state.selected[0] === r && state.selected[1] === c

    const selItem = state.selected
      ? state.grid[state.selected[0]][state.selected[1]]
      : null

    const isMergeHint =
      !isSel && item !== null && selItem !== null &&
      item.cat === selItem.cat &&
      item.lvl === selItem.lvl &&
      item.lvl < maxLvl(item.cat)

    // Preserve drag classes
    const hasDragSource = el.classList.contains('drag-source')
    const hasDropMove   = el.classList.contains('drop-move')
    const hasDropMerge  = el.classList.contains('drop-merge')

    el.className = [
      'cell',
      item          ? 'has-item'    : '',
      isSel         ? 'selected'    : '',
      isMergeHint   ? 'merge-hint'  : '',
      hasDragSource ? 'drag-source' : '',
      hasDropMove   ? 'drop-move'   : '',
      hasDropMerge  ? 'drop-merge'  : '',
    ].filter(Boolean).join(' ')

    if (item) {
      let inner = el.querySelector<HTMLElement>('.cell-inner')
      if (!inner) {
        inner = document.createElement('div')
        inner.className = 'cell-inner'
        el.appendChild(inner)
      }
      inner.innerHTML =
        `<span class="cell-emoji">${emo(item.cat, item.lvl)}</span>` +
        `<span class="cell-lvl">Lv${item.lvl}</span>`
    } else {
      el.innerHTML = ''
    }
  })
}

// ── All ───────────────────────────────────────────────────────────────

export function renderAll(): void {
  renderHeader()
  renderOrders()
  renderGrid()
}
