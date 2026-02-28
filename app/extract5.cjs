const fs = require('fs');
const code = fs.readFileSync('scentsationz.js', 'utf8');

let index = code.indexOf('Cloud Verified Registry Item');
if (index !== -1) {
  const start = Math.max(0, index - 2000);
  const end = Math.min(code.length, index + 2000);
  console.log('--- MATCH ---');
  console.log(code.substring(start, end));
} else {
  console.log('Not found');
}
