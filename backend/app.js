const express = require('express');
const connectDB = require('./config/db');
const colors = require('colors');
const app = express();
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes.js');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header("Access-Control-Allow-Headers", "x-access-token, Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json()); // Allows us to accept JSON data in the body

const connect = async () => {
  connectDB();
};

connect();

app.get('/', (req, res) => {
  res.send('API Running');
});

// Define Routes
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);


const server = app.listen(8000, () => {
    console.log('Listening on port 8000');

});

const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: '*',
  }
});

io.on('connection', (socket) => {
  console.log('Socket connected');

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log('User connected', userData._id);
    socket.emit("connected");
  });

  socket.on('join', (room) => {
    socket.join(room);
    socket.emit('joined', room);
    console.log('Joined room', room);
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });

  socket.on("stopTyping", (room) => {
    socket.in(room).emit("stopTyping");
  });

 
  socket.on('sendMessage', (message) => {
    if (message.context && message.chat) {
      const chat = message.chat;
      const receivers = message.sender;
      const context = message.context;

      chat.users.forEach((user) => {
        if (user !== message.sender) {
          socket.in(user._id).emit('receiveMessage', message);
        }
      });
    }
  });



});
