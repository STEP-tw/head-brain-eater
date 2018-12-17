const { displayFile } = require("../src/outputLib");
const deepEqual = require("assert").deepEqual;

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
