const { last, take } = require("./stringLib");
let isOptionProvided = function(arg) {
  return arg.startsWith("-");
};

const toWholeNumber = function(num) {
  return Math.max(0, num);
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

const filters = function() {
  return {
    tail: {
      n: last.bind(null, "\n"),
      c: last.bind(null, "")
    },
    head: {
      n: take.bind(null, "\n"),
      c: take.bind(null, "")
    }
  };
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

const filter = function(option, count, files, type = "head") {
  let filter = filters()[type][option];
  let filteredFiles = files.map(filterContent.bind(null, filter, count));

  if (hasOnlyOneElement(files)) {
    let file = filteredFiles[0];
    if (!file.exists) {
      return type + ": " + file.name + ": No such file or directory";
    }
    return file.content;
  }

  return filteredFiles.map(displayFile.bind(null, type)).join("\n\n");
};

const displayFile = function(type, { name, content, exists }) {
  if (!exists) {
    return type + ": " + name + ": No such file or directory";
  }

  return "==> " + name + " <==\n" + content;
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

const validateParameters = function(option, count, type) {
  let optionNames = {
    n: "line",
    c: "byte"
  };
  let errorMessage = undefined;

  let { invalidOptionMsg, undefinedCountMsg, usageMessage } = errorMessages(
    type,
    option
  );

  if (!isValidOption(option)) {
    errorMessage = invalidOptionMsg;
    return errorMessage;
  }

  if (isUndefined(count)) {
    errorMessage = undefinedCountMsg + "\n" + usageMessage;
    return errorMessage;
  }

  if (!isNaturalNum(count)) {
    return illegalCountMessage(count, type, optionNames[option]);
  }
};

const illegalCountMessage = function(count, type, optionName) {
  if (type == "tail") {
    if (count == 0) {
      return "";
    }
    return "tail: illegal offset -- " + count;
  }
  errorMessage = "head: illegal " + optionName + " count -- " + count;
  return errorMessage;
};

const isValidOption = function(option) {
  return option == "n" || option == "c";
};

const isUndefined = function(ele) {
  return ele == undefined;
};

const isNaturalNum = function(num) {
  return !isNaN(num) && num > 0;
};

const runFilter = function(parameters, type, readFileSync, existsSync) {
  let { option, count, fileNames } = classifyParameters(parameters);

  let errorMessage = validateParameters(option, count, type);
  if (errorMessage != undefined) {
    return errorMessage;
  }
  let files = readFiles(fileNames, readFileSync, existsSync);
  return filter(option, count, files, type);
};

const errorMessages = function(type, option) {
  let usageMessages = {
    head: "usage: head [-n lines | -c bytes] [file ...]",
    tail: "usage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]"
  };
  let invalidOptionMsg =
    type + ": illegal option -- " + option + "\n" + usageMessages[type];
  let undefinedCountMsg = type + ": option requires an argument -- " + option;
  let usageMessage = usageMessages[type];
  return { invalidOptionMsg, undefinedCountMsg, usageMessage };
};

module.exports = {
  filter,
  filters,
  readFiles,
  displayFile,
  validateParameters,
  runFilter,
  classifyParameters,
  readFile,
  filterContent,
  errorMessages,
  illegalCountMessage
};
