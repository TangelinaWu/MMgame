// =====================================================================
//  UI / FX — DOM effects only, no game-state imports
// =====================================================================

let _toastT: ReturnType<typeof setTimeout> | undefined

export function showToast(msg: string): void {
  const t = document.getElementById('toast')!
  t.textContent = msg
  t.classList.add('show')
  clearTimeout(_toastT)
  _toastT = setTimeout(() => t.classList.remove('show'), 1900)
}

export function floatScore(txt: string): void {
  const el = document.createElement('div')
  el.className = 'float-score'
  el.textContent = txt
  document.body.appendChild(el)
  el.addEventListener('animationend', () => el.remove())
}

export function bumpCoins(): void {
  const el = document.getElementById('coins-badge')!
  el.classList.remove('coin-bump')
  void el.offsetWidth // force reflow
  el.classList.add('coin-bump')
  el.addEventListener('animationend', () => el.classList.remove('coin-bump'), { once: true })
}

export function animCell(r: number, c: number, cls: string): void {
  const inner = document.querySelector<HTMLElement>(
    `.cell[data-r="${r}"][data-c="${c}"] .cell-inner`,
  )
  if (!inner) return
  inner.classList.remove(cls)
  void inner.offsetWidth
  inner.classList.add(cls)
  inner.addEventListener('animationend', () => inner.classList.remove(cls), { once: true })
}

export function spawnParticles(r: number, c: number): void {
  const el = document.querySelector<HTMLElement>(`.cell[data-r="${r}"][data-c="${c}"]`)
  if (!el) return
  const rect = el.getBoundingClientRect()
  const cx = rect.left + rect.width  / 2
  const cy = rect.top  + rect.height / 2
  const emojis = ['✨', '⭐', '💫', '🌟']
  for (let i = 0; i < 5; i++) {
    const p = document.createElement('div')
    p.className = 'particle'
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)]
    const angle = Math.random() * Math.PI * 2
    const dist  = 40 + Math.random() * 40
    p.style.setProperty('--dx', `${Math.cos(angle) * dist}px`)
    p.style.setProperty('--dy', `${Math.sin(angle) * dist}px`)
    p.style.left         = cx + 'px'
    p.style.top          = cy + 'px'
    p.style.animationDelay = (Math.random() * 0.1) + 's'
    document.body.appendChild(p)
    p.addEventListener('animationend', () => p.remove())
  }
}
