const { deepEqual } = require("assert");
const {
  validateParameters,
  errorMessages,
  illegalCountMessage
} = require("../src/handleExceptions");

describe("validateParameters", function() {
  it("should return illegal count when not natural number  is given as 2nd parameter", function() {
    deepEqual(
      validateParameters("n", 0, "head"),
      "head: illegal line count -- 0"
    );
    deepEqual(
      validateParameters("n", "a", "head"),
      "head: illegal line count -- a"
    );
    deepEqual(
      validateParameters("n", -1, "head"),
      "head: illegal line count -- -1"
    );
    deepEqual(
      validateParameters("c", "file1", "head"),
      "head: illegal byte count -- file1"
    );
  });

  it("should return this option requires an argument when count is undefined", function() {
    deepEqual(
      validateParameters("c", undefined, "head"),
      "head: option requires an argument -- c\nusage: head [-n lines | -c bytes] [file ...]"
    );
  });

  it("should return that requires arguments when n or c is given as 1st parameter and 2nd parameter is undefined", function() {
    deepEqual(
      validateParameters("e", undefined, "head"),
      "head: illegal option -- e\nusage: head [-n lines | -c bytes] [file ...]"
    );
  });

  it("should return illegal option  when anything other than n or c  is given as 1nd parameter", function() {
    deepEqual(
      validateParameters("e", 0, "head"),
      "head: illegal option -- e\nusage: head [-n lines | -c bytes] [file ...]"
    );
  });

  it("should return undefined when 1st parameter is n or c and 2nd parameter is a natural number", function() {
    deepEqual(validateParameters("c", 1, "head"), null);
    deepEqual(validateParameters("n", 33, "head"), null);
  });
});

describe("errorMessages", function() {
  it("should return error message for respective error for head", function() {
    let { invalidOptionMsg, undefinedCountMsg, usageMessage } = errorMessages(
      "head",
      "n"
    );
    deepEqual(
      invalidOptionMsg,
      "head: illegal option -- n\nusage: head [-n lines | -c bytes] [file ...]"
    );
    deepEqual(undefinedCountMsg, "head: option requires an argument -- n");
    deepEqual(usageMessage, "usage: head [-n lines | -c bytes] [file ...]");
  });

  it("should return error message for respective error for head", function() {
    let { invalidOptionMsg, undefinedCountMsg, usageMessage } = errorMessages(
      "tail",
      "n"
    );
    deepEqual(
      invalidOptionMsg,
      "tail: illegal option -- n\nusage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]"
    );
    deepEqual(undefinedCountMsg, "tail: option requires an argument -- n");
    deepEqual(
      usageMessage,
      "usage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]"
    );
  });
});

describe("illegalCountMessage", function() {
  it("should return empty string when count is 0 and type is tail", function() {
    deepEqual(illegalCountMessage(0, "tail", "line"), "");
  });

  it("should return illegal offset message when type is tail and count is not a zero", function() {
    deepEqual(
      illegalCountMessage(-5, "tail", "line"),
      "tail: illegal offset -- -5"
    );
    deepEqual(
      illegalCountMessage("tilak", "tail", "line"),
      "tail: illegal offset -- tilak"
    );
  });

  it("should return illegal count message when type is head and count is not a natural number", function() {
    deepEqual(
      illegalCountMessage(-1, "head", "line"),
      "head: illegal line count -- -1"
    );

    deepEqual(
      illegalCountMessage("tilak", "head", "line"),
      "head: illegal line count -- tilak"
    );
  });
});
