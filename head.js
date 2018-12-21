const { head } = require("./src/filter.js");

const fs = require("fs");

const main = function() {
  let parameters = process.argv.slice(2);
  console.log(head(parameters, fs));
};

main();
