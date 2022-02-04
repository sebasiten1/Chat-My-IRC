require("dotenv").config();

// Set Db
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE,{
    useUnifiedTopology: true,
    useNewUrlParser: true,
});
mongoose.connection.on("error", (err)=>{
    console.log("Mongoose Connection Error: "+ err.message);
});
mongoose.connection.once("open", ()=>{
    console.log("MongoDB Connected !");
});

//Import Model
require("./models/User");
require("./models/ChatRoom");
require("./models/Message");

// Connect app to server
const app = require("./app");

const server = app.listen(8080, ()=>{
    console.log("Server listening on port 8080");
});

// Connect socket Io
const io = require("socket.io")(server, {
    allowEIO3: true,
    cors: {
        origin: true,
        methods: ['GET', 'POST'],
        credentials: true
    }
});

const jwt = require("jwt-then");
const Message = mongoose.model("Message");
const User = mongoose.model("User");

io.use(async (socket, next)=>{
    try {
        const token = socket.handshake.query.token;
        const payload = await jwt.verify(token, process.env.SECRET);
        socket.userid = payload.id;
        next();
    }catch (err){}
});

io.on("connection", (socket)=>{
    
    console.log("Connected: "+ socket.userid);
    socket.on("disconnect", ()=>{
        console.log("Disonnected: "+ socket.userid);
    });
    
    socket.on("joinRoom", ({chatroomId})=>{
        socket.join(chatroomId);
        console.log(socket.userid +" joined Room: "+ chatroomId);
        //socket.broadcast.to(chatroomId).emit('chatroomMessage', { name: 'admin', message: `${socket.userid} has joined!`, chatroomId });
    });

    socket.on("leaveRoom", ({chatroomId})=>{
        socket.leave(chatroomId);
        console.log(socket.userid +" left Room: "+ chatroomId);
    });

    socket.on("chatroomMessage", async ({chatroomId, message})=>{
        if(message.trim().length > 0){
            const user = await User.findOne({_id: socket.userid});
            const newMessage = new Message({
                chatroom: chatroomId,
                user: socket.userid,
                message,
            });
            io.to(chatroomId).emit("newMessage", {
                message,
                name: user.name,
                id: socket.userid,
            });
            await newMessage.save();
        }
    });

});