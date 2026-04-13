# Erwin Compare Formatter

A specialized utility to transform raw Erwin Data Modeler HTML difference reports into a modern, searchable, and filterable interface.

## Features

- **Presence-Based Change Detection**: Categorizes changes (I, A, E) strictly by the presence of data on either side.
- **Robust Encoding Detection**: Automatically detects and handles legacy encodings (like Windows-1252) used in Portuguese Erwin reports, preventing character mangling.
- **Flip Sides Logic**: Swap Work (Left) and Reference (Right) models globally with a single click. Inclusion/Exclusion logic updates automatically.
- **Calculated Field Awareness**: Detects and marks objects where all properties are identical and explicitly marked as `[Calculated]`.
- **Character Counter**: Real-time length indicators (color-coded) for all name fields on both models (Green ≤ 18, Red > 18).
- **Multilingual Support**: Fully localized interface supporting Portuguese, English, Spanish, and French.
- **Hierarchical Interaction**: Intuitive Left-Click (Toggle properties) and Right-Click (Toggle sub-objects) for a clean navigation experience.
- **Visual Feedback**: Copy-to-clipboard actions provide instant visual confirmation with a green checkmark.
- **Flat UI Design**: Modernized interface using a stable, high-performance table grid without legacy 3D effects.
- **Offline Ready**: All builds are self-contained and require no internet connection.

## Installation and Usage

### 1. Standalone Application (Recommended)

The standalone version is a single-file HTML application that works offline. No installation is required.

*   **Download:** [Download `Erwin_Complete_Compare_Formatter.html`](./dist/Erwin_Complete_Compare_Formatter.html?raw)
*   **Usage:**
    1.  Open the downloaded HTML file in any modern web browser.
    2.  Drag and drop your Erwin report (.html) onto the header area or use the upload button.

### 2. Tampermonkey Userscript

The userscript automatically transforms any Erwin report you open locally (`file:///.../*.html`) into the formatted interface.

#### Prerequisites
- Install the **Tampermonkey** browser extension:
    - [Tampermonkey for Chrome / Edge](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
    - [Tampermonkey for Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)

#### Installation
1.  **Download/Install Script:** [Install `erwin_complete_compare_formatter.user.js`](./dist/erwin_complete_compare_formatter.user.js?raw)
2.  Tampermonkey will automatically detect the `.user.js` extension and ask for confirmation to install.
3.  **Permissions:** In Chrome/Edge, you must enable **"Allow access to file URLs"** in the extension settings (Manage Extensions -> Tampermonkey -> Details) to process local files.

## Build Options (Developers)

If you wish to build the project from source:

### Build Standalone
```bash
npm run build:standalone
```
Output: `dist/Erwin_Formatter_CompleteCompare.html`

### Build Userscript
```bash
npm run build:monkey
```
Output: `dist/erwin_complete_compare_formatter.user.js`

## Technical Stack

- **Framework**: Lit (Web Components) + TypeScript
- **State**: Nanostores
- **i18n**: lit-translate
- **UI**: Bootflat (Bootstrap 3) + Custom Flat Theme
- **Icons**: Tabler Icons
- **Build**: Vite + Rollup
