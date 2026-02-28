const https = require('https');
const fs = require('fs');

https.get('https://scentsationz.pk/assets/index-hTp1WwY6.js', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    fs.writeFileSync('scentsationz.js', data);
    console.log('Downloaded JS file');
  });
});
