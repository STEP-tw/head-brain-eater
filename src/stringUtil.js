const cut = function(string, seperator, start, end) {
  return string
    .split(seperator)
    .slice(start, end)
    .join(seperator);
};

const take = function(seperator, count, string) {
  return cut(string, seperator, 0, count);
};

const last = function(seperator, count, string) {
  return cut(string, seperator, -count);
};

module.exports = {
  cut,
  take,
  last
};
