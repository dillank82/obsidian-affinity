interface WidgetItem {
  el: HTMLElement
  filePath: string
  pos: number
}

let currentIndex = -1
let currentFile = ''

const registry = new Map<string, WidgetItem>()

export const widgetRegistry = {
  register: (id: string, item: WidgetItem) => registry.set(id, item),
  unregister: (id: string) => registry.delete(id),

  focusNext: (filePath: string) => focusWithRetry(filePath)
}

const focusWithRetry = (filePath: string, attempt: number = 0) => {
  const list = [...registry.values()]
    .filter(item => item.filePath === filePath && item.el.isConnected && isVisible(item.el))
    .sort((a, b) => a.pos - b.pos)
 
  if (list.length === 0) {
    if (attempt < 5) setTimeout(() => focusWithRetry(filePath, attempt + 1), 100)
    return
  }

  handleCycle(filePath, list.length)

  const target = list[currentIndex]
  applyFocus(target?.el)
}

const isVisible = (el: HTMLElement): boolean => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length)

const applyFocus = (el: HTMLElement | undefined) => {
  if (!el) return
  el.scrollIntoView({ block: 'center', behavior: 'smooth' })
  el.setAttribute('data-focused', 'true')
  el.addEventListener('blur', () => { el.removeAttribute('data-focused') }, { once: true })
  el.focus()
}

const handleCycle = (filePath: string, listLength: number) => {
  currentIndex = filePath === currentFile ? (currentIndex + 1) % listLength : 0
  currentFile = filePath
}