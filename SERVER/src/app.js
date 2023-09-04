require("dotenv").config();
const express = require('express');
const app = express();
const crypto = require("crypto-js");
const message = require("./models/message.model");
const messageRouter = require("./routers/message.router");
const cors = require("cors");



//! Cors  for access from anywhere......
app.use(cors({
    origin:"*"
}));


//! Require DB......
require("./db/conn");


//! express.json 

app.use(express.json());



//! Routers......
app.use("/api/v1/message",messageRouter);



//! Page Not Found-------------
app.use("*",(req,res,next)=>{
    res.status(404).json({error:false,message:"404 Page Not Found"});
})


//! error handling middleware ------------------
app.use((error,req,res,next)=>{
    res.status(401).json({error:true,message:error.message});
})





//!PORT 
const PORT = process.env.PORT || 4000;


//! Listenner...........
const server = app.listen(PORT, (err)=>{
    if(err) throw err;

    console.log(`Server running on PORT : ${PORT}..`);
})

//?--------------------------------------------Socket Connections-------------------------------------


//!Require io ..... And set corse ...
const io  = require("socket.io")(server,{
    cors:{
        origin:"*"
    }
});

io.on("connection", (socket)=>{
    console.log(`Connected socket id is ${socket.id}`)
    
    //!Send Socket id to Frontend...
    io.to(socket.id).emit("id",socket.id);

    //! Get Id From Frontend And Store It .....
    socket.on("sendid",(id)=>{
        io.SocketID = id;
    });

    socket.on("messageStream", async (data)=>{
        try {

            //!convert string data into array.. 
            const messages = data.split("|");
           
            //! Secret Key to decrypt.....
            const passKey = 'SECRETPASSKEY';


            messages.map( async(ce)=>{
                const bytes  =  crypto.AES.decrypt(ce, passKey);
                const decryptMessage = bytes.toString(crypto.enc.Utf8);
                const messageObect= JSON.parse(decryptMessage)

                //! Message Object's hashed secret key.
                const secretKey = messageObect.secret_key;
                
                //!Delete the secret key ..
                delete messageObect.secret_key;
    
                //!Hash The get message ..
                const hashObject = crypto.SHA256(JSON.stringify(messageObect)).toString();
    
    
                //! hash Matching logic ..
    
                if(hashObject === secretKey){
                    
                    //!Add Data to MongoDB
                    const addData = await new message(messageObect);
                    await addData.save();

                    //! Data emit to frontend......
                    io.to(io.SocketID).emit("data",addData);
                    
                    
                }else{
                    console.log("Data is intarapted")
                }
            })
            

        } catch (error) {
            console.log(error);
        }  
    })

    //! Desconnect..........
    socket.on('disconnect', function () {
        console.log(`disconnected..`)
    });
})


