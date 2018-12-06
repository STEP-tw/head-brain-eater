const classifyParameters = function(parameters) {
  let filter = "n";
  let firstArg = parameters[0];
  let secondArg = parameters[1];
  let firstFileNameIndex = 0;
  let count = 10;

  if(firstArg.match("-") != null){
    firstFileNameIndex++;
    count = +firstArg.slice(1);
    if(isNaN(count) || count < 0){
      filter = firstArg[1];
      count = +firstArg.slice(2);
      if(firstArg.length == 2){
        firstFileNameIndex++;
        count = secondArg;
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
  let doesFileExist = file.doesFileExist;
  return {name,content,doesFileExist};
}


const head = function(option, count, files) {
  let filter = headOptions()[option];
  let filteredFiles = files.map(filterContent.bind(null,filter,count));
  if(filteredFiles.length == 1){
    if(!filteredFiles[0].doesFileExist){
      return "head: "+filteredFiles[0].name+": No such file or directory";
    }
    return filteredFiles[0].content;
  }
  return filteredFiles.map(displayFile).join("\n\n");
};

const displayFile = function({name,content,doesFileExist}){
  if(!doesFileExist){
    return "head: "+name+": No such file or directory";
  }
  return "==> "+name+" <==\n"+content;
}

const readFile = function(readFileSync,exists,fileName){
  let doesFileExist = true;
  let name = fileName;
  let content = "";
  if(!exists(name)){
    doesFileExist = false;
    return {name,content,doesFileExist}  
  }
  content = readFileSync(fileName,"utf-8");
  content = content.trim();//removing extra \n from end
  return {content,name,doesFileExist};
}

const readFiles = function(readFileSync,fileNames,exists){
  return fileNames.map(readFile.bind(null,readFileSync,exists))
}

const validateParameters = function(option,count,fileNames){
  let types = {n:"line",c:"byte"};
  let errorMessage = undefined;

  if(!isValidOption(option)){
    errorMessage = "head: illegal option -- "+option+"\nusage: head [-n lines | -c bytes] [file ...]";
    return errorMessage;
  }
  if(isUndefined(count)){
    errorMessage ="head: option requires an argument -- "+option+"\nusage: head [-n lines | -c bytes] [file ...]";
    return errorMessage;
  }
  if(!isNaturalNum(count)){
    errorMessage = "head: illegal "+types[option]+" count -- "+count;
    return errorMessage;
  }
}

const isValidOption = function(option){
  return option == 'n' || option == 'c';
}

const isUndefined = function(ele){
  return ele == undefined;
}

const isNaturalNum = function(num){
  return !isNaN(num) && num > 0;
}

module.exports = {
  head,
  headOptions,
  cut,
  readFiles,
  displayFile,
  validateParameters,
  classifyParameters
};
