var http = require('http');
var server = http.createServer();

var express = require('express');
var os = require('os');
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

app.get('/status.json', function (req, res) {
  var memory = process.memoryUsage();
  var date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  var json = {
    date: date,
    rss: memory.rss / 1024 / 1024 + Math.random(10),
    heapUsed: memory.heapUsed / 1024 / 1024 + Math.random(10),
    heapTotal: memory.heapTotal / 1024 / 1024 + Math.random(10),
    usedMemory: (os.totalmem() - os.freemem()) / 1024 / 1024,
    cpu: os.cpus()
  };


  res.setHeader('Content-Type', 'application/json');
  res.json(json);
})

server.on('request', app);

server.listen(PORT, function () {
  console.log("server listening on port"+PORT)
});

function getUsageCPU() {
  var cpus = os.cpus();
  var usage = 0, total = 0;
  var arr = [];
  for(var i = 0, len = cpus.length; i < len; i++) {
    var cpu = cpus[i], usage = 0;

    for(var type in cpu.times) {
      total += cpu.times[type];
    }

    for(type in cpu.times) {
      if(type !== "idle") {
        usage += cpu.times[type];
      }
    }
    arr.push(usage);
  }
  //return Math.round(100 * usage / total);
  return arr;
}