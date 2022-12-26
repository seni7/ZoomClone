const express=require('express');

const app=express();

const server=require('http').Server(app);

const io = require('socket.io')(server);

const { v4: uuidv4 } = require('uuid');

const {ExpressPeerServer}=require('peer');

const peerServer= ExpressPeerServer(server,{
    debug:true,
})

app.use(express.static('public'));

app.use('/peerjs',peerServer);

app.set('view engine','ejs');

app.set('views', __dirname + '/viws');

app.get('/',(req,res)=>{
    res.redirect(`/${uuidv4()}`);
    console.log("server respond")
});
app.get('/:room',(req,res)=>{
    res.render('room',{roomId: req.params.room});
});

io.on('connection', (socket) => {
    socket.on('join-room',(roomId, userId)=>{
        socket.join(roomId)
        socket.broadcast.to(roomId).emit('user-connected', userId);
    socket.on('message',(message) =>{
        io.to(roomId).emit('creatMessage',message);
    }) ;
    socket.on('disconnect', () => {
        // socket.to(roomId).broadcast.emit('user-disconnected',userId)
        socket.broadcast.to(roomId).emit('user-disconnected', userId);

        });

        });
});

server.listen(process.env.PORT||3007)