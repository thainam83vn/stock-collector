const Table = "symbols";
module.exports = class SymbolsDb {
  constructor(dbo) {
    this.dbo = dbo;
  }

  drop() {
    return new Promise((resolve, reject) => {
      this.dbo.collection(Table).drop((err, res) => {
        if (err) return reject(err);
        resolve(res);
      });
    });
  }

  insertBatch(file, symbols) {
    let promises = [];
    for (let symbol of symbols) {
      promises.push(
        new Promise((resolve, reject) => {
          this.dbo
            .collection(Table)
            .insert({ file: file, ...symbol }, (err, data) => {
              if (err) reject(err);
              resolve(data);
            });
        })
      );
    }
    return Promise.all(promises);
  }
};
