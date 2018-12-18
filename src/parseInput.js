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

const validateParameters = function(option, count, type) {
  let optionNames = {
    n: "line",
    c: "byte"
  };
  let { invalidOptionMsg, undefinedCountMsg, usageMessage } = errorMessages(
    type,
    option
  );

  if (!isValidOption(option)) {
    return invalidOptionMsg;
  }

  if (isUndefined(count)) {
    return undefinedCountMsg + "\n" + usageMessage;
  }

  if (!isNaturalNum(count)) {
    return illegalCountMessage(count, type, optionNames[option]);
  }
  return null;
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

const isOptionProvided = function(arg) {
  return arg.startsWith("-");
};

const isValidOption = function(option) {
  return option == "n" || option == "c";
};

const isUndefined = function(element) {
  return element == undefined;
};

const isNaturalNum = function(num) {
  return !isNaN(num) && num > 0;
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
  readFiles,
  validateParameters,
  classifyParameters,
  readFile,
  errorMessages,
  illegalCountMessage
};
