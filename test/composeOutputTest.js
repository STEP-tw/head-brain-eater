const { composeOutput } = require("../src/composeOutput");
const { deepEqual } = require("assert");

describe("composeOutput", function() {
  let file = {
    name: "file1",
    content: "hi",
    exists: true
  };
  it("should return the content with heading when file name ,file content and exists is given", function() {
    deepEqual(composeOutput("head", file), "==> file1 <==\nhi");
  });

  it("should return file not found error when exists is false", function() {
    file = {
      name: "file1",
      content: "hi",
      exists: false
    };
    deepEqual(
      composeOutput("head", file),
      "head: file1: No such file or directory"
    );
  });
});
