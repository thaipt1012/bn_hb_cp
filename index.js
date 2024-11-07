const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.get('/binance_all_symboys', (req, res) => {
  https.get('https://api1.binance.com/api/v3/ticker/price', (resp) => {
    let data = '';

    // A chunk of data has been received.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      res.json(JSON.parse(data));
    });
  })
  // https://devcenter.heroku.com/articles/getting-started-with-nodejs#deploy-the-app
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
