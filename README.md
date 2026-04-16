# Erwin Compare Formatter

A specialized utility to transform raw Erwin Data Modeler HTML difference reports into a modern, searchable, and filterable interface.

## Features

- **Presence-Based Change Detection**: Categorizes changes (I, A, E) strictly by the presence of data on either side.
- **Advanced Filtering**: 
  - **Show Properties**: Toggle all metadata visibility.
  - **Hide Calculated**: Strong filter (ON by default) to completely remove identical objects.
  - **Only Entities**: Focus view on top-level objects (supports manual drill-down).
  - **Only Ent+Atr**: Focus on Entities and Attributes (supports manual drill-down).
- **High Performance**: Optimized data engine designed to handle large HTML reports (up to 50MB+) with Map-based processing.
- **Hierarchy Visualization**: 
  - Structural guide using middle dots (`·`) for indentation levels.
  - **Interactive Indicators**: Dynamic icons (`chevron`, `sitemap`) show property and sub-object visibility status.
- **UDP Awareness**: Automatic teal highlighting for **User Defined Properties** (UDP).
- **Integrated Actions**:
  - **Flip Side**: Swap Work (Left) and Reference (Right) models globally.
  - **Batch Copy**: Export table name lists with a single click.
- **Robust Encoding Detection**: Handles legacy encodings (Windows-1252) used in Portuguese Erwin reports.
- **Smart Character Counter**: Real-time length indicators (Green ≤ 18, Red > 18) for Physical Names, stripping owner prefixes and tags like `[Calculated]` or `(FK)`.
- **Multilingual Support**: Localized in Portuguese, English, Spanish, and French.

## Installation and Usage

### 1. Standalone Application (Recommended)

The standalone version is a single-file HTML application that works offline.

- **Download:** [Download `Erwin_Complete_Compare_Formatter.html`](./dist/Erwin_Complete_Compare_Formatter.html?raw)
- **Usage:** Open the file and drag your Erwin HTML report onto the interface.

### 2. Tampermonkey Userscript

Automatically transforms any Erwin report opened locally.

1.  Install **Tampermonkey** extension.
2.  Install the script: [Install `erwin_complete_compare_formatter.user.js`](./dist/erwin_complete_compare_formatter.user.js?raw)
3.  Enable **"Allow access to file URLs"** in extension settings.

## Technical Stack

- **Framework**: Lit + TypeScript
- **State**: Nanostores
- **UI**: Bootflat (Bootstrap 3)
- **Build**: Vite + vite-plugin-singlefile
