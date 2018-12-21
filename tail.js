const { readFileSync, existsSync } = require("fs");
const { tail } = require("./src/filter");

const main = function() {
  let parameters = process.argv.slice(2);
  console.log(tail(parameters, readFileSync, existsSync));
};
main();
