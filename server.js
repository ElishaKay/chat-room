const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
io.on('connection', () => { /* … */ });
server.listen(3000);

let users = [];
let connections = [];


app.get('/', function(req, res) {
    console.log('hit root route')
    res.sendFile(__dirname + '/index.html')
});

io.sockets.on('connection', function(socket){
    connections.push(socket);
    console.log("connected: % of sockets connected", connections.length);

    //Disconnect
    socket.on('disconnect', function(data){
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected % of sockets connected', connections.length);        
    });

    //Message
    socket.on('send message', function(data){
        io.sockets.emit('new message', {msg: data, user: socket.username});
    });
    
    // new user
    socket.on('new user', function(data, callback){
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
    });

    function updateUsernames(){
        io.sockets.emit('get users', users)
    } 
});