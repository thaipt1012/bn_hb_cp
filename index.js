const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const https = require('https');

const steps = process.env.steps || 123;



app.get('/all', (req, res) => {
  https.get('https://api1.binance.com/api/v3/ticker/price', (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      console.log(req.query.symbols);

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

  [...text].forEach(c => {
    encrypted += (c.charCodeAt() + steps).toString().padStart(3, '0');
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


// for extension
function decrypt(encrypted) {
  let output = '';

  encrypted.match(/.{1,3}/g).forEach(asciiCode => {
    output += String.fromCharCode(asciiCode - steps);
  })

  return output;
}




let houbiPrices = () => {
  let endpoint = 'https://api.huobi.pro/market/tickers';
}

let binancePrices = () => {
  let endpoint = 'https://api1.binance.com/api/v3/ticker/price';
}
