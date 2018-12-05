let deepEqual = require('assert').deepEqual;
let {
  displayFile,
  headOptions,
  cut,
  classifyParameters,
  validateParameters,
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
      doesFileExist : true
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
      content : "how are you",
      doesFileExist : true
    });
    deepEqual(head("c", 5, files),'==> t <==\nToday\n==> t2 <==\nhow a' );
    deepEqual(head("n", 2, files), '==> t <==\nToday is a great day\nyes\n==> t2 <==\nhow are you');
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

describe("displayFile",function(){
  let files = {name:"file1",content:"hi",doesFileExist:true};
  it('should return the content with heading when file name ,file content and doesFileExist is given',function(){
    deepEqual(displayFile(files),'==> file1 <==\nhi');
  });

  it('should return file not found error when doesFileExist is false',function(){
  files = {name:"file1",content:"hi",doesFileExist:false};
    deepEqual(displayFile(files),'head: file1: No such file or directory');
  })
})

describe("validateParameters",function(){

  it('should return illegal count when not natural number  is given as 2nd parameter',function(){
    deepEqual(validateParameters("n",0,"file"),'head: illegal lines count -- 0');
    deepEqual(validateParameters("n",-1,"file"),'head: illegal lines count -- -1');
    deepEqual(validateParameters("n","file1","file"),'head: illegal lines count -- file1');
  });

  it("it should return that requires arguments when n or c is given as 1st parameter and 2nd parameter is undefined",function(){
    deepEqual(validateParameters("e",undefined,"file"),'head: illegal option -- e\nusage: head [-n lines | -c bytes] [file ...]');
  });

 it('should return illegal option  when anything other than n or c  is given as 1nd parameter',function(){
    deepEqual(validateParameters("e",0,"file"),'head: illegal option -- e\nusage: head [-n lines | -c bytes] [file ...]');
  });

 it('should return undefined when 1st parameter is n or c and 2nd parameter is a natural number',function(){
    deepEqual(validateParameters("c",1,"file"),undefined);
    deepEqual(validateParameters("n",33,"file"),undefined);
  });


})
