import fs from 'fs';
const f = fs.readFileSync('output-wasm/_build/index.pmo', 'utf8');
console.log(f.substring(0, 1000));
