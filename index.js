const cwd = process.cwd();
const Stocks = require(`${cwd}/models/stocks`);
const TimeDelay = 3600 * 1000;
let stocks = new Stocks();
let dbo, quotesDb;

async function getQuotes() {
  const date = new Date();
  const day = date.getUTCDate();
  const hour = date.getUTCHours() - 4;
  if (day == 0 || day == 6 || hour < 9 || hour > 16) {
    setTimeout(() => getQuotes(), TimeDelay);
  }
  const quotes = await stocks.quotes();
  console.log(quotes);
  quotesDb
    .insertBatch(quotes)
    .then(data => {
      console.log(
        `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()} ${date.getUTCHours()}:${date.getUTCFullYear()}: inserted into db`
      );
      setTimeout(() => getQuotes(), TimeDelay);
    })
    .catch(err => {
      console.log(err);
      setTimeout(() => getQuotes(), 1000 * 60);
    });
}

require(`${cwd}/helpers/mongodb`)()
  .then(db => {
    dbo = db.db("stocks");
    const QuoteDb = require(`${cwd}/models/quotes.db`);
    quotesDb = new QuoteDb(dbo);
    getQuotes();
  })
  .catch(err => console.log(err));

// getQuotes();
