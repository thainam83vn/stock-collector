const cwd = process.cwd();
const fs = require("fs");

module.exports = () => {
  return {
    log: message => {
      const date = new Date();
      const sdate = `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}`;
      const stime = `${date.getUTCHours()}:${date.getUTCMinutes()}`;
      const s = `\n${stime}: ${message}`;
      console.log(s);
      fs.appendFileSync(`${cwd}/logs/${sdate}`, s);
    }
  };
};
