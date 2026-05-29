// =====================================================================
//  DATA — no imports from our own code
// =====================================================================

export type ChainEntry = { emoji: string; name: string }
export type ChainMap = Record<string, ChainEntry[]>

// Each chain has 10 merge tiers. Emojis are unique across all chains.
export const CHAINS: ChainMap = {
  veggie: [
    { emoji: '🌱', name: 'Seed'           },
    { emoji: '🥦', name: 'Broccoli'       },
    { emoji: '🥗', name: 'Salad'          },
    { emoji: '🌿', name: 'Garden Bowl'    },
    { emoji: '🥬', name: 'Greens'         },
    { emoji: '🥑', name: 'Avocado'        },
    { emoji: '🫑', name: 'Pepper Mix'     },
    { emoji: '🌽', name: 'Corn Medley'    },
    { emoji: '🌮', name: 'Veggie Taco'    },
    { emoji: '🌯', name: 'Master Wrap'    },
  ],
  protein: [
    { emoji: '🥚', name: 'Egg'            },
    { emoji: '🍳', name: 'Fried Egg'      },
    { emoji: '🥘', name: 'Stew'           },
    { emoji: '🍖', name: 'Roast'          },
    { emoji: '🥩', name: 'Steak'          },
    { emoji: '🍗', name: 'Roast Chicken'  },
    { emoji: '🥓', name: 'Bacon'          },
    { emoji: '🌭', name: 'Sausage'        },
    { emoji: '🍱', name: 'Bento Box'      },
    { emoji: '🍣', name: 'Omakase'        },
  ],
  grain: [
    { emoji: '🌾', name: 'Wheat'          },
    { emoji: '🍞', name: 'Bread'          },
    { emoji: '🥪', name: 'Sandwich'       },
    { emoji: '🥐', name: 'Croissant'      },
    { emoji: '🥖', name: 'Baguette'       },
    { emoji: '🥨', name: 'Pretzel'        },
    { emoji: '🥯', name: 'Bagel'          },
    { emoji: '🧇', name: 'Waffle'         },
    { emoji: '🍕', name: 'Pizza'          },
    { emoji: '🥞', name: 'Grand Stack'    },
  ],
  sauce: [
    { emoji: '🍅', name: 'Tomato'         },
    { emoji: '🫙', name: 'Sauce Jar'      },
    { emoji: '🍝', name: 'Pasta'          },
    { emoji: '🍜', name: 'Ramen'          },
    { emoji: '🍲', name: 'Hot Pot'        },
    { emoji: '🍛', name: 'Curry'          },
    { emoji: '🌶️', name: 'Chili'          },
    { emoji: '🧄', name: 'Garlic Confit'  },
    { emoji: '🥣', name: 'Master Broth'   },
    { emoji: '🫕', name: 'Grand Fondue'   },
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
  // Pool 0 — Tutorial (Lv1 singles)
  [
    { label: 'Sprout Plate',   items: [['veggie', 1]],  coins: 8  },
    { label: 'Raw Egg',        items: [['protein', 1]], coins: 8  },
    { label: 'Wheat Stalk',    items: [['grain', 1]],   coins: 8  },
    { label: 'Fresh Tomato',   items: [['sauce', 1]],   coins: 8  },
  ],
  // Pool 1 — Easy (Lv2 singles)
  [
    { label: 'Veggie Plate',   items: [['veggie', 2]],  coins: 15 },
    { label: 'Egg Dish',       items: [['protein', 2]], coins: 15 },
    { label: 'Fresh Bread',    items: [['grain', 2]],   coins: 15 },
    { label: 'Sauce Cup',      items: [['sauce', 2]],   coins: 18 },
  ],
  // Pool 2 — Easy+ (Lv2 combos)
  [
    { label: 'Breakfast Bowl', items: [['veggie', 2],  ['protein', 2]],  coins: 32 },
    { label: 'Bread & Sauce',  items: [['grain', 2],   ['sauce', 2]],    coins: 32 },
    { label: 'Farmer Plate',   items: [['protein', 2], ['grain', 2]],    coins: 32 },
    { label: 'Garden Snack',   items: [['veggie', 2],  ['sauce', 2]],    coins: 32 },
  ],
  // Pool 3 — Medium (Lv3 singles)
  [
    { label: 'Garden Salad',   items: [['veggie', 3]],  coins: 40 },
    { label: 'Club Sandwich',  items: [['grain', 3]],   coins: 40 },
    { label: 'Pasta Bowl',     items: [['sauce', 3]],   coins: 45 },
    { label: 'Hearty Stew',    items: [['protein', 3]], coins: 45 },
  ],
  // Pool 4 — Medium+ (Lv3 combos)
  [
    { label: 'Veggie Sub',     items: [['veggie', 3],  ['grain', 2]],                coins: 58  },
    { label: 'Stew & Sauce',   items: [['protein', 3], ['sauce', 2]],                coins: 60  },
    { label: 'Triple Combo',   items: [['veggie', 2],  ['protein', 2], ['grain', 2]],coins: 55  },
    { label: 'Power Lunch',    items: [['protein', 3], ['veggie', 2]],               coins: 60  },
    { label: 'Chef Salad',     items: [['veggie', 3],  ['sauce', 3]],                coins: 75  },
    { label: 'Pasta Plate',    items: [['grain', 3],   ['sauce', 3]],                coins: 75  },
  ],
  // Pool 5 — Hard (Lv4 singles + Lv3 pairs)
  [
    { label: 'Garden Bowl',    items: [['veggie', 4]],                               coins: 80  },
    { label: 'Roast Plate',    items: [['protein', 4]],                              coins: 80  },
    { label: 'Croissant',      items: [['grain', 4]],                                coins: 80  },
    { label: 'Ramen',          items: [['sauce', 4]],                                coins: 80  },
    { label: 'Gourmet Salad',  items: [['veggie', 3],  ['protein', 3]],              coins: 90  },
    { label: 'Ramen Set',      items: [['grain', 4],   ['sauce', 2]],                coins: 95  },
    { label: 'Harvest Bowl',   items: [['veggie', 4],  ['grain', 2]],                coins: 95  },
  ],
  // Pool 6 — Very Hard (Lv4 combos, 3-item orders)
  [
    { label: 'Chef Special',   items: [['veggie', 3],  ['protein', 3], ['sauce', 2]],coins: 115 },
    { label: 'Grand Feast',    items: [['veggie', 4],  ['grain', 3],   ['sauce', 3]],coins: 140 },
    { label: 'Master Bowl',    items: [['protein', 4], ['sauce', 4]],                coins: 145 },
    { label: 'Ultimate Plate', items: [['veggie', 4],  ['protein', 4]],              coins: 150 },
    { label: 'Legendary Set',  items: [['grain', 4],   ['sauce', 4],   ['veggie', 3]],coins: 165},
    { label: 'Grand Omakase',  items: [['veggie', 4],  ['protein', 4], ['grain', 4]],coins: 200 },
  ],
  // Pool 7 — Master (Lv5 intro)
  [
    { label: 'Leafy Greens',   items: [['veggie', 5]],                               coins: 160 },
    { label: 'Prime Steak',    items: [['protein', 5]],                              coins: 160 },
    { label: 'Baguette',       items: [['grain', 5]],                                coins: 160 },
    { label: 'Hot Pot',        items: [['sauce', 5]],                                coins: 160 },
    { label: 'Steak & Greens', items: [['veggie', 4],  ['protein', 5]],              coins: 240 },
    { label: 'Bread & Pasta',  items: [['grain', 5],   ['sauce', 3]],                coins: 200 },
    { label: 'Harvest Feast',  items: [['veggie', 5],  ['grain', 4]],                coins: 240 },
    { label: 'Fusion Bowl',    items: [['protein', 4], ['sauce', 5]],                coins: 240 },
  ],
  // Pool 8 — Legend (Lv5 combos)
  [
    { label: 'Gourmet Bowl',   items: [['veggie', 5],  ['protein', 5]],              coins: 300 },
    { label: 'Grand Pasta',    items: [['grain', 5],   ['sauce', 5]],                coins: 300 },
    { label: 'Power Plate',    items: [['protein', 5], ['grain', 4]],                coins: 260 },
    { label: 'Master Combo',   items: [['veggie', 5],  ['sauce', 5]],                coins: 300 },
    { label: 'Triple Power',   items: [['veggie', 5],  ['protein', 4], ['grain', 4]],coins: 340 },
    { label: 'Chef Collection',items: [['grain', 5],   ['sauce', 4],   ['veggie', 3]],coins: 320},
    { label: 'Prestige Bento', items: [['protein', 5], ['veggie', 5],  ['sauce', 3]],coins: 380 },
  ],
  // Pool 9 — Apex / Supreme (Lv6 challenge)
  [
    { label: 'Avocado Dream',  items: [['veggie', 6]],                               coins: 320 },
    { label: 'Chicken Master', items: [['protein', 6]],                              coins: 320 },
    { label: 'Pretzel Royal',  items: [['grain', 6]],                                coins: 320 },
    { label: 'Curry Supreme',  items: [['sauce', 6]],                                coins: 320 },
    { label: 'Supreme Bowl',   items: [['veggie', 6],  ['protein', 5]],              coins: 480 },
    { label: 'Artisan Feast',  items: [['grain', 6],   ['sauce', 5]],                coins: 480 },
    { label: 'Legend Duo',     items: [['veggie', 6],  ['grain', 6]],                coins: 640 },
    { label: 'Grand Omakase II',items:[['protein', 6], ['veggie', 5], ['sauce', 4]], coins: 600 },
    { label: 'Ultimate Spread',items: [['veggie', 6],  ['protein', 6], ['grain', 5]],coins: 760 },
  ],
]

export type LevelCfg = {
  need: number
  maxOrders: number
  pool: number
  label: string
}

export const LEVEL_CFG: LevelCfg[] = [
  { need: 5,  maxOrders: 6,  pool: 0, label: 'Tutorial'     }, // Level 1
  { need: 6,  maxOrders: 6,  pool: 1, label: 'Easy'         }, // Level 2
  { need: 6,  maxOrders: 6,  pool: 2, label: 'Easy+'        }, // Level 3
  { need: 7,  maxOrders: 6,  pool: 3, label: 'Medium'       }, // Level 4
  { need: 7,  maxOrders: 7,  pool: 4, label: 'Medium+'      }, // Level 5
  { need: 8,  maxOrders: 7,  pool: 4, label: 'Medium+'      }, // Level 6
  { need: 8,  maxOrders: 7,  pool: 5, label: 'Hard'         }, // Level 7
  { need: 9,  maxOrders: 8,  pool: 5, label: 'Hard+'        }, // Level 8
  { need: 9,  maxOrders: 8,  pool: 6, label: 'Expert'       }, // Level 9
  { need: 10, maxOrders: 8,  pool: 6, label: 'Expert+'      }, // Level 10
  { need: 10, maxOrders: 8,  pool: 7, label: 'Master'       }, // Level 11
  { need: 11, maxOrders: 8,  pool: 7, label: 'Master+'      }, // Level 12
  { need: 11, maxOrders: 9,  pool: 8, label: 'Legend'       }, // Level 13
  { need: 12, maxOrders: 9,  pool: 8, label: 'Legend+'      }, // Level 14
  { need: 12, maxOrders: 9,  pool: 9, label: 'Grand Master' }, // Level 15
  { need: 13, maxOrders: 9,  pool: 9, label: 'Grand Master' }, // Level 16
  { need: 13, maxOrders: 10, pool: 9, label: 'Apex'         }, // Level 17
  { need: 14, maxOrders: 10, pool: 9, label: 'Apex+'        }, // Level 18
  { need: 14, maxOrders: 10, pool: 9, label: 'Supreme'      }, // Level 19
  { need: 15, maxOrders: 10, pool: 9, label: 'Ultimate'     }, // Level 20+
]

export const DIFFICULTY_LABELS = [
  'Beginner', 'Beginner', 'Easy',   'Easy',
  'Medium',   'Medium',   'Hard',   'Hard',
  'Expert',   'Expert',   'Master', 'Master',
  'Legend',   'Legend',   'Grand Master', 'Grand Master',
  'Apex',     'Apex',     'Supreme', 'Ultimate',
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
