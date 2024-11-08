const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const https = require('https');

const steps = parseInt(process.env.steps || '123');
const halfSteps = Math.round(steps / 2);

var prices = {};
const secondsToUpdate = 10;
let latestUpdatePriceAt = 0;


app.get('/all', (req, res) => {
  console.log('new request. symbol=' + req.query.symbol + ' symbols=' + req.query.symbols);

  if (Date.now() - latestUpdatePriceAt > secondsToUpdate * 1000) {
    const updateBinanePrice = new Promise(getPriceFromBinance);
    latestUpdatePriceAt = Date.now();

    updateBinanePrice
      .then((data) => {
        prices = data;
        res.json(processDataToResponse(req.query.symbol, req.query.ignore_encrypt));
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    res.json(processDataToResponse(req.query.symbol, req.query.ignore_encrypt));
  }
});

function processDataToResponse(symbol, ignore_encrypt) {
  let data;

  if (symbol) {
    data = JSON.stringify(prices);
    // data = JSON.stringify(filterBySymbols(prices, symbol));
  } else {
    data = JSON.stringify(prices);
  }

  if (!ignore_encrypt) {
    data = encrypt(data);
  }

  return data;
}



function getPriceFromBinance(resolve, reject) {
  console.log('Send request to Binance.......');

  let url = 'https://api.binance.com/api/v3/ticker/price';

  https.get(url, (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      let jsonRes = JSON.parse(data);

      if (jsonRes.code) return jsonRes.msg.slice(0, 30) + '...';

      resolve(jsonRes);
    });
  })
}




app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

function encrypt(text) {
  let encrypted = '';

  [...text].forEach((c, i) => {
    let asciiCode = c.charCodeAt() + (i % 2 ? steps : halfSteps);

    encrypted += (asciiCode).toString().padStart(3, '0');
  });

  return encrypted;
}

function filterBySymbols(data, symbols) {
  let output = [];
  symbols = symbols.toLowerCase();

  data.forEach(c => {
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
