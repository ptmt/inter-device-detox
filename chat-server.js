var express = require('express');
var http = require('http');
var socketio = require('socket.io');

var app = express();
var server = http.Server(app);
var websocket = socketio(server);
server.listen(3000, () => console.log('listening on *:3000'));

let usersCount = 0;
let typing = false;
const MAX_DELAY = 5000;

function emulateNetwork(func) {
  const emulatedNetworkDelay = Math.round(MAX_DELAY * Math.random());
  setTimeout(func, emulatedNetworkDelay);
}

websocket.on('connection', socket => {
  socket.emit('init', USERS[usersCount]);
  console.log('A client just joined on', socket.id, USERS[usersCount]);
  usersCount = usersCount === 0 ? 1 : 0;

  socket.on('message:new', message => {
    emulateNetwork(() => {
      socket.broadcast.emit('typing', false);
      socket.broadcast.emit('message:new', message);
      socket.emit('message:update', { ...message, attributes: { sent: true } });
    });
  });

  socket.on('message:update', message => {
    emulateNetwork(() => socket.broadcast.emit('message:update', message));
  });

  socket.on('typing', () => {
    clearTimeout(typing);
    socket.broadcast.emit('typing', true);
    typing = setTimeout(() => socket.broadcast.emit('typing', false), 3000);
  });
});

const USERS = [
  {
    _id: '1',
    identity: 'user1',
    avatar: 'https://api.adorable.io/avatars/99/user1@adodfdrable.io.png',
  },
  {
    _id: '2',
    identity: 'user2',
    avatar: 'https://api.adorable.io/avatars/99/user2@adodfdrable.io.png',
  },
];
