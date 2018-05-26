const cwd = process.cwd();
let dbo, SymbolDb, symbolsDb;

require(`${cwd}/helpers/mongodb`)()
  .then(db => {
    console.log("connected to DB");
    dbo = db.db("stocks");
    SymbolDb = require(`${cwd}/models/symbols.db`);
    symbolsDb = new SymbolDb(dbo);    
    await symbolsDb.drop();
    console.log("Dropped symbols");    
    for (let file of files) {
      const json = await csv.fromFile(file);
      console.log(`-----Import ${json.length} rows of ${file}-----`);
      await symbolsDb.insertBatch(file, json);
      console.log(`-----Imported ${json.length} rows of ${file}----`);
    }
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
