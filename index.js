const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, { transports: ['websocket'] })
let count = 0
let user = {}
io.on("connection", (socket) => {
  console.log(socket.id)
  socket.on('user', (data) => {
    let id = user[data]
    count++
    if (id) {
      io.sockets.sockets.get(id).emit('islogin', { islogin: false, user: data })
    }

    user[data] = socket.id

    io.emit('countmsg', count)
    socket.on('sendMsg', (data) => {
      console.log(data)
      io.emit('pushMsg', data)
    })
    socket.on('disconnect', () => {
      user[data] === socket.id ? null : user[data]
      count--
      io && io.emit('countmsg', count)
    })
    // io.emit('islogin', {islogin:true,user:data})


  })

});


server.listen(3000, () => {
  console.log('listening on *:3000');
})
