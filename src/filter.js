const { last, take } = require("./stringUtil");
const { readFiles, classifyParameters } = require("./parseInput");
const { composeOutput } = require("./composeOutput");
const { validateParameters } = require("./handleExceptions");

const getSeperator = function(option) {
  let seperators = {
    n: "\n",
    c: ""
  };
  return seperators[option];
};

const getFilter = function(type) {
  let filters = {
    head: take,
    tail: last
  };
  return filters[type];
};

const filterContent = function(filter, count, file) {
  let name = file.name;
  let content = filter(count, file.content);
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
  let seperator = getSeperator(option);
  let filter = getFilter(type);
  filter = filter.bind(null, seperator);
  let filteredFiles = files.map(filterContent.bind(null, filter, count));

  if (hasOnlyOneElement(files)) {
    let file = filteredFiles[0];
    if (!file.exists) {
      return type + ": " + file.name + ": No such file or directory";
    }
    return file.content;
  }

  return filteredFiles.map(composeOutput.bind(null, type)).join("\n\n");
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

const head = function(parameters, { readFileSync, existsSync }) {
  return runFilter(parameters, "head", readFileSync, existsSync);
};

const tail = function(parameters, { readFileSync, existsSync }) {
  return runFilter(parameters, "tail", readFileSync, existsSync);
};

module.exports = {
  filter,
  runFilter,
  filterContent,
  head,
  tail
};
