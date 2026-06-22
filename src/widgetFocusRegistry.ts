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

  focusNext: (filePath: string) => {
    const list = [...registry.values()]
      .filter(item => item.filePath == filePath)
      .sort((a, b) => a.pos - b.pos)
    if (list.length === 0) return

    currentIndex = filePath === currentFile ? (currentIndex + 1) % list.length : 0
    currentFile = filePath

    const target = list[currentIndex]
    target?.el.scrollIntoView({ block: 'center', behavior: 'smooth' })
    requestAnimationFrame(() => {
      target?.el.focus()
    })
  }
}