var fs = require("fs");

//readFireSync
// console.log("a");
// var result = fs.readFileSync("syntax/context.txt", "utf8");
// console.log(result);
// console.log("b");

//async
console.log("a");
fs.readFile("syntax/context.txt", "utf8", function (err, result) {
  console.log(result);
});
console.log("b");
