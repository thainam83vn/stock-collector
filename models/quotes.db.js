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
          this.dbo
            .collection(Table)
            .insert(
              { symbol: symbol, date: date, value: value },
              (err, data) => {
                if (err) reject(err);
                resolve(data);
              }
            );
        })
      );
    }
    return Promise.all(promises);
  }
};
