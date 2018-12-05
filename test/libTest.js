let deepEqual = require('assert').deepEqual;
let {
  displayFiles,
  headOptions,
  cut,
  classifyParameters,
  head
} = require('../src/lib.js');

describe('headOptions', function(){
  it('should return object with keys "n" and "c"',function(){
    let options = headOptions();
    deepEqual(Object.keys(options),[ 'n', 'c' ]);
  });

  describe('n',function(){
    let {n} =headOptions();
    let content = "hi\nhow are you\ni am fine";
    it("should return first specified number of lines of content",function(){
      deepEqual(n(2,content),'hi\nhow are you');
    });
  });

  describe('c',function(){
    let {c} =headOptions();
    it("should return first specified number of characters of content",function(){
      deepEqual(c(5,"nandi hills"),"nandi");
    });
  });
});

describe('head', function() {
  let files = [
    {
      name: 't',
      content: 'Today is a great day\nyes\nha',
    },
  ];
  it('should return specified number of character of  the content given when c is passed as parameter ', function() {
    deepEqual(head("c", 5, files), 'Today');
  });

it('should return specified number of line  of  the content given when c is passed as parameter ', function() {
    deepEqual(head("n", 2, files), 'Today is a great day\nyes');
  });

  it('should return specified number of lines\\characters of the contents  given ', function() {
    files.push({
      name : "t2",
      content : "how are you"
    });
    deepEqual(head("c", 5, files),'==> t <==\nToday\n\n==> t2 <==\nhow a' );
    deepEqual(head("n", 2, files), '==> t <==\nToday is a great day\nyes\n\n==> t2 <==\nhow are you');
  });
});

describe('cut',function(){
  it('should cut the given text by given seperator and return specified no of portions',function(){
    deepEqual(cut("-",3,"1-2-3-4-5"),"1-2-3");
    deepEqual(cut("\n",0,"1\n2\n3"),"");
  });
});

describe('classifyParameters',function(){
  it('should return an object with keys filter,count and files ',function(){
    deepEqual(Object.keys(classifyParameters("-n3Tilak")),["filter","count","fileNames"]);
  });

  it('should return an object with  filter,count and files ',function(){
    deepEqual(classifyParameters(["file1"]),{ filter: 'n', count: 10, fileNames: [ 'file1' ] })
    deepEqual(classifyParameters(["-n5","file1"]),{ filter: 'n', count: 5, fileNames: [ 'file1' ] })
    deepEqual(classifyParameters(["-n","5","file1"]),{ filter: 'n', count: 5, fileNames: [ 'file1' ] })
    deepEqual(classifyParameters(["-5","file1"]),{ filter: 'n', count: 5, fileNames: [ 'file1' ] })
    deepEqual(classifyParameters(["file1","file2"]),{ filter: 'n', count: 10, fileNames: [ 'file1', 'file2' ] })
    deepEqual(classifyParameters(["-n","5","file1","file2"]),{ filter: 'n', count: 5, fileNames: [ 'file1','file2' ] })
    deepEqual(classifyParameters(["-n5","file1","file2"]),{ filter: 'n', count: 5, fileNames: [ 'file1', 'file2' ] })
    deepEqual(classifyParameters(["-5","file1","file2"]),{ filter: 'n', count: 5, fileNames: [ 'file1', 'file2' ] })
    deepEqual(classifyParameters(["-c5","file1"]),{ filter: 'c', count: 5, fileNames: [ 'file1' ] })
    deepEqual(classifyParameters(["-c","5","file1"]),{ filter: 'c', count: 5, fileNames: [ 'file1' ] })
    deepEqual(classifyParameters(["-c5","file1","file2"]),{ filter: 'c', count: 5, fileNames: [ 'file1', 'file2' ] })
    deepEqual(classifyParameters(["-c","5","file1","file2"]),{ filter: 'c', count: 5, fileNames: [ 'file1', 'file2' ] })
  });
})

describe("displayFiles",function(){
  let files = [{name:"file1",content:"hi"}];
  it('should return the content of files when only one file is given',function(){
    deepEqual(displayFiles(files),"hi");
  });

  it('should return each file heading and file content joined together',function(){
    files.push({name:"file2",content:"hello"});
    deepEqual(displayFiles(files),'==> file1 <==\nhi\n\n==> file2 <==\nhello');
  })
})
