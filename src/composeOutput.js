const composeOutput = function(type, { name, content, exists }) {
  if (!exists) {
    return getErrorMessage(type, name);
  }
  return getHeading(name, content);
};

const getErrorMessage = function(type, name) {
  return type + ": " + name + ": No such file or directory";
};

const getHeading = function(name, content) {
  return "==> " + name + " <==\n" + content;
};

module.exports = {
  composeOutput
};
