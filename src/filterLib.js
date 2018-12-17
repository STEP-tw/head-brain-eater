const { last, take } = require("./stringLib");
const {
  readFiles,
  validateParameters,
  classifyParameters
} = require("./inputLib");

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

const runFilter = function(parameters, type, readFileSync, existsSync) {
  let { option, count, fileNames } = classifyParameters(parameters);

  let errorMessage = validateParameters(option, count, type);
  if (errorMessage != undefined) {
    return errorMessage;
  }
  let files = readFiles(fileNames, readFileSync, existsSync);
  return filter(option, count, files, type);
};

module.exports = {
  filter,
  filters,
  displayFile,
  runFilter,
  filterContent
};
