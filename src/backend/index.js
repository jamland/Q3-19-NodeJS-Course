const express = require('express');
const path = require('path');
const uuidv1 = require('uuid/v1');
const { currentTime } = require('./utils');
const busboy = require('connect-busboy');
const fs = require('fs');

const app = express();
const port = 8000;
const API = {
  todoList: '/api/todo-list',
  todoCreate: '/api/todo-create',
  todoDelete: '/api/todo-delete'
};
const processRootFolder = process.env.PWD;
const options = {
  root: path.join(processRootFolder, 'public'),
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html'],
  index: false,
  maxAge: '1d',
  redirect: false,
  setHeaders: function(res, path, stat) {
    res.set('x-timestamp', Date.now());
  }
};

const logger = (req, res, next) => {
  console.log(
    `📩 New ${req.method} request to the path: ${req.url}
    ⏱  ${currentTime()},
  `
  );
  next();
};

const todoList = [
  {
    id: uuidv1(),
    title: 'Create Express server 🚟',
    description:
      'Build a basic REST API client with list, add, delete features',
    date: new Date()
  }
];

app.use(logger);
app.use(express.static('public', options));
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());
// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(busboy());

app.get('/', (req, res, next) => {
  var fileName = 'index.html';
  res.sendFile(fileName, options, function(err) {
    if (err) {
      next(err);
    } else {
      console.log('Sent:', fileName);
    }
  });
  // res.send(JSON.stringify(todoList))
});

app.get('/upload', (req, res, next) => {
  // fs.readFile(__dirname + '/data.txt', function(err, data) {
  //   res.send(data);
  // });
  // var stream = fs.createReadStream(__dirname + '/data.txt');
  // stream.pipe(res);

  var fileName = 'upload.html';
  res.sendFile(fileName, {}, function(err) {
    if (err) {
      next(err);
    } else {
      console.log('Sent:', fileName);
    }
  });
});

app.post('/upload', (req, res, next) => {
  // fs.readFile(__dirname + '/data.txt', function(err, data) {
  //   res.send(data);
  // });
  // var stream = fs.createReadStream(__dirname + '/data.txt');
  // stream.pipe(res);
  // req.pipe(fs.createWriteStream('./uploadFile.txt'));
  // req.on('end', next);
  // var stream = fs.createReadStream(req);
  // const file = fs.createWriteStream('./uploadedFile.txt')
  // stream.pipe(data => console.log('data', data));
  req.pipe(req.busboy);
  req.busboy.on('file', function(fieldname, file, filename) {
    console.log('Uploading: ' + filename);
    fstream = fs.createWriteStream(__dirname + '/' + filename);
    file.pipe(fstream);
    fstream.on('close', function() {
      res.redirect('back');
    });
  });
});

app.get(API.todoList, (req, res) => {
  res.send(JSON.stringify(todoList));
});

app.post(API.todoCreate, (req, res) => {
  const { title = '', description = '', date = new Date() } = req.body;
  const newTodoItem = {
    id: uuidv1(),
    title,
    description,
    date
  };

  todoList.push(newTodoItem);
  res.send('OK');
});

app.use(function(req, res, next) {
  res.status(404).send("404. Sorry can't find that!");
});

// ERROR Handler
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log('🚁 Server started on localhost:8000');
});
