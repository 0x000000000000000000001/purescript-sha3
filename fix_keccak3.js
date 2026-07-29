const fs = require('fs');
const file = 'src/Crypto/Keccak.purs';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/initArray arr =[\s\S]*?in go 0/, 
\`initArray srcArr =
      let len = 24
          out = WIA.unsafeNew len
          go' i = if i < len then let _ = WIA.unsafeSet out i (Array.index srcArr i \`fromMaybe\` 0) in go' (i + 1) else out
      in go' 0\`);

content = content.replace(/rhoOffsets = initI32/, 'rhoOffsets = initArray');

content = content.replace(/import Data.Array as Array/, 'import Data.Array as Array\\nimport Data.Maybe (fromMaybe)');

fs.writeFileSync(file, content);
