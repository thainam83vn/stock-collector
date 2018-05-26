const cwd = process.cwd();
const csv = require("csvtojson");
let dbo, SymbolDb, symbolsDb;
const files = ["./ref/amex.csv", "./ref/nasdaq.csv", "./ref/nyse.csv"];
const db = require("./models");
db()
  .then(async models => {
    console.log("connected to DB");
    console.log("Drop symbols");
    const symbols = models.symbols;
    console.log(await symbols.drop());
    for (let file of files) {
      console.log(`-----Read ${file}`);
      const json = await csv().fromFile(file);
      console.log(`-----Import ${json.length} rows of ${file}-----`);
      await symbols.insertBatch(file, json);
      console.log(`-----Imported ${json.length} rows of ${file}----`);
    }
    console.log("Done");
  })
  .catch(err => console.log(err));
// require(`${cwd}/helpers/mongodb`)()
//   .then(async db => {
//   })
//   .catch(err => console.log(err));
