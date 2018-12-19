const { last, take } = require("./stringUtil");
const { readFiles, classifyParameters } = require("./parseInput");
const { composeOutput } = require("./composeOutput");
const { validateParameters } = require("./handleExceptions");

const getDelimiter = function(option) {
  const delimiters = {
    line: "\n",
    char: ""
  };
  return delimiters[option];
};

const getMapper = function(type) {
  const mappers = {
    head: take,
    tail: last
  };
  return mappers[type];
};

const getLongOption = function(option) {
  let longOptions = {
    n: "line",
    c: "char"
  };
  return longOptions[option];
};

const mapContent = function(mapper, count, file) {
  let name = file.name;
  let content = mapper(count, file.content);
  let exists = file.exists;
  return {
    name,
    content,
    exists
  };
};

const hasOnlyOneElement = function(elements) {
  return elements.length == 1;
};

const filter = function(option, count, files, type) {
  let longOption = getLongOption(option);
  let seperator = getDelimiter(longOption);
  let mapper = getMapper(type);
  mapper = mapper.bind(null, seperator);
  let mappedFiles = files.map(mapContent.bind(null, mapper, count));

  if (hasOnlyOneElement(files)) {
    let file = mappedFiles[0];
    if (!file.exists) {
      return type + ": " + file.name + ": No such file or directory";
    }
    return file.content;
  }

  return mappedFiles.map(composeOutput.bind(null, type)).join("\n\n");
};

const runFilter = function(parameters, type, readFileSync, existsSync) {
  let { option, count, fileNames } = classifyParameters(parameters);

  let errorMessage = validateParameters(option, count, type);

  if (errorMessage != null) {
    return errorMessage;
  }
  let files = readFiles(fileNames, readFileSync, existsSync);
  return filter(option, count, files, type);
};

module.exports = {
  filter,
  runFilter,
  mapContent
};
