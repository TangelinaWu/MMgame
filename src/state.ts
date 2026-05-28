// =====================================================================
//  STATE — imports only from data.ts
// =====================================================================

import { LEVEL_CFG, type LevelCfg } from './data.ts'

export const G = 8

export type GridItem = {
  cat: string
  lvl: number
}

export type OrderItem = {
  cat: string
  lvl: number
}

export type Order = {
  id: number
  label: string
  coins: number
  items: OrderItem[]
}

export type DragState = {
  fromR: number
  fromC: number
  item: GridItem
  startX: number
  startY: number
  isDragging: boolean
  overR: number | null
  overC: number | null
}

export type GamePhase = 'welcome' | 'playing' | 'lvlcomplete'

export type GameState = {
  level: number
  coins: number
  ordersCompleted: number
  orders: Order[]
  nextOId: number
  grid: (GridItem | null)[][]
  selected: [number, number] | null
  phase: GamePhase
}

export function mkGrid(): (GridItem | null)[][] {
  return Array.from({ length: G }, () => Array<GridItem | null>(G).fill(null))
}

export const state: GameState = {
  level: 1,
  coins: 0,
  ordersCompleted: 0,
  orders: [],
  nextOId: 0,
  grid: mkGrid(),
  selected: null,
  phase: 'welcome',
}

export function getLevelCfg(): LevelCfg {
  return LEVEL_CFG[Math.min(state.level - 1, LEVEL_CFG.length - 1)]
}

export function getNextLevelCfg(): LevelCfg {
  return LEVEL_CFG[Math.min(state.level, LEVEL_CFG.length - 1)]
}
