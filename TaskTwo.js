var url = require("url");

var address =
  "https://www.w3schools.com/nodejs/shownodejs_cmd.asp?filename=demo_url";

var p = url.parse(address, true);

console.log(p.host);
console.log(p.pathname);
console.log(p.search);

var pdata = p.query;
console.log(pdata.month);