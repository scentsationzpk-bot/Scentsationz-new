const fs = require('fs');
const code = fs.readFileSync('scentsationz.js', 'utf8');

const matches = [...code.matchAll(/name:"([^"]+)",description:"([^"]+)"/g)];
matches.forEach(m => console.log(m[1], ':', m[2]));

const matches2 = [...code.matchAll(/name:"([^"]+)",price:([0-9]+)/g)];
matches2.forEach(m => console.log(m[1], ':', m[2]));
