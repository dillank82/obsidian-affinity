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
      .filter(item => item.filePath == filePath && item.el.isConnected)
      .sort((a, b) => a.pos - b.pos)

    console.log('[widgetRegistry.focusNext]', {
      filePath,
      currentFile,
      currentIndex,
      registrySize: registry.size,
      allFilePaths: [...registry.values()].map(i => i.filePath),
      filteredCount: list.length,
    })

    if (list.length === 0) {
      if (attempt < 5) setTimeout(() => focusWithRetry(filePath, attempt + 1), 100)
      return
    }

    currentIndex = filePath === currentFile ? (currentIndex + 1) % list.length : 0
    currentFile = filePath

    const target = list[currentIndex]

    console.log('[widgetRegistry.focusNext] target', {
      targetId: [...registry.entries()].find(([, v]) => v === target)?.[0],
      targetPos: target?.pos,
      elConnected: target?.el.isConnected,
      el: target?.el
    })

    target?.el.scrollIntoView({ block: 'center', behavior: 'smooth' })
    target?.el.focus()
  }