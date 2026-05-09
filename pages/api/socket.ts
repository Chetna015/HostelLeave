import { Server } from 'socket.io';

const ioHandler = (req: any, res: any) => {
  if (!res.socket.server.io) {
    console.log('*First use, starting socket.io');

    const io = new Server(res.socket.server);

    io.on('connection', (socket) => {
      console.log('A user connected');
      socket.on('disconnect', () => {
        console.log('A user disconnected');
      });
    });

    res.socket.server.io = io;
  } else {
    console.log('socket.io already running');
  }
  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default ioHandler;
