let deepEqual = require("assert").deepEqual;
let {
  displayFile,
  readFile,
  readFiles,
  options,
  cut,
  filterContent,
  classifyParameters,
  validateParameters,
  filter,
  runFilter,
  errorMessages
} = require("../src/lib.js");

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

describe("options", function() {
  it('should return object with keys "n" and "c"', function() {
    let opts = options();
    deepEqual(Object.keys(opts), ["n", "c"]);
  });

  describe("n", function() {
    let { n } = options();
    let content = "hi\nhow are you\ni am fine";
    it("should return first specified number of lines of content", function() {
      deepEqual(n(2, content), "hi\nhow are you");
    });
  });

  describe("c", function() {
    let { c } = options();
    it("should return first specified number of characters of content", function() {
      deepEqual(c(5, "nandi hills"), "nandi");
    });
  });
});

describe("filter", function() {
  let files = [
    {
      name: "t",
      content: "Today is a great day\nyes\nha",
      exists: true
    }
  ];
  it("should return specified number of character of  the content given when c is passed as parameter ", function() {
    deepEqual(filter("c", 5, files), "Today");
  });

  it("should return specified number of line  of  the content given when c is passed as parameter ", function() {
    deepEqual(filter("n", 2, files), "Today is a great day\nyes");
  });

  it("should return specified number of lines\\characters of the contents  given ", function() {
    files.push({
      name: "t2",
      content: "how are you",
      exists: true
    });
    deepEqual(filter("c", 5, files), "==> t <==\nToday\n\n==> t2 <==\nhow a");
    deepEqual(
      filter("n", 2, files),
      "==> t <==\nToday is a great day\nyes\n\n==> t2 <==\nhow are you"
    );
  });

  it("should return no such file when given input file objects's exists key is false", function() {
    let files = [
      {
        name: "file1",
        content: "",
        exists: false
      }
    ];
    deepEqual(filter("c", 5, files), "head: file1: No such file or directory");
  });
});

describe("cut", function() {
  it("should return sliced text of the given text by given seperator and return specified no of portions", function() {
    deepEqual(cut("-", 3, "1-2-3-4-5", false), "1-2-3");
    deepEqual(cut("\n", 0, "1\n2\n3", false), "");
  });

  it("should return sliced text sliced from reverse order when last argument given as true", function() {
    deepEqual(cut("-", 3, "1-2-3-4-5", true), "3-4-5");
    deepEqual(cut("\n", 1, "1\n2\n3", true), "3");
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

  it("should return an object with  default option and count with given file when niether options nor count are specified ", function() {
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

  it("should return an object with  default option and count with given  files when niether options nor count are specified ", function() {
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

describe("displayFile", function() {
  let files = {
    name: "file1",
    content: "hi",
    exists: true
  };
  it("should return the content with heading when file name ,file content and exists is given", function() {
    deepEqual(displayFile("head", files), "==> file1 <==\nhi");
  });

  it("should return file not found error when exists is false", function() {
    files = {
      name: "file1",
      content: "hi",
      exists: false
    };
    deepEqual(
      displayFile("head", files),
      "head: file1: No such file or directory"
    );
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
    deepEqual(validateParameters("c", 1, "head"), undefined);
    deepEqual(validateParameters("n", 33, "head"), undefined);
  });
});

describe("readFiles", function() {
  it("should return array of objects with content,exists and name of files when fileNames with file reader and exists given", function() {
    deepEqual(readFiles(readLine, ["file1", "file2"], exists), [
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
    deepEqual(readFiles(readLine, ["file3"], exists), [
      {
        content: "",
        exists: false,
        name: "file3"
      }
    ]);
  });

  it("should return object with name,empty content and exists key false and file objects  when non existing file name and existing file names are given", function() {
    deepEqual(readFiles(readLine, ["file3", "file1"], exists), [
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

describe("runFilter", function() {
  describe("head", function() {
    it("should return head result of given file when valid parameters and files are given", function() {
      deepEqual(
        runFilter(["-n5", "file1"], "head", readLine, exists),
        "this is file1"
      );
      deepEqual(runFilter(["-c5", "file1"], "head", readLine, exists), "this ");
      deepEqual(
        runFilter(["-c5", "file1", "file2"], "head", readLine, exists),
        "==> file1 <==\nthis \n\n==> file2 <==\nthis "
      );
    });

    it("should return illegal count/byte count is not valid value are given", function() {
      deepEqual(
        runFilter(["-n", 0, "file"], "head", readLine, exists),
        "head: illegal line count -- 0"
      );
      deepEqual(
        runFilter(["-c", "file1", "file"], "head", readLine, exists),
        "head: illegal byte count -- file1"
      );
    });

    it("should return option requires argument message when undefined count is given are given", function() {
      deepEqual(
        runFilter(["-c", undefined, "file"], "head", readLine, exists),
        "head: option requires an argument -- c\nusage: head [-n lines | -c bytes] [file ...]"
      );
    });
    it("should return option is neither n or c are given", function() {
      deepEqual(
        runFilter(["-e", 0, "file"], "head", readLine, exists),
        "head: illegal option -- e\nusage: head [-n lines | -c bytes] [file ...]"
      );
    });
  });

  describe("tail", function() {
    it("should return specified numer of lines from bottom of given file when valid parameters and files are given", function() {
      deepEqual(
        runFilter(["-n5", "file1"], "tail", readLine, exists),
        "this is file1"
      );
    });

    it("should return specified numer of lines from bottom of given file when valid parameters and files are given", function() {
      deepEqual(runFilter(["-c5", "file1"], "tail", readLine, exists), "file1");
      deepEqual(
        runFilter(["-c5", "file1", "file2"], "tail", readLine, exists),
        "==> file1 <==\nfile1\n\n==> file2 <==\nfile2"
      );
    });

    it("should return illegal count/byte count is not valid value are given", function() {
      deepEqual(runFilter(["-n", 0, "file"], "tail", readLine, exists), "");
      deepEqual(
        runFilter(["-c", "file1", "file"], "tail", readLine, exists),
        "tail: illegal offset -- file1"
      );
    });

    it("should return option requires argument message when undefined count is given are given", function() {
      deepEqual(
        runFilter(["-c", undefined, "file"], "tail", readLine, exists),
        "tail: option requires an argument -- c\nusage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]"
      );
    });
  });

  it("should return option is neither n or c are given", function() {
    deepEqual(
      runFilter(["-e", 0, "file"], "tail", readLine, exists),
      "tail: illegal option -- e\nusage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]"
    );
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

describe("filterContent", function() {
  it("should return the output of given filter with other parameters count file as parameters to filter", function() {
    deepEqual(
      filterContent((x, y, z) => y, 3, true, {
        name: "tilak",
        content: "tilakpuli",
        exists: false
      }),
      { name: "tilak", content: "tilakpuli", exists: false }
    );
  });
});
