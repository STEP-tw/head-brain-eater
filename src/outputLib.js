const parseOutput = function(type, { name, content, exists }) {
  if (!exists) {
    return type + ": " + name + ": No such file or directory";
  }

  return "==> " + name + " <==\n" + content;
};

module.exports = {
  parseOutput
};
