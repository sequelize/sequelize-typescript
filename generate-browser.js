const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp-promise');
const recursive = require("recursive-readdir");
const lodash = require('lodash');
const base = 'lib';
const targetBase = 'browser';

async function main() {
  const annotationsDir = path.posix.join(base, 'annotations');
  // gathering annotation inputs
  const inputs = (await recursive(annotationsDir))
    .filter(f => f.endsWith('.js'))
    // since recursive-readdir dosen't provide an a posix api, replace all \\ with // 
    .map(p => p.replace(/\\/g, '/'));

  // write out the noop function that all the annotations will use
  const noopDir = path.posix.join(targetBase, 'noop.js');
  await mkdirp(path.posix.dirname(noopDir));
  fs.writeFileSync(noopDir, `export function noop(){}`);
  const exportedFiles = [];

  // write the noop functions for all the annotations
  for(const f of inputs) {
    const fileParts = f.split('/');
    // assume the function exported is the same as the filename
    const functionName = fileParts[fileParts.length -1].replace('.js', '');

    const outPath = path.posix.join(targetBase, f);
    exportedFiles.push({functionName, path: outPath});
    const noopRelatitiveDir = path.posix.relative(path.posix.dirname(outPath), path.posix.dirname(noopDir));

    const file = `import {noop} from '${path.posix.join(noopRelatitiveDir, 'noop')}';
export function ${functionName}() { return noop; }
`

    await mkdirp(path.posix.dirname(outPath));
    fs.writeFileSync(outPath, file)
  }

  // we need to include the model file
  const modelFilePath = path.posix.join(targetBase, 'models', 'Model.js')
  await mkdirp(path.posix.dirname(modelFilePath));
  fs.writeFileSync(modelFilePath, `export class Model {}\n`)
  exportedFiles.push({functionName: 'Model', path: modelFilePath})

  // export all the files we made in our index
  let indexFile = '';
  for(const fn of exportedFiles) {
    const p = path.posix.relative(targetBase, fn.path).replace('.js', '')
    indexFile += `export {${fn.functionName}} from './${p}'\n`;
  }
  fs.writeFileSync(path.posix.join(targetBase, 'index.js'), indexFile);

  // update package.json with new set of browser files
  const browser = {
    "index.js": path.posix.join(targetBase, "index.js"),
  };
  for(const fn of lodash.sortBy(exportedFiles, f => f.path)) {
    const relativePath = path.posix.relative(targetBase, fn.path);
    browser[relativePath] = fn.path;
  }
  const packageJson = JSON.parse(fs.readFileSync('package.json').toString());
  packageJson.browser = browser;
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2))

}

main();
