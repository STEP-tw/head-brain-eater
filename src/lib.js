const cut = function(seperator,count,content){
  return content.split(seperator).slice(0,count).join(seperator);
}

const headOptions = function(){
  let options  = {
    n : cut.bind(null,"\n"),
    c : cut.bind(null,"")
  }
  return options;
}

const head = function(option, count, files){
  let filter = headOptions()[option];
  let filteredContent  = "";
  let delimeter = "";
  for(let file of Object.values(files)){
    filteredContent  = filteredContent + delimeter + filter(count,file.content);
    delimeter = "\n";
  }
  return filteredContent;
};

module.exports = {
  head,
  headOptions,
  cut
}
