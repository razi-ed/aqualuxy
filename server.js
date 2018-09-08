const http = require('http');
const fs = require('fs');

http.createServer( (req, res) => {

  fs.readFile(__dirname + '/index.html', (err,data)=> {
    if (err) {
      console.log(err.message);
      res.writeHead( 404, {'Content-Type': 'text/plain'});
      res.write('Page Not Found');
      res.end();
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(data);
      res.end();
    }
  })
}).listen(80);
