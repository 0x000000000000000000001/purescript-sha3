const fs = require('fs');
const file = 'src/Crypto/Keccak.purs';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/WIA\.unsafeSet out i \(fromMaybe 0 \(src A\.!! i\)\) \`seq\` go \(i \+ 1\)/g, 'let _ = WIA.unsafeSet out i (fromMaybe 0 (src A.!! i)) in go (i + 1)');
fs.writeFileSync(file, content);
