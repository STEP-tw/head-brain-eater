const { deepEqual, equal } = require("assert");
const { mapContent, filter, runFilter } = require("../src/headAndTail.js");

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
      equal(filter("byte", 5, files, "head"), "Today");
    });

    it("should return specified number of lines from starting of  the content given when n is passed as parameter ", function() {
      equal(
        filter("line", 2, files, "head"),
        "Today is a great day\nis'nt it?"
      );
    });

    it("should return specified number of characters from the end of  the content given when c is passed as parameter ", function() {
      equal(filter("byte", 5, files, "tail"), "?\nyes");
    });

    it("should return specified number of lines from the end of  the content given when n is passed as parameter ", function() {
      equal(filter("line", 2, files, "tail"), "is'nt it?\nyes");
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
    equal(
      filter("line", 2, files, "head"),
      "==> t <==\nToday is a great day\nis'nt it?\n\n==> t2 <==\nhow are you"
    );
  });

  it("should return specified number of characters from the starting of the contents  given ", function() {
    equal(
      filter("byte", 5, files, "head"),
      "==> t <==\nToday\n\n==> t2 <==\nhow a"
    );
  });

  it("should return specified number of lines from the end of the contents  given ", function() {
    equal(
      filter("line", 2, files, "tail"),
      "==> t <==\nis'nt it?\nyes\n\n==> t2 <==\nhow are you"
    );
  });

  it("should return specified number of characters from the end of the contents  given ", function() {
    equal(
      filter("byte", 5, files, "tail"),
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
    equal(
      filter("byte", 5, files, "head"),
      "head: file1: No such file or directory"
    );

    equal(
      filter("byte", 5, files, "tail"),
      "tail: file1: No such file or directory"
    );
  });
});

describe("filterContent", function() {
  it("should return the output of given filter with other parameters count file as parameters to filter", function() {
    deepEqual(
      mapContent((x, y, z) => y, 3, {
        name: "tilak",
        content: "tilakpuli",
        exists: false
      }),
      { name: "tilak", content: "tilakpuli", exists: false }
    );
  });
});
