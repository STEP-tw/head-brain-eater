let {classifyParameters} = require("./src/lib.js");

const main = function(){
  let parameters = process.argv.slice(2);
  let {filter,count,files} = classifyParameters(parameters);
}

main();

