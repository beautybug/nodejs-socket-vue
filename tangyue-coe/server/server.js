const express = require('express');
const path = require('path');
const App = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const QiQiuYun = require('qiqiuyun-sdk');
var opn = require('opn');
var server = require('http').createServer(App);
var io = require('socket.io')(server);

var users = {};
var userSockets = {};
var roomMembers = [];

io.on('connection', function(socket) {
  var username = '';
  socket.on('user join', function(data) {
    username = data.user;
    users[username] = {name: username, msgCount: 0};
    userSockets[username] = socket;
    data.type = 'notify';
    data.users = users;
    data.msg = "欢迎 " + data.user + " 进入聊天室";
    io.sockets.emit('sendmsg', data);
  });

  socket.on('user quit', function(data) {
    delete(users[data.user]);
    delete(userSockets[data.user]);
    data.type = 'notify';
    data.users = users;
    data.msg = data.user + " 离开了，好伤心，你快回来";
    io.sockets.emit('sendmsg', data);
  });

  socket.on('public chat', function(data) {
    data.users = users;
    io.sockets.emit('sendmsg', data);
  });

  socket.on('private chat', function(data) {
    data.users = users;
    userSockets[data.toUser].emit('sendmsg', data);
    if (data.toUser !== data.user) {
      userSockets[data.user].emit('sendmsg', data);
    }
  });
});

var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : '',
  database        : 'node_test'
});

var jsonParser = bodyParser.json();

App.use(express.static(path.resolve(__dirname, '../dist')));

App.get('/', function(req, res) {
  res.sendFile(path.resolve(__dirname,'../dist/index.html'));
});

App.post('/login', jsonParser, function(req, res) {
  console.log(req.body);
  let name = req.body.username;
  if (users[name]) {
    res.send({success: false, existed: true});
  }
  roomMembers.push(name);
  res.send({success: true, username: name});
});

App.get('/logout', function(req, res) {
  roomMembers.splice(roomMembers.indexOf(req.query.name), 1);
  res.send({success: true});
});

App.get('/player/token', function(req, res) {
  const resNo = req.query.resNo;
  const secretKey = '9e64ca5b4a446e9a0999d982';
  const token = QiQiuYun.generateToken(resNo, secretKey);
  res.send({playerToken: token});
});
const port = '10086';
const url = 'http://127.0.0.1:10086';
server.listen(port,function () {
  console.log('Server is open on %s',url);
  opn(url);
});

