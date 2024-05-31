import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './db/connectDB.js';
import userRoute from '../Backend/Route/userRoute.js';
import adminRoute from '../Backend/Route/adminRoute.js';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

dotenv.config();
const PORT = process.env.PORT;

const app = express();  
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});


io.on('connection', (socket) => {
  console.log('A user connected');
});


app.use((req, res, next) => {
  req.io = io;
  next();
});

const corsOptions = {
  origin: true,
};

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use('/auth', userRoute);
app.use('/admin', adminRoute);

server.listen(PORT, () => {
  connectDB();
  console.log(`Server started on port ${PORT}`);
});
