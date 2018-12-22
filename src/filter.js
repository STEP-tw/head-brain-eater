const { last, take } = require("./stringUtil");
const { readFiles, classifyParameters } = require("./parseInput");
const { formatOutput } = require("./formatOutput");
const { validateParameters } = require("./handleExceptions");

const getDelimiter = function(option) {
  const delimiters = {
    line: "\n",
    byte: ""
  };
  return delimiters[option];
};

const getMapper = function(utility) {
  const mappers = {
    head: take,
    tail: last
  };
  return mappers[utility];
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

const filter = function(option, count, files, utility) {
  let delimiter = getDelimiter(option);
  let mapper = getMapper(utility);
  mapper = mapper.bind(null, delimiter);
  let mappedFiles = files.map(mapContent.bind(null, mapper, count));

  if (hasOnlyOneElement(files)) {
    let file = mappedFiles[0];
    if (!file.exists) {
      return utility + ": " + file.name + ": No such file or directory";
    }
    return file.content;
  }

  return mappedFiles.map(formatOutput.bind(null, utility)).join("\n\n");
};

const runFilter = function(parameters, readFileSync, existsSync) {
  const utility = parameters.shift();
  let { option, count, fileNames } = classifyParameters(parameters);

  let errorMessage = validateParameters(option, count, utility);

  if (errorMessage != null) {
    return errorMessage;
  }
  let files = readFiles(fileNames, readFileSync, existsSync);
  return filter(option, count, files, utility);
};

const head = function(parameters, fs) {
  parameters.unshift("head");
  return runFilter(parameters, fs.readFileSync, fs.existsSync);
};

const tail = function(parameters, fs) {
  parameters.unshift("tail");
  return runFilter(parameters, fs.readFileSync, fs.existsSync);
};

module.exports = {
  filter,
  runFilter,
  mapContent,
  head,
  tail
};
