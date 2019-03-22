const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp-promise');
const recursive = require("recursive-readdir");
const base = 'lib';
const targetBase = 'browser';

async function main() {
  const annotationsDir = path.join(base, 'annotations');
  // gathering annotation inputs
  const inputs = (await recursive(annotationsDir)).filter(f => f.endsWith('.js'));

  const noopDir = path.join(targetBase, 'noop.js');
  await mkdirp(path.dirname(noopDir));
  fs.writeFileSync(noopDir, `export function noop(){}`);
  const exportedFiles = [];

  // common annotations
  for(const f of inputs) {
    const fileParts = f.split('/');
    const functionName = fileParts[fileParts.length -1].replace('.js', '');

    const outPath = path.join(targetBase, f);
    exportedFiles.push({functionName, path: outPath});
    const noopRelatitiveDir = path.relative(path.dirname(outPath), path.dirname(noopDir));

    const file = `import {noop} from '${path.join(noopRelatitiveDir, 'noop')}';
export function ${functionName}() { return noop; }
`

    await mkdirp(path.dirname(outPath));
    fs.writeFileSync(outPath, file)
  }

  // model file
  const modelFilePath = path.join(targetBase, 'models', 'Model.js')
  await mkdirp(path.dirname(modelFilePath));
  fs.writeFileSync(modelFilePath, `export class Model {}\n`)
  exportedFiles.push({functionName: 'Model', path: modelFilePath})

  // index export file
  let indexFile = '';
  for(const fn of exportedFiles) {
    const p = path.relative(targetBase, fn.path).replace('.js', '')
    indexFile += `export {${fn.functionName}} from './${p}'\n`;
  }
  fs.writeFileSync(path.join(targetBase, 'index.js'), indexFile);

  // update package.json
  const browser = {
    "index.js": path.join(targetBase, "index.js"),
  };
  for(const fn of exportedFiles) {
    const relativePath = path.relative(targetBase, fn.path);
    browser[relativePath] = fn.path;
  }
  const packjageJson = JSON.parse(fs.readFileSync('package.json').toString());
  packjageJson.browser = browser;
  fs.writeFileSync('package.json', JSON.stringify(packjageJson, null, 2))

}

main();
