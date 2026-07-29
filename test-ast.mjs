import fs from 'fs';
const data = JSON.parse(fs.readFileSync('keccak.json', 'utf8'));
function findGo(obj) {
  if (Array.isArray(obj)) return obj.map(findGo);
  if (typeof obj === 'object' && obj !== null) {
    if (obj.identifier === 'go' && obj.expression) {
      console.log("Found go bind!");
      console.log(obj.expression.annotation.type);
      console.log(obj.expression.body.annotation.type);
      console.log(obj.expression.body.body.annotation.type);
    }
    for (const key in obj) {
      findGo(obj[key]);
    }
  }
}
findGo(data);
