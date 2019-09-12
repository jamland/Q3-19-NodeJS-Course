const { spawn, fork } = require('child_process');
const fs = require('fs');

// 1. Get system info and save it to file system-profile.txt

const filename = 'system-profile.txt';
const fstream = fs.createWriteStream(__dirname + '/' + filename);
const system_profiler = spawn('system_profiler', ['-detailLevel', 'mini']);

system_profiler.stdout.pipe(fstream);

system_profiler.on('close', function(code) {
  console.log('child process exited with code ' + code);
});

// 2. подсчет суммы значений в цикле 0 – 1e9

const compute = fork(__dirname + '/' + 'compute.js');
compute.send('start');
const startDate = new Date();

compute.on('message', result => {
  const endDate = new Date();
  const time = (endDate.getTime() - startDate.getTime()) / 1000;
  console.log(`Long computation result: ${result}`);
  console.log(`computation took: ${time}s`);
});
