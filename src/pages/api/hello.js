import { Server } from 'socket.io';
import mongoose  from 'mongoose';
import DBConnect from '../../../DBConnect';
import getMessageController from '../../../controllers/getMessageController';
export default function handler(req, res) {

  if (!res.socket.server.io) {

    const io = new Server(res.socket.server, {
      path: '/api/hello',
    });

    res.socket.server.io = io;
    const onlineUsers=new Map();
    io.on('connection', (socket) => {


      socket.on('add-user',(user)=>{
        onlineUsers.set(user.id,socket.id);
      })
      socket.on('input-change', (msg) => {
        const socketUser=onlineUsers.get(msg.to);
        if(socketUser)
        socket.to(socketUser).emit("receive",msg);

      });

      socket.on('disconnect', () => {

      });
    });
  } else {

  }

res.end();



}
