const axios = require('axios');
const Symbols = ['aapl', 'fb', 'snap'];
const Url = 'https://api.iextrading.com/1.0/stock/market/batch';
module.exports = class Stocks {
  quotes() {
    return new Promise((resolve, reject) => {
      axios.get(`${Url}?symbols=${Symbols.join(',')}&types=quote`)
        .then(data => resolve(data.data))
        .catch(err => reject(err));
    });
  }
}