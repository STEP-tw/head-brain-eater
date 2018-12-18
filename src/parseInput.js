const isNaturalNum = function(num) {
  return !isNaN(num) && num > 0;
};

const isOptionProvided = function(arg) {
  return arg.startsWith("-");
};

const classifyParameters = function(parameters) {
  let option = "n";
  let firstArg = parameters[0];
  let secondArg = parameters[1];
  let firstFileNameIndex = 0;
  let count = 10;

  if (isOptionProvided(firstArg)) {
    firstFileNameIndex++;
    count = firstArg.slice(1);
    if (!isNaturalNum(count)) {
      option = firstArg[1];
      count = firstArg.slice(2);
      if (firstArg.length == 2) {
        firstFileNameIndex++;
        count = secondArg;
      }
    }
  }
  let fileNames = parameters.slice(firstFileNameIndex);

  return {
    option,
    count,
    fileNames
  };
};
const readFile = function(readFileSync, existsSync, fileName) {
  let exists = true;
  let name = fileName;
  let content = "";
  if (!existsSync(name)) {
    exists = false;
    return {
      name,
      content,
      exists
    };
  }
  content = readFileSync(fileName, "utf-8");
  return {
    content,
    name,
    exists
  };
};

const readFiles = function(fileNames, readFileSync, existsSync) {
  return fileNames.map(readFile.bind(null, readFileSync, existsSync));
};

module.exports = {
  readFiles,
  classifyParameters,
  readFile
};
