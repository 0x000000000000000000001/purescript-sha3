const fs = require('fs');
const file = 'src/Crypto/Keccak.purs';
let content = fs.readFileSync(file, 'utf8');

const replacement = `
import Data.Array as Array
import Data.Maybe (fromMaybe)

-- A 50-element MUTABLE wasm array. Lane (x,y) at 2*(x+5y) (lo) and +1 (hi).
`;

content = content.replace(/-- A 50-element MUTABLE wasm array\. Lane \(x,y\) at 2\*\(\x\+5y\) \(lo\) and \+1 \(hi\)\./, replacement.trim());

const initArrayCode = `
initArray :: Array Int -> Array Int
initArray srcArr =
  let len = Array.length srcArr
      out = WA.unsafeNew len
      go' i = if i < len then let _ = WA.unsafeSet out i (fromMaybe 0 (Array.index srcArr i)) in go' (i + 1) else out
  in go' 0
`;

const rcLoReplacement = `
rcLo :: Array Int
rcLo = initArray
  [ 1, 0x8082, 0x808A, hb .|. 0x8000, 0x808B, hb .|. 0x1
  , hb .|. 0x8081, 0x8009, 0x8A, 0x88, hb .|. 0x8009, hb .|. 0xA
  , hb .|. 0x808B, 0x8B, 0x8089, 0x8003, 0x8002, 0x80
  , 0x800A, hb .|. 0xA, hb .|. 0x8081, 0x8080, hb .|. 0x1, hb .|. 0x8008
  ]
`;

content = content.replace(/rcLo :: Array Int\nrcLo =\n\s+\[[\s\S]*?\]/, initArrayCode + '\n' + rcLoReplacement.trim());

const rcHiReplacement = `
rcHi :: Array Int
rcHi = initArray
  [ 0, 0, hb, hb, 0, 0, hb, hb, 0, 0, 0, 0
  , 0, hb, hb, hb, hb, hb, 0, hb, hb, hb, 0, hb
  ]
`;

content = content.replace(/rcHi :: Array Int\nrcHi =\n\s+\[[\s\S]*?\]/, rcHiReplacement.trim());

const rhoReplacement = `
rhoOffsets :: Array Int
rhoOffsets = initArray
  [ 0, 1, 62, 28, 27
  , 36, 44, 6, 55, 20
  , 3, 10, 43, 25, 39
  , 41, 45, 15, 21, 8
  , 18, 2, 61, 56, 14
  ]
`;

content = content.replace(/rhoOffsets :: Array Int\nrhoOffsets =\n\s+\[[\s\S]*?\]/, rhoReplacement.trim());

fs.writeFileSync(file, content);
