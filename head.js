let { head } = require("./src/filter.js");

let { readFileSync, existsSync } = require("fs");

const main = function() {
  let parameters = process.argv.slice(2);
  console.log(head(parameters, fs));
};

main();
