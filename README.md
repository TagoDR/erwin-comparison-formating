# Erwin Compare Formatter

A specialized utility to transform raw Erwin Data Modeler HTML difference reports into a modern, searchable, and filterable interface.

## Features

- **Presence-Based Change Detection**: Categorizes changes (I, A, E) strictly by the presence of data on either side.
- **Advanced Filtering**:
  - **Show Properties**: Toggle metadata visibility (forces all objects to sync with the global state).
  - **Hide Calculated**: Removes identical objects (ON by default).
  - **Only Entities**: Focus view on top-level objects (Hides 'Model' container and resets overrides).
  - **Only Ent+Atr**: Focus on Entities and Attributes (Hides 'Model' and resets overrides).
- **High Performance**: Optimized data engine designed to handle large HTML reports (up to 50MB+).
- **NoSQL & Nested Fields Support**: Full support for hierarchical NoSQL structures (e.g., MongoDB, JSON-like data).
  - **Recursive Nesting**: Visualizes deeply nested fields with accurate indentation.
  - **Independent Interaction**: Properties (Left Click) and Sub-objects (Right Click) can be toggled independently at any nesting level.
- **Hierarchy Visualization**:
  - Structural guide using middle dots (`·`) for indentation levels.
  - **Type Hover**: Full type text visible on mouse hover when truncated.
- **UDP Awareness**: Automatic teal highlighting for **User Defined Properties** (UDP).
- **Smart Formatting**: Heuristics automatically format long properties (Description, Comments) with logical line breaks for better readability.
- **Dynamic Character Counter**:
  - **Red warning** threshold dynamically adjusts:
    - **50 chars** for Oracle, MySQL, Mongo, Postgres, and Hive.
    - **18 chars** for other databases.
- **Integrated Actions**:
  - **Flip Side**: Swap Work (Left) and Reference (Right) models globally.
  - **Batch Copy**: Export table name lists with a single click.
- **Robust Encoding Detection**: Handles legacy encodings (Windows-1252) common in regional Erwin exports.

## Installation and Usage

### 1. Standalone Application

A single-file HTML application that works offline.

- **Download:** [Download `Erwin_Complete_Compare_Formatter.html`](./dist/Erwin_Complete_Compare_Formatter.html?raw)
- **Usage:** Open and drag your Erwin HTML report onto the interface.

### 2. Tampermonkey Userscript

Automatically transforms Erwin reports opened in your browser.

- **Install:** [Install `erwin_complete_compare_formatter.user.js`](./dist/erwin_complete_compare_formatter.user.js?raw)
- **Note:** Enable "Allow access to file URLs" in Tampermonkey settings.

### 3. Web Component Library

Use as a reusable `<erwin-comparison-formatter>` in your own web applications.

- **Build:** `npm run build:lib`
- **Programmatic Usage:** Use the `.loadHtml(content, name)` method to feed data.

## Development

### Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Generates Standalone and Userscript outputs.
- `npm run build:lib`: Generates the reusable library bundle.
- `npm run gen:sample`: Regenerates test sample data.

### Internationalization (i18n)

The application uses **build-time i18n optimization**. The final bundle only contains translations for the detected system language of the build environment, or the language specified via `VITE_APP_LANG`.

```bash
# Build for a specific language
VITE_APP_LANG=en-US npm run build
```

## Technical Stack

- **Framework**: Lit + TypeScript
- **State**: Nanostores
- **UI**: Bootflat (Bootstrap 3)
- **Build**: Vite + vite-plugin-singlefile
