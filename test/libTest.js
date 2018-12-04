let deepEqual = require('assert').deepEqual;
let {
  headOptions
} = require('../src/lib.js');

describe('headOptions', function(){
  it('should return object with keys "n" and "c"',function(){
    let options = headOptions();
    deepEqual(Object.keys(options),[ 'n', 'c' ]);
  });

  describe('n',function(){
    let {n} =headOptions();
    it("should return back the input",function(){
      deepEqual(n("hello"),"hello");
    });
  });

  describe('c',function(){
    let {c} =headOptions();
    it("should return back the input",function(){
      deepEqual(c("hello"),"hello");
    });
  });
});

