// an object holding all the parsed query parameters
// (tries to parse them as numbers/boolean)
const qs = require('query-string');

function parseOptions () {
  if (typeof window === 'undefined') return {};
  const parsed = qs.parse(window.location.search);
  Object.keys(parsed).forEach(key => {
    if (parsed[key] === null) parsed[key] = true;
    if (parsed[key] === 'false') parsed[key] = false;
    if (parsed[key] === 'true') parsed[key] = true;
    if (isNumber(parsed[key])) {
      parsed[key] = Number(parsed[key]);
    }
  });
  return parsed;
}

function isNumber (x) {
  if (typeof x === 'number') return true;
  if (/^0x[0-9a-f]+$/i.test(x)) return true;
  return /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(x);
}

module.exports = parseOptions();
