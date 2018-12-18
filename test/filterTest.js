const { deepEqual } = require("assert");
let { filterContent, filter, runFilter } = require("../src/filter.js");

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

describe("filter", function() {
  describe("for Single File", function() {
    let files = [
      {
        name: "t",
        content: "Today is a great day\nis'nt it?\nyes",
        exists: true
      }
    ];
    it("should return specified number of characters from starting of the content given when c is passed as parameter ", function() {
      deepEqual(filter("c", 5, files, "head"), "Today");
    });

    it("should return specified number of lines from starting of  the content given when n is passed as parameter ", function() {
      deepEqual(
        filter("n", 2, files, "head"),
        "Today is a great day\nis'nt it?"
      );
    });

    it("should return specified number of characters from the end of  the content given when c is passed as parameter ", function() {
      deepEqual(filter("c", 5, files, "tail"), "?\nyes");
    });

    it("should return specified number of lines from the end of  the content given when n is passed as parameter ", function() {
      deepEqual(filter("n", 2, files, "tail"), "is'nt it?\nyes");
    });
  });

  let files = [
    {
      name: "t",
      content: "Today is a great day\nis'nt it?\nyes",
      exists: true
    },
    {
      name: "t2",
      content: "how are you",
      exists: true
    }
  ];

  it("should return specified number of lines from the starting of the contents  given ", function() {
    deepEqual(
      filter("n", 2, files, "head"),
      "==> t <==\nToday is a great day\nis'nt it?\n\n==> t2 <==\nhow are you"
    );
  });

  it("should return specified number of characters from the starting of the contents  given ", function() {
    deepEqual(
      filter("c", 5, files, "head"),
      "==> t <==\nToday\n\n==> t2 <==\nhow a"
    );
  });

  it("should return specified number of lines from the end of the contents  given ", function() {
    deepEqual(
      filter("n", 2, files, "tail"),
      "==> t <==\nis'nt it?\nyes\n\n==> t2 <==\nhow are you"
    );
  });

  it("should return specified number of characters from the end of the contents  given ", function() {
    deepEqual(
      filter("c", 5, files, "tail"),
      "==> t <==\n?\nyes\n\n==> t2 <==\ne you"
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
    deepEqual(
      filter("c", 5, files, "head"),
      "head: file1: No such file or directory"
    );

    deepEqual(
      filter("c", 5, files, "tail"),
      "tail: file1: No such file or directory"
    );
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

    it("should return illegal count/byte when invalid count is given", function() {
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

describe("filterContent", function() {
  it("should return the output of given filter with other parameters count file as parameters to filter", function() {
    deepEqual(
      filterContent((x, y, z) => y, 3, {
        name: "tilak",
        content: "tilakpuli",
        exists: false
      }),
      { name: "tilak", content: "tilakpuli", exists: false }
    );
  });
});
