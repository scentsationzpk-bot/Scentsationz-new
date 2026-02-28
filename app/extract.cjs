const fs = require('fs');
const code = fs.readFileSync('scentsationz.js', 'utf8');

const index = code.indexOf('Add to Bag 🛍️');
if (index !== -1) {
  const start = Math.max(0, index - 3000);
  const end = Math.min(code.length, index + 3000);
  console.log(code.substring(start, end));
} else {
  console.log('Not found');
}
