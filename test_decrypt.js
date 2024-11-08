const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const https = require('https');
const http = require('http');

const steps = parseInt(process.env.steps || '123');
const halfSteps = Math.round(steps / 2);

let url = 'https://bn-hb-cp.onrender.com/all?symbol=sttusdt';
// url = 'http://localhost:3000/all?symbol=sttusdt';

app.get('/', (req, res) => {
  http.get(url, (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      // console.log(JSON.parse(decrypt(data)));

      res.json(JSON.parse(decrypt(data)));
    });
  })
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))


function decrypt(encrypted) {
  let output = '';

  encrypted.slice(1, -1).match(/.{1,3}/g).forEach((asciiCode, i) => {
    let old = asciiCode;

    if (i % 2) {
      asciiCode -= steps;
    } else {
      asciiCode -= halfSteps;
    }

    output += String.fromCharCode(asciiCode);
  })

  return output;
}
