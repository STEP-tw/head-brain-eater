const { deepEqual } = require("assert");
const {
  readFiles,
  validateParameters,
  classifyParameters,
  readFile,
  errorMessages,
  illegalCountMessage
} = require("../src/parseInput");

const readLine = function(name) {
  let files = {
    file1: "this is file1",
    file2: "this is file2"
  };
  return files[name];
};

const exists = function(fileName) {
  return fileName == "file1" || fileName == "file2";
};

describe("readFile", function() {
  it("should return file object with exists , content and name when file name with reader and exist checker is given", function() {
    deepEqual(readFile(readLine, exists, "file1"), {
      content: "this is file1",
      name: "file1",
      exists: true
    });
  });

  it("should return array of objects with name,empty content and exists key false when non existing file names is given", function() {
    deepEqual(readFile(readLine, exists, "file3"), {
      name: "file3",
      content: "",
      exists: false
    });
  });
});

describe("readFiles", function() {
  it("should return array of objects with content,exists and name of files when fileNames with file reader and exists given", function() {
    deepEqual(readFiles(["file1", "file2"], readLine, exists), [
      {
        content: "this is file1",
        exists: true,
        name: "file1"
      },
      {
        content: "this is file2",
        exists: true,
        name: "file2"
      }
    ]);
  });

  it("should return array of objects with name,empty content and exists key false when non existing file names is given", function() {
    deepEqual(readFiles(["file3"], readLine, exists), [
      {
        content: "",
        exists: false,
        name: "file3"
      }
    ]);
  });

  it("should return object with name,empty content and exists key false and file objects  when non existing file name and existing file names are given", function() {
    deepEqual(readFiles(["file3", "file1"], readLine, exists), [
      {
        content: "",
        exists: false,
        name: "file3"
      },
      {
        content: "this is file1",
        name: "file1",
        exists: true
      }
    ]);
  });
});

describe("classifyParameters", function() {
  it("should return an object with keys option,count and files ", function() {
    deepEqual(Object.keys(classifyParameters("-n3Tilak")), [
      "option",
      "count",
      "fileNames"
    ]);
  });

  it("should return an object with  default option and count with given file when niether filters nor count are specified ", function() {
    deepEqual(classifyParameters(["file1"]), {
      option: "n",
      count: 10,
      fileNames: ["file1"]
    });
  });

  it("should return an object with given option,count and file when option is specified ", function() {
    deepEqual(classifyParameters(["-n5", "file1"]), {
      option: "n",
      count: 5,
      fileNames: ["file1"]
    });
    deepEqual(classifyParameters(["-n", "5", "file1"]), {
      option: "n",
      count: 5,
      fileNames: ["file1"]
    });
  });

  it("should return an object with  default option and given count and file when no option but count is given is specified ", function() {
    deepEqual(classifyParameters(["-5", "file1"]), {
      option: "n",
      count: 5,
      fileNames: ["file1"]
    });
  });

  it("should return an object with  default option and count with given  files when niether filters nor count are specified ", function() {
    deepEqual(classifyParameters(["file1", "file2"]), {
      option: "n",
      count: 10,
      fileNames: ["file1", "file2"]
    });
  });

  it("should return an object with option,count and files when option is specified ", function() {
    deepEqual(classifyParameters(["-n", "5", "file1", "file2"]), {
      option: "n",
      count: 5,
      fileNames: ["file1", "file2"]
    });
    deepEqual(classifyParameters(["-n5", "file1", "file2"]), {
      option: "n",
      count: 5,
      fileNames: ["file1", "file2"]
    });
  });

  it("should return an object with  default option and given count and files when no option but count is given is specified ", function() {
    deepEqual(classifyParameters(["-5", "file1", "file2"]), {
      option: "n",
      count: 5,
      fileNames: ["file1", "file2"]
    });
  });

  it("should return and object with option c and given count and file if c is given as option in input ", function() {
    deepEqual(classifyParameters(["-c5", "file1"]), {
      option: "c",
      count: 5,
      fileNames: ["file1"]
    });
    deepEqual(classifyParameters(["-c", "5", "file1"]), {
      option: "c",
      count: 5,
      fileNames: ["file1"]
    });
  });

  it("should return and object with option c and given count and files if c is given as option in input ", function() {
    deepEqual(classifyParameters(["-c5", "file1", "file2"]), {
      option: "c",
      count: 5,
      fileNames: ["file1", "file2"]
    });
    deepEqual(classifyParameters(["-c", "5", "file1", "file2"]), {
      option: "c",
      count: 5,
      fileNames: ["file1", "file2"]
    });
  });
});

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
