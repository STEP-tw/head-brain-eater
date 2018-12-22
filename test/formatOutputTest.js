const { formatOutput } = require("../src/formatOutput");
const { equal } = require("assert");

describe("formatOutput", function() {
  let file = {
    name: "file1",
    content: "hi",
    exists: true
  };
  it("should return the content with heading when file name ,file content and exists is given", function() {
    equal(formatOutput("head", file), "==> file1 <==\nhi");
  });

  it("should return file not found error when exists is false", function() {
    file = {
      name: "file1",
      content: "hi",
      exists: false
    };
    equal(formatOutput("head", file), "head: file1: No such file or directory");
  });
});
