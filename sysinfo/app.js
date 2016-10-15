var http = require('http');
var server = http.createServer();

var express = require('express');
var os = require('os');
var app = express();
var fs = require('fs');

var cpubusy = 0.0;

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
    totalMem: os.totalmem()/1024/1024,
    freeMem: os.freemem()/1024/1024,
    usedMemory: (os.totalmem() - os.freemem()) / 1024 / 1024,
    cpuUsage: cpubusy.value,
    cpu: os.cpus()
  };


  res.setHeader('Content-Type', 'application/json');
  res.json(json);
})

server.on('request', app);

server.listen(PORT, function () {
  console.log("server listening on port"+PORT)
});

function* getUsageCPU() {
  var cpus = os.cpus();

  for(var i = 0, len = cpus.length; i < len; i++) {
    var cpu = cpus[i], usage = 0, total = 0;;

    for(var type in cpu.times) {
      total += cpu.times[type];
    }
    tot.push(total);
    for(type in cpu.times) {
      if(type !== "idle") {
        usage += cpu.times[type];
      }
    }
    arr.push(usage);
  }
  //return Math.round(100 * usage / total);
  //return usage + "/" + total;
  //return arr;
  return tot;
}

function* cpuMoniter() {
  /*yield [0, 0, 1]
  let current = {date: new Date(), cpus: os.cpus()}

  while(true) {
    let prev = current
    current = {date: new Date(), cpus: os.cpus()}
    let time = current.date - prev.date
    yield [time, 0, 1]
  }*/
  var curr = os.cpus();
  if( typeof prev === 'undefined')
    prev = curr;
  while(true) {
    curr = os.cpus();
    var total = 0;
    var work = 0;
    for(var i = 0, len = curr.length; i < len; i++) {
      work = 0;
      for(var type in curr[i].times) {
        total += curr[i].times[type] - prev[i].times[type];
      }

      for(type in curr[i].times) {
        if(type !== "idle") {
          work += curr[i].times[type] - prev[i].times[type];
        }
      }
      prev = curr;
      yield work/total*100;
    }
  }
}

setInterval(function() {
  var cpu = cpuMoniter();
  cpubusy = cpu.next();
  console.log(cpubusy);
}, 1000);