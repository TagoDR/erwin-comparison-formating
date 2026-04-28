import { writeFileSync } from 'node:fs';
import {
  type DiffRow,
  type EnrichedDiffRow,
  type GroupingKeyword,
  INDENT_SIZE,
  type ModelObject,
} from '../src/types.js';

/**
 * Core logic to transform a structured ModelObject into the legacy Erwin HTML table format.
 *
 * @param sampleData The source JSON data.
 * @returns A complete HTML document string.
 */
export function buildSampleHtml(sampleData: ModelObject): string {
  const rows: string[] = [];

  function processObject(obj: ModelObject) {
    // ID Row
    rows.push(renderRow(obj.id));

    // Properties
    if (obj.properties) {
      for (const prop of obj.properties) {
        rows.push(renderRow(prop));
      }
    }

    // Children
    if (obj.children) {
      for (const entry of Object.entries(obj.children)) {
        const groupName = entry[0] as GroupingKeyword;
        const children = entry[1] as ModelObject[];
        if (!children) continue;

        // Grouping Header (e.g., Entities/Tables)
        const groupLevel = obj.id.level + 1;
        rows.push(renderGroupingRow(groupName, groupLevel));

        for (const child of children) {
          processObject(child);
        }
      }
    }
  }

  function renderRow(row: DiffRow | EnrichedDiffRow) {
    const spaces = row.spaces || row.level * INDENT_SIZE;
    const indent = '&nbsp;'.repeat(spaces);
    const leftVal = row.left || '';
    const rightVal = row.right || '';

    return `    <tr>
        <td width="30%">${indent}${row.type}</td>
        <td width="30%"><font color="#FF0000">${leftVal}</font></td>
        <td width="50" align="center" nowrap>${leftVal === rightVal ? 'Equal' : 'Not Equal'}</td>
        <td width="30%"><font color="#0000FF">${rightVal}</font></td>
    </tr>`;
  }

  function renderGroupingRow(name: string, level: number) {
    const indent = '&nbsp;'.repeat(level * INDENT_SIZE);
    return `    <tr>
        <td width="30%">${indent}${name}</td>
        <td width="30%"></td>
        <td width="50" align="center" nowrap>Equal</td>
        <td width="30%"></td>
    </tr>`;
  }

  processObject(sampleData);

  return `<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Report</title>
</head>
<body>
<table border="1" height="*" >
    <caption>Table Description</caption>
    <thead valign="top">
    <tr>
        <th>Type</th>
        <th>Left Value</th>
        <th>Status</th>
        <th>Right Value</th>
    </tr>
    </thead>
    <tbody>
${rows.join('\n')}
    </tbody>
</table>
</body>
</html>`.replace(/\r?\n/g, '\r\n');
}

// Standalone execution logic (for npm run gen:sample)
if (import.meta.url.endsWith('generate-sample-html.ts')) {
  (async () => {
    try {
      const { sampleData } = await import('../src/store/sample.js');
      const html = buildSampleHtml(sampleData);
      writeFileSync('./src/store/sample.html', html);
      console.log('Successfully regenerated src/store/sample.html');
    } catch (err) {
      console.error('Error in standalone generation:', err);
    }
  })();
}
