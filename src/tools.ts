const MapToString = function(map) {
  let temparr = [];

  for (let key of map) {
    let initial = key[0] + ' --> ';
    let rules = key[1].join(' | ');
    temparr.push(initial + rules);
  }
  return temparr;
};

const copyMap = function(map: Map<string, string[]>) {
  let newMap = {};
  for (let key in map) {
    newMap[key] = map[key];
  }

  return newMap;
};

export { MapToString, copyMap };
