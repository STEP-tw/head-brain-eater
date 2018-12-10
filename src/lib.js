let isOptionProvided = function (arg) {
  return arg.startsWith('-');
};

const classifyParameters = function (parameters) {
  let option = 'n';
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

const cut = function (seperator, count, content) {
  return content
    .split(seperator)
    .slice(0, count)
    .join(seperator);
};

const options = function () {
  let options = {
    n: cut.bind(null, '\n'),
    c: cut.bind(null, ''),
  };
  return options;
};

const filterContent = function (filter, count, file) {
  let name = file.name;
  let content = filter(count, file.content);
  let exists = file.exists;
  return {
    name,
    content,
    exists
  };
};

const hasOnlyOneEle = function (elements) {
  return elements.length == 1;
};

const filter = function (option, count, files, type = 'head') {
  let filter = options()[option];

  let filteredFiles = files.map(filterContent.bind(null, filter, count));

  if (type == 'tail') {
    filteredFiles = filteredFiles.map(reverseLines);
    if (option == 'c') {
      filteredFiles = filteredFiles.map(reverseCharacters);
    }
  }

  if (hasOnlyOneEle(files)) {
    let file = filteredFiles[0];
    if (!file.exists) {
      return type + ': ' + file.name + ': No such file or directory';
    }

    return file.content;
  }


  return filteredFiles.map(displayFile.bind(null, type)).join('\n\n');
};

const displayFile = function (type, {
  name,
  content,
  exists
}) {
  if (!exists) {
    return type + ': ' + name + ': No such file or directory';
  }
    
  return '==> ' + name + ' <==\n' + content;
};

const readFile = function (readFileSync, doesFileExist, fileName) {
  let exists = true;
  let name = fileName;
  let content = '';
  if (!doesFileExist(name)) {
    exists = false;
    return {
      name,
      content,
      exists
    };
  }
  content = readFileSync(fileName, 'utf-8');
  return {
    content,
    name,
    exists
  };
};

const readFiles = function (readFileSync, fileNames, exists) {
  return fileNames.map(readFile.bind(null, readFileSync, exists));
};

const validateParameters = function (option, count, type) {
  let types = {
    n: 'line',
    c: 'byte'
  };
  let errorMessage = undefined;
  let usageMessages = {
    head: 'usage: head [-n lines | -c bytes] [file ...]',
    tail: 'usage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]',
  };
  if (!isValidOption(option)) {
    errorMessage =
      type + ': illegal option -- ' + option + '\n' + usageMessages[type];
    return errorMessage;
  }
  if (isUndefined(count)) {
    errorMessage =
      type +
      ': option requires an argument -- ' +
      option +
      '\n' +
      usageMessages[type];
    return errorMessage;
  }
  if (!isNaturalNum(count)) {
    if (type == 'tail') {
      if(count == 0){
        return "";
      }
      return "tail: illegal offset -- "+count;
    }
    errorMessage = 'head: illegal ' + types[option] + ' count -- ' + count;
    return errorMessage;
  }
};

const isValidOption = function (option) {
  return option == 'n' || option == 'c';
};

const isUndefined = function (ele) {
  return ele == undefined;
};

const isNaturalNum = function (num) {
  return !isNaN(num) && num > 0;
};

const head = function (parameters, readFileSync, existsSync) {
  let {
    option,
    count,
    fileNames
  } = classifyParameters(parameters);

  let errorMessage = validateParameters(option, count, 'head');
  if (errorMessage != undefined) {
    return errorMessage;
  }
  let files = readFiles(readFileSync, fileNames, existsSync);
  return filter(option, count, files);
};

const reverseLines = function (file) {
  let content = file.content
    .split('\n')
    .reverse()
    .join('\n');
  let {
    name,
    exists
  } = file;
  return {
    name,
    content,
    exists
  };
};

const reverse = function (text) {
  return text.split('').reverse().join('');
}

const reverseCharacters = function (file) {
  let content = file.content.split('\n').map(reverse).join('\n');
  let {
    name,
    exists
  } = file;
  return {
    name,
    content,
    exists
  };
}

const tail = function (parameters, readFileSync, existsSync) {
  let {
    option,
    count,
    fileNames
  } = classifyParameters(parameters);
  let errorMessage = validateParameters(option, count, 'tail');

  if (errorMessage != undefined) {
    return errorMessage;
  }

  let files = readFiles(readFileSync, fileNames, existsSync);

  let reversedFiles = files.map(reverseLines);

  if (option == 'c') {
    reversedFiles = reversedFiles.map(reverseCharacters);
  }


  return filter(option, count, reversedFiles, 'tail');
};

module.exports = {
  filter,
  options,
  cut,
  readFiles,
  displayFile,
  validateParameters,
  head,
  classifyParameters,
  readFiles,
  tail,
};