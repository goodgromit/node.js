var http = require('http');
var server = http.createServer();

var express = require('express');
var app = express();
var fs = require('fs');

var PORT = 8209;

app.get('/', function (req, res) {
  fs.readFile(__dirname + '/index.html', 'utf8', function (err, text) {
    res.send(text);
  });
})

app.get('/data.tsv', function (req, res) {
  fs.readFile(__dirname + '/data.tsv', 'utf8', function (err, text) {
    res.send(text);
  });
})

app.get('/memory', function (req, res) {
  var memory = process.memoryUsage();
  var date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  var json = [
    {
      id: 'rss',
      values: [{
        date: date,
        size: memory.rss / 1024 / 1024
      }]
    },
    {
      id: 'heapUsed',
      values: [{
        date: date,
        size: memory.heapUsed / 1024 / 1024
      }]
    },
    {
      id: 'heapTotal',
      values: [{
        date: date,
        size: memory.heapTotal / 1024 / 1024
      }]
    },
  ]
  res.json(JSON.stringify(json));
})

server.on('request', app);

server.listen(PORT, function () {
  console.log("server listening on port"+PORT)
});
