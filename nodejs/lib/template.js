module.exports = {
  HTML: function (title, list, body, control) {
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
  },
  list: function (filelist) {
    var list = "<ul>";
    var i = 0;

    while (i < filelist.length) {
      var titleName = checkTitleForm(filelist[i]);
      list += `<li><a href="/?id=${filelist[i]}">${titleName}</a></li>`;
      i++;
    }
    list = list + "</ul>";
    return list;
  },
};
function checkTitleForm(titleName) {
  if (!parseInt(titleName.substring(0, 1))) {
    return titleName;
  } else {
    return titleName.substring(2);
  }
}
