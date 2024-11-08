const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const https = require('https');

const steps = parseInt(process.env.steps || '123');
const halfSteps = Math.round(steps / 2);

app.get('/all', (req, res) => {
  let url = 'https://api1.binance.com/api/v3/ticker/price';
  console.log('new request. symbol=' + req.query.symbol + ' symbols=' + req.query.symbols);

  if (req.query.symbol) {
    url += '?symbol=' + req.query.symbol.toUpperCase();
  }

  https.get(url, (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      if (req.query.symbols) {
        data = JSON.stringify(filterBySymbols(JSON.parse(data), req.query.symbols));
      }

      res.json(encrypt(data));
    });
  })
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

function encrypt(text) {
  let encrypted = '';

  [...text].forEach((c, i) => {
    let asciiCode = c.charCodeAt();

    if (i % 2) {
      asciiCode += steps;
    } else {
      asciiCode += halfSteps;
    }

    encrypted += (asciiCode).toString().padStart(3, '0');
  });

  return encrypted;
}

function filterBySymbols(data, symbols) {
  let output = [];
  symbols = symbols.toLowerCase();

  data.forEach(c => {
    console.log(symbols, c.symbol.toLowerCase());
    if (symbols.indexOf(c.symbol.toLowerCase()) !== -1) {
      output.push(c);
    }
  });

  return output;
}


let houbiPrices = () => {
  let endpoint = 'https://api.huobi.pro/market/tickers';
}

let binancePrices = () => {
  let endpoint = 'https://api1.binance.com/api/v3/ticker/price';
}
