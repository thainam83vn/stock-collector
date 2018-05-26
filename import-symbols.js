const cwd = process.cwd();
// const fs = require("fs");
const csv = require("csvtojson");
let dbo, SymbolDb, symbolsDb;
const files = ["./ref/amex.csv", "./ref/nasdaq.csv", "./ref/nyse.csv"];
require(`${cwd}/helpers/mongodb`)()
  .then(async db => {
    console.log("connected to DB");
    dbo = db.db("stocks");
    SymbolDb = require(`${cwd}/models/symbols.db`);
    symbolsDb = new SymbolDb(dbo);
    console.log("Drop symbols");
    console.log(await symbolsDb.drop());
    for (let file of files) {
      console.log(`-----Read ${file}`);
      const json = await csv().fromFile(file);
      console.log(`-----Import ${json.length} rows of ${file}-----`);
      await symbolsDb.insertBatch(file, json);
      console.log(`-----Imported ${json.length} rows of ${file}----`);
    }
    console.log("Done");
  })
  .catch(err => console.log(err));

// require(`${cwd}/helpers/mongodb`)()
//   .then(async db => {
//     dbo = db.db("stocks");
//     const SymbolDb = require(`${cwd}/models/symbols.db`);
//     const symbolsDb = new SymbolDb(dbo);
//     await symbolsDb.drop();
//     for (let file of files) {
//       const json = await csv.fromFile(file);
//       console.log(
//         `-------------------Import ${
//           json.length
//         } rows of ${file}-------------------`
//       );
//       await symbolsDb.insertBatch(file, json);
//       console.log(
//         `-------------------Imported ${
//           json.length
//         } rows of ${file}-------------------`
//       );
//     }
//   })
//   .catch(err => console.log(err));
