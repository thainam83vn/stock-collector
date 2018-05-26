const cwd = process.cwd();
const delay = require("delay");
const logger = require(`${cwd}/helpers/logger`)();
const Stocks = require(`${cwd}/stocks/stocks`);
let stocks = new Stocks();

const TimeDelay = 3600 * 1000;
let dbo, quotesDbo, symbolsDbo, symbolNames;

async function getQuote() {
  const date = new Date();
  let count = 0;
  for (let i = 0; i < symbolNames.length; i += 100) {
    const items = [];
    for (let j = 0; j < 100 && i + j < symbolNames.length; j++) {
      items.push(symbolNames[i + j]);
    }
    const quotes = await stocks.quotes(items);
    // console.log(quotes);
    await quotesDbo.insertBatch(quotes);
    count += items.length;
    console.log(`${count} quotes inserted`);
    await delay(1000);
  }
  logger.log(`${count} rows inserted into db`);
}

async function getQuotes() {
  await getQuote();
  while (true) {
    const date = new Date();
    const day = date.getUTCDay();
    const hour = date.getUTCHours() - 4;
    if (!(day == 0 || day == 6 || hour < 9 || hour > 16)) {
      await getQuote();
    }
    await delay(TimeDelay);
  }
}

const db = require("./models");
db()
  .then(async models => {
    console.log("connected to DB");
    quotesDbo = models.quotes;
    symbolsDbo = models.symbols;
    symbolNames = (await symbolsDbo.all()).map(item => item.Symbol);
    await getQuotes();
    console.log("Done");
  })
  .catch(err => logger.log(err + ""));
