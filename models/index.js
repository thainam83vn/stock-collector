const cwd = process.cwd();

module.exports = () => {
  return new Promise((resolve, reject) => {
    require(`${cwd}/helpers/mongodb`)()
      .then(db => {
        dbo = db.db("stocks");
        const QuoteDb = require(`${cwd}/models/quotes.db`);
        const SymbolDb = require(`${cwd}/models/symbols.db`);
        resolve({
          quotes: new QuoteDb(dbo),
          symbols: new SymbolDb(dbo)
        });
      })
      .catch(err => reject(err));
  });
};
