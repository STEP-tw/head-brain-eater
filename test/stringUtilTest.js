const { take, last, cut } = require("../src/stringUtil");
const { equal } = require("assert");

describe("cut", function() {
  it("should return sliced text when text,seperator,start and end is  specified", function() {
    equal(cut("1-2-3-4-5", "-", 0, 3), "1-2-3");
  });

  it("should return sliced text from given position when end is not specified", function() {
    equal(cut("1\n2\n3\n4\n5", "\n", 3), "4\n5");
  });
});

describe("take", function() {
  it("should return specified number of portions from start of given string", function() {
    equal(take("-", 3, "1-2-3-4-5"), "1-2-3");
  });
});

describe("last", function() {
  it("should return specified number of portions from end of given string", function() {
    equal(last("-", 3, "1-2-3-4-5"), "3-4-5");
  });
});
