const socket = require("socket.io-client");
const crypto = require("crypto-js");
const fs = require("fs");
const { names, cities } = require("./data/data.json");


//! Server Url ...
const url = "http://localhost:4000";

//!connect to listener..

const socketClient = socket.connect(url);


//! Message Generator.......

const messageGenerator = async () => {
    try {

        //! Generate random details.....

        const randomName = names[Math.floor(Math.random() * names.length)];
        const randomOrigin = cities[Math.floor(Math.random() * cities.length)];
        const randomDestination = cities[Math.floor(Math.random() * cities.length)];


        //! Original message......
        const originalMessage = {
            name: randomName,
            origin: randomOrigin,
            destination: randomDestination,
        };

        console.log(originalMessage);
        //! Calculate the SHA-256 hash secret key 
        const secretKey = crypto.SHA256(JSON.stringify(originalMessage)).toString();

        //! New message along with secret key .....
        const newOriginalMessage = {
            name: randomName,
            origin: randomOrigin,
            destination: randomDestination,
            secret_key: secretKey
        }

        //! Secret Pass key....
        const passKey = 'SECRETPASSKEY';

        //! Encrypt the message using AES-256-CTR
        const encryptedMessage = crypto.AES.encrypt(JSON.stringify(newOriginalMessage), passKey).toString();

        // console.log(encryptedMessage);

        // var bytes  =  crypto.AES.decrypt(encryptedMessage, passKey);

        // console.log(bytes.toString(crypto.enc.Utf8));
        return encryptedMessage;

    } catch (err) {
        console.log(err);
    }
}

//! Send Message Function ..

const sendMessage = async () => {
    try {

        //! Generate Random number between 49 and 499..
        const numberOfMessages = 1
        // Math.floor(Math.random() * 451) + 49; 
        console.log(numberOfMessages);

        const messages = [];
        for (let i = 0; i < numberOfMessages; i++) {
            messages.push(await messageGenerator());
        }

        const messageStream = messages.join('|');

        socketClient.emit('messageStream', messageStream);

        //!For execute every 10 seconds..
        setTimeout(sendMessage, 1000); // Send every 10 seconds



    } catch (err) {
        console.log(err);
    }
}



// messageGenerator();

// sendMessage()

socketClient.on('connect', ()=>{
    sendMessage();
})