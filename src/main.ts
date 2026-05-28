// =====================================================================
//  MAIN — entry point, event handlers, game loop
// =====================================================================

import { emo, maxLvl, iname } from './data.ts'
import { G, state, mkGrid, getLevelCfg } from './state.ts'
import { firstEmpty, applyMerge, applyMove } from './game/grid.ts'
import { fillOrders, getOrderPositions } from './game/orders.ts'
import { showToast, floatScore, bumpCoins, animCell, spawnParticles } from './ui/fx.ts'
import {
  setRenderCallbacks,
  renderHeader,
  renderGrid,
  renderOrders,
  renderAll,
  resetLastDone,
} from './ui/render.ts'
import {
  showRecipe,
  closeRecipe,
  recipeOrderId,
  updateRecipeDeliverBtn,
  showLevelComplete,
  hideLevelComplete,
} from './ui/overlays.ts'
import { buildSpawnerButtons } from './ui/spawners.ts'

// ── Drag state ────────────────────────────────────────────────────────

type DragState = {
  fromR: number
  fromC: number
  item: { cat: string; lvl: number }
  startX: number
  startY: number
  isDragging: boolean
  overR: number | null
  overC: number | null
}

let drag: DragState | null = null

const DRAG_THRESHOLD = 7
const ghost = document.getElementById('drag-ghost') as HTMLElement

// ── Deliver ───────────────────────────────────────────────────────────

function handleDeliver(oid: number): void {
  const order = state.orders.find(o => o.id === oid)
  if (!order) return

  const positions = getOrderPositions(state, order)
  if (!positions) { showToast('Missing ingredients! 🍽️'); return }

  // 1. Remove order from state immediately
  const idx = state.orders.findIndex(o => o.id === oid)
  state.orders.splice(idx, 1)

  // 2. Remove items from grid, update score
  positions.forEach(([r, c]) => { state.grid[r][c] = null })
  state.coins += order.coins
  state.ordersCompleted++
  state.selected = null

  // 3. Visual feedback
  floatScore(`+${order.coins} 🪙`)
  showToast(`✅ ${order.label} delivered!`)
  bumpCoins()
  renderGrid()
  renderHeader()

  // 4. Animate card out
  const card = document.querySelector<HTMLElement>(`.order-card[data-oid="${oid}"]`)
  if (card) {
    card.classList.add('removing')
    card.addEventListener('animationend', () => {
      card.remove()
      afterCardRemoved()
    }, { once: true })
  } else {
    // Card wasn't in DOM (shouldn't happen), proceed immediately
    afterCardRemoved()
  }
}

function afterCardRemoved(): void {
  const cfg = getLevelCfg()
  if (state.ordersCompleted >= cfg.need) {
    setTimeout(() => showLevelComplete(), 200)
  } else {
    fillOrders(state)
    renderOrders()
  }
}

// ── Tap interaction ───────────────────────────────────────────────────

function handleTap(r: number, c: number): void {
  if (state.phase !== 'playing') return
  const item = state.grid[r][c]

  if (!state.selected) {
    if (!item) return
    state.selected = [r, c]
    renderGrid()
    return
  }

  const [sr, sc] = state.selected

  if (sr === r && sc === c) {
    state.selected = null
    renderGrid()
    return
  }

  const selItem = state.grid[sr][sc]

  if (!item) {
    // Move
    state.selected = null
    applyMove(state, sr, sc, r, c)
    setTimeout(() => animCell(r, c, 'anim-pop'), 0)
    renderAll()
    return
  }

  if (selItem && item.cat === selItem.cat && item.lvl === selItem.lvl) {
    // Merge
    state.selected = null
    const result = applyMerge(state, sr, sc, r, c)
    if (result) {
      showToast(`✨ ${iname(result.cat, result.newLvl)}!`)
      spawnParticles(r, c)
      setTimeout(() => animCell(r, c, 'anim-merge'), 0)
    }
    renderAll()
    return
  }

  // Re-select
  state.selected = [r, c]
  renderGrid()
}

// ── Drag interaction ──────────────────────────────────────────────────

function onCellPointerDown(e: PointerEvent, r: number, c: number): void {
  if (state.phase !== 'playing') return
  if (e.button !== undefined && e.button !== 0) return

  const item = state.grid[r][c]

  if (!item) {
    if (state.selected) {
      e.preventDefault()
      handleTap(r, c)
    }
    return
  }

  e.preventDefault()
  drag = {
    fromR: r, fromC: c, item,
    startX: e.clientX, startY: e.clientY,
    isDragging: false,
    overR: null, overC: null,
  }
}

function onDocPointerMove(e: PointerEvent): void {
  if (!drag) return

  const dx = e.clientX - drag.startX
  const dy = e.clientY - drag.startY

  if (!drag.isDragging) {
    if (Math.sqrt(dx * dx + dy * dy) < DRAG_THRESHOLD) return
    drag.isDragging = true
    state.selected = null

    ghost.textContent = emo(drag.item.cat, drag.item.lvl)
    ghost.style.display = 'block'

    const src = document.querySelector<HTMLElement>(
      `.cell[data-r="${drag.fromR}"][data-c="${drag.fromC}"]`,
    )
    if (src) src.classList.add('drag-source')
  }

  ghost.style.left = e.clientX + 'px'
  ghost.style.top  = e.clientY + 'px'

  const el = document.elementFromPoint(e.clientX, e.clientY)

  // Clear previous drop hints (cells + order cards)
  document.querySelectorAll<HTMLElement>('.cell.drop-move, .cell.drop-merge').forEach(c => {
    c.classList.remove('drop-move', 'drop-merge')
  })
  document.querySelectorAll<HTMLElement>('.order-card.drop-deliver').forEach(c => {
    c.classList.remove('drop-deliver')
  })

  drag.overR = null
  drag.overC = null

  // Check if hovering over an order card
  const orderTarget = (el as HTMLElement | null)?.closest<HTMLElement>('.order-card:not(.removing)')
  if (orderTarget) {
    const oid = Number(orderTarget.dataset.oid)
    const order = state.orders.find(o => o.id === oid)
    if (order && order.items.some(i => i.cat === drag!.item.cat && i.lvl === drag!.item.lvl)) {
      orderTarget.classList.add('drop-deliver')
    }
    e.preventDefault()
    return
  }

  // Check if hovering over a grid cell
  const target = (el as HTMLElement | null)?.closest<HTMLElement>('.cell')
  if (target) {
    const tr = +(target.dataset.r ?? 0)
    const tc = +(target.dataset.c ?? 0)
    if (!(tr === drag.fromR && tc === drag.fromC)) {
      drag.overR = tr
      drag.overC = tc
      const targetItem = state.grid[tr][tc]
      if (!targetItem) {
        target.classList.add('drop-move')
      } else if (
        targetItem.cat === drag.item.cat &&
        targetItem.lvl === drag.item.lvl &&
        drag.item.lvl < maxLvl(drag.item.cat)
      ) {
        target.classList.add('drop-merge')
      }
    }
  }

  e.preventDefault()
}

function onDocPointerUp(_e: PointerEvent): void {
  if (!drag) return

  const { fromR, fromC, isDragging, overR, overC, item } = drag

  ghost.style.display = 'none'
  document.querySelectorAll<HTMLElement>('.cell.drag-source, .cell.drop-move, .cell.drop-merge')
    .forEach(c => c.classList.remove('drag-source', 'drop-move', 'drop-merge'))

  // Capture and clear any order card drop target
  const deliverTarget = document.querySelector<HTMLElement>('.order-card.drop-deliver')
  document.querySelectorAll<HTMLElement>('.order-card.drop-deliver')
    .forEach(c => c.classList.remove('drop-deliver'))

  drag = null

  if (!isDragging) {
    handleTap(fromR, fromC)
    return
  }

  // Dropped onto an order card
  if (deliverTarget) {
    const oid = Number(deliverTarget.dataset.oid)
    const order = state.orders.find(o => o.id === oid)
    if (order && order.items.some(i => i.cat === item.cat && i.lvl === item.lvl)) {
      const positions = getOrderPositions(state, order)
      if (positions) {
        handleDeliver(oid)
      } else {
        showToast('Not all ingredients ready! 🍽️')
      }
    }
    return
  }

  if (overR === null || overC === null) return

  const targetItem = state.grid[overR][overC]

  if (!targetItem) {
    applyMove(state, fromR, fromC, overR, overC)
    setTimeout(() => animCell(overR, overC, 'anim-pop'), 0)
    renderAll()
  } else {
    const result = applyMerge(state, fromR, fromC, overR, overC)
    if (result) {
      showToast(`✨ ${iname(result.cat, result.newLvl)}!`)
      spawnParticles(overR, overC)
      setTimeout(() => animCell(overR, overC, 'anim-merge'), 0)
    } else {
      const src = state.grid[fromR][fromC]
      if (src) showToast(`${iname(src.cat, src.lvl)} is max level! ✨`)
    }
    renderAll()
  }
}

function cancelDrag(): void {
  if (!drag) return
  ghost.style.display = 'none'
  document.querySelectorAll<HTMLElement>('.cell.drag-source, .cell.drop-move, .cell.drop-merge')
    .forEach(c => c.classList.remove('drag-source', 'drop-move', 'drop-merge'))
  document.querySelectorAll<HTMLElement>('.order-card.drop-deliver')
    .forEach(c => c.classList.remove('drop-deliver'))
  drag = null
  renderGrid()
}

// ── Spawn ─────────────────────────────────────────────────────────────

function useSpawner(cat: string): void {
  if (state.phase !== 'playing') return
  const pos = firstEmpty(state)
  if (!pos) { showToast('Grid is full! 😅'); return }
  const [r, c] = pos
  state.grid[r][c] = { cat, lvl: 1 }
  renderGrid()
  renderOrders()
  setTimeout(() => animCell(r, c, 'anim-pop'), 0)
}

// ── Level flow ────────────────────────────────────────────────────────

function startGame(): void {
  state.phase = 'playing'
  resetLastDone()
  ;(document.getElementById('overlay-welcome') as HTMLElement).classList.remove('active')
  fillOrders(state)
  renderAll()
}

function startNextLevel(): void {
  state.level++
  state.ordersCompleted = 0
  state.orders          = []
  state.selected        = null
  state.grid            = mkGrid()
  state.phase           = 'playing'
  resetLastDone()
  hideLevelComplete()
  fillOrders(state)
  renderAll()
}

// ── Grid DOM build ────────────────────────────────────────────────────

function buildGrid(): void {
  const gridEl = document.getElementById('grid') as HTMLElement
  gridEl.innerHTML = ''
  for (let r = 0; r < G; r++) {
    for (let c = 0; c < G; c++) {
      const cell = document.createElement('div')
      cell.className  = 'cell'
      cell.dataset.r  = String(r)
      cell.dataset.c  = String(c)
      cell.addEventListener('pointerdown', (e) => onCellPointerDown(e, r, c), { passive: false })
      gridEl.appendChild(cell)
    }
  }
}

// ── Init ──────────────────────────────────────────────────────────────

function init(): void {
  // Wire render callbacks so render.ts can call deliver / recipe
  setRenderCallbacks({
    onDeliver:    (oid) => handleDeliver(oid),
    onShowRecipe: (order) => showRecipe(order),
  })

  buildGrid()
  buildSpawnerButtons(useSpawner)

  // Static button wiring
  document.getElementById('btn-start')!.addEventListener('click', startGame)
  document.getElementById('btn-next-level')!.addEventListener('click', startNextLevel)
  document.getElementById('btn-recipe-close')!.addEventListener('click', closeRecipe)
  document.getElementById('recipe-bg')!.addEventListener('click', closeRecipe)
  document.getElementById('btn-recipe-deliver')!.addEventListener('click', () => {
    // recipeOrderId is a live import — read from the module
    const oid = recipeOrderId
    if (oid !== null) {
      closeRecipe()
      handleDeliver(oid)
    }
  })

  // Global pointer listeners for drag
  document.addEventListener('pointermove',   onDocPointerMove,  { passive: false })
  document.addEventListener('pointerup',     onDocPointerUp)
  document.addEventListener('pointercancel', cancelDrag)

  renderAll()

  // Periodic order refill
  setInterval(() => {
    if (state.phase !== 'playing') return
    const cfg = getLevelCfg()
    if (state.orders.length < cfg.maxOrders) {
      fillOrders(state)
      renderOrders()
      renderHeader()
    }
  }, 8000)
}

init()
