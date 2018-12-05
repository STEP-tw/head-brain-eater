const classifyParameters = function(parameters) {
  let filter = "n";
  let firstArg = parameters[0];
  let secondArg = parameters[1];
  let firstFileNameIndex = 0;
  let count = 10;

  if(firstArg.match("-") != null){
    firstFileNameIndex++;
    count = +firstArg.slice(1);
    if(isNaN(count)){
      filter = firstArg[1];
      count = +firstArg.slice(2);
      if(firstArg.length == 2){
        firstFileNameIndex++;
        count = +secondArg;
      }
    }
  }
  let  fileNames = parameters.slice(firstFileNameIndex);

  return {filter, count, fileNames};
};

const cut = function(seperator, count, content) {
  return content
    .split(seperator)
    .slice(0, count)
    .join(seperator);
};

const headOptions = function() {
  let options = {
    n: cut.bind(null, '\n'),
    c: cut.bind(null, ''),
  };
  return options;
};

const filterContent = function(filter,count,file){
  let name = file.name;
  let content = filter(count,file.content);
  return {name,content};
}


const head = function(option, count, files) {
  let filter = headOptions()[option];
  let filteredFiles = files.map(filterContent.bind(null,filter,count));
  return displayFiles(filteredFiles);
};

const displayFiles = function(files){
  if(files.length == 1){
    return files[0].content;
  }
  return files.map(({name,content})=>{return "==> "+name+" <==\n"+content}).join("\n");
}

const getFile = function(readFile,fileName){
  let content = readFile(fileName,"utf-8");
  let name = fileName;
  return {content,name};
}

module.exports = {
  head,
  headOptions,
  cut,
  getFile,
  classifyParameters
};
