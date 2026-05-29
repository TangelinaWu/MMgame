// =====================================================================
//  UI / STATIONS — DOM rendering for cooking stations
// =====================================================================

import { STATION_DEFS, RECIPES, emo } from '../data.ts'
import { state } from '../state.ts'
import { getMatchingRecipe } from '../game/cooking.ts'

export function buildStationUI(
  onCook: (stationId: string) => void,
  onSlotTap: (stationId: string, slotIdx: number) => void,
): void {
  const row = document.getElementById('stations-row') as HTMLElement
  row.innerHTML = ''

  for (const station of STATION_DEFS) {
    const card = document.createElement('div')
    card.className = 'station-card'
    card.dataset.stationId = station.id

    // Header
    const header = document.createElement('div')
    header.className = 'station-header'

    const icon = document.createElement('span')
    icon.className = 'station-icon'
    icon.textContent = station.icon

    const name = document.createElement('span')
    name.className = 'station-name'
    name.textContent = station.name

    header.append(icon, name)

    // Slots row
    const slotsRow = document.createElement('div')
    slotsRow.className = 'station-slots'

    for (let i = 0; i < 2; i++) {
      const slot = document.createElement('div')
      slot.className = 'station-slot'
      slot.dataset.stationId = station.id
      slot.dataset.slotIdx = String(i)
      slot.textContent = '+'
      slot.addEventListener('pointerdown', (e) => {
        e.stopPropagation()
      })
      slot.addEventListener('click', (e) => {
        e.stopPropagation()
        onSlotTap(station.id, i)
      })
      slotsRow.appendChild(slot)

      if (i === 0) {
        const join = document.createElement('span')
        join.className = 'station-join'
        join.textContent = '+'
        slotsRow.appendChild(join)
      }
    }

    // Cook button
    const cookBtn = document.createElement('button')
    cookBtn.className = 'station-cook-btn'
    cookBtn.textContent = '👨‍🍳 Cook!'
    cookBtn.dataset.stationId = station.id
    cookBtn.addEventListener('pointerdown', (e) => e.stopPropagation())
    cookBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      onCook(station.id)
    })

    // Recipes hints
    const recipesDiv = document.createElement('div')
    recipesDiv.className = 'station-recipes'

    const stationRecipes = RECIPES.filter(r => r.stationId === station.id)
    for (const recipe of stationRecipes) {
      const hint = document.createElement('div')
      hint.className = 'station-recipe-hint'
      const ing1Emoji = emo(recipe.ing1.cat, recipe.ing1.lvl)
      const ing2Emoji = emo(recipe.ing2.cat, recipe.ing2.lvl)
      const resultEmoji = emo(recipe.result, 1)
      hint.textContent = `${ing1Emoji}+${ing2Emoji}→${resultEmoji}`
      recipesDiv.appendChild(hint)
    }

    card.append(header, slotsRow, cookBtn, recipesDiv)
    row.appendChild(card)
  }
}

export function renderStations(): void {
  for (const station of STATION_DEFS) {
    const card = document.querySelector<HTMLElement>(`.station-card[data-station-id="${station.id}"]`)
    if (!card) continue

    const slots = state.stationSlots[station.id]
    const slotEls = card.querySelectorAll<HTMLElement>('.station-slot')
    const cookBtn = card.querySelector<HTMLElement>('.station-cook-btn')

    slotEls.forEach((slotEl, i) => {
      const item = slots[i]
      if (item) {
        slotEl.textContent = emo(item.cat, item.lvl)
        slotEl.classList.add('has-item')
      } else {
        slotEl.textContent = '+'
        slotEl.classList.remove('has-item')
      }
    })

    // Show/hide cook button and has-recipe class
    const [s0, s1] = slots
    const hasRecipe = !!(s0 && s1 && getMatchingRecipe(station.id, s0, s1))

    if (cookBtn) {
      cookBtn.style.display = hasRecipe ? 'block' : 'none'
    }

    if (hasRecipe) {
      card.classList.add('has-recipe')
    } else {
      card.classList.remove('has-recipe')
    }
  }
}
