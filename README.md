# Affinity
Obsidian plugin for dynamic relationships tracking. It's primarily intended for TTRPG Game Masters, mainly in D&D-like systems.

## Motivation
In the context of TTRPGs, relationship tracking often falls into one of two extremes: either unstructured free-form note-taking (which is flexible, but difficult to analyze over long campaigns) or oversimplified, abstract sliders (which are good only for simple game systems, but lack narrative context).
Affinity bridges this gap by applying a structured psychological model to narrative dynamics. It's designed for long narrative-heavy campaigns where relationships are a dynamic plot element that requires analysis and tracking of changes over time.

## Tech stack
Core: Typescript, React
Testing: Jest, RTL
State management: Zustand
Data integrity: Zod

## Challenges and Decisions

### Synchronization of Zustand State with React Lyfecycle

#### Problem
During early implementation access to the store state was directly by store API. By accessing the store directly the components were failing to subscribe to state changes. React remained unaware of the mutations, as there was no trigger to re-render UI components.

#### Decision
Store integration was refactored to component use store hook, not API.

### Type Safety in Dynamic Hook

#### Problem
The custom hook-orchestrator returned varying structures. Initial implementation had simple interface with optional labels, that forcing to use multi-conditional in main component.

#### Decisions
Implemented Discriminated Unions for the return types of the hook. Status introduced as a discriminator. After that Typescript could infer the shape of data based on the current state with high precision.

### Managing Pre-loaded Plugin State

#### Problem
Plugin needed to persist last selected character ID within a MarkDownCodeBlockProcessor to mantain state across Obsidian reloads.
This requires complex methods of note content managing and preventing issues from manual user edits. But storing this in the global store would have caused:
1) **State Pollution:** Global business logic being coupled with transient UI layout data.
2) **Dangling References:** Complexity in tracking and clearing "dead" data from the global store when user deletes a note or code block.

#### Decision
Last selected character and code block IDs encapsulated locally as block-level parameters within MarkDown code block (instance of plugin). Implemented Graceful Degradation approach to ensure that plugin will handle malformed blocks gracefully

### UI Components in the Obsidian Ecosystem

#### Problem
Evaluated trade-off between using third-party UI libraries and native Obsidian classes.
- **The Portal Issue:** Using React Portals for modals/menus from Radix-like libraries often creates "DOM isolation" issues. Obsidian relies on specific DOM structures to manage focus, modal closing, and hotkey capturing. Portals frequently break event propagation and trigger premature "click-outside" handlers or conflicts with the host application's z-index stack.
- **Consistency:** Native Obsidian UI provides built-in a11y and keyboard navigation that matches the user's workflow perfectly.

#### Decisions
Prioritized native Obsidian API over standard Radix UI implementation