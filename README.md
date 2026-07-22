# Affinity
Obsidian plugin for dynamic relationships tracking. It's primarily intended for TTRPG Game Masters, mainly in D&D-like systems.

## Preview
<img width="1920" height="1037" alt="image" src="https://github.com/user-attachments/assets/ed12ba26-3fbd-4fb3-9ad9-260e8e2e0211" />
<img width="1920" height="1041" alt="image" src="https://github.com/user-attachments/assets/7e0e2591-d27e-45c1-84e6-31adb5172bd4" />

## Status
The project is paused mid-refactor on a dedicated branch. At the point of pausing, one test was failing; the cause is understood but not yet addressed. The main branch remains in a stable, tested state and reflects the architecture and decisions described below. Remaining work toward a beta release is tracked in the TODO list.

## Motivation
In the context of TTRPGs, relationship tracking often falls into one of two extremes: either unstructured free-form note-taking (which is flexible, but difficult to analyze over long campaigns) or oversimplified, abstract sliders (which are good only for simple game systems, but lack narrative context).
Affinity bridges this gap by applying a structured psychological model to narrative dynamics. It's designed for long narrative-heavy campaigns where relationships are a dynamic plot element that requires analysis and tracking of changes over time.

## Tech stack
Core: Typescript, React
Testing: Jest, RTL
State management: Zustand
Data integrity: Zod

## Challenges and Decisions

### Synchronization of Zustand State with React Lifecycle

#### Problem
During early implementation, store state was accessed directly via the store API. By accessing the store directly the components were failing to subscribe to state changes. React remained unaware of the mutations, as there was no trigger to re-render UI components. Using constaint arrays in menus also made them non-reactive.

#### Decision
Store integration was refactored to component use store hook, not API.
Implemented slice structure to store (characters, relationships, history).

### Type Safety in Dynamic Hook

#### Problem
The custom hook-orchestrator returned varying structures. Initial implementation had simple interface with optional labels, that forcing to use multi-conditional in main component.

#### Decision
Implemented Discriminated Unions for the return types of the hook. Status introduced as a discriminator. After that Typescript could infer the shape of data based on the current state with high precision.

### Managing Pre-loaded Plugin State

#### Problem
Plugin needed to persist last selected character ID within a MarkDownCodeBlockProcessor to maintain state across Obsidian reloads.
This requires complex methods of note content managing and preventing issues from manual user edits. But storing this in the global store would have caused:
1) **State Pollution:** Global business logic being coupled with transient UI layout data.
2) **Dangling References:** Complexity in tracking and clearing "dead" data from the global store when user deletes a note or code block.

#### Decision
Last selected character and code block IDs encapsulated locally as block-level parameters within MarkDown code block (instance of plugin). Implemented a graceful degradation approach so the plugin tolerates malformed blocks without crashing.

### UI Components in the Obsidian Ecosystem

#### Problem
Initially, the menu components were designed using Radix UI, but critical weaknesses of this approach compared to native Obsidian classes were identified:
- **The Portal Issue:** Using React Portals for modals/menus from Radix-like libraries often creates "DOM isolation" issues. Obsidian relies on specific DOM structures to manage focus, modal closing, and hotkey capturing. Portals frequently break event propagation and trigger premature "click-outside" handlers or conflicts with the host application's z-index stack.
- **Consistency:** Native Obsidian UI provides built-in a11y and keyboard navigation that matches the user's workflow perfectly.

#### Decision
Prioritized native Obsidian API over standard Radix UI implementation

### Locating and Identifying Code Blocks in Notes (in Editor Mode)

#### Problem
The plugin needed a reliable way to find a specific code block within a note's content by its ID — both to render the correct widget in Live Preview and to update block-level parameters on state changes.

The first approach used regular expressions to scan the note's raw text. This immediately split into a secondary decision: whether to build a RegExp object (requiring manual escaping of special characters in the ID) or to iterate matches and compare with `.includes()`. Both worked, but regex-based scanning proved fragile — it had no real understanding of Markdown structure, so it was prone to false positives on structurally similar content and broke on edge cases in block formatting.

To get a structure-aware alternative, the next attempt used `markdownLanguage.parser.parse()` directly to obtain a parse tree with readable node names. This solved the reliability problem but was too expensive to run repeatedly — parsing the full document on every lookup was not viable for a plugin reacting to editor state changes.

Switching to CodeMirror's built-in `syntaxTree()` function avoided the cost of parsing, but introduced a new problem: the standard Lezer node type names in Obsidian's syntax tree were unreadable, and the composite nodes of a code block had no common parent other than the document.

Additionally, an early assumption was that Obsidian's native block ID (`^block-id`) could be used to identify code blocks programmatically. This turned out to be incorrect — the native block ID is an editor-level tool intended for internal note linking and is not exposed or reliable enough for use as a stable, code-accessible identifier.

#### Decision
A custom iterator function for blocks of affinity code has been implemented using `tree.iterate()` in the State Iterator pattern. The function walks the syntax tree, tracks the opening node of a code block, and — once the following closing node is found — computes the combined range as the block's boundaries. The extracted data is then passed to a callback supplied by the caller, keeping the traversal logic decoupled from what's done with the result.

Block identification itself was implemented as yaml field value inside code block data.

## TODO

### Beta-Release

#### Main features and improvements
- Remake findBlockRangesApp: current implementation is fragile and causes tests fail (The proposed solution is to use third-party libraries to parse text into a classic AST, in order to work with it in a manner similar to the implementation in edit mode).
- Improve create-code-block command: implement widget insertion in reading mode.
- Add focus command for plugin to implement keyboard navigation since the built-in tab skips widgets.
- Clear main.ts: remove everything from the file except the plugin loading.
- Clear plugin file from dead relations.

#### Minor improvements
- Remove unused processor declaration in plugin class.
- Remove optionality for cause field in CauseInputProps interface.
- Add key to map items in HistoryWorkspace component.
- Improve the header layout, in particular, align the placement and size of the buttons.
- Replace deprecated compiler options in tsconfig.

#### Verification
- Make sure all components have the proper cursor style.
- Make sure that tabs don't break code blocks.

### Next Improvements
- Use fuzzy modal to select directory, character.
- Show parent directories (until first difference) for characters with similar names in selectors.
- Refactor useAffinity for readability and maintainability.
- Add sorting changes history by order.
- Visually adjust scroll in changes history.
- Implement history logs deleting/editing.
- Implement history logs order editing.
- Extract ChangeAffinityForm control logic to a hook.
- Refactor (shorten) ChangeAffinityForm test.
- Fix menus sticking when scrolling.
- Extract LogItem repeating li tags into a component.
- Extract StatChanger repeating button groups into a component.
- Instant focus on inserted widget.
