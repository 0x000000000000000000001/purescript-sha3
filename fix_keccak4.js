const fs = require('fs');
const file = 'src/Crypto/Keccak.purs';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/rhoOffsets :: WIA\.Int32Array/, 'rhoOffsets :: Array Int');
fs.writeFileSync(file, content);
