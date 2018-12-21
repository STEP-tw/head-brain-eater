const isWholelNum = function(num) {
  return !isNaN(num) && num >= 0;
};

const isOptionProvided = function(arg) {
  return arg.startsWith("-");
};

const getShortOption = function(arg) {
  if (!isWholelNum(arg[1])) {
    return arg[1];
  }
  return "line";
};

const getCount = function(args) {
  let count = args[0].slice(1);

  if (isWholelNum(count)) {
    return count;
  }
  count = args[0].slice(2);
  if (count != "") {
    return count;
  }

  return args[1];
};

const getFileNames = function(args) {
  if (args[0].length >= 3 || isWholelNum(args[0].slice(1))) {
    return args.slice(1);
  }
  return args.slice(2);
};

const classifyParameters = function(parameters) {
  if (isOptionProvided(parameters[0])) {
    return parseParameters(parameters);
  }
  return { option: "line", count: "10", fileNames: parameters };
};

const getOption = function(shortOption) {
  let options = {
    n: "line",
    c: "byte"
  };
  let option = options[shortOption];
  return option || shortOption;
};

const parseParameters = function(parameters) {
  let shortOption = getShortOption(parameters[0]);
  let count = getCount(parameters);
  let fileNames = getFileNames(parameters);
  let option = getOption(shortOption);
  return { option, count, fileNames };
};

const readFile = function(readFileSync, existsSync, fileName) {
  if (!existsSync(fileName)) {
    exists = false;
    return {
      name: fileName,
      content: "",
      exists: false
    };
  }
  let content = readFileSync(fileName, "utf-8");
  return {
    content,
    name: fileName,
    exists: true
  };
};

const readFiles = function(fileNames, readFileSync, existsSync) {
  return fileNames.map(readFile.bind(null, readFileSync, existsSync));
};

module.exports = {
  readFiles,
  classifyParameters,
  parseParameters,
  readFile
};
