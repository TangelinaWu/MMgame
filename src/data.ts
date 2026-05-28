// =====================================================================
//  DATA — no imports from our own code
// =====================================================================

export type ChainEntry = { emoji: string; name: string }
export type ChainMap = Record<string, ChainEntry[]>

export const CHAINS: ChainMap = {
  veggie: [
    { emoji: '🌱', name: 'Seed' },
    { emoji: '🥦', name: 'Broccoli' },
    { emoji: '🥗', name: 'Salad' },
    { emoji: '🌿', name: 'Garden Bowl' },
  ],
  protein: [
    { emoji: '🥚', name: 'Egg' },
    { emoji: '🍳', name: 'Fried Egg' },
    { emoji: '🥘', name: 'Stew' },
    { emoji: '🍖', name: 'Roast' },
  ],
  grain: [
    { emoji: '🌾', name: 'Wheat' },
    { emoji: '🍞', name: 'Bread' },
    { emoji: '🥪', name: 'Sandwich' },
    { emoji: '🥐', name: 'Croissant' },
  ],
  sauce: [
    { emoji: '🍅', name: 'Tomato' },
    { emoji: '🫙', name: 'Sauce' },
    { emoji: '🍝', name: 'Pasta' },
    { emoji: '🍜', name: 'Ramen' },
  ],
}

export type SpawnerDef = { cat: string; icon: string; name: string }

export const SPAWNER_DEFS: SpawnerDef[] = [
  { cat: 'veggie',  icon: '🌿', name: 'Veggie'  },
  { cat: 'protein', icon: '🥩', name: 'Protein' },
  { cat: 'grain',   icon: '🌾', name: 'Grain'   },
  { cat: 'sauce',   icon: '🍅', name: 'Sauce'   },
]

// [cat, lvl]
export type OrderItemTmpl = [string, number]

export type OrderTemplate = {
  label: string
  items: OrderItemTmpl[]
  coins: number
}

export const ORDER_POOLS: OrderTemplate[][] = [
  // Pool 0 — tutorial (Lv1 only, single ingredient)
  [
    { label: 'Sprout Plate',  items: [['veggie', 1]],  coins: 8  },
    { label: 'Raw Egg',       items: [['protein', 1]], coins: 8  },
    { label: 'Wheat Stalk',   items: [['grain', 1]],   coins: 8  },
    { label: 'Fresh Tomato',  items: [['sauce', 1]],   coins: 8  },
  ],
  // Pool 1 — easy (Lv2 single, simple merges)
  [
    { label: 'Veggie Plate',  items: [['veggie', 2]],              coins: 15 },
    { label: 'Egg Dish',      items: [['protein', 2]],             coins: 15 },
    { label: 'Fresh Bread',   items: [['grain', 2]],               coins: 15 },
    { label: 'Sauce Cup',     items: [['sauce', 2]],               coins: 18 },
  ],
  // Pool 2 — easy+ (Lv2 combos, 2 ingredients)
  [
    { label: 'Breakfast Bowl', items: [['veggie', 2], ['protein', 2]],  coins: 32 },
    { label: 'Bread & Sauce',  items: [['grain', 2],  ['sauce', 2]],    coins: 32 },
    { label: 'Farmer Plate',   items: [['protein', 2],['grain', 2]],    coins: 32 },
    { label: 'Garden Snack',   items: [['veggie', 2], ['sauce', 2]],    coins: 32 },
  ],
  // Pool 3 — medium (Lv3 single, 3 merges per item)
  [
    { label: 'Garden Salad',  items: [['veggie', 3]],  coins: 40 },
    { label: 'Club Sandwich', items: [['grain', 3]],   coins: 40 },
    { label: 'Pasta Bowl',    items: [['sauce', 3]],   coins: 45 },
    { label: 'Hearty Stew',   items: [['protein', 3]], coins: 45 },
  ],
  // Pool 4 — medium+ (Lv3 combos, Lv2 triples)
  [
    { label: 'Veggie Sub',    items: [['veggie', 3],  ['grain', 2]],               coins: 58 },
    { label: 'Stew & Sauce',  items: [['protein', 3], ['sauce', 2]],               coins: 60 },
    { label: 'Triple Combo',  items: [['veggie', 2],  ['protein', 2], ['grain', 2]], coins: 55 },
    { label: 'Power Lunch',   items: [['protein', 3], ['veggie', 2]],              coins: 60 },
    { label: 'Chef Salad',    items: [['veggie', 3],  ['sauce', 3]],               coins: 75 },
    { label: 'Pasta Plate',   items: [['grain', 3],   ['sauce', 3]],               coins: 75 },
  ],
  // Pool 5 — hard (Lv4 single, Lv3 pairs, 7+ merges)
  [
    { label: 'Garden Bowl',   items: [['veggie', 4]],                          coins: 80  },
    { label: 'Roast Plate',   items: [['protein', 4]],                         coins: 80  },
    { label: 'Croissant',     items: [['grain', 4]],                           coins: 80  },
    { label: 'Ramen',         items: [['sauce', 4]],                           coins: 80  },
    { label: 'Gourmet Salad', items: [['veggie', 3],  ['protein', 3]],         coins: 90  },
    { label: 'Ramen Set',     items: [['grain', 4],   ['sauce', 2]],           coins: 95  },
    { label: 'Harvest Bowl',  items: [['veggie', 4],  ['grain', 2]],           coins: 95  },
  ],
  // Pool 6 — very hard (Lv4 combos, 3-item orders)
  [
    { label: 'Chef Special',   items: [['veggie', 3],  ['protein', 3], ['sauce', 2]],  coins: 115 },
    { label: 'Grand Feast',    items: [['veggie', 4],  ['grain', 3],   ['sauce', 3]],  coins: 140 },
    { label: 'Master Bowl',    items: [['protein', 4], ['sauce', 4]],                  coins: 145 },
    { label: 'Ultimate Plate', items: [['veggie', 4],  ['protein', 4]],                coins: 150 },
    { label: 'Legendary Set',  items: [['grain', 4],   ['sauce', 4],   ['veggie', 3]], coins: 165 },
    { label: 'Grand Omakase',  items: [['veggie', 4],  ['protein', 4], ['grain', 4]],  coins: 200 },
  ],
]

export type LevelCfg = {
  need: number
  maxOrders: number
  pool: number
  label: string
}

export const LEVEL_CFG: LevelCfg[] = [
  { need: 2, maxOrders: 2, pool: 0, label: 'Tutorial' }, // Level 1  — Lv1 single
  { need: 3, maxOrders: 2, pool: 1, label: 'Easy'     }, // Level 2  — Lv2 single
  { need: 3, maxOrders: 2, pool: 2, label: 'Easy+'    }, // Level 3  — Lv2 combos
  { need: 4, maxOrders: 2, pool: 3, label: 'Medium'   }, // Level 4  — Lv3 single
  { need: 4, maxOrders: 3, pool: 4, label: 'Medium+'  }, // Level 5  — Lv3 combos
  { need: 5, maxOrders: 3, pool: 4, label: 'Medium+'  }, // Level 6  — Lv3 combos, more
  { need: 5, maxOrders: 3, pool: 5, label: 'Hard'     }, // Level 7  — Lv4 + Lv3 pairs
  { need: 6, maxOrders: 4, pool: 5, label: 'Hard+'    }, // Level 8  — Lv4 single, 4 slots
  { need: 6, maxOrders: 4, pool: 6, label: 'Expert'   }, // Level 9  — Lv4 combos
  { need: 7, maxOrders: 4, pool: 6, label: 'Master'   }, // Level 10+ — full complexity
]

// ── Helper functions ──────────────────────────────────────────────────

export function emo(cat: string, lvl: number): string {
  return CHAINS[cat][lvl - 1].emoji
}

export function iname(cat: string, lvl: number): string {
  return CHAINS[cat][lvl - 1].name
}

export function maxLvl(cat: string): number {
  return CHAINS[cat].length
}

export function spawnerName(cat: string): string {
  return SPAWNER_DEFS.find(s => s.cat === cat)?.name ?? cat
}
