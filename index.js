const cwd = process.cwd();
const delay = require("delay");
const logger = require(`${cwd}/helpers/logger`)();
const Stocks = require(`${cwd}/stocks/stocks`);
let stocks = new Stocks();

const TimeDelay = 20 * 1000;
let dbo, quotesDbo, symbolsDbo, symbolNames;
let lastOpenTime;

// async function getSingleQuote() {
//   const date = new Date();
//   let count = 0;
//   for (let i = 0; i < symbolNames.length; i += 100) {
//     const items = [];
//     for (let j = 0; j < 100 && i + j < symbolNames.length; j++) {
//       items.push(symbolNames[i + j]);
//     }
//     const quotes = await stocks.quotes(items);
//     // console.log(quotes);
//     const openTime = quotes[symbolNames[0]].quote.openTime;
//     const closeTime = quotes[symbolNames[0]].quote.closeTime;
//     if (openTime - lastOpenTime > 0 || !lastOpenTime) {
//       console.log({
//         openTime: new Date(openTime),
//         closeTime: new Date(closeTime)
//       });
//       await quotesDbo.insertBatch(quotes);
//     }
//     lastOpenTime = openTime;

//     count += items.length;
//     console.log(`${count} quotes inserted`);
//     await delay(100);
//   }
//   logger.log(`${count} rows inserted into db`);
// }

async function realtimeQuote(symbol) {
  const data = await stocks.realtime(symbol);
  await quotesDbo.insert(symbol, data);
  return data;
}

async function realtimeQuotes() {
  for (let symbol of symbolNames) {
    await realtimeQuote(symbol);
  }
}

async function getQuotes() {
  await realtimeQuotes();
  while (true) {
    const date = new Date();
    const day = date.getUTCDay();
    const hour = date.getUTCHours() - 4;
    console.log("Call for quote:", { day, hour });
    if (!(day == 0 || day == 6 || hour < 8 || hour > 20)) {
      // await getSingleQuote();
      await realtimeQuotes();
    }
    await delay(TimeDelay);
  }
}

const db = require("./models");
db()
  .then(async models => {
    logger.log("Connected to DB");
    quotesDbo = models.quotes;
    symbolsDbo = models.symbols;
    // symbolNames = (await symbolsDbo.all()).map(item => item.Symbol);
    symbolNames = [
      "AMD",
      "FIT",
      "SONO",
      "AMZN",
      "AAPL",
      "INTC",
      "TWTR",
      "TSLA",
      "MSFT",
      "GPRO"
    ];
    await getQuotes();
    logger.log("Done");
  })
  .catch(err => logger.log(err + ""));
