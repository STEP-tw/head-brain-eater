let isOptionProvided = function(arg) {
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

const cut = function(seperator, count, content, isReverse) {
  let start = 0;
  let end = count;

  if (isReverse == true) {
    let contentLength = content.split(seperator).length;
    start = contentLength - count;
    end = contentLength;
  }

  return content
    .split(seperator)
    .slice(start, end)
    .join(seperator);
};

const options = function() {
  let options = {
    n: cut.bind(null, "\n"),
    c: cut.bind(null, "")
  };
  return options;
};

const filterContent = function(filter, count, isReverse, file) {
  let name = file.name;
  let content = filter(count, file.content, isReverse);
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
  let filter = options()[option];
  let isReverse = false;
  if (type == "tail") {
    isReverse = true;
  }
  let filteredFiles = files.map(
    filterContent.bind(null, filter, count, isReverse)
  );

  // if (type == "tail") {
  //   filteredFiles = filteredFiles.map(reverseLines);
  //   if (option == "c") {
  //     filteredFiles = filteredFiles.map(reverseCharacters);
  //   }
  // }

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

const readFile = function(readFileSync, doesFileExist, fileName) {
  let exists = true;
  let name = fileName;
  let content = "";
  if (!doesFileExist(name)) {
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

const readFiles = function(readFileSync, fileNames, exists) {
  return fileNames.map(readFile.bind(null, readFileSync, exists));
};

const validateParameters = function(option, count, type) {
  let types = {
    n: "line",
    c: "byte"
  };
  let errorMessage = undefined;

  let usageMessages = {
    head: "usage: head [-n lines | -c bytes] [file ...]",
    tail: "usage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]"
  };

  let invalidOptionMsg =
    type + ": illegal option -- " + option + "\n" + usageMessages[type];
  let undefinedCountMsg = type + ": option requires an argument -- " + option;

  if (!isValidOption(option)) {
    errorMessage = invalidOptionMsg;
    return errorMessage;
  }

  if (isUndefined(count)) {
    errorMessage = undefinedCountMsg + "\n" + usageMessages[type];
    return errorMessage;
  }

  if (!isNaturalNum(count)) {
    if (type == "tail") {
      if (count == 0) {
        return "";
      }
      return "tail: illegal offset -- " + count;
    }
    errorMessage = "head: illegal " + types[option] + " count -- " + count;
    return errorMessage;
  }
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

const runFilter = function(parameters, type , readFileSync, existsSync) {
  let { option, count, fileNames } = classifyParameters(parameters);

  let errorMessage = validateParameters(option, count, type);
  if (errorMessage != undefined) {
    return errorMessage;
  }
  let files = readFiles(readFileSync, fileNames, existsSync);
  return filter(option, count, files,type);
};

module.exports = {
  filter,
  options,
  cut,
  readFiles,
  displayFile,
  validateParameters,
  runFilter,
  classifyParameters,
  readFiles,
  
};
