const { readFileSync, existsSync } = require("fs");
const { runFilter } = require("./src/filter");

const main = function() {
  console.log(
    runFilter(process.argv.slice(2), "tail", readFileSync, existsSync)
  );
};
main();
