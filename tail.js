const { readFileSync, existsSync } = require("fs");
const { runFilter } = require("./src/filter");

const main = function() {
  let parameters = process.argv.slice(2);
  parameters.unshift("tail");
  console.log(runFilter(parameters, readFileSync, existsSync));
};
main();
