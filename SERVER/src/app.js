require("dotenv").config();
const express = require('express');
const app = express();
const crypto = require("crypto-js");
const message = require("./models/message.model");


//! Require DB......
require("./db/conn");


//! express.json 

app.use(express.json());



//!PORT 

const PORT = process.env.PORT || 3000;

//! Listenner...........

const server = app.listen(PORT, (err)=>{
    if(err) throw err;

    console.log(`Server running on PORT : ${PORT}..`);
})

//!Require io ..... And set corse ...
const io  = require("socket.io")(server,{
    cors:{
        origin:"*"
    }
});

io.on("connection", (socket)=>{
    console.log(`Connected socket id is ${socket.id}`)

    socket.on("messageStream", async (data)=>{
        try {
            const messages = data.split("|");
            // console.log(messages.length);
            const passKey = 'SECRETPASSKEY';
            messages.map( async(ce)=>{
                const bytes  =  crypto.AES.decrypt(ce, passKey);
                const decryptMessage = bytes.toString(crypto.enc.Utf8);
                const messageObect= JSON.parse(decryptMessage)
                // console.log(messageObect)
                const secretKey = messageObect.secret_key;
                
                //!Delete the secret key ..
                delete messageObect.secret_key;
    
                //!Hash The get message ..
                const hashObject = crypto.SHA256(JSON.stringify(messageObect)).toString();
    
    
                //! hash Matching logic ..
    
                if(hashObject === secretKey){
                    
                    const addData = await new message(messageObect);
                    await addData.save();
                    // console.log(messageObect)
                    
                }else{
                    console.log("Data is intarapted")
                }
            })
            

        } catch (error) {
            console.log(error);
        }  
    })
})

