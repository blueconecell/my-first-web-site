var http = require("http");
var fs = require("fs");
var url = require("url");
var qs = require("querystring");
const { title } = require("process");
function templateHTML(title, list, body, control) {
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
    <style>
      textarea {
        width: 400px;
			  height: 200px;
      }
    </style>
  </head>
  <body>
    
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${control}
    ${body}
  </body>
  </html>
  `;
}
function checkTitleForm(titleName) {
  if (!parseInt(titleName.substring(0, 1))) {
    return titleName;
  } else {
    return titleName.substring(2);
  }
}
function templateList(filelist) {
  var list = "<ul>";
  var i = 0;

  while (i < filelist.length) {
    var titleName = checkTitleForm(filelist[i]);
    list += `<li><a href="/?id=${filelist[i]}">${titleName}</a></li>`;
    i++;
  }
  list = list + "</ul>";
  return list;
}
var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;

  if (pathname === "/") {
    if (queryData.id === undefined) {
      fs.readdir("./data", function (error, filelist) {
        console.log(filelist);
        var title = "Welcome";
        var description = "Hello, Node.js";
        var list = templateList(filelist);
        var template = templateHTML(title, list, `<h2>${title}</h2>${description}`, `<a href="/create">create</a>`);
        response.writeHead(200);
        response.end(template);
      });
    } else {
      fs.readdir("./data", function (error, filelist) {
        console.log(filelist);
        fs.readFile(`data/${queryData.id}`, "utf8", function (err, description) {
          var title = queryData.id;
          console.log("querdyData.id : " + queryData.id);
          var list = templateList(filelist);
          var titleName = checkTitleForm(title);
          console.log(parseInt(title.substring(0, 1)));
          var template = templateHTML(
            title,
            list,
            `<h2>${titleName}</h2>${description}`,
            `<a href="/create">create</a>
             <a href="/update?id=${title}">update</a>
             <form action='delete_process' method='post'>
              <input type='hidden' name='id' value='${title}'>
              <input type='submit' value='delete'>
             </form>`
          );
          response.writeHead(200);
          response.end(template);
        });
      });
    }
  } else if (pathname === "/create") {
    fs.readdir("./data", function (error, filelist) {
      console.log(filelist);
      var title = "WEB - create";
      var list = templateList(filelist);
      var template = templateHTML(
        title,
        list,
        `
      <form action="/create_process" method="post">
        <p><input type="text" name="title" placeholder='title'/></p>
        <p><textarea name="description" placeholder='description'></textarea></p>
        <p><input type="submit" /></p>
      </form>

      `,
        ""
      );
      response.writeHead(200);
      response.end(template);
    });
  } else if (pathname === "/create_process") {
    var body = "";
    request.on("data", function (data) {
      body += data;
      //만약 용량이 너무 크면 connection.destroy로 접속을 끊는
      //안전장치를 만들어 줄 수도 있음
    });
    request.on("end", function () {
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;
      fs.writeFile(`data/${title}`, description, "utf8", function (err) {
        response.writeHead(302, { Location: `/?id=${title}` });
        response.end("success");
      });
    });
  } else if (pathname === "/update") {
    fs.readdir("./data", function (error, filelist) {
      console.log(filelist);
      fs.readFile(`data/${queryData.id}`, "utf8", function (err, description) {
        var title = queryData.id;
        console.log("querdyData.id : " + queryData.id);
        var list = templateList(filelist);
        console.log(parseInt(title.substring(0, 1)));
        var template = templateHTML(
          title,
          list,
          `
          <form action="update_process" method="post">
            <input type='hidden' name='id' value='${title}'>
            <p><input type="text" name="title" placeholder='title' value=${title}></p>
            <p><textarea name="description" placeholder='description'>${description}</textarea></p>
            <p><input type="submit" /></p>
          </form>
          `,
          `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
        );
        response.writeHead(200);
        response.end(template);
      });
    });
  } else if (pathname === "/update_process") {
    var body = "";
    request.on("data", function (data) {
      body += data;
    });
    request.on("end", function () {
      var post = qs.parse(body);
      var id = post.id;
      var title = post.title;
      var description = post.description;
      fs.rename(`data/${id}`, `data/${title}`, function (error) {
        fs.writeFile(`data/${title}`, description, "utf8", function (err) {
          response.writeHead(302, { Location: `/?id=${title}` });
          response.end("success");
        });
      });
    });
  }else if (pathname === "/delete_process") {
    var body = "";
    request.on("data", function (data) {
      body += data;
    });
    request.on("end", function () {
      var post = qs.parse(body);
      var id = post.id;
      fs.unlink(`data/${id}`,function(error){
        response.writeHead(302, {Location: `/`});
        response.end();
      })
    });
  } else {
    response.writeHead(404);
    response.end("Not found");
  }
});
app.listen(3000);
