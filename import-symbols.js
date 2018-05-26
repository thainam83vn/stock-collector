const cwd = process.cwd();
let dbo, quotesDb;

require(`${cwd}/helpers/mongodb`)()
  .then(db => {
    console.log("connected to DB");
  })
  .catch(err => console.log(err));

const files = ["./ref/amex.csv", "./ref/nasdaq.csv", "./ref/nyse.csv"];

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
