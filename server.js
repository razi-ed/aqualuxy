const http = require('http');
const fs = require('fs');
const nodemailer = require('nodemailer');

http.createServer((req, res) => {
  const headers = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, GET", "Access-Control-Max-Age": 2592000 };
  if (req.method === 'POST') {
    let body = '';
    let responseMessage = '';
    req.on('data', chunk => {
      body += chunk.toString(); // convert Buffer to string
    });
    req.on('end', () => {
      const bodyData = JSON.parse(body);
      const nonNullDataKeys = Object.keys(bodyData).filter(e => {
        if(bodyData[e]){
          return true;
        }
        return false;
      })
      if (nonNullDataKeys.includes('mobile') || nonNullDataKeys.includes('email')) {
        responseMessage="ok";
      const htmlStringArray = nonNullDataKeys.map(e => `<li><strong>${e} : </strong>${bodyData[e]}</li>`);
      const htmlString = `<ul>${htmlStringArray.join("")}</ul>`;
      try {
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false, // secure:true for port 465, secure:false for port 587
          auth: {
            user: 'aqualuxy.kannur@gmail.com',
            pass: 'xxxxxxtheerthamKxxxxxxx'
          }
        });
        // setup email data with unicode symbols
        const _now = new Date();
        let mailOptions = {
          from: '"Aqualuxy" <aqualuxy.kannur@gmail.com>', // sender address
          to: 'theerthamknr@gmail.com',
          subject: `Enquiry made at aqualuxy.com || ${_now.toLocaleString('en-GB')}`, // Subject line
          text: 'following is the details of enquiry made at aqualuxy.com :', // plain text body
          html: `<p>following is the details of enquiry made at aqualuxy.com :</p><br/>${htmlString}` // html body
        };

        // send mail with defined transport object
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return console.log(error);
        }
        console.log("Message sent: " + info.response);
      });

    }catch(e){
      console.log(e.message)
    }
    }else{
      responseMessage('notEnoughInfo')
    }
    res.writeHead(200, headers)
    res.write(responseMessage);
    res.end();
  });
  }

  let {url} = req;
  url = url === '/' ? '/index.html' : url;

  if(req.method === 'GET') {
    // console.log(url) use for debug
    // console.log(/.*\.html/gi.exec(url)[0]);
    const fileNameString = /.*\.html/gi.test(url) ? /.*\.html/gi.exec(url)[0] : url;
    fs.readFile(__dirname + fileNameString, (err, data) => {
      if (err) {
        console.log(err.message);
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('Page Not Found');
        res.end();
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html', ...headers });
        res.write(data);
        res.end();
      }
    })
  }
}).listen(5500);