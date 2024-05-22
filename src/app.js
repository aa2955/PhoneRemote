const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const qrcode = require('qrcode');
const robot = require('robotjs');
const path = require('path');
const os = require('os');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const indexRouter = require('./routes/index');

app.use(express.static(path.join(__dirname, '../public')));
app.use('/', indexRouter);

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('mouse move', (data) => {
        const mouse = robot.getMousePos();
        const newMouseX = mouse.x + data.deltaX;
        const newMouseY = mouse.y + data.deltaY;
        robot.moveMouse(newMouseX, newMouseY);
    });

    socket.on('click', (data) => {
        robot.mouseClick(data.button);
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
