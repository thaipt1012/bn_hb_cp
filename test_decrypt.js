const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
let https = require('https');
const http = require('http');

const steps = parseInt(process.env.steps || '123');
const halfSteps = Math.round(steps / 2);

app.get('/', (req, res) => {
  let url = 'https://bn-hb-cp.onrender.com/all';
  url = 'http://localhost:3000/all';

  if (req.query.symbol) {
    url += '?symbol=' + req.query.symbol.toUpperCase();
  }

  if (url.indexOf('http://') == 0) {
    https = http;
  }

  https.get(url, (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      console.log('data =', data);
      console.log('decrypt(data) =', decrypt(data));

      res.json(JSON.parse(decrypt(data)));
    });
  })
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))


function decrypt(encrypted) {
  let output = '';

  encrypted.slice(1, -1).match(/.{1,3}/g).forEach((asciiCode, i) => {
    output += String.fromCharCode(asciiCode - (i % 2 ? steps : halfSteps));
  })

  return output;
}
