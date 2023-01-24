var fs = require("fs");
fs.readFile("context.txt", "utf8", function (err, data) {
  console.log(data);
});
