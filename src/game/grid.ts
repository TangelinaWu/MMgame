// =====================================================================
//  GAME / GRID — pure logic, no DOM
// =====================================================================

import { maxLvl } from '../data.ts'
import { G, type GameState, type GridItem } from '../state.ts'

export type MergeResult = {
  newLvl: number
  cat: string
}

/** Returns the [r, c] of the first empty cell (bottom-to-top, left-to-right),
 *  or null if the grid is full. */
export function firstEmpty(state: GameState): [number, number] | null {
  for (let r = G - 1; r >= 0; r--) {
    for (let c = 0; c < G; c++) {
      if (!state.grid[r][c]) return [r, c]
    }
  }
  return null
}

/** Returns whether two cells can merge. */
export function canMerge(src: GridItem, dst: GridItem): boolean {
  return src.cat === dst.cat && src.lvl === dst.lvl && src.lvl < maxLvl(src.cat)
}

/** Attempts a merge from (fromR, fromC) → (toR, toC).
 *  Mutates state.grid and returns MergeResult on success, null on failure. */
export function applyMerge(
  state: GameState,
  fromR: number, fromC: number,
  toR: number,   toC: number,
): MergeResult | null {
  const src = state.grid[fromR][fromC]
  if (!src) return null
  const dst = state.grid[toR][toC]
  if (!dst) return null
  if (!canMerge(src, dst)) return null

  const newLvl = src.lvl + 1
  state.grid[fromR][fromC] = null
  state.grid[toR][toC] = { cat: src.cat, lvl: newLvl }

  return { newLvl, cat: src.cat }
}

/** Moves the item at (fromR, fromC) to (toR, toC).
 *  Assumes destination is empty. Mutates state.grid. */
export function applyMove(
  state: GameState,
  fromR: number, fromC: number,
  toR: number,   toC: number,
): void {
  state.grid[toR][toC] = state.grid[fromR][fromC]
  state.grid[fromR][fromC] = null
}
