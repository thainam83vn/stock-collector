const fs = require("fs");
const csv = require("csvtojson")();
const cwd = process.cwd();

const files = ["./ref/amex.csv", "./ref/nasdaq.csv", "./ref/nyse.csv"];

async function load() {
  for (let file of files) {
    await importSymbols(file);
    return;
  }
}

require(`${cwd}/helpers/mongodb`)()
  .then(async db => {
    dbo = db.db("stocks");
    const SymbolDb = require(`${cwd}/models/symbols.db`);
    const symbolsDb = new SymbolDb(dbo);
    await symbolsDb.drop();
    for (let file of files) {
      const json = await csv.fromFile(file);
      console.log(
        `-------------------Import ${
          json.length
        } rows of ${file}-------------------`
      );
      await symbolsDb.insertBatch(file, json);
      console.log(
        `-------------------Imported ${
          json.length
        } rows of ${file}-------------------`
      );
    }
  })
  .catch(err => console.log(err));

// load();
