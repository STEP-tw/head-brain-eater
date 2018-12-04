let deepEqual = require('assert').deepEqual;
let {
  headOptions,
  cut,
  head
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

describe('head', function() {
  let files = {
    file1: {
      name: 't',
      content: 'hi',
    },
  };
  it('should return back the content of file given ', function() {
    deepEqual(head("c", 5, files), 'hi');
    deepEqual(head("n", 5, files), 'hi');
  });

  it('should return back the content of files given ', function() {
    files.file2={
      name : "t2",
      content : "how are you"
    }
    deepEqual(head("c", 5, files), 'hi\nhow are you');
    deepEqual(head("n", 5, files), 'hi\nhow are you');
  });
});

describe('cut',function(){
  it('should cut the given text by given seperator and return specified no of portions',function(){
    deepEqual(cut("-",3,"1-2-3-4-5"),"1-2-3");
    deepEqual(cut("\n",0,"1\n2\n3"),"");
  });
})
