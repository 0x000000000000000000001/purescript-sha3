const fs = require('fs');
const file = 'src/Crypto/Keccak.purs';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/go i = if i < len then WIA\.unsafeSet out i \(WIA\.unsafeIndex arr i\) \`seq\` go \(i \+ 1\) else out/g, 
  'go i = if i < len then let _ = WIA.unsafeSet out i (WIA.unsafeIndex arr i) in go (i + 1) else out');
fs.writeFileSync(file, content);
