# Erwin Compare Formatter

A specialized utility to transform raw Erwin Data Modeler HTML difference reports into a modern, searchable, and filterable interface.

## Features

- **Presence-Based Change Detection**: Categorizes changes (I, A, E) strictly by the presence of data on either side.
- **Advanced Filtering**: 
  - Toggle all properties visibility with a single switch.
  - **Only Entities**: Filter view to see only top-level objects.
  - **Only Ent+Atr**: Focus on Entities and Attributes, hiding all other metadata.
- **Hierarchy Visualization**: Clear structural guide using middle dots (`·`) for each indentation level (3 spaces per level).
- **UDP Awareness**: Automatic teal highlighting for **User Defined Properties** (UDP) based on naming patterns and indentation.
- **Integrated Actions**:
  - **Flip Side**: Swap Work (Left) and Reference (Right) models globally.
  - **Batch Copy**: Export the full list of table names with one click from the stats panel.
- **Robust Encoding Detection**: Automatically handles legacy encodings (like Windows-1252) used in Portuguese Erwin reports.
- **Character Counter**: Real-time length indicators (Green ≤ 18, Red > 18) for critical name fields.
- **Multilingual Support**: Fully localized in Portuguese, English, Spanish, and French.
- **Flat UI Design**: Modernized interface using an Office 2010 palette and high-performance grid.
- **Offline Ready**: Fully self-contained builds requiring no external dependencies.

## Installation and Usage

### 1. Standalone Application (Recommended)

The standalone version is a single-file HTML application that works offline.

- **Download:** [Download `Erwin_Complete_Compare_Formatter.html`](./dist/Erwin_Complete_Compare_Formatter.html?raw=1)
- **Usage:** Open the file and drag your Erwin HTML report onto the interface.

### 2. Tampermonkey Userscript

Automatically transforms any Erwin report opened locally.

1.  Install **Tampermonkey** extension.
2.  Install the script: [Install `erwin_complete_compare_formatter.user.js`](./dist/erwin_complete_compare_formatter.user.js?raw=1)
3.  Enable **"Allow access to file URLs"** in extension settings to process local files.

## Technical Stack

- **Framework**: Lit + TypeScript
- **State**: Nanostores
- **UI**: Bootflat (Bootstrap 3)
- **Build**: Vite + vite-plugin-singlefile
