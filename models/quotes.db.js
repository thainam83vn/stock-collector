const moment = require("moment");
const Table = "quotes";
module.exports = class QuotesDb {
  constructor(dbo) {
    this.dbo = dbo;
  }

  drop() {
    return new Promise((resolve, reject) => {
      this.dbo.dropCollection(Table, (err, res) => {
        if (err) return resolve(false);
        resolve(res);
      });
    });
  }

  insertBatch(quotes) {
    let promises = [];
    for (let symbol in quotes) {
      let value = quotes[symbol];
      let date = new Date();
      promises.push(
        new Promise((resolve, reject) => {
          this.dbo.collection(Table).insert({ ...value.quote }, (err, data) => {
            if (err) reject(err);
            resolve(data);
          });
        })
      );
    }
    return Promise.all(promises);
  }

  insert(symbol, data) {
    const code = `${moment.utc().format("YYYYMMDD")}_${symbol}`;
    return new Promise(async (resolve, reject) => {
      try {
        const quotes = this.dbo.collection(Table);
        const quote = await quotes.findOne({ code });
        if (quote) {
          console.log("-----update----", { symbol, code });
          data = await quotes.update(
            { code },
            {
              $set: {
                ...data
              }
            }
          );
          resolve(data);
        } else {
          console.log("-----insert----", { symbol, code });
          data = await quotes.insert({
            code,
            symbol,
            time: new Date(),
            ...data
          });
          resolve(data);
        }
      } catch (err) {
        reject(err);
      }
    });
  }
};
