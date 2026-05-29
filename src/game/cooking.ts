// =====================================================================
//  GAME / COOKING — station logic, no DOM
// =====================================================================

import { RECIPES } from '../data.ts'
import type { GridItem, GameState } from '../state.ts'

export function getMatchingRecipe(stationId: string, s0: GridItem, s1: GridItem): string | null {
  for (const r of RECIPES) {
    if (r.stationId !== stationId) continue
    const fwd = r.ing1.cat === s0.cat && r.ing1.lvl === s0.lvl && r.ing2.cat === s1.cat && r.ing2.lvl === s1.lvl
    const rev = r.ing1.cat === s1.cat && r.ing1.lvl === s1.lvl && r.ing2.cat === s0.cat && r.ing2.lvl === s0.lvl
    if (fwd || rev) return r.result
  }
  return null
}

export function cookAtStation(state: GameState, stationId: string): string | null {
  const slots = state.stationSlots[stationId]
  const [s0, s1] = slots
  if (!s0 || !s1) return null
  const result = getMatchingRecipe(stationId, s0, s1)
  if (!result) return null
  state.stationSlots[stationId] = [null, null]
  return result
}
