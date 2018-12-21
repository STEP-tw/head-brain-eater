const { deepEqual } = require("assert");
const {
  readFiles,
  parseParameters,
  classifyParameters,
  readFile
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
  it("should return an object with  default option and count with given file when neither filters nor count are specified ", function() {
    deepEqual(classifyParameters(["file1"]), {
      option: "line",
      count: 10,
      fileNames: ["file1"]
    });
  });
  it("should return an object with given option,count and file when option is specified ", function() {
    deepEqual(classifyParameters(["-n5", "file1"]), {
      option: "line",
      count: 5,
      fileNames: ["file1"]
    });
    deepEqual(classifyParameters(["-n", "5", "file1"]), {
      option: "line",
      count: 5,
      fileNames: ["file1"]
    });
  });

  it("should return an object with  default option and given count and file when no option but count is given is specified ", function() {
    deepEqual(classifyParameters(["-5", "file1"]), {
      option: "line",
      count: 5,
      fileNames: ["file1"]
    });
  });
});

describe("parseParameters", function() {
  it("should return an object with given option,count and file when option is specified ", function() {
    deepEqual(parseParameters(["-n5", "file1"]), {
      option: "line",
      count: 5,
      fileNames: ["file1"]
    });
    deepEqual(parseParameters(["-n", "5", "file1"]), {
      option: "line",
      count: 5,
      fileNames: ["file1"]
    });
  });

  it("should return an object with  default option and given count and file when no option but count is given is specified ", function() {
    deepEqual(parseParameters(["-5", "file1"]), {
      option: "line",
      count: 5,
      fileNames: ["file1"]
    });
  });
});

it("should return an object with option,count and files when option is specified ", function() {
  deepEqual(parseParameters(["-n", "5", "file1", "file2"]), {
    option: "line",
    count: 5,
    fileNames: ["file1", "file2"]
  });
  deepEqual(parseParameters(["-n5", "file1", "file2"]), {
    option: "line",
    count: 5,
    fileNames: ["file1", "file2"]
  });
});

it("should return an object with  default option and given count and files when no option but count is given is specified ", function() {
  deepEqual(parseParameters(["-5", "file1", "file2"]), {
    option: "line",
    count: 5,
    fileNames: ["file1", "file2"]
  });
});

it("should return and object with option c and given count and file if c is given as option in input ", function() {
  deepEqual(parseParameters(["-c5", "file1"]), {
    option: "byte",
    count: 5,
    fileNames: ["file1"]
  });
  deepEqual(parseParameters(["-c", "5", "file1"]), {
    option: "byte",
    count: 5,
    fileNames: ["file1"]
  });
});

it("should return and object with option c and given count and files if c is given as option in input ", function() {
  deepEqual(parseParameters(["-c5", "file1", "file2"]), {
    option: "byte",
    count: 5,
    fileNames: ["file1", "file2"]
  });
  deepEqual(parseParameters(["-c", "5", "file1", "file2"]), {
    option: "byte",
    count: 5,
    fileNames: ["file1", "file2"]
  });
});
