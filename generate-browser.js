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

  // write out the noop function that all the annotations will use
  const noopDir = path.join(targetBase, 'noop.js');
  await mkdirp(path.dirname(noopDir));
  fs.writeFileSync(noopDir, `export function noop(){}`);
  const exportedFiles = [];

  // write the noop functions for all the annotations
  for(const f of inputs) {
    const fileParts = f.split('/');
    // assume the function exported is the same as the filename
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

  // we need to include the model file
  const modelFilePath = path.join(targetBase, 'models', 'Model.js')
  await mkdirp(path.dirname(modelFilePath));
  fs.writeFileSync(modelFilePath, `export class Model {}\n`)
  exportedFiles.push({functionName: 'Model', path: modelFilePath})

  // export all the files we made in our index
  let indexFile = '';
  for(const fn of exportedFiles) {
    const p = path.relative(targetBase, fn.path).replace('.js', '')
    indexFile += `export {${fn.functionName}} from './${p}'\n`;
  }
  fs.writeFileSync(path.join(targetBase, 'index.js'), indexFile);

  // update package.json with new set of browser files
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
