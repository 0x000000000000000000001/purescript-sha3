const fs = require('fs');
const file = 'src/Crypto/Keccak.purs';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'theta :: State -> State\\ntheta a = applyD a (computeD a (WA.unsafeNew 10) 0) 0',
  'theta :: State -> State -> State\\ntheta thetaScratch a = applyD a (computeD a thetaScratch 0) 0'
);

content = content.replace(
  'keccakRound :: State -> Int -> State -> State\\nkeccakRound scratch r a =\\n  let\\n    a1 = theta a',
  'keccakRound :: State -> State -> Int -> State -> State\\nkeccakRound thetaScratch rhoPiScratch r a =\\n  let\\n    a1 = theta thetaScratch a\\n    b1 = rhoPi a1 rhoPiScratch'
);

content = content.replace(
  'b1 = rhoPi a1 scratch\\n    a2 = chi b1 a1',
  'a2 = chi b1 a1'
);

content = content.replace(
  'keccakF :: State -> State\\nkeccakF a = go 0 a (WA.unsafeNew 50)\\n  where\\n  go r st scratch\\n    | r < 24 = go (r + 1) (keccakRound scratch r st) scratch',
  'keccakF :: State -> State\\nkeccakF a = go 0 a (WA.unsafeNew 10) (WA.unsafeNew 50)\\n  where\\n  go r st thetaScratch rhoPiScratch\\n    | r < 24 = go (r + 1) (keccakRound thetaScratch rhoPiScratch r st) thetaScratch rhoPiScratch'
);

fs.writeFileSync(file, content);
