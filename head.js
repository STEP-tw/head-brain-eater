const { head } = require("./src/headAndTail.js");
const { classifyParameters } = require("./src/parseInput");
const { validateParameters } = require("./src/handleExceptions");
const fs = require("fs");

const main = function() {
  let parameters = process.argv.slice(2);
  let { option, count, fileNames } = classifyParameters(parameters);

  let errorMessage = validateParameters(option, count, "head");

  if (errorMessage != null) {
    return errorMessage;
  }
  console.log(head({ option, count, fileNames }, fs));
};

main();
