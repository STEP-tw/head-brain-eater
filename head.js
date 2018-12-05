let {
  head,
  classifyParameters,
  validateParameters,
  readFiles
  }= require("./src/lib.js");
let {readFileSync,existsSync} = require("fs");

const main = function(){
  let parameters = process.argv.slice(2);
  let {filter,count,fileNames} = classifyParameters(parameters);
  let errorMessage = validateParameters(filter,count,fileNames);
  if(errorMessage != undefined){
    console.log(errorMessage);
    return 0;
  }
  let files = readFiles(readFileSync,fileNames,existsSync)
  console.log(head(filter,count,files));
}

main();

