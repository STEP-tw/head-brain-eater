const { readFileSync, existsSync } = require("fs");
const { tail } = require("./src/filter");

const main = function() {
  console.log(tail(process.argv.slice(2), { readFileSync, existsSync }));
};
main();
