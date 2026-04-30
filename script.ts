import fs from 'fs';

const content = fs.readFileSync('src/utils/reportGenerator.ts', 'utf8');

const regex = /if \(c\.interaction === '異常'\) followUpItems\.push\(\{ target: name, label: '互動情.*const childrenList = !record\.hasChildren/s;

const fixed = content.replace(regex, `if (c.interaction === '異常') followUpItems.push({ target: name, label: '互動情形', status: '異常' });\n  });\n\n  const childrenList = !record.hasChildren`);

fs.writeFileSync('src/utils/reportGenerator.ts', fixed);
