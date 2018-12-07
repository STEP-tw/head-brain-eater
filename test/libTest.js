let deepEqual = require('assert').deepEqual;
let {
  displayFile,
  readFiles,
  headOptions,
  cut,
  classifyParameters,
  validateParameters,
  head,
} = require('../src/lib.js');

const readLine = function(name) {
  let files = {
    file1: 'this is file1',
    file2: 'this is file2',
  };
  return files[name];
};

const exists = function(fileName) {
  return fileName == 'file1' || fileName == 'file2';
};

describe('headOptions', function() {
  it('should return object with keys "n" and "c"', function() {
    let options = headOptions();
    deepEqual(Object.keys(options), ['n', 'c']);
  });

  describe('n', function() {
    let {n} = headOptions();
    let content = 'hi\nhow are you\ni am fine';
    it('should return first specified number of lines of content', function() {
      deepEqual(n(2, content), 'hi\nhow are you');
    });
  });

  describe('c', function() {
    let {c} = headOptions();
    it('should return first specified number of characters of content', function() {
      deepEqual(c(5, 'nandi hills'), 'nandi');
    });
  });
});

describe('head', function() {
  let files = [
    {
      name: 't',
      content: 'Today is a great day\nyes\nha',
      exists: true,
    },
  ];
  it('should return specified number of character of  the content given when c is passed as parameter ', function() {
    deepEqual(head('c', 5, files), 'Today');
  });

  it('should return specified number of line  of  the content given when c is passed as parameter ', function() {
    deepEqual(head('n', 2, files), 'Today is a great day\nyes');
  });

  it('should return specified number of lines\\characters of the contents  given ', function() {
    files.push({
      name: 't2',
      content: 'how are you',
      exists: true,
    });
    deepEqual(head('c', 5, files), '==> t <==\nToday\n\n==> t2 <==\nhow a');
    deepEqual(
      head('n', 2, files),
      '==> t <==\nToday is a great day\nyes\n\n==> t2 <==\nhow are you',
    );
  });

  it('should return no such file when given input file objects\'s exists key is false',function(){
    let files = [{
    name: 'file1',
    content : "",
    exists : false}];
    deepEqual(head('c', 5, files), 'head: file1: No such file or directory');
  });
});

describe('cut', function() {
  it('should cut the given text by given seperator and return specified no of portions', function() {
    deepEqual(cut('-', 3, '1-2-3-4-5'), '1-2-3');
    deepEqual(cut('\n', 0, '1\n2\n3'), '');
  });
});

describe('classifyParameters', function() {
  it('should return an object with keys filter,count and files ', function() {
    deepEqual(Object.keys(classifyParameters('-n3Tilak')), [
      'filter',
      'count',
      'fileNames',
    ]);
  });

  it('should return an object with  filter,count and files ', function() {
    deepEqual(classifyParameters(['file1']), {
      filter: 'n',
      count: 10,
      fileNames: ['file1'],
    });
    deepEqual(classifyParameters(['-n5', 'file1']), {
      filter: 'n',
      count: 5,
      fileNames: ['file1'],
    });
    deepEqual(classifyParameters(['-n', '5', 'file1']), {
      filter: 'n',
      count: 5,
      fileNames: ['file1'],
    });
    deepEqual(classifyParameters(['-5', 'file1']), {
      filter: 'n',
      count: 5,
      fileNames: ['file1'],
    });
    deepEqual(classifyParameters(['file1', 'file2']), {
      filter: 'n',
      count: 10,
      fileNames: ['file1', 'file2'],
    });
    deepEqual(classifyParameters(['-n', '5', 'file1', 'file2']), {
      filter: 'n',
      count: 5,
      fileNames: ['file1', 'file2'],
    });
    deepEqual(classifyParameters(['-n5', 'file1', 'file2']), {
      filter: 'n',
      count: 5,
      fileNames: ['file1', 'file2'],
    });
    deepEqual(classifyParameters(['-5', 'file1', 'file2']), {
      filter: 'n',
      count: 5,
      fileNames: ['file1', 'file2'],
    });
    deepEqual(classifyParameters(['-c5', 'file1']), {
      filter: 'c',
      count: 5,
      fileNames: ['file1'],
    });
    deepEqual(classifyParameters(['-c', '5', 'file1']), {
      filter: 'c',
      count: 5,
      fileNames: ['file1'],
    });
    deepEqual(classifyParameters(['-c5', 'file1', 'file2']), {
      filter: 'c',
      count: 5,
      fileNames: ['file1', 'file2'],
    });
    deepEqual(classifyParameters(['-c', '5', 'file1', 'file2']), {
      filter: 'c',
      count: 5,
      fileNames: ['file1', 'file2'],
    });
  });
});

describe('displayFile', function() {
  let files = {name: 'file1', content: 'hi', exists: true};
  it('should return the content with heading when file name ,file content and exists is given', function() {
    deepEqual(displayFile(files), '==> file1 <==\nhi');
  });

  it('should return file not found error when exists is false', function() {
    files = {name: 'file1', content: 'hi', exists: false};
    deepEqual(displayFile(files), 'head: file1: No such file or directory');
  });
});

describe('validateParameters', function() {
  it('should return illegal count when not natural number  is given as 2nd parameter', function() {
    deepEqual(
      validateParameters('n', 0, 'file'),
      'head: illegal line count -- 0',
    );
    deepEqual(
      validateParameters('n', 'a', 'file'),
      'head: illegal line count -- a',
    );
    deepEqual(
      validateParameters('n', -1, 'file'),
      'head: illegal line count -- -1',
    );
    deepEqual(
      validateParameters('n', -1, 'file'),
      'head: illegal line count -- -1',
    );
    deepEqual(
      validateParameters('c', 'file1', 'file'),
      'head: illegal byte count -- file1',
    );
  });

  it('should return this option requires an argument when count is undefined',function(){
     deepEqual(validateParameters('c', undefined, 'file'),'head: option requires an argument -- c\nusage: head [-n lines | -c bytes] [file ...]');
  });

  it('should return that requires arguments when n or c is given as 1st parameter and 2nd parameter is undefined', function() {
    deepEqual(
      validateParameters('e', undefined, 'file'),
      'head: illegal option -- e\nusage: head [-n lines | -c bytes] [file ...]',
    );
  });

  it('should return illegal option  when anything other than n or c  is given as 1nd parameter', function() {
    deepEqual(
      validateParameters('e', 0, 'file'),
      'head: illegal option -- e\nusage: head [-n lines | -c bytes] [file ...]',
    );
  });

  it('should return undefined when 1st parameter is n or c and 2nd parameter is a natural number', function() {
    deepEqual(validateParameters('c', 1, 'file'), undefined);
    deepEqual(validateParameters('n', 33, 'file'), undefined);
  });
});

describe('readFiles', function() {
  it('should return content,exists and exists in object of file when fileName with file reader and exists given', function() {
    deepEqual(readFiles(readLine, ['file1'], exists), [
      {
        content: 'this is file1',
        exists: true,
        name: 'file1',
      },
    ]);
  });

  it('should return object with name,empty content and exists key false when non existing file name is given', function() {
    deepEqual(readFiles(readLine, ['file3'], exists), [
      {
        content: '',
        exists: false,
        name: 'file3',
      },
    ]);
  });
});
