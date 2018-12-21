const validateParameters = function(option, count, type) {
  let shortOptions = {
    line: "n",
    byte: "c"
  };
  let shortOption = shortOptions[option] || option;
  let { invalidOptionMsg, undefinedCountMsg, usageMessage } = errorMessages(
    type,
    shortOption
  );

  if (!isValidOption(shortOption)) {
    return invalidOptionMsg;
  }

  if (isUndefined(count)) {
    return undefinedCountMsg + "\n" + usageMessage;
  }

  if (!isNaturalNum(count)) {
    return illegalCountMessage(count, type, option);
  }
  return null;
};

const illegalCountMessage = function(count, type, option) {
  if (type == "tail") {
    if (count == 0) {
      return "";
    }
    return "tail: illegal offset -- " + count;
  }
  errorMessage = "head: illegal " + option + " count -- " + count;
  return errorMessage;
};

const isNaturalNum = function(num) {
  return !isNaN(num) && num > 0;
};

const isValidOption = function(shortOption) {
  return shortOption == "n" || shortOption == "c";
};

const isUndefined = function(element) {
  return element == undefined;
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
  validateParameters,
  errorMessages,
  illegalCountMessage
};
