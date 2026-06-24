import { EditorView } from "@codemirror/view"
import { MarkdownViewModeType, Notice } from "obsidian"
import { iterateAffinityBlocks } from "utils/iterateAffinityBlocks"

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

  focusNext: (filePath: string, editor: EditorView, mode: MarkdownViewModeType) => {
    if (mode === 'preview') focusPreview(filePath)
    if (mode === 'source') focusSource(filePath, editor)
  }
}

const focusPreview = (filePath: string, attempt: number = 0) => {
  const list = [...registry.values()]
    .filter(item => item.filePath === filePath && item.el.isConnected && isVisible(item.el))
    .sort((a, b) => a.pos - b.pos)

  if (list.length === 0) {
    if (attempt < 5) setTimeout(() => focusPreview(filePath, attempt + 1), 100)
    return
  }

  handleCycle(filePath, list.length)

  const target = list[currentIndex]
  applyFocus(target?.el)
}

const focusSource = (filePath: string, editor: EditorView, attempt: number = 0) => {
  const allPositions: number[] = []
  iterateAffinityBlocks(editor.state, ({ from }) => allPositions.push(from))

  if (allPositions.length === 0) {
    if (attempt < 5) setTimeout(() => focusSource(filePath, editor, attempt + 1), 100)
    return
  }

  handleCycle(filePath, allPositions.length)

  const targetPos = allPositions[currentIndex]

  if (!targetPos) {
    new Notice('Error: focus target position is undefined')
    return
  }

  editor.dispatch({
    effects: EditorView.scrollIntoView(targetPos, { y: 'end' })
  })

  requestAnimationFrame(() => {
    const list = [...registry.values()]
      .filter(item => item.filePath === filePath && item.el.isConnected && isVisible(item.el))
      .sort((a, b) => a.pos - b.pos)

    if (list.length === 0) {
      if (attempt < 5) setTimeout(() => focusSource(filePath, editor, attempt + 1), 100)
      return
    }
    const target = list[currentIndex]
    applyFocus(target?.el)
  })
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