// =====================================================================
//  UI / SPAWNERS — builds the spawner button DOM
// =====================================================================

import { SPAWNER_DEFS, CHAINS } from '../data.ts'

/** Builds spawner buttons into #spawners-row.
 *  @param onSpawn - callback called with the cat string when a button is tapped */
export function buildSpawnerButtons(onSpawn: (cat: string) => void): void {
  const row = document.getElementById('spawners-row') as HTMLElement
  row.innerHTML = ''

  SPAWNER_DEFS.forEach(sp => {
    const btn = document.createElement('div')
    btn.className = 'spawner-btn'
    btn.innerHTML =
      `<div class="spawner-icon">${sp.icon}</div>` +
      `<div class="spawner-name">${sp.name}</div>` +
      `<div class="spawner-gives">${CHAINS[sp.cat][0].emoji}</div>`
    btn.addEventListener('click', () => onSpawn(sp.cat))
    row.appendChild(btn)
  })
}
