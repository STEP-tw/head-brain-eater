const { composeOutput } = require("../src/composeOutput");
const { equal } = require("assert");

describe("composeOutput", function() {
  let file = {
    name: "file1",
    content: "hi",
    exists: true
  };
  it("should return the content with heading when file name ,file content and exists is given", function() {
    equal(composeOutput("head", file), "==> file1 <==\nhi");
  });

  it("should return file not found error when exists is false", function() {
    file = {
      name: "file1",
      content: "hi",
      exists: false
    };
    equal(
      composeOutput("head", file),
      "head: file1: No such file or directory"
    );
  });
});
