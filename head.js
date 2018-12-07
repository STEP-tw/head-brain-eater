let {runHead} = require('./src/lib.js');
let {readFileSync, existsSync} = require('fs');

const main = function() {
  let parameters = process.argv.slice(2);
  console.log(runHead(parameters, readFileSync, existsSync));
};

main();
