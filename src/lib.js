const isNaN = function(num){
  return num*0 != 0;
}

const classifyParameters = function(parameters) {
  let filter = "n";
  let firstArg = parameters[0];
  let secondArg = parameters[1];
  let firstFileNameIndex = 0;
  let count = 10;

  if(firstArg.match("-") != null){
    firstFileNameIndex++;
    count = +firstArg.slice(1);
    if(isNaN(count)){
      filter = firstArg[1];
      count = +firstArg.slice(2) || firstFileNameIndex++ && +secondArg;
    }
  }

  let  fileNames = parameters.slice(firstFileNameIndex);

  return {filter, count, fileNames};
};

const cut = function(seperator, count, content) {
  return content
    .split(seperator)
    .slice(0, count)
    .join(seperator);
};

const headOptions = function() {
  let options = {
    n: cut.bind(null, '\n'),
    c: cut.bind(null, ''),
  };
  return options;
};

const head = function(option, count, files) {
  let filter = headOptions()[option];
  let filteredContent = '';
  let delimeter = '';
  for (let file of Object.values(files)) {
    filteredContent = filteredContent + delimeter + filter(count, file.content);
    delimeter = '\n';
  }
  return filteredContent;
};

module.exports = {
  head,
  headOptions,
  cut,
  classifyParameters
};
