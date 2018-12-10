let {head} = require('./src/lib.js');
let {readFileSync, existsSync} = require('fs');

const main = function() {
  let parameters = process.argv.slice(2);
  console.log(head(parameters, readFileSync, existsSync));
};

main();
