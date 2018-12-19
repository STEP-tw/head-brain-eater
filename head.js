const { runFilter } = require("./src/filter.js");

const { readFileSync, existsSync } = require("fs");

const main = function() {
  let parameters = process.argv.slice(2);
  parameters.unshift("head");
  console.log(runFilter(parameters, readFileSync, existsSync));
};

main();
