# Todo List & Detailed Plan

## 1. Dynamic Page Title for Userscript
- **Goal:** Set title to `${modelName} ${isoDate} (Comparison)` when running as a userscript.
- **Plan:**
    - In `src/main.ts`, update `_detectAndTransformUserscript`.
    - Extract the first row's `leftModel` or `rightModel` (Model Name).
    - Format current date as ISO (YYYY-MM-DD).
    - Update `document.title` and `fileName$` store.
    - the string "(Comparison)" at the end must be in the correct language

## 2. Copy Button Visual Feedback
- **Goal:** Transform copy icon to a checkmark temporarily.
- **Plan:**
    - In `src/components/app-table.ts`, add a `@state()` property `copiedId`.
    - In the copy click handler, set `this.copiedId = row.id`.
    - Use `setTimeout` to clear `this.copiedId` after 2 seconds.
    - In the template, conditionally render `icons.check` instead of `icons.copy` if `this.copiedId === row.id`.
    - Use color green for check mark

## 3. Flip Sides Functionality
- **Goal:** Swap Left and Right model columns globally.
- **Plan:**
    - **Store:** Add `isFlipped$` atom to `src/store/data.store.ts`.
    - **Header:** Add a "Flip" button in `src/components/app-header.ts` that toggles `isFlipped$`.
    - **Table:** In `src/components/app-table.ts`, when rendering rows, swap the display of `leftModel` and `rightModel` based on `isFlipped$`.
    - **Stats:** Ensure stats logic remains consistent (Addition vs Deletion also flips conceptually).

## 4. Persistent Table Header on Empty Filter
- **Goal:** Keep the `<thead>` visible even when search results are empty.
- **Plan:**
    - In `src/components/app-table.ts`, wrap the `tbody` rendering in a check.
    - Ensure the `<table>` and `<thead>` structure is outside the "empty" conditional logic.
    - Add a specific "No results found" row inside `<tbody>` if data is empty.

## 5. Fix "Copy Entity List" Button
- **Goal:** Repair the broken clipboard functionality for entity names.
- **Plan:**
    - Locate the button (likely in `app-stats.ts`).
    - Debug the click handler: ensure it accesses `enrichedData$`.
    - Filter rows where `prop === 'Ent'` and `isHeader` is true.
    - Extract the name (parsing `type: Name` or from the header text).
    - Use `navigator.clipboard.writeText` to copy the newline-separated list.

## 6. Character Length Counter Bubble
- **Goal:** Show length of 'name' fields with color-coding (Green <= 18, Red > 18).
- **Plan:**
    - In `src/components/app-table.ts`, identify rows where `row.type.toLowerCase().includes('name')`.
    - Calculate `length` of `leftModel` and `rightModel`.
    - Add a small circular badge (bubble) next to the text.
    - Apply CSS classes based on the length: `.len-ok` (green) or `.len-warn` (red).

## 7. Flatten the table appearance
- **Goal:** Improve the table appearance by removing 3d like effects
- **Plan:**
    - Update the CSS to make table closer to PureCSS base layout, preserving the current colors