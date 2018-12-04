let {
    head,
    classifyParameters,
    getFile
    }= require("./src/lib.js");
let {readFileSync} = require("fs");

const main = function(){
  let parameters = process.argv.slice(2);
  let {filter,count,fileNames} = classifyParameters(parameters);
  let getFileUsingFs = getFile.bind(null,readFileSync);
  let files = fileNames.map(getFileUsingFs);
  console.log(head(filter,count,files));
}

main();

