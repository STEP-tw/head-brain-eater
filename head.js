let {
    head,
    classifyParameters,
    readFiles
    }= require("./src/lib.js");
let {readFileSync} = require("fs");

const main = function(){
  let parameters = process.argv.slice(2);
  let {filter,count,fileNames} = classifyParameters(parameters);
  let files = readFiles(readFileSync,fileNames)
  console.log(head(filter,count,files));
}

main();

