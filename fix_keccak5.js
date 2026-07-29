const fs = require('fs');
const file = 'src/Crypto/Keccak.purs';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/Array\.index srcArr i \`fromMaybe\` 0/g, 'fromMaybe 0 (Array.index srcArr i)');
fs.writeFileSync(file, content);
